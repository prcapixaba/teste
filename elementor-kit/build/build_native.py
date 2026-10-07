#!/usr/bin/env python3
"""Gera o kit com WIDGETS NATIVOS do Elementor (containers, títulos, textos, botões,
ícones, imagens, FAQ, abas e formulário), editáveis por arrastar e soltar.

Fluxo: telas do Stitch → seções (sem header/footer) → medição no Chromium em
1280/900/390 px (native/extract.cjs) → conversão para JSON Elementor (native/convert.cjs).

Uso (a partir de elementor-kit/):  python3 -I build/build_native.py
Requer: `npm install` em build/ e Playwright com Chromium.
"""
import json
import re
import subprocess
import sys
import zipfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import build as html_build  # noqa: E402  (reaproveita a extração das seções e o CSS)

KIT = html_build.KIT
BUILD = html_build.BUILD
NATIVE = BUILD / 'native'
TMP = BUILD / '.tmp'
OUT = KIT / 'templates'

# scripts que continuam necessários com widgets nativos (filtros dos diretórios)
KEEP_SCRIPTS = {'07-guia-delegacias-es', '08-guia-presidios-es'}
PRK_DATA = (
    "function prkData(el,k){var v=el.getAttribute('data-'+k);if(v!==null)return v;"
    "var p='prk-d-'+k+'--',c=[].slice.call(el.classList).find(function(x){return x.indexOf(p)===0});"
    "if(!c)return null;var h=c.slice(p.length),b=new Uint8Array(h.length/2);"
    "for(var i=0;i<b.length;i++)b[i]=parseInt(h.substr(i*2,2),16);return new TextDecoder().decode(b);}"
)


def node(script, *args):
    subprocess.run(['node', str(NATIVE / script), *map(str, args)], cwd=BUILD, check=True)


def main():
    OUT.mkdir(exist_ok=True)
    TMP.mkdir(exist_ok=True)
    built = []
    for slug, title, src in html_build.PAGES:
        items, js = html_build.collect(slug, src)
        body = ''.join(h for _, h, _ in items)
        css = html_build.compile_css(slug, body)
        page = {
            'title': f'Pablo Ribeiro · {title}',
            'head': html_build.FONTS + f'<style>{css}</style>',
            'items': [
                {'title': t, 'html': h, 'hide': hide, 'only': 'm' if hide and 'desktop' in hide else None}
                for t, h, hide in items
            ],
        }
        items_f = TMP / f'{slug}.items.json'
        measure_f = TMP / f'{slug}.measure.json'
        out_f = OUT / f'{slug}.json'
        items_f.write_text(json.dumps(page, ensure_ascii=False), encoding='utf-8')
        node('extract.cjs', items_f, measure_f)
        node('convert.cjs', items_f, measure_f, out_f)

        tpl = json.loads(out_f.read_text(encoding='utf-8'))
        snippets = json.loads(out_f.with_suffix('.snippets.json').read_text(encoding='utf-8'))
        out_f.with_suffix('.snippets.json').unlink()
        extra = ''
        if snippets:
            snip_css = html_build.compile_css(slug + '-snippets', ''.join(snippets) + ''.join(js))
            extra += html_build.FONTS + f'<style>{snip_css}</style>'
        if slug in KEEP_SCRIPTS and js:
            code = '\n'.join(re.sub(r"(\w+)\.getAttribute\('data-([\w-]+)'\)", r"prkData(\1,'\2')", s) for s in js)
            extra += f'<script>{PRK_DATA}\n{code}</script>'
        if extra:
            tpl['content'].append({
                'id': 'f00d' + slug[:3].replace('-', '0'), 'elType': 'container', 'isInner': False,
                'settings': {'_title': '⚙ Filtros do diretório: CSS + script (não remover)', 'content_width': 'full',
                             'padding': {'unit': 'px', 'top': '0', 'right': '0', 'bottom': '0', 'left': '0', 'isLinked': True},
                             'flex_gap': {'unit': 'px', 'size': 0, 'column': '0', 'row': '0', 'isLinked': True}},
                'elements': [{'id': 'f00e' + slug[:3].replace('-', '0'), 'elType': 'widget', 'widgetType': 'html',
                              'isInner': False, 'settings': {'_title': 'CSS + script dos filtros', 'html': extra},
                              'elements': []}],
            })
        out_f.write_text(json.dumps(tpl, ensure_ascii=False, indent=1), encoding='utf-8')
        built.append(out_f)

    zpath = KIT / 'pablo-ribeiro-elementor-templates.zip'
    with zipfile.ZipFile(zpath, 'w', zipfile.ZIP_DEFLATED) as z:
        for f in built:
            z.write(f, f.name)
    print('zip:', zpath.name)


if __name__ == '__main__':
    sys.exit(main())
