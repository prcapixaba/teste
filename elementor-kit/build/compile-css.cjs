// Compila o CSS do kit: preflight do Tailwind escopado em .prk + utilitários usados.
// Uso: node compile-css.cjs <content.html> <saida.css>
const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const tailwind = require('tailwindcss');
const prefixer = require('postcss-prefix-selector');

const [, , contentFile, outFile] = process.argv;
process.env.PRK_CONTENT = path.resolve(contentFile);

const preflightPath = require.resolve('tailwindcss/lib/css/preflight.css');
// o preflight usa theme(); o Tailwind resolve ao processar o arquivo final
const preflight = fs.readFileSync(preflightPath, 'utf8');

const scopedPreflight = postcss([
  prefixer({
    prefix: '.prk',
    transform(prefix, selector) {
      if (/^(html|:host|body)$/.test(selector)) return prefix;
      if (selector === '*') return `${prefix}, ${prefix} *`;
      return `${prefix} ${selector}`;
    },
  }),
]).process(preflight, { from: undefined }).css;

// Base do wrapper: o que o <body> das telas do Stitch definia.
const wrapperBase = `
.prk{font-family:Inter,ui-sans-serif,system-ui,sans-serif;font-size:15px;line-height:24px;color:#1a1c1b;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;text-align:left;letter-spacing:normal}
.prk .material-symbols-outlined{font-family:'Material Symbols Outlined';font-weight:normal;font-style:normal;line-height:1;letter-spacing:normal;text-transform:none;display:inline-block;white-space:nowrap;word-wrap:normal;direction:ltr;-webkit-font-feature-settings:'liga';font-feature-settings:'liga';-webkit-font-smoothing:antialiased;font-variation-settings:'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24}
.prk h1,.prk h2,.prk h3,.prk h4,.prk h5,.prk h6{text-transform:none;letter-spacing:inherit;color:inherit;font-family:inherit}
.prk details>summary{list-style:none}.prk details>summary::-webkit-details-marker{display:none}
.prk a:focus-visible,.prk button:focus-visible,.prk summary:focus-visible,.prk input:focus-visible,.prk select:focus-visible,.prk textarea:focus-visible{outline:2px solid #D4B16F;outline-offset:2px}
/* Elementor: remove respiros que o tema/Elementor adicionam em volta das seções do kit */
.elementor-section.prk-section>.elementor-container>.elementor-column>.elementor-widget-wrap{padding:0!important}
.elementor-section.prk-section .elementor-widget-html{margin-bottom:0!important}
.elementor-section.prk-section .elementor-widget-html>.elementor-widget-container{padding:0;margin:0}
`;

const input = `${scopedPreflight}\n${wrapperBase}\n@tailwind utilities;\n`;

postcss([tailwind(require('./tailwind.config.cjs'))])
  .process(input, { from: undefined })
  .then((r) => {
    fs.writeFileSync(outFile, r.css.replace(/\/\*![\s\S]*?\*\//, '').trim() + '\n');
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
