// Renderiza as seções no Chromium e mede cada elemento em 3 larguras
// (desktop 1280, tablet 900, mobile 390). Saída: árvore DOM + estilos computados.
// Uso: node extract.cjs <items.json> <out.json>
const fs = require('fs');
const { chromium } = require('playwright');

const WIDTHS = { d: 1280, t: 900, m: 390 };
const PROPS = [
  'display', 'position', 'flexDirection', 'flexWrap', 'justifyContent', 'alignItems', 'alignSelf',
  'flexGrow', 'flexShrink', 'rowGap', 'columnGap', 'gridTemplateColumns', 'gridColumnStart', 'gridColumnEnd',
  'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
  'marginTop', 'marginRight', 'marginBottom', 'marginLeft',
  'width', 'height', 'maxWidth', 'minHeight',
  'backgroundColor', 'backgroundImage', 'backgroundSize', 'backgroundPosition',
  'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth',
  'borderTopColor', 'borderRightColor', 'borderBottomColor', 'borderLeftColor',
  'borderTopStyle', 'borderRightStyle', 'borderBottomStyle', 'borderLeftStyle',
  'borderTopLeftRadius', 'borderTopRightRadius', 'borderBottomRightRadius', 'borderBottomLeftRadius',
  'boxShadow', 'color', 'fontFamily', 'fontSize', 'fontWeight', 'lineHeight', 'letterSpacing',
  'textTransform', 'fontStyle', 'textDecorationLine', 'textAlign', 'opacity', 'overflow', 'zIndex',
  'top', 'right', 'bottom', 'left', 'visibility', 'pointerEvents', 'objectFit', 'whiteSpace',
];

async function main() {
  const [, , itemsFile, outFile] = process.argv;
  const page = JSON.parse(fs.readFileSync(itemsFile, 'utf8'));
  const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1"><style>body{margin:0}</style>
${page.head}</head><body>${page.items.map((it, i) => `<div data-root="${i}">${it.html}</div>`).join('')}</body></html>`;
  const browser = await chromium.launch();
  const ctx = await browser.newContext();
  const p = await ctx.newPage();
  await p.setContent(html, { waitUntil: 'load' });
  await p.waitForTimeout(300);

  // índice estável, revela painéis de abas e respostas de FAQ (para medir) e captura a árvore
  const tree = await p.evaluate(() => {
    let n = 0;
    document.querySelectorAll('[data-root] *').forEach((el) => el.setAttribute('data-pk', String(n++)));
    document.querySelectorAll('.tab-panel.hidden').forEach((el) => {
      el.classList.remove('hidden'); el.classList.add('flex'); el.setAttribute('data-was-hidden', '1');
    });
    const keepAttrs = ['href', 'src', 'alt', 'id', 'onclick', 'type', 'placeholder', 'name', 'value', 'rows',
      'checked', 'for', 'target', 'style', 'aria-hidden', 'selected', 'required', 'maxlength', 'open',
      'data-was-hidden'];
    function walk(el) {
      const node = { tag: el.tagName.toLowerCase(), pk: el.getAttribute('data-pk'), cls: el.getAttribute('class') || '', attrs: {}, kids: [] };
      for (const a of el.attributes) if (keepAttrs.includes(a.name) || a.name.startsWith('data-') && a.name !== 'data-pk') node.attrs[a.name] = a.value;
      for (const c of el.childNodes) {
        if (c.nodeType === 3) { if (c.nodeValue.trim()) node.kids.push({ text: c.nodeValue }); }
        else if (c.nodeType === 1) node.kids.push(walk(c));
      }
      return node;
    }
    return [...document.querySelectorAll('[data-root]')].map((r) => walk(r.firstElementChild));
  });

  // barras de filtro dos diretórios (inputs fora de <form>): ficam como HTML interativo
  const outers = await p.evaluate(() => {
    const CARDS = '.delegacia-card, .prison-card';
    const out = {};
    document.querySelectorAll('[data-root] input, [data-root] select').forEach((inp) => {
      if (inp.closest('form')) return;
      let el = inp;
      while (el.parentElement && !el.parentElement.matches('section, [data-root], .prk') && !el.parentElement.querySelector(CARDS)) el = el.parentElement;
      const clone = el.cloneNode(true);
      clone.querySelectorAll('[data-pk]').forEach((x) => x.removeAttribute('data-pk'));
      clone.removeAttribute('data-pk');
      out[el.getAttribute('data-pk')] = clone.outerHTML;
    });
    return out;
  });
  fs.writeFileSync(outFile.replace('.measure.json', '.outer.json'), JSON.stringify(outers));

  const styles = {};
  for (const [bp, w] of Object.entries(WIDTHS)) {
    await p.setViewportSize({ width: w, height: 1000 });
    await p.waitForTimeout(150);
    styles[bp] = await p.evaluate((PROPS) => {
      const out = {};
      document.querySelectorAll('[data-pk]').forEach((el) => {
        const cs = getComputedStyle(el);
        const r = el.getBoundingClientRect();
        const o = {};
        for (const k of PROPS) o[k] = cs[k];
        o.rect = { x: r.x + scrollX, y: r.y + scrollY, w: r.width, h: r.height };
        out[el.getAttribute('data-pk')] = o;
      });
      return out;
    }, PROPS);
  }
  await browser.close();
  fs.writeFileSync(outFile, JSON.stringify({ tree, styles }));
}
main().catch((e) => { console.error(e); process.exit(1); });
