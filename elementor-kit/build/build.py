#!/usr/bin/env python3
"""Leitura das telas do Stitch e prévias HTML.

- Remove <header> e <footer> do site (o kit é só conteúdo) e separa as seções.
- Aplica as correções de conteúdo (card duplicado da Vila Velha, telefone provisório).
- Compila o Tailwind (sem CDN), escopado em .prk.
- `python3 -I build/build.py` gera preview/*.html. Os templates Elementor nativos
  são gerados por build_native.py, que reaproveita estas funções.
"""
import re
import subprocess
import sys
from pathlib import Path

from bs4 import BeautifulSoup

KIT = Path(__file__).resolve().parent.parent
SRC = KIT / 'source'
BUILD = KIT / 'build'
TMP = BUILD / '.tmp'
OUT_P = KIT / 'preview'

PHONE = '5527996239086'
FONTS = (
    '<link rel="preconnect" href="https://fonts.googleapis.com">'
    '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
    '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700'
    '&family=Newsreader:ital,opsz,wght@0,6..72,400..700;1,6..72,400..700&display=swap">'
    '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:'
    'opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap">'
)

# slug, título, arquivo(s) fonte
PAGES = [
    ('01-home', 'Home — Advocacia Criminal Estratégica no ES', 'home-desktop.html'),
    ('02-areas-de-atuacao', 'Áreas de Atuação', 'areas-de-atuacao.html'),
    ('03-sobre-pablo-ribeiro', 'Sobre — Pablo Ribeiro', 'sobre.html'),
    ('04-prisao-flagrante-habeas-corpus', 'Prisão em Flagrante, Liberdade e Habeas Corpus', 'prisao-flagrante-habeas-corpus.html'),
    ('05-advogado-criminalista-vila-velha', 'Advogado Criminalista em Vila Velha (ES)', 'vila-velha.html'),
    ('06-contato', 'Contato', 'contato.html'),
    ('07-guia-delegacias-es', 'Guia de Delegacias do Espírito Santo', 'guia-delegacias.html'),
    ('08-guia-presidios-es', 'Guia de Presídios do Espírito Santo', 'guia-presidios.html'),
]

FALLBACK_LABELS = {
    'nav': 'Breadcrumb', 'div': 'Barra de urgência', 'footer': 'CTA final + aviso OAB',
}

def soup(name):
    return BeautifulSoup((SRC / name).read_text(encoding='utf-8'), 'lxml')


def blocks_of(doc):
    """Seções de conteúdo (main > div > *) e scripts da página, sem header/footer."""
    main = doc.body.find('main', recursive=False)
    wrapper = main.find('div', recursive=False)
    sections, scripts = [], []
    for el in wrapper.find_all(recursive=False):
        if el.name == 'script':
            scripts.append(el.string or '')
        else:
            sections.append(el)
    for sc in main.find_all('script', recursive=False):
        scripts.append(sc.string or '')
    return sections, scripts


def label_of(el, i):
    h = el.find(['h1', 'h2'])
    if h:
        return re.sub(r'\s+', ' ', h.get_text(' ', strip=True))[:70]
    if el.find('nav') or 'Início' in el.get_text():
        return 'Breadcrumb'
    return FALLBACK_LABELS.get(el.name, f'Bloco {i + 1}')


def fix_vila_velha(sections):
    """A v2 do Stitch repetiu o card 'Orla & Centro Histórico' em 'Como Funciona' e
    em 'Depoimentos'. Restaura os cards corretos a partir da v1."""
    v1, _ = blocks_of(soup('vila-velha-v1.html'))
    for idx in (2, 7):
        grid_v2 = sections[idx].select_one('div.grid')
        grid_v1 = v1[idx].select_one('div.grid')
        first_v2 = grid_v2.find(recursive=False)
        assert 'Orla' in first_v2.get_text(), f'seção {idx}: card duplicado não encontrado'
        first_v2.replace_with(grid_v1.find(recursive=False))
    return sections


def normalize_scripts(js):
    # DOMContentLoaded não dispara de novo dentro do editor do Elementor
    js = js.replace(
        "document.addEventListener('DOMContentLoaded', () => {",
        "(function (fn) { document.readyState !== 'loading' ? fn() : document.addEventListener('DOMContentLoaded', fn); })(() => {",
    )
    return js


def clean_html(html):
    html = html.replace('5527999999999', PHONE)
    return html


def section_html(el, extra_wrap=None):
    inner = str(el)
    if extra_wrap:
        inner = f'<div class="{extra_wrap}">{inner}</div>'
    return clean_html(f'<div class="prk">{inner}</div>')


def compile_css(slug, content_html):
    TMP.mkdir(exist_ok=True)
    src = TMP / f'{slug}.html'
    src.write_text(content_html, encoding='utf-8')
    out = TMP / f'{slug}.css'
    subprocess.run(['node', str(BUILD / 'compile-css.cjs'), str(src), str(out)], cwd=BUILD, check=True)
    return out.read_text(encoding='utf-8')


def collect(slug, src):
    """Lista de (título, html, hide) + scripts da página."""
    sections, scripts = blocks_of(soup(src))
    if src == 'vila-velha.html':
        sections = fix_vila_velha(sections)
    items = [(label_of(s, i), section_html(s), ['mobile'] if slug == '01-home' else None)
             for i, s in enumerate(sections)]
    js = [normalize_scripts(s) for s in scripts if s.strip()]

    if slug == '01-home':
        # A Home tem uma versão mobile própria: entra junto, visível só no celular.
        m_sections, m_scripts = blocks_of(soup('home-mobile.html'))
        for i, s in enumerate(m_sections):
            for b in s.select('[onclick^="toggleFaq("]'):
                b['onclick'] = b['onclick'].replace('toggleFaq(', 'toggleFaqMobile(')
            pad = 'bg-surface px-margin-mobile pt-6' + (' pb-6' if i == len(m_sections) - 1 else '')
            items.append(('Mobile · ' + label_of(s, i), section_html(s, pad), ['desktop', 'tablet']))
        js += [s.replace('function toggleFaq(', 'function toggleFaqMobile(') for s in m_scripts if s.strip()]
    return items, js


def main():
    """Gera as prévias HTML (preview/*.html): referência visual fiel ao Stitch,
    usada também pelo conversor nativo para medir cada elemento."""
    OUT_P.mkdir(exist_ok=True)
    for slug, title, src in PAGES:
        items, js = collect(slug, src)
        body = ''.join(h for _, h, _ in items)
        script_html = ''.join(f'<script>{s}</script>' for s in js)
        css = compile_css(slug, body + script_html)
        preview = (
            '<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">'
            '<meta name="viewport" content="width=device-width, initial-scale=1">'
            f'<title>{title}</title><style>body{{margin:0}}'
            '@media (max-width:767px){.hidden-mobile{display:none!important}}'
            '@media (min-width:768px) and (max-width:1024px){.hidden-tablet{display:none!important}}'
            '@media (min-width:1025px){.hidden-desktop{display:none!important}}</style></head><body>'
            + FONTS + f'<style>{css}</style>'
            + ''.join(
                f'<div class="{" ".join("hidden-" + k for k in (hide or []))}">{h}</div>' for _, h, hide in items)
            + script_html + '</body></html>'
        )
        (OUT_P / f'{slug}.html').write_text(preview, encoding='utf-8')
        print(f'preview/{slug}.html: {len(items)} seções')


if __name__ == '__main__':
    sys.exit(main())
