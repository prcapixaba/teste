// Converte a árvore medida (extract.cjs) em elementos NATIVOS do Elementor:
// Container (flex/grid), Título, Editor de Texto, Botão, Ícone, Imagem, Alternância (FAQ),
// Abas aninhadas e Formulário (Pro). Tudo editável no painel do Elementor.
// Uso: node convert.cjs <items.json> <measure.json> <template-out.json>
const fs = require('fs');
const path = require('path');

const ICONS = require('./icon-map.json');
const TW = require('../tailwind.config.cjs').theme.extend.colors;
const BPS = ['d', 't', 'm'];
const SUFFIX = { d: '', t: '_tablet', m: '_mobile' };

let seq = 0x1a2b3c;
const eid = () => (seq++).toString(16).padStart(7, '0').slice(-7);

// ---------- utilidades de valores ----------
const px = (v) => (v == null || v === '' || v === 'auto' || v === 'normal' || v === 'none' ? 0 : parseFloat(v)) || 0;
const r2 = (v) => Math.round(v * 100) / 100;

function color(c) {
  if (!c) return null;
  const m = c.match(/rgba?\(([^)]+)\)/);
  if (!m) return null;
  const parts = m[1].split(/[ ,/]+/).filter(Boolean).map(Number);
  const [r, g, b] = parts;
  const a = parts.length > 3 ? parts[3] : 1;
  if (a === 0) return null;
  const hex = '#' + [r, g, b].map((x) => Math.round(x).toString(16).padStart(2, '0')).join('').toUpperCase();
  return a >= 1 ? hex : hex + Math.round(a * 255).toString(16).padStart(2, '0').toUpperCase();
}


function parseShadow(sh) {
  if (!sh || sh === 'none') return null;
  for (const part of sh.split(/,(?![^(]*\))/)) {
    if (/inset/.test(part)) continue;
    const m = part.match(/(rgba?\([^)]+\))\s+(-?[\d.]+)px\s+(-?[\d.]+)px\s+(-?[\d.]+)px(?:\s+(-?[\d.]+)px)?/);
    if (!m) continue;
    const col = color(m[1]);
    if (!col || (+m[2] === 0 && +m[3] === 0 && +m[4] === 0 && +(m[5] || 0) === 0)) continue;
    return { horizontal: +m[2], vertical: +m[3], blur: +m[4], spread: +(m[5] || 0), color: col };
  }
  return null;
}

function dims(t, r, b, l, unit = 'px') {
  const v = [t, r, b, l].map((x) => String(r2(x)));
  return { unit, top: v[0], right: v[1], bottom: v[2], left: v[3], isLinked: v.every((x) => x === v[0]) };
}
const zeroDims = () => dims(0, 0, 0, 0);

function family(ff) {
  const f = (ff || '').split(',')[0].replace(/["']/g, '').trim();
  return f || 'Inter';
}

// define chave com variações responsivas (só grava tablet/mobile quando muda)
// Estes controles têm padrão próprio no celular/tablet no Elementor (ex.: --width:100% e
// --flex-wrap-mobile:wrap), então são gravados explicitamente nos 3 breakpoints.
const FORCE_ALL = new Set(['width', 'flex_wrap', 'flex_direction', '_element_width', '_element_custom_width']);
function setR(s, key, vals) {
  const [d, t, m] = BPS.map((b) => vals[b]);
  if (FORCE_ALL.has(key)) {
    BPS.forEach((b) => { if (vals[b] !== undefined && vals[b] !== null) s[key + SUFFIX[b]] = vals[b]; });
    return;
  }
  const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  if (d !== undefined && d !== null) s[key] = d;
  if (t !== undefined && t !== null && !eq(t, d)) s[key + SUFFIX.t] = t;
  if (m !== undefined && m !== null && !eq(m, t ?? d)) s[key + SUFFIX.m] = m;
}

function byBp(node, fn) {
  const o = {};
  for (const b of BPS) o[b] = node.vis[b] ? fn(node.st[b], b) : undefined;
  // breakpoint escondido herda do visível mais próximo (só para completar valores)
  for (const b of BPS) if (o[b] === undefined) o[b] = o.d ?? o.t ?? o.m;
  return o;
}

function typography(s, prefix, node) {
  s[prefix + '_typography'] = 'custom';
  const d = node.st.d0;
  s[prefix + '_font_family'] = family(d.fontFamily);
  s[prefix + '_font_weight'] = String(d.fontWeight);
  setR(s, prefix + '_font_size', byBp(node, (c) => ({ unit: 'px', size: r2(px(c.fontSize)) })));
  setR(s, prefix + '_line_height', byBp(node, (c) => (c.lineHeight === 'normal' ? { unit: 'em', size: 1.2 } : { unit: 'px', size: r2(px(c.lineHeight)) })));
  const ls = px(d.letterSpacing);
  if (ls) s[prefix + '_letter_spacing'] = { unit: 'px', size: r2(ls) };
  if (d.textTransform && d.textTransform !== 'none') s[prefix + '_text_transform'] = d.textTransform;
  if (d.fontStyle === 'italic') s[prefix + '_font_style'] = 'italic';
  if (d.textDecorationLine && d.textDecorationLine !== 'none') s[prefix + '_text_decoration'] = d.textDecorationLine.split(' ')[0];
}

// ---------- leitura da árvore ----------
function prep(node, styles, only) {
  if (node.text !== undefined) return node;
  node.st = {};
  for (const b of BPS) node.st[b] = styles[only || b][node.pk];
  node.vis = {};
  for (const b of BPS) {
    const c = node.st[b];
    node.vis[b] = !!c && c.display !== 'none' && c.visibility !== 'hidden' && (c.rect.w > 0 || c.rect.h > 0);
  }
  node.st.d0 = node.st[BPS.find((b) => node.vis[b]) || 'd'];
  node.classes = node.cls.split(/\s+/).filter(Boolean);
  node.kids.forEach((k) => prep(k, styles, only));
  return node;
}

const isEl = (k) => k && k.text === undefined;
const elKids = (n) => n.kids.filter(isEl);
const hasCls = (n, re) => n.classes.some((c) => re.test(c));
const isIcon = (n) => isEl(n) && n.classes.includes('material-symbols-outlined');
const textOf = (n) => (n.text !== undefined ? n.text : n.kids.map(textOf).join(''));
const cleanText = (t) => t.replace(/\s+/g, ' ').trim();
function textNoIcons(n) {
  if (n.text !== undefined) return n.text;
  if (isIcon(n)) return ' ';
  return n.kids.map(textNoIcons).join('');
}
function find(n, pred) {
  if (!isEl(n)) return null;
  if (pred(n)) return n;
  for (const k of n.kids) { const f = find(k, pred); if (f) return f; }
  return null;
}
function findAll(n, pred, acc = []) {
  if (!isEl(n)) return acc;
  if (pred(n)) acc.push(n);
  n.kids.forEach((k) => findAll(k, pred, acc));
  return acc;
}

const INLINE_TAGS = new Set(['span', 'strong', 'b', 'em', 'i', 'a', 'br', 'small', 'sup', 'sub', 'u', 'mark', 'code', 'abbr', 'time']);
const hasBox = (c) => !!color(c.backgroundColor) || px(c.borderTopWidth) + px(c.borderBottomWidth) + px(c.borderLeftWidth) + px(c.borderRightWidth) > 0 || (c.backgroundImage && c.backgroundImage !== 'none');
function isInlineish(n) {
  if (n.text !== undefined) return true;
  if (!n.vis.d && !n.vis.m) return true;
  if (isIcon(n)) return false;
  const c = n.st.d0;
  if (!INLINE_TAGS.has(n.tag)) return false;
  if (c.display.includes('flex') || c.display === 'block' || c.display === 'grid') return false;
  if (hasBox(c)) return false;
  return n.kids.every(isInlineish);
}
// folha de texto: só texto e elementos inline (sem ícones/caixas internas)
function isTextLeaf(n) {
  if (!cleanText(textOf(n))) return false;
  if (find(n, (x) => x !== n && (isIcon(x) || x.tag === 'img'))) return false;
  return n.kids.every(isInlineish);
}

function inlineHtml(n, base) {
  return n.kids.map((k) => {
    if (k.text !== undefined) return k.text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\s+/g, ' ');
    if (!k.vis.d && !k.vis.m) return '';
    if (k.tag === 'br') return '<br>';
    const c = k.st.d0;
    const st = [];
    const col = color(c.color);
    if (col && col !== color(base.color)) st.push(`color:${col}`);
    if (c.fontWeight !== base.fontWeight) st.push(`font-weight:${c.fontWeight}`);
    if (c.fontStyle !== base.fontStyle) st.push(`font-style:${c.fontStyle}`);
    if (c.textDecorationLine !== base.textDecorationLine && c.textDecorationLine !== 'none') st.push(`text-decoration:${c.textDecorationLine}`);
    if (c.textTransform !== base.textTransform) st.push(`text-transform:${c.textTransform}`);
    if (family(c.fontFamily) !== family(base.fontFamily)) st.push(`font-family:${family(c.fontFamily)}`);
    const inner = inlineHtml(k, c);
    const style = st.length ? ` style="${st.join(';')}"` : '';
    if (k.tag === 'a') return `<a href="${(k.attrs.href || '#').replace(/"/g, '&quot;')}"${k.attrs.target ? ` target="${k.attrs.target}"` : ''}${style}>${inner}</a>`;
    const tag = ['strong', 'b'].includes(k.tag) ? 'strong' : ['em', 'i'].includes(k.tag) ? 'em' : 'span';
    if (!style && tag === 'span') return inner;
    return `<${tag}${style}>${inner}</${tag}>`;
  }).join('').replace(/\s+/g, ' ').trim();
}

// ---------- configurações comuns ----------
function boxStyles(s, node, prefix) {
  // prefix '' para containers, '_' para widgets (aba Avançado)
  const c = node.st.d0;
  const bg = byBp(node, (x) => color(x.backgroundColor));
  const bgi = c.backgroundImage && c.backgroundImage !== 'none' ? c.backgroundImage : null;
  if (bgi && bgi.startsWith('url(')) {
    s[prefix + 'background_background'] = 'classic';
    s[prefix + 'background_image'] = { url: bgi.slice(4, -1).replace(/["']/g, ''), id: '', size: '', source: 'url' };
    s[prefix + 'background_size'] = c.backgroundSize === 'contain' ? 'contain' : 'cover';
    s[prefix + 'background_position'] = 'center center';
    if (bg.d) s[prefix + 'background_color'] = bg.d;
  } else if (bgi && bgi.startsWith('linear-gradient')) {
    const cols = [...bgi.matchAll(/rgba?\([^)]+\)/g)].map((m) => color(m[0]) || '#FFFFFF00');
    const ang = (bgi.match(/(\d+)deg/) || [])[1];
    const dir = bgi.includes('to bottom') ? 180 : bgi.includes('to right') ? 90 : bgi.includes('to top') ? 0 : bgi.includes('to left') ? 270 : ang ? +ang : 180;
    s[prefix + 'background_background'] = 'gradient';
    s[prefix + 'background_color'] = cols[0];
    s[prefix + 'background_color_b'] = cols[cols.length - 1];
    s[prefix + 'background_gradient_type'] = 'linear';
    s[prefix + 'background_gradient_angle'] = { unit: 'deg', size: dir };
  } else if (bg.d || bg.t || bg.m) {
    s[prefix + 'background_background'] = 'classic';
    setR(s, prefix + 'background_color', { d: bg.d || '#FFFFFF00', t: bg.t || '#FFFFFF00', m: bg.m || '#FFFFFF00' });
  }
  const bw = [c.borderTopWidth, c.borderRightWidth, c.borderBottomWidth, c.borderLeftWidth].map(px);
  if (bw.some((x) => x > 0)) {
    const sides = ['Top', 'Right', 'Bottom', 'Left'];
    const i = bw.findIndex((x) => x > 0);
    s[prefix + 'border_border'] = c[`border${sides[i]}Style`] === 'dashed' ? 'dashed' : 'solid';
    s[prefix + 'border_width'] = dims(...bw);
    s[prefix + 'border_color'] = color(c[`border${sides[i]}Color`]) || '#E5E3DC';
  }
  const rad = [c.borderTopLeftRadius, c.borderTopRightRadius, c.borderBottomRightRadius, c.borderBottomLeftRadius].map(px);
  if (rad.some((x) => x > 0)) s[prefix + 'border_radius'] = dims(...rad.map((x) => Math.min(x, 9999)));
  const sh = parseShadow(c.boxShadow);
  if (sh) { s[prefix + 'box_shadow_box_shadow_type'] = 'yes'; s[prefix + 'box_shadow_box_shadow'] = sh; }
}

function spacing(s, node, isWidget) {
  const p = isWidget ? '_' : '';
  const pad = byBp(node, (c) => dims(px(c.paddingTop), px(c.paddingRight), px(c.paddingBottom), px(c.paddingLeft)));
  setR(s, p + 'padding', pad);
  const autoX = node.classes.some((c) => /^(\w+:)?m[xl]-auto$/.test(c));
  const autoR = node.classes.some((c) => /^(\w+:)?m[xr]-auto$/.test(c));
  const mar = byBp(node, (c) => {
    const v = [px(c.marginTop), px(c.marginRight), px(c.marginBottom), px(c.marginLeft)];
    if (autoX || autoR) {
      return { unit: 'custom', top: `${r2(v[0])}px`, right: autoR ? 'auto' : `${r2(v[1])}px`, bottom: `${r2(v[2])}px`, left: autoX ? 'auto' : `${r2(v[3])}px`, isLinked: false };
    }
    return dims(...v);
  });
  if (Object.values(mar).some((m) => m && (m.unit === 'custom' || ['top', 'right', 'bottom', 'left'].some((k) => m[k] !== '0')))) setR(s, p + 'margin', mar);
}

function visibility(s, node) {
  if (!node.vis.d) s.hide_desktop = 'hidden-desktop';
  if (!node.vis.t) s.hide_tablet = 'hidden-tablet';
  if (!node.vis.m) s.hide_mobile = 'hidden-mobile';
}

// largura/alinhamento do filho conforme o layout do pai
function placement(s, node, parent, isWidget) {
  if (!parent) return;
  const pfx = isWidget ? '_' : '';
  const pc = parent.st.d0;
  const c = node.st.d0;
  const covers = c.position === 'absolute' && c.rect.w >= parent.st.d0.rect.w * 0.95 && c.rect.h >= parent.st.d0.rect.h * 0.95;
  const inFlowSiblings = elKids(parent).filter((k) => k !== node && !k.skip && k.st.d0.position !== 'absolute' && (k.vis.d || k.vis.m));
  if (covers && !isWidget && !inFlowSiblings.length) {
    // camada "inset-0" sozinha no bloco (ex.: legenda sobre o mapa): filho normal que cresce e preenche
    s._flex_size = 'grow';
    for (const b of BPS) s['width' + SUFFIX[b]] = { unit: '%', size: 100 };
    return;
  }
  if (covers && !isWidget) {
    // camada sobreposta a outros conteúdos: absoluta, ancorada em 0/0 com o tamanho do pai
    s.position = 'absolute'; s._offset_orientation_h = 'start'; s._offset_x = { unit: 'px', size: 0 };
    s._offset_orientation_v = 'start'; s._offset_y = { unit: 'px', size: 0 }; s.z_index = parseInt(c.zIndex, 10) || 0;
    for (const b of BPS) s['width' + SUFFIX[b]] = { unit: '%', size: 100 };
    setR(s, 'min_height', byBp(node, (x) => ({ unit: 'px', size: r2(x.rect.h) })));
    return;
  }
  if (c.position === 'absolute') {
    const pr = parent.st.d0.rect; const r = c.rect;
    s[isWidget ? '_position' : 'position'] = 'absolute';
    const right = pr.x + pr.w - (r.x + r.w); const bottom = pr.y + pr.h - (r.y + r.h);
    const useEnd = right < r.x - pr.x; const useBottom = bottom < r.y - pr.y;
    s._offset_orientation_h = useEnd ? 'end' : 'start';
    s[useEnd ? '_offset_x_end' : '_offset_x'] = { unit: 'px', size: r2(useEnd ? right : r.x - pr.x) };
    s._offset_orientation_v = useBottom ? 'end' : 'start';
    s[useBottom ? '_offset_y_end' : '_offset_y'] = { unit: 'px', size: r2(useBottom ? bottom : r.y - pr.y) };
    s[isWidget ? '_z_index' : 'z_index'] = parseInt(c.zIndex, 10) || 1;
    if (isWidget) s._element_width = 'auto';
    return;
  }
  if (pc.display === 'grid') {
    const span = (c.gridColumnStart || '').match(/span (\d+)/) || (c.gridColumnEnd || '').match(/span (\d+)/);
    if (span) setR(s, isWidget ? '_grid_column' : 'grid_column', byBp(node, (x) => ((x.gridColumnStart + x.gridColumnEnd).match(/span (\d+)/) || [])[1] || '1'));
    return;
  }
  const row = (cc) => cc.display.includes('flex') && cc.flexDirection.startsWith('row');
  const pContent = (b) => {
    const p = parent.st[b];
    return p.rect.w - px(p.paddingLeft) - px(p.paddingRight) - px(p.borderLeftWidth) - px(p.borderRightWidth);
  };
  if (BPS.some((b) => node.vis[b] && parent.vis[b] && row(parent.st[b]))) {
    if (+c.flexGrow > 0) { s[pfx + '_flex_size'] = 'grow'; if (!isWidget) s._flex_size = 'grow'; }
    if (isWidget) {
      if (+c.flexGrow === 0) s._element_width = 'auto';
      // textos curtos de uma linha (selos, rótulos) não devem quebrar ao encolher
      if (+c.flexGrow === 0) {
        const one = byBp(node, (x) => {
          const lh = x.lineHeight === 'normal' ? px(x.fontSize) * 1.2 : px(x.lineHeight);
          return x.rect.h <= lh * 1.5 + px(x.paddingTop) + px(x.paddingBottom) + 2 ? 'none' : 'shrink';
        });
        // só impede a quebra onde o original também não quebrava; no celular sempre pode encolher
        one.m = one.m === 'none' && node.st.m.rect.w < parent.st.m.rect.w * 0.6 ? 'none' : 'shrink';
        setR(s, '_flex_size', one);
      }
    } else {
      const w = byBp(node, (x, b) => (row(parent.st[b]) && +x.flexGrow === 0 ? { unit: '%', size: r2(Math.min(100, (x.rect.w / pContent(b)) * 100)) } : { unit: '%', size: 100 }));
      if (+c.flexGrow === 0 || w.m.size !== 100) setR(s, 'width', w);
      s._flex_size = +c.flexGrow > 0 ? 'grow' : 'none';
      if (+c.flexGrow > 0) { delete s.width; delete s.width_tablet; delete s.width_mobile; }
    }
    return;
  }
  // pai em coluna/bloco: alinhar quando o filho é mais estreito que o pai
  const narrow = (b) => node.st[b].rect.w < pContent(b) - 4;
  if (BPS.some((b) => node.vis[b] && narrow(b))) {
    const al = byBp(node, (x, b) => {
      if (!narrow(b)) return 'stretch';
      const p = parent.st[b]; const left = x.rect.x - (p.rect.x + px(p.paddingLeft)); const right = pContent(b) - left - x.rect.w;
      return Math.abs(left - right) < 6 ? 'center' : left > right ? 'flex-end' : 'flex-start';
    });
    setR(s, '_flex_align_self', al);
    if (isWidget) s._element_width = 'auto';
    else setR(s, 'width', byBp(node, (x, b) => ({ unit: '%', size: narrow(b) ? r2((x.rect.w / pContent(b)) * 100) : 100 })));
  }
}

// ---------- widgets ----------
function widget(type, settings, title) {
  if (title) settings._title = title.slice(0, 60);
  if (settings._element_width && settings._element_width_mobile === undefined) {
    settings._element_width_tablet = settings._element_width; settings._element_width_mobile = settings._element_width;
  }
  return { id: eid(), elType: 'widget', widgetType: type, isInner: false, settings, elements: [] };
}

function iconValue(n) {
  const name = cleanText(textOf(n));
  const v = ICONS[name] || 'fas fa-circle';
  const lib = v.startsWith('fab') ? 'fa-brands' : v.startsWith('far') ? 'fa-regular' : 'fa-solid';
  return { value: v, library: lib };
}

function iconWidget(n, parent, well) {
  const s = { selected_icon: iconValue(n), view: 'default', align: 'left' };
  setR(s, 'size', byBp(n, (c) => ({ unit: 'px', size: r2(px(c.fontSize)) })));
  s.primary_color = color(n.st.d0.color) || '#08102E';
  if (well) {
    const c = well.st.d0;
    const bg = color(c.backgroundColor);
    const bwid = px(c.borderTopWidth);
    s.view = bg ? 'stacked' : 'framed';
    if (bg) { s.primary_color = bg; s.secondary_color = color(n.st.d0.color) || '#FFFFFF'; }
    else { s.border_width = { unit: 'px', size: bwid }; s.primary_color = color(c.borderTopColor) || s.primary_color; }
    const rad = px(c.borderTopLeftRadius);
    s.shape = rad >= Math.min(c.rect.w, c.rect.h) / 2 - 1 ? 'circle' : 'square';
    if (s.shape === 'square') s.border_radius = dims(rad, rad, rad, rad);
    s.icon_padding = { unit: 'px', size: r2(Math.max(0, (Math.min(c.rect.w, c.rect.h) - px(n.st.d0.fontSize)) / 2)) };
    visibility(s, well);
    spacing(s, { ...well, st: { ...well.st }, classes: well.classes }, true);
    delete s._padding; delete s._padding_tablet; delete s._padding_mobile;
    placement(s, well, parent, true);
  } else {
    visibility(s, n);
    spacing(s, n, true);
    delete s._padding;
    placement(s, n, parent, true);
  }
  s._element_width = s._element_width || 'auto';
  return widget('icon', s, `Ícone · ${cleanText(textOf(n))}`);
}

function headingOrText(n, parent) {
  const c = n.st.d0;
  const html = inlineHtml(n, c);
  const plain = cleanText(textOf(n));
  const isHeading = /^h[1-6]$/.test(n.tag);
  // parágrafos também usam o widget Título (tag <p>): a tipografia vai direto no elemento e
  // nenhum tema consegue injetar margens/altura de linha extras como acontece no Editor de Texto.
  const long = false;
  let w;
  if (isHeading || !long) {
    const s = { title: html, header_size: isHeading ? n.tag : (['p', 'span', 'div'].includes(n.tag) ? n.tag : 'div') };
    if (n.tag === 'a' && n.attrs.href) s.link = { url: n.attrs.href, is_external: n.attrs.target === '_blank' ? 'on' : '', nofollow: '' };
    s.title_color = color(c.color) || '#1A1C1B';
    typography(s, 'typography', n);
    w = ['heading', s];
  } else {
    const s = { editor: n.tag === 'p' ? `<p>${html}</p>` : `<p>${html}</p>`, text_color: color(c.color) || '#2F3542', paragraph_spacing: { unit: 'px', size: 0 } };
    typography(s, 'typography', n);
    w = ['text-editor', s];
  }
  const s = w[1];
  const centered = (x) => x.display.includes('flex') && (x.flexDirection.startsWith('row') ? x.justifyContent === 'center' : x.alignItems === 'center');
  setR(s, 'align', byBp(n, (x) => (centered(x) ? 'center' : { start: 'left', left: 'left', center: 'center', right: 'right', end: 'right', justify: 'justify' }[x.textAlign] || 'left')));
  boxStyles(s, n, '_');
  spacing(s, n, true);
  visibility(s, n);
  placement(s, n, parent, true);
  // selos de tamanho fixo (ex.: "01" em quadrado de 48px): largura fixa + padding vertical
  const fixedW = n.classes.some((k) => /^(\w+:)?(w|size)-(\d|\[)/.test(k));
  const fixedH = n.classes.some((k) => /^(\w+:)?(h|size)-(\d|\[)/.test(k));
  if (fixedW && s._element_width !== undefined && c.position !== 'absolute') {
    s._element_width = 'initial';
    setR(s, '_element_custom_width', byBp(n, (x) => ({ unit: 'px', size: r2(x.rect.w) })));
  }
  if (fixedH) {
    setR(s, '_padding', byBp(n, (x) => {
      const lh = x.lineHeight === 'normal' ? px(x.fontSize) * 1.2 : px(x.lineHeight);
      const v = Math.max(0, (x.rect.h - lh - px(x.borderTopWidth) - px(x.borderBottomWidth)) / 2);
      return dims(v, px(x.paddingRight), v, px(x.paddingLeft));
    }));
  }
  return widget(w[0], s, plain);
}

function hoverColors(n) {
  const out = {};
  for (const c of n.classes) {
    let m = c.match(/^hover:bg-([a-z-]+)(?:\/(\d+))?$/);
    if (m && TW[m[1]]) out.bg = TW[m[1]].toUpperCase() + (m[2] ? Math.round((+m[2] / 100) * 255).toString(16).padStart(2, '0').toUpperCase() : '');
    m = c.match(/^hover:text-([a-z-]+)$/);
    if (m && TW[m[1]]) out.text = TW[m[1]].toUpperCase();
    m = c.match(/^hover:border-([a-z-]+)$/);
    if (m && TW[m[1]]) out.border = TW[m[1]].toUpperCase();
  }
  return out;
}

function buttonWidget(n, parent) {
  const c = n.st.d0;
  const icons = findAll(n, isIcon);
  const text = cleanText(textNoIcons(n));
  const s = { text, link: { url: n.attrs.href || '#', is_external: n.attrs.target === '_blank' ? 'on' : '', nofollow: '' } };
  if (icons.length) {
    const first = icons[0];
    s.selected_icon = iconValue(first);
    const textFirst = n.kids.findIndex((k) => cleanText(textNoIcons(k)) !== '') < n.kids.findIndex((k) => k === first || (isEl(k) && find(k, (x) => x === first)));
    s.icon_align = textFirst ? 'right' : 'left';
    s.icon_indent = { unit: 'px', size: r2(px(c.columnGap) || 8) };
  }
  typography(s, 'typography', n);
  s.button_text_color = color(c.color) || '#FFFFFF';
  const bg = color(c.backgroundColor);
  if (bg) { s.background_background = 'classic'; s.background_color = bg; }
  else { s.background_background = 'classic'; s.background_color = '#FFFFFF00'; }
  const hv = hoverColors(n);
  if (hv.bg) { s.button_background_hover_background = 'classic'; s.button_background_hover_color = hv.bg; }
  if (hv.text) s.hover_color = hv.text;
  if (hv.border) s.button_hover_border_color = hv.border;
  const bw = [c.borderTopWidth, c.borderRightWidth, c.borderBottomWidth, c.borderLeftWidth].map(px);
  if (bw.some((x) => x > 0)) { s.border_border = 'solid'; s.border_width = dims(...bw); s.border_color = color(c.borderTopColor) || color(c.borderBottomColor); }
  const rad = px(c.borderTopLeftRadius);
  s.border_radius = dims(rad, px(c.borderTopRightRadius), px(c.borderBottomRightRadius), px(c.borderBottomLeftRadius));
  const explicitH = n.classes.some((k) => /^(\w+:)?h-/.test(k));
  setR(s, 'text_padding', byBp(n, (x) => {
    const lh = x.lineHeight === 'normal' ? px(x.fontSize) * 1.2 : px(x.lineHeight);
    const v = explicitH ? Math.max(0, (x.rect.h - lh - px(x.borderTopWidth) * 2) / 2) : px(x.paddingTop);
    return dims(v, px(x.paddingRight), explicitH ? v : px(x.paddingBottom), px(x.paddingLeft));
  }));
  const shadow = parseShadow(c.boxShadow);
  if (shadow) { s.button_box_shadow_box_shadow_type = 'yes'; s.button_box_shadow_box_shadow = shadow; }
  // alinhamento: ocupa toda a largura do pai? (justify) senão esquerda/centro/direita
  if (parent) {
    setR(s, 'align', byBp(n, (x, b) => {
      const p = parent.st[b];
      const cw = p.rect.w - px(p.paddingLeft) - px(p.paddingRight);
      if (x.rect.w >= cw - 3 && !(p.display.includes('flex') && p.flexDirection.startsWith('row') && elKids(parent).length > 1)) return 'justify';
      const left = x.rect.x - (p.rect.x + px(p.paddingLeft));
      const right = cw - left - x.rect.w;
      if (p.display.includes('flex') && p.flexDirection.startsWith('row')) return 'left';
      return Math.abs(left - right) < 6 ? 'center' : left > right ? 'right' : 'left';
    }));
    if (s.align === 'justify') s.content_align = ({ 'space-between': 'space-between', center: 'center', 'flex-end': 'end', end: 'end' }[c.justifyContent]) || (c.display.includes('flex') ? 'start' : 'center');
  }
  spacing(s, n, true);
  delete s._padding; delete s._padding_tablet; delete s._padding_mobile;
  visibility(s, n);
  placement(s, n, parent, true);
  if (s.align === 'justify' && parent && parent.st.d0.display.includes('flex') && parent.st.d0.flexDirection.startsWith('row')) { delete s._element_width; }
  return widget('button', s, `Botão · ${text}`);
}

function imageWidget(n, parent) {
  const c = n.st.d0;
  const s = { image: { url: n.attrs.src || '', id: '', size: '', alt: n.attrs.alt || '', source: 'url' }, image_size: 'full', align: 'center' };
  const pw = parent ? parent.st.d0.rect.w - px(parent.st.d0.paddingLeft) - px(parent.st.d0.paddingRight) : c.rect.w;
  setR(s, 'width', byBp(n, (x) => ({ unit: '%', size: r2(Math.min(100, (x.rect.w / Math.max(1, pw)) * 100)) })));
  if (n.classes.some((k) => /^(\w+:)?h-/.test(k)) || c.objectFit === 'cover' || n.classes.includes('h-fixed')) {
    setR(s, 'height', byBp(n, (x) => ({ unit: 'px', size: r2(x.rect.h) })));
    s.object_fit = 'cover';
  }
  const rad = [c.borderTopLeftRadius, c.borderTopRightRadius, c.borderBottomRightRadius, c.borderBottomLeftRadius].map(px);
  if (rad.some((x) => x > 0)) s.image_border_radius = dims(...rad);
  if (px(c.opacity) < 1 && c.opacity !== '') s.opacity = { unit: 'px', size: r2(+c.opacity) };
  spacing(s, n, true);
  visibility(s, n);
  placement(s, n, parent, true);
  return widget('image', s, `Imagem · ${n.attrs.alt || ''}`);
}

// ---------- FAQ → widget Alternância (toggle) com schema FAQPage ----------
function faqTrigger(item) {
  return find(item, (x) => x.tag === 'summary' || ((x.tag === 'button') && (/toggleFaq/.test(x.attrs.onclick || '') || hasCls(x, /faq/))));
}
function isFaqItem(n) {
  if (!isEl(n)) return false;
  const t = faqTrigger(n);
  if (!t) return false;
  const triggers = findAll(n, (x) => x.tag === 'summary' || (x.tag === 'button' && (/toggleFaq/.test(x.attrs.onclick || '') || hasCls(x, /faq/))));
  return triggers.length === 1;
}
function answerOf(item, trig) {
  if (item.tag === 'details') return { kids: item.kids.filter((k) => k !== trig) };
  // conteúdo = irmão seguinte do gatilho (ou do wrapper do gatilho)
  let cur = trig;
  while (cur) {
    const parent = findParent(item, cur);
    if (!parent) break;
    const sibs = elKids(parent);
    const i = sibs.indexOf(cur);
    if (sibs[i + 1]) return sibs[i + 1];
    if (parent === item) break;
    cur = parent;
  }
  return null;
}
function findParent(root, target) {
  if (!isEl(root)) return null;
  for (const k of root.kids) { if (k === target) return root; const f = findParent(k, target); if (f) return f; }
  return null;
}
function richHtml(n) {
  // conteúdo da resposta: parágrafos, listas e negritos em HTML simples
  if (n.text !== undefined) return n.text.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  if (isIcon(n)) return '';
  const inner = n.kids.map(richHtml).join('');
  const map = { p: 'p', ul: 'ul', ol: 'ol', li: 'li', strong: 'strong', b: 'strong', em: 'em', br: 'br', a: 'a' };
  const t = map[n.tag];
  if (t === 'br') return '<br>';
  if (t === 'a') return `<a href="${n.attrs.href || '#'}">${inner}</a>`;
  if (t) return `<${t}>${inner}</${t}>`;
  const c = n.st && n.st.d0;
  const block = c && (c.display === 'block' || c.display.includes('flex') || c.display === 'grid');
  return block && inner.trim() ? `<p>${inner}</p>` : inner;
}
function toggleWidget(items, parent) {
  const first = items[0];
  const trig = faqTrigger(first);
  const qText = (tr) => {
    const q = find(tr, (x) => /^h[1-6]$/.test(x.tag) || (x.tag === 'span' && !isIcon(x) && cleanText(textOf(x)).length > 10));
    return cleanText(textNoIcons(q || tr));
  };
  const tabs = items.map((it) => {
    const t = faqTrigger(it);
    const a = answerOf(it, t);
    let html = a ? (a.kids ? a.kids.map(richHtml).join('') : richHtml(a)) : '';
    html = html.replace(/<p>\s*<p>/g, '<p>').replace(/<\/p>\s*<\/p>/g, '</p>').replace(/\s+/g, ' ').trim();
    if (!/^<(p|ul|ol)/.test(html)) html = `<p>${html}</p>`;
    return { _id: eid(), tab_title: qText(t), tab_content: html };
  });
  const s = { tabs, faq_schema: 'yes', title_html_tag: 'h3' };
  s.selected_icon = { value: 'fas fa-chevron-down', library: 'fa-solid' };
  s.selected_active_icon = { value: 'fas fa-chevron-up', library: 'fa-solid' };
  s.icon_align = 'right';
  const ic = c0(first);
  s.border_width = { unit: 'px', size: px(ic.borderTopWidth) || 1 };
  s.border_color = color(ic.borderTopColor) || '#E5E3DC';
  if (items[1]) s.space_between = { unit: 'px', size: r2(Math.max(0, items[1].st.d0.rect.y - (first.st.d0.rect.y + first.st.d0.rect.h))) };
  const tc = trig.st.d0;
  s.title_background = color(ic.backgroundColor) || color(tc.backgroundColor) || '#FFFFFF';
  const qn = find(trig, (x) => /^h[1-6]$/.test(x.tag) || (x.tag === 'span' && !isIcon(x))) || trig;
  s.title_color = color(qn.st.d0.color) || '#08102E';
  s.tab_active_color = s.title_color;
  const iconN = find(trig, isIcon);
  if (iconN) { s.icon_color = color(iconN.st.d0.color) || '#B59451'; s.icon_active_color = s.icon_color; }
  const padT = Math.max(px(tc.paddingTop), px(ic.paddingTop)); const padL = Math.max(px(tc.paddingLeft), px(ic.paddingLeft));
  s.title_padding = dims(padT, padL, padT, padL);
  typography(s, 'title_typography', qn);
  const a = answerOf(first, trig);
  const an = a && !a.kids ? (find(a, (x) => x.tag === 'p') || a) : null;
  if (an && an.st) {
    s.content_color = color(an.st.d0.color) || '#2F3542';
    typography(s, 'content_typography', an);
  } else { s.content_color = '#2F3542'; }
  s.content_background_color = s.title_background;
  s.content_padding = dims(4, padL, padT, padL);
  const tsh = parseShadow(ic.boxShadow);
  if (tsh) { s.box_shadow_box_shadow_type = 'yes'; s.box_shadow_box_shadow = tsh; }
  return widget('toggle', s, 'FAQ · ' + tabs.length + ' perguntas');
}
const c0 = (n) => n.st.d0;

// ---------- formulário (Elementor Pro) ----------
function formWidget(n, parent) {
  const fields = [];
  const labelFor = (inp) => {
    const id = inp.attrs.id;
    const lab = id && find(n, (x) => x.tag === 'label' && x.attrs.for === id);
    if (lab) return cleanText(textNoIcons(lab)).replace(/\*\s*$/, '').trim();
    return '';
  };
  // agrupa campos por "bloco" (label + controle)
  const blocks = findAll(n, (x) => ['input', 'select', 'textarea'].includes(x.tag));
  const seenRadio = new Set();
  const widthOf = (inp) => {
    const w = inp.st.d0.rect.w / Math.max(1, n.st.d0.rect.w);
    return w > 0.9 ? '100' : w > 0.6 ? '66' : w > 0.45 ? '50' : '33';
  };
  for (const inp of blocks) {
    const type = (inp.attrs.type || inp.tag).toLowerCase();
    if (type === 'submit' || type === 'hidden') continue;
    if (type === 'radio' || type === 'checkbox') {
      const name = inp.attrs.name || inp.attrs.id;
      if (seenRadio.has(name)) continue;
      seenRadio.add(name);
      const group = blocks.filter((x) => (x.attrs.name || x.attrs.id) === name);
      // título do grupo: label/legenda mais próxima acima
      const container = findParent(n, findParent(n, group[0])) || n;
      const opts = group.map((g) => {
        const lab = findParent(n, g);
        return cleanText(textNoIcons(lab)).replace(/\s+/g, ' ');
      });
      if (type === 'checkbox' && group.length === 1 && opts[0].length > 40) {
        fields.push({ _id: eid(), custom_id: name || 'aceite', field_type: 'acceptance', acceptance_text: opts[0], required: 'true', width: '100' });
        continue;
      }
      let gl = '';
      let up = findParent(n, container);
      const prevLabel = up && elKids(up).find((x) => ['label', 'span', 'p', 'legend'].includes(x.tag) && cleanText(textOf(x)).length < 80 && !find(x, (y) => y.tag === 'input'));
      if (prevLabel) gl = cleanText(textNoIcons(prevLabel)).replace(/\*\s*$/, '').trim();
      fields.push({ _id: eid(), custom_id: (name || 'opcao').replace(/[^a-z0-9_]/gi, '_'), field_type: type, field_label: gl, field_options: opts.join('\n'), inline_list: 'elementor-subgroup-inline', required: group.some((g) => 'required' in g.attrs) ? 'true' : '', width: '100' });
      continue;
    }
    const f = { _id: eid(), custom_id: (inp.attrs.name || inp.attrs.id || `campo_${fields.length + 1}`).replace(/[^a-z0-9_]/gi, '_'), field_label: labelFor(inp), placeholder: inp.attrs.placeholder || '', required: 'required' in inp.attrs ? 'true' : '', width: widthOf(inp) };
    if (inp.tag === 'textarea') { f.field_type = 'textarea'; f.rows = +(inp.attrs.rows || 4); }
    else if (inp.tag === 'select') {
      f.field_type = 'select';
      f.field_options = findAll(inp, (x) => x.tag === 'option').map((o) => cleanText(textOf(o))).join('\n');
    } else f.field_type = ['email', 'tel', 'number', 'url', 'date'].includes(type) ? type : 'text';
    fields.push(f);
  }
  const btn = find(n, (x) => (x.tag === 'button' && (x.attrs.type || 'submit') !== 'button') || (x.tag === 'input' && x.attrs.type === 'submit'));
  const inp0 = blocks.find((x) => !['radio', 'checkbox'].includes(x.attrs.type));
  const lab0 = find(n, (x) => x.tag === 'label');
  const s = {
    form_name: 'Triagem Jurídica', form_fields: fields,
    button_text: btn ? cleanText(textNoIcons(btn)) : 'Enviar', button_width: '100',
    email_to: '', email_subject: 'Nova triagem pelo site', success_message: 'Recebemos seu resumo. Retornaremos em até 2 horas úteis.',
    column_gap: { unit: 'px', size: 16 }, row_gap: { unit: 'px', size: 20 },
  };
  if (lab0) { s.label_color = color(lab0.st.d0.color); typography(s, 'label_typography', lab0); }
  if (inp0) {
    const c = inp0.st.d0;
    s.field_text_color = color(c.color); s.field_background_color = color(c.backgroundColor) || '#FFFFFF';
    s.field_border_color = color(c.borderTopColor); s.field_border_width = dims(px(c.borderTopWidth), px(c.borderRightWidth), px(c.borderBottomWidth), px(c.borderLeftWidth));
    s.field_border_radius = dims(px(c.borderTopLeftRadius), px(c.borderTopRightRadius), px(c.borderBottomRightRadius), px(c.borderBottomLeftRadius));
    typography(s, 'field_typography', inp0);
  }
  if (btn) {
    const c = btn.st.d0;
    s.button_background_color = color(c.backgroundColor); s.button_text_color = color(c.color);
    s.button_border_radius = dims(px(c.borderTopLeftRadius), px(c.borderTopRightRadius), px(c.borderBottomRightRadius), px(c.borderBottomLeftRadius));
    typography(s, 'button_typography', btn);
    s.button_width = btn.st.d0.rect.w > n.st.d0.rect.w * 0.9 ? '100' : '';
    const hv = hoverColors(btn); if (hv.bg) s.button_background_hover_color = hv.bg;
  }
  spacing(s, n, true);
  visibility(s, n);
  placement(s, n, parent, true);
  return widget('form', s, 'Formulário · Triagem (Elementor Pro)');
}

// ---------- tabela → Editor de Texto com tabela estilizada ----------
function tableWidget(n, parent) {
  function cell(x) {
    if (x.text !== undefined) return x.text.replace(/&/g, '&amp;').replace(/</g, '&lt;');
    if (isIcon(x)) return '';
    const c = x.st.d0;
    const st = [];
    if (['table', 'thead', 'tbody', 'tr', 'th', 'td'].includes(x.tag)) {
      const bg = color(c.backgroundColor); if (bg) st.push(`background:${bg}`);
      if (x.tag !== 'tr' && x.tag !== 'thead' && x.tag !== 'tbody') {
        st.push(`padding:${px(c.paddingTop)}px ${px(c.paddingRight)}px ${px(c.paddingBottom)}px ${px(c.paddingLeft)}px`);
        st.push(`color:${color(c.color)}`, `font-size:${c.fontSize}`, `line-height:${c.lineHeight}`, `font-weight:${c.fontWeight}`, `font-family:${family(c.fontFamily)}`, `text-align:${c.textAlign}`, 'vertical-align:top');
        if (c.textTransform !== 'none') st.push(`text-transform:${c.textTransform}`, `letter-spacing:${c.letterSpacing}`);
        if (px(c.borderBottomWidth)) st.push(`border-bottom:${c.borderBottomWidth} solid ${color(c.borderBottomColor)}`);
      }
      if (x.tag === 'table') st.push('width:100%', 'border-collapse:collapse', 'margin:0');
      if (x.tag === 'th') st.push(`width:${r2((c.rect.w / n.st.d0.rect.w) * 100)}%`);
      const inner = x.kids.map(cell).join('');
      return `<${x.tag}${st.length ? ` style="${st.join(';')}"` : ''}>${inner}</${x.tag}>`;
    }
    const inner = x.kids.map(cell).join('');
    const sst = [];
    if (x.st.d0.display === 'block') return `<span style="display:block;color:${color(c.color)};font-size:${c.fontSize};font-weight:${c.fontWeight};${c.textTransform !== 'none' ? `text-transform:${c.textTransform};letter-spacing:${c.letterSpacing};` : ''}font-family:${family(c.fontFamily)}">${inner}</span>`;
    const bg = color(c.backgroundColor);
    if (bg) sst.push(`background:${bg};padding:2px 8px;border-radius:2px;display:inline-block`);
    sst.push(`color:${color(c.color)}`, `font-weight:${c.fontWeight}`, `font-size:${c.fontSize}`, `line-height:${c.lineHeight}`, `font-family:${family(c.fontFamily)}`);
    if (c.letterSpacing !== 'normal') sst.push(`letter-spacing:${c.letterSpacing}`);
    if (c.textTransform !== 'none') sst.push(`text-transform:${c.textTransform}`);
    return `<span style="${sst.join(';')}">${inner}</span>`;
  }
  const s = { editor: cell(n).replace(/\s+/g, ' '), text_color: '#2F3542', paragraph_spacing: { unit: 'px', size: 0 } };
  typography(s, 'typography', n);
  visibility(s, n);
  return widget('text-editor', s, 'Tabela');
}

// ---------- HTML preservado (só para filtros interativos e SVG) ----------
let HTML_SNIPPETS = [];
function htmlWidget(n, title) {
  HTML_SNIPPETS.push(n.outer);
  return widget('html', { html: `<div class="prk">${n.outer}</div>` }, title);
}

// ---------- containers ----------
function isWell(n) {
  const kids = elKids(n);
  if (kids.length !== 1 || !isIcon(kids[0]) || cleanText(n.kids.filter((k) => k.text !== undefined).map((k) => k.text).join(''))) return false;
  const c = n.st.d0;
  return (color(c.backgroundColor) || px(c.borderTopWidth) > 0) && c.rect.w <= 96 && c.rect.h <= 96;
}
function isDecorative(n) {
  const c = n.st.d0;
  if (c.position !== 'absolute' && c.position !== 'fixed') return false;
  if (n.attrs['aria-hidden'] === 'true' || c.pointerEvents === 'none' || +c.opacity <= 0.35) return true;
  return !cleanText(textOf(n)) && !find(n, (x) => x.tag === 'img' || isIcon(x));
}
function isButtonish(n) {
  if (!['a', 'button'].includes(n.tag)) return false;
  if (!cleanText(textNoIcons(n))) return false;
  if (findAll(n, (x) => x !== n && !isIcon(x) && (['div', 'p', 'h1', 'h2', 'h3', 'h4', 'img', 'ul'].includes(x.tag))).length) return false;
  const kidsBoxes = findAll(n, (x) => x !== n && !isIcon(x) && hasBox(x.st.d0));
  if (kidsBoxes.length) return false;
  const c = n.st.d0;
  return hasBox(c) || findAll(n, isIcon).length > 0 || c.display.includes('flex') || c.display === 'inline-block';
}

function containerSettings(n, parent, root) {
  const s = { content_width: 'full', flex_gap: { unit: 'px', size: 0, column: '0', row: '0', isLinked: true } };
  const c = n.st.d0;
  const disp = byBp(n, (x) => x.display);
  if (disp.d === 'grid' || disp.t === 'grid' || disp.m === 'grid') {
    s.container_type = 'grid';
    setR(s, 'grid_columns_grid', byBp(n, (x) => {
      if (x.display !== 'grid') return { unit: 'fr', size: 1 };
      const cols = x.gridTemplateColumns.split(' ').map(px).filter((v) => v > 0);
      const eq = cols.every((v) => Math.abs(v - cols[0]) < 2);
      if (eq || cols.length < 2) return { unit: 'fr', size: Math.max(1, cols.length) };
      const min = Math.min(...cols);
      return { unit: 'custom', size: cols.map((v) => `${r2(v / min)}fr`).join(' ') };
    }));
    setR(s, 'grid_gaps', byBp(n, (x) => ({ unit: 'px', column: String(px(x.columnGap)), row: String(px(x.rowGap)), isLinked: px(x.columnGap) === px(x.rowGap), size: px(x.columnGap) })));
    setR(s, 'grid_align_items', byBp(n, (x) => ({ normal: 'stretch', stretch: 'stretch', start: 'start', 'flex-start': 'start', center: 'center', end: 'end', 'flex-end': 'end' }[x.alignItems] || 'stretch')));
    s.grid_auto_flow = 'row';
    for (const b of BPS) s['grid_rows_grid' + SUFFIX[b]] = { unit: 'custom', size: 'auto' };
    const cols = byBp(n, (x) => {
      if (x.display !== 'grid') return { unit: 'fr', size: 1 };
      const cs = x.gridTemplateColumns.split(' ').map(px).filter((v) => v > 0);
      const eq = cs.every((v) => Math.abs(v - cs[0]) < 2);
      if (eq || cs.length < 2) return { unit: 'fr', size: Math.max(1, cs.length) };
      const min = Math.min(...cs);
      return { unit: 'custom', size: cs.map((v) => `${r2(v / min)}fr`).join(' ') };
    });
    for (const b of BPS) s['grid_columns_grid' + SUFFIX[b]] = cols[b];
  } else {
    s.container_type = 'flex';
    setR(s, 'flex_direction', byBp(n, (x) => (x.display.includes('flex') ? x.flexDirection : 'column')));
    setR(s, 'flex_justify_content', byBp(n, (x) => (x.display.includes('flex') ? ({ normal: 'flex-start', start: 'flex-start', end: 'flex-end' }[x.justifyContent] || x.justifyContent) : 'flex-start')));
    setR(s, 'flex_align_items', byBp(n, (x) => {
      if (!x.display.includes('flex')) return 'stretch';
      return ({ normal: 'stretch', start: 'flex-start', end: 'flex-end', baseline: 'flex-start' }[x.alignItems] || x.alignItems);
    }));
    setR(s, 'flex_gap', byBp(n, (x) => {
      const cg = px(x.columnGap); const rg = px(x.rowGap);
      return { unit: 'px', size: x.flexDirection.startsWith('row') ? cg : rg, column: String(cg), row: String(rg), isLinked: cg === rg };
    }));
    setR(s, 'flex_wrap', byBp(n, (x) => (x.flexWrap === 'wrap' ? 'wrap' : 'nowrap')));
  }
  boxStyles(s, n, '');
  spacing(s, n, false);
  if (n.classes.some((k) => /^(\w+:)?(min-)?h-(?!full|auto)/.test(k))) setR(s, 'min_height', byBp(n, (x) => ({ unit: 'px', size: r2(x.rect.h) })));
  if (c.overflow === 'hidden') s.overflow = 'hidden';
  visibility(s, n);
  if (!root) placement(s, n, parent, false);
  if (n.tag === 'a' && n.attrs.href) { s.html_tag = 'a'; s.link = { url: n.attrs.href, is_external: n.attrs.target === '_blank' ? 'on' : '', nofollow: '' }; }
  else if (['section', 'article', 'aside', 'nav', 'header', 'footer'].includes(n.tag)) s.html_tag = n.tag === 'header' || n.tag === 'footer' ? 'div' : n.tag;
  // barra decorativa absoluta colada numa borda (ex.: faixa navy de 6px à esquerda) → borda do container
  for (const k of elKids(n)) {
    const kc = k.st.d0; const r = kc.rect; const pr = c.rect;
    if (kc.position !== 'absolute' || !color(kc.backgroundColor) || cleanText(textOf(k))) continue;
    let side = null;
    if (r.w <= 8 && r.h >= pr.h * 0.9) side = Math.abs(r.x - pr.x) < 2 ? 'left' : Math.abs(r.x + r.w - pr.x - pr.w) < 2 ? 'right' : null;
    else if (r.h <= 8 && r.w >= pr.w * 0.9) side = Math.abs(r.y - pr.y) < 2 ? 'top' : Math.abs(r.y + r.h - pr.y - pr.h) < 2 ? 'bottom' : null;
    if (!side || s.border_border) continue;
    const t = Math.round(side === 'left' || side === 'right' ? r.w : r.h);
    s.border_border = 'solid';
    s.border_width = dims(side === 'top' ? t : 0, side === 'right' ? t : 0, side === 'bottom' ? t : 0, side === 'left' ? t : 0);
    s.border_color = color(kc.backgroundColor);
    const hv = hoverColors({ classes: k.classes.map((x) => x.replace(/^group-hover:/, 'hover:')) });
    if (hv.bg) { s.border_hover_border = 'solid'; s.border_hover_width = s.border_width; s.border_hover_color = hv.bg; }
    k.skip = true;
  }
  // fundo de imagem absoluta que cobre o bloco → background do container
  const bgImg = elKids(n).find((k) => k.tag === 'img' && k.st.d0.position === 'absolute' && k.st.d0.rect.w >= c.rect.w * 0.9 && k.st.d0.rect.h >= c.rect.h * 0.9);
  if (bgImg) {
    const bgc = color(c.backgroundColor) || '#08102E';
    s.background_background = 'classic';
    s.background_image = { url: bgImg.attrs.src, id: '', size: '', source: 'url' };
    s.background_size = 'cover'; s.background_position = 'center center';
    s.background_overlay_background = 'classic'; s.background_overlay_color = bgc.slice(0, 7);
    s.background_overlay_opacity = { unit: 'px', size: r2(1 - (+bgImg.st.d0.opacity || 1)) };
    bgImg.skip = true;
  }
  return s;
}

function container(n, parent, root, title) {
  const s = containerSettings(n, parent, root);
  // cards dos diretórios: os data-* viram classes (o filtro em JS lê com prkData)
  const card = n.classes.find((k) => k === 'delegacia-card' || k === 'prison-card');
  if (card) {
    const enc = (v) => Buffer.from(v, 'utf8').toString('hex');
    s.css_classes = [card, ...Object.entries(n.attrs).filter(([k]) => k.startsWith('data-') && k !== 'data-was-hidden').map(([k, v]) => `prk-d-${k.slice(5)}--${enc(v)}`)].join(' ');
  }
  const h = find(n, (x) => /^h[1-6]$/.test(x.tag));
  s._title = (title || (h ? cleanText(textOf(h)) : '') || n.tag).slice(0, 60);
  const elements = convertKids(n);
  // container vazio sem nada visual vira só uma área de "+" no editor: descarta
  if (!root && !elements.length && !s.background_background && !s.border_border && !s.min_height) return null;
  return { id: eid(), elType: 'container', isInner: !root, settings: s, elements };
}

// colapsa wrappers sem estilo e de mesmo tamanho do único filho
function collapsible(n, kid, parent) {
  const c = n.st.d0; const k = kid.st.d0;
  if (parent && parent.st.d0.display === 'grid') return false;
  if (+c.flexGrow !== +k.flexGrow) return false;
  if (hasBox(c) || parseShadow(c.boxShadow)) return false;
  if (['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'marginTop', 'marginBottom', 'marginLeft', 'marginRight'].some((p) => px(c[p]))) return false;
  if (c.position === 'absolute' || n.tag === 'a') return false;
  return Math.abs(c.rect.w - k.rect.w) < 2 && Math.abs(c.rect.h - k.rect.h) < 2 && BPS.every((b) => n.vis[b] === kid.vis[b]);
}


// blocos vazios viram widgets nativos (no editor, container vazio aparece como área "+")
function emptyBoxWidget(n, parent) {
  const c = n.st.d0; const r = c.rect;
  const bgi = c.backgroundImage && c.backgroundImage.startsWith('url(') ? c.backgroundImage.slice(4, -1).replace(/["']/g, '') : null;
  if (bgi) {
    const img = { ...n, tag: 'img', attrs: { ...n.attrs, src: bgi, alt: n.attrs['data-location'] || '' }, classes: [...n.classes, 'h-fixed'] };
    img.st = { ...n.st, d0: { ...c, objectFit: 'cover' } };
    return imageWidget(img, parent);
  }
  const bg = color(c.backgroundColor);
  if (!bg) return null;
  if (r.w <= 16 && r.h <= 16) {
    const s = { selected_icon: { value: 'fas fa-circle', library: 'fa-solid' }, view: 'default', primary_color: bg, align: 'left' };
    setR(s, 'size', byBp(n, (x) => ({ unit: 'px', size: r2(Math.max(x.rect.w, x.rect.h)) })));
    if (px(c.borderTopLeftRadius) < Math.min(r.w, r.h) / 2 - 1) s.selected_icon = { value: 'fas fa-square-full', library: 'fa-solid' };
    spacing(s, n, true); delete s._padding;
    visibility(s, n); placement(s, n, parent, true);
    return widget('icon', s, 'Marcador');
  }
  if (r.h <= 3 || r.w <= 3) {
    const vertical = r.w <= 3 && r.h > r.w;
    if (vertical) return null;
    const s = { style: 'solid', weight: { unit: 'px', size: r2(r.h) }, color: bg, gap: { unit: 'px', size: 0 } };
    const pw = parent ? parent.st.d0.rect.w - px(parent.st.d0.paddingLeft) - px(parent.st.d0.paddingRight) : r.w;
    setR(s, 'width', byBp(n, (x) => ({ unit: '%', size: r2(Math.min(100, (x.rect.w / Math.max(1, pw)) * 100)) })));
    spacing(s, n, true); visibility(s, n);
    return widget('divider', s, 'Divisor');
  }
  return null;
}

const TAB_TITLES = [];
function convertNode(n, parent) {
  if (n.skip) return [];
  if (['script', 'style', 'noscript', 'option', 'label'].includes(n.tag) && !(n.tag === 'label' && !find(n, (x) => x.tag === 'input'))) return [];
  if (!n.vis.d && !n.vis.t && !n.vis.m && !n.attrs['data-was-hidden']) return [];
  if (isDecorative(n)) return [];
  if (n.attrs.id && /^tab-btn-/.test(n.attrs.id)) return [];
  if (elKids(n).length && elKids(n).every((k) => /^tab-btn-/.test(k.attrs.id || ''))) return [];
  if (find(n, (x) => x.attrs.id === 'tab-btn-1') && !find(n, (x) => x.classes.includes('tab-panel')) && !cleanText(textOf(n).replace(TAB_TITLES.join(''), ''))) return [];
  if (n.tag === 'form') return [formWidget(n, parent)];
  if (n.tag === 'table') return [tableWidget(n, parent)];
  if (n.tag === 'svg') return [htmlWidget(n, 'SVG')];
  if (n.filterBar) return [htmlWidget(n, 'Filtro do diretório (interativo)')];
  if (n.tag === 'img') return [imageWidget(n, parent)];
  if (isIcon(n)) return [iconWidget(n, parent)];
  if (isWell(n)) return [iconWidget(elKids(n)[0], parent, n)];
  if (isButtonish(n)) return [buttonWidget(n, parent)];
  if (isTextLeaf(n)) return [headingOrText(n, parent)];
  if (!elKids(n).length && !cleanText(textOf(n))) {
    const leaf = emptyBoxWidget(n, parent);
    if (leaf) return [leaf];
  }
  const kids = elKids(n);
  const strayText = n.kids.some((k) => k.text !== undefined && cleanText(k.text));
  if (kids.length === 1 && !strayText && collapsible(n, kids[0], parent)) return convertNode(kids[0], parent);
  const ct = container(n, parent, false);
  return ct ? [ct] : [];
}

function convertKids(n) {
  const out = [];
  const kids = n.kids;
  for (let i = 0; i < kids.length; i++) {
    const k = kids[i];
    if (k.text !== undefined) {
      const t = cleanText(k.text);
      if (t) {
        const fake = { ...n, kids: [k], tag: 'span', classes: [], attrs: {} };
        out.push(headingOrText(fake, null));
      }
      continue;
    }
    // grupo de FAQs consecutivas → 1 widget Alternância
    if (isFaqItem(k) && k.vis.d + k.vis.m > 0) {
      const group = [k];
      while (kids[i + 1] && (kids[i + 1].text !== undefined ? !cleanText(kids[i + 1].text) : isFaqItem(kids[i + 1]))) { i++; if (isEl(kids[i])) group.push(kids[i]); }
      out.push(toggleWidget(group, n));
      continue;
    }
    // painéis de abas → Abas aninhadas
    if (k.classes && k.classes.includes('tab-panel')) {
      const panels = [k];
      while (kids[i + 1] && (kids[i + 1].text !== undefined || (kids[i + 1].classes || []).includes('tab-panel'))) { i++; if (isEl(kids[i])) panels.push(kids[i]); }
      out.push(nestedTabs(panels, n));
      continue;
    }
    out.push(...convertNode(k, n));
  }
  return out;
}

function nestedTabs(panels, parent) {
  const tabs = panels.map((p, i) => ({ _id: eid(), tab_title: TAB_TITLES[i] || `Aba ${i + 1}` }));
  const els = panels.map((p, i) => {
    p.vis = { d: true, t: true, m: true };
    const c = container(p, parent, false, tabs[i].tab_title);
    c.isInner = true;
    delete c.settings.width; delete c.settings.width_tablet; delete c.settings.width_mobile;
    for (const k of ['hide_desktop', 'hide_tablet', 'hide_mobile']) delete c.settings[k];
    return c;
  });
  const btn = TAB_BTN;
  const s = { tabs, tabs_justify_horizontal: 'stretch', tabs_direction: 'block-start' };
  if (btn) {
    const c = btn.st.d0;
    s.title_text_color = '#2F3542'; s.title_text_color_active = '#FFFFFF'; s.title_text_color_hover = '#08102E';
    s.tabs_title_background_color_background = 'classic'; s.tabs_title_background_color_color = '#FFFFFF';
    s.tabs_title_background_color_active_background = 'classic'; s.tabs_title_background_color_active_color = '#08102E';
    s.tabs_title_border_radius = dims(px(c.borderTopLeftRadius), px(c.borderTopLeftRadius), px(c.borderTopLeftRadius), px(c.borderTopLeftRadius));
    s.padding = dims(px(c.paddingTop), px(c.paddingRight), px(c.paddingBottom), px(c.paddingLeft));
    typography(s, 'title_typography', btn);
  }
  return { id: eid(), elType: 'widget', widgetType: 'nested-tabs', isInner: false, settings: { ...s, _title: 'Abas · Núcleos de Atuação' }, elements: els };
}
let TAB_BTN = null;

// raiz da seção: container de largura total; o miolo max-w + mx-auto vira "boxed"
function rootContainer(n, title, only) {
  const s = containerSettings(n, null, true);
  s._title = title.slice(0, 60);
  s.html_tag = n.tag === 'section' ? 'section' : 'div';
  let inner = n;
  const kids = elKids(n);
  const k = kids.length === 1 ? kids[0] : null;
  if (k && k.st.d0.maxWidth !== 'none' && hasCls(k, /^(\w+:)?mx-auto$/) && !hasBox(k.st.d0)) {
    const mw = px(k.st.d0.maxWidth);
    s.content_width = 'boxed';
    const pad = byBp(k, (c) => [px(c.paddingTop), px(c.paddingRight), px(c.paddingBottom), px(c.paddingLeft)]);
    const outer = byBp(n, (c) => [px(c.paddingTop), px(c.paddingRight), px(c.paddingBottom), px(c.paddingLeft)]);
    setR(s, 'padding', Object.fromEntries(BPS.map((b) => [b, dims(outer[b][0] + pad[b][0], Math.max(outer[b][1], pad[b][1]), outer[b][2] + pad[b][2], Math.max(outer[b][3], pad[b][3]))])));
    s.boxed_width = { unit: 'px', size: r2(mw - pad.d[1] - pad.d[3]) };
    const ks = containerSettings(k, n, true);
    for (const key of Object.keys(ks)) if (/^(flex_|grid_|container_type)/.test(key)) s[key] = ks[key];
    inner = k;
  }
  return { id: eid(), elType: 'container', isInner: false, settings: s, elements: convertKids(inner) };
}

function main() {
  const [, , itemsFile, measureFile, outFile] = process.argv;
  const page = JSON.parse(fs.readFileSync(itemsFile, 'utf8'));
  const { tree, styles } = JSON.parse(fs.readFileSync(measureFile, 'utf8'));
  const outers = JSON.parse(fs.readFileSync(measureFile.replace('.measure.json', '.outer.json'), 'utf8'));
  const content = [];
  tree.forEach((prkRoot, i) => {
    const item = page.items[i];
    prep(prkRoot, styles, item.only || null);
    // marca HTML externo para filtros interativos
    (function mark(x) {
      if (!isEl(x)) return;
      if (outers[x.pk]) { x.outer = outers[x.pk]; x.filterBar = true; }
      x.kids.forEach(mark);
    })(prkRoot);
    const b1 = find(prkRoot, (x) => x.attrs.id === 'tab-btn-1');
    if (b1) { TAB_BTN = b1; findAll(prkRoot, (x) => /^tab-btn-/.test(x.attrs.id || '')).forEach((b) => TAB_TITLES.push(cleanText(textOf(b)))); }
    let sec = elKids(prkRoot)[0];
    const el = rootContainer(sec, item.title, item.only);
    if (item.hide) for (const h of item.hide) el.settings[`hide_${h}`] = `hidden-${h}`;
    content.push(el);
  });
  if (page.extraHtml) content.push(...page.extraHtml.map((h) => ({ id: eid(), elType: 'container', isInner: false, settings: { content_width: 'full', _title: h.title, padding: zeroDims(), flex_gap: { unit: 'px', size: 0, column: '0', row: '0', isLinked: true } }, elements: [widget('html', { html: h.html }, h.title)] })));
  const tpl = { version: '0.4', title: page.title, type: 'page', page_settings: { template: 'elementor_header_footer', hide_title: 'yes' }, content };
  fs.writeFileSync(outFile, JSON.stringify(tpl, null, 1));
  fs.writeFileSync(outFile.replace('.json', '.snippets.json'), JSON.stringify(HTML_SNIPPETS));
  const count = {};
  (function walk(es) { for (const e of es) { const k = e.widgetType || e.elType; count[k] = (count[k] || 0) + 1; walk(e.elements); } })(content);
  console.log(path.basename(outFile), JSON.stringify(count));
}
main();
