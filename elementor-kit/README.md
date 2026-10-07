# Pablo Ribeiro · Template Kit para Elementor

Kit com as 8 páginas do Stitch (design system **Sober Jurisprudence**) prontas para importar no Elementor. **Sem header e sem footer**: elas devem ser criadas no Theme Builder (Elementor Pro) ou pelo próprio tema.

| # | Template | Fonte (Stitch) | Seções |
|---|---|---|---|
| 01 | Home (desktop + versão mobile própria) | `home-desktop.html` + `home-mobile.html` | 9 + 9 |
| 02 | Áreas de Atuação | `areas-de-atuacao.html` | 9 |
| 03 | Sobre — Pablo Ribeiro | `sobre.html` | 10 |
| 04 | Prisão em Flagrante, Liberdade e Habeas Corpus | `prisao-flagrante-habeas-corpus.html` | 9 |
| 05 | Advogado Criminalista em Vila Velha (ES) | `vila-velha.html` (v2, corrigida) | 11 |
| 06 | Contato | `contato.html` | 7 |
| 07 | Guia de Delegacias do ES | `guia-delegacias.html` | 10 |
| 08 | Guia de Presídios do ES | `guia-presidios.html` | 10 |

## O que tem aqui

```
elementor-kit/
├── pablo-ribeiro-elementor-templates.zip   ← importe este arquivo
├── templates/*.json                        ← os mesmos templates, um por página
├── css/pablo-ribeiro-kit.css               ← CSS global opcional (todas as páginas)
├── preview/*.html                          ← abra no navegador para conferir cada página
├── source/                                 ← telas originais do Stitch + DESIGN.md
├── build/                                  ← script que gera tudo (Tailwind compilado)
└── kit-index.json                          ← lista de seções de cada template
```

## Como foi montado

- Cada `<section>` do Stitch virou uma **Seção do Elementor** com um **widget HTML**, e o nome dela aparece no Navegador (ex.: "Perguntas Frequentes sobre Atuação em Vila Velha"). O layout fica idêntico ao Stitch, e você pode reordenar, duplicar ou apagar seções no editor.
- O Tailwind via CDN foi trocado por **CSS compilado** (só as classes usadas, ~25–32 KB por página). Esse CSS está embutido na primeira seção de cada página, **"⚙ Estilos do kit (não remover)"**.
- Todo o CSS vale apenas dentro de `.prk`. Ele não altera o tema nem os outros widgets, e o CSS do tema também não deforma o kit (testado com um CSS hostil sobrescrevendo h1–h3, p, a, button e img).
- Acordeões, abas, filtros dos diretórios e contador do formulário funcionam. Os scripts ficam na última seção, **"⚙ Scripts da página (não remover)"**.
- A Home junta as duas versões. As seções desktop ficam ocultas no celular e as seções "Mobile · …" aparecem **somente no celular** (Avançado → Responsivo).

## Instalação (passo a passo)

1. **Requisitos:** WordPress + Elementor 3.x (o gratuito basta). Recomendamos o tema **Hello Elementor**. Você precisa estar logado como **Administrador**, porque o widget HTML com `<script>` exige a permissão `unfiltered_html`.
2. Em **Elementor → Configurações → Geral**, marque **Desativar cores padrão** e **Desativar fontes padrão**.
3. Em **Modelos → Modelos Salvos → Importar Modelos**, envie `pablo-ribeiro-elementor-templates.zip`. Os 8 modelos aparecem como "Pablo Ribeiro · …".
4. Para cada página, siga **Páginas → Adicionar nova**, dê o título e clique em **Editar com Elementor**. Depois clique no ícone de pasta (Adicionar modelo), vá em **Meus Modelos** e escolha **Inserir**. Quando perguntar se deseja importar as configurações do documento, responda **Sim**: isso aplica o layout "Elementor Largura Total" e oculta o título.
5. Publique. O header e o footer vêm do Theme Builder ou do tema.

> Alternativa: em vez do CSS embutido em cada página, cole `css/pablo-ribeiro-kit.css` em **Aparência → Personalizar → CSS adicional** (ou enfileire no tema filho). Depois apague a seção "⚙ Estilos do kit" das páginas, mas mantenha o `<link>` das fontes (ou carregue as fontes pelo tema).

## Editando o conteúdo

- Clique na seção, abra o widget **HTML** e edite o texto direto no código (use Ctrl+F para achar a frase). As classes seguem o design system: por exemplo, `text-navy-deep`, `bg-gold-accent` e `font-headline-lg`.
- Se você usar uma classe Tailwind **nova**, que ainda não existe no kit, rode o build de novo (veja abaixo) ou escreva o estilo inline.
- Para novas seções com widgets nativos do Elementor, use as **Cores e Fontes Globais** abaixo.

### Cores globais (Configurações do site → Cores globais)

| Nome | Hex | Uso |
|---|---|---|
| Navy Deep (Primária) | `#08102E` | estrutura, botões primários, faixas de CTA |
| Gold Accent (Destaque) | `#D4B16F` | botão de conversão (WhatsApp), filetes |
| Gold Muted | `#B59451` | eyebrows, ícones em fundo claro |
| Gold Ink | `#755A21` | links dourados pequenos (contraste AA) |
| Slate Charcoal (Texto) | `#2F3542` | corpo de texto |
| Parchment (Fundo) | `#FAFAF7` | fundo das páginas |
| Surface Card | `#FFFFFF` | cards, inputs |
| Hairline | `#E5E3DC` | bordas de 1px |
| Urgência | `#BA1A1A` | só alertas de prisão/flagrante |

### Fontes globais (Configurações do site → Fontes globais)

| Nome | Fonte | Tamanho / Altura | Peso |
|---|---|---|---|
| H1 | Newsreader | 48/56px (mobile 34/42) | 500 |
| H2 | Newsreader | 36/44px (mobile 28/36) | 500 |
| H3 | Newsreader | 20/28px | 600 |
| Texto | Inter | 15/24px | 400 |
| Label / Botão | Inter, MAIÚSCULAS, espaçamento 0.08em | 12/16px | 600 |

## Pendências: o que você precisa revisar antes de publicar

1. **Imagens:** as 10 imagens (retrato do Dr. Pablo, mapas e fundos) apontam para `lh3.googleusercontent.com/aida-public/…`, endereços temporários gerados pelo Stitch. Suba as imagens definitivas na Biblioteca de Mídia e troque as URLs dentro do widget HTML. Templates afetados: 01 (2), 03 (3), 04 (1), 05 (1), 06 (2) e 07 (1).
2. **Endereço divergente (template 04):** a seção "Unidades Físicas & Acesso Estratégico" mostra **Rua Henrique Moscoso, 833, Sala 904 (Ed. Affinity Prime Business)** para Vila Velha. As outras páginas usam **Rua João Pessoa de Matos, 530, Sala 205 (Ed. Master)**. Confirme qual é o endereço correto.
3. **Formulário de triagem (template 06):** o formulário do Stitch apenas **simula** o envio (mostra a faixa de sucesso e limpa os campos) e **não envia dados**. Substitua por um widget Formulário (Elementor Pro), WPForms ou Contact Form 7, ou ligue o `handleFormSubmit()` a um endpoint.
4. **Links internos:** vários links do Stitch apontam para `#`. Ajuste para as URLs reais das páginas (Áreas, Contato, Guia de Delegacias etc.).

## Correções já aplicadas em relação ao Stitch

- **Vila Velha (v2):** o card "Orla & Centro Histórico" estava duplicado em "Como Funciona" e em "Depoimentos". Os cards corretos ("01 Primeiro Contato & Triagem Imediata" e o depoimento de Carlos Eduardo Mendes) foram restaurados a partir da v1.
- **Home mobile:** o telefone provisório `(27) 99999-9999` foi trocado por `(27) 99623-9086`.
- **Home:** as funções de FAQ do desktop e do mobile foram separadas (`toggleFaq` e `toggleFaqMobile`) para não conflitarem na mesma página.
- **Guia de Delegacias:** os scripts passaram a funcionar também dentro do editor do Elementor, e não só no site publicado.

## Regerar o kit (depois de editar `source/`)

```bash
cd elementor-kit/build && npm install && cd ..
python3 -I build/build.py
```

O comando gera de novo `templates/`, o `.zip`, `css/` e `preview/`.
