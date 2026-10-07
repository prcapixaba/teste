# Pablo Ribeiro · Template Kit para Elementor (widgets nativos)

As 8 páginas do Stitch (design system **Sober Jurisprudence**) foram convertidas em **elementos nativos do Elementor**. Tudo é editável pelo painel: arrastar e soltar, Estilo, Avançado e Responsivo. O kit vem **sem header e sem footer**.

| # | Template | Seções |
|---|---|---|
| 01 | Home (desktop + versão mobile própria) | 9 + 9 |
| 02 | Áreas de Atuação | 9 |
| 03 | Sobre — Pablo Ribeiro | 10 |
| 04 | Prisão em Flagrante, Liberdade e Habeas Corpus | 9 |
| 05 | Advogado Criminalista em Vila Velha (ES) | 11 |
| 06 | Contato | 7 |
| 07 | Guia de Delegacias do ES | 10 |
| 08 | Guia de Presídios do ES | 10 |

## Do que cada página é feita

| Elemento do Stitch | Vira no Elementor |
|---|---|
| Seções, colunas, cards, grids | **Container** (Flexbox ou Grade), com fundo, borda, sombra, raio e espaçamentos por dispositivo |
| Títulos, parágrafos, selos, rótulos | Widget **Título** (com a tag correta: H1, H2, H3, p, span) |
| Botões e links com ícone | Widget **Botão**, com cores de hover |
| Ícones (Material Symbols) | Widget **Ícone**, com o equivalente mais próximo do Font Awesome |
| Ícone dentro de círculo/quadrado | Widget **Ícone** no modo "Empilhado" ou "Emoldurado" |
| Fotos e mapas | Widget **Imagem** |
| Perguntas frequentes | Widget **Alternância (Toggle)**, com **Schema FAQ** ligado para o Google |
| Abas "Três Grandes Núcleos" | Widget **Abas** (aninhadas), com os cards dentro de cada aba |
| Tabela de instrumentos de liberdade | **Editor de Texto** com a tabela |
| Formulário de triagem (Contato) | Widget **Formulário** do **Elementor Pro** |
| Linhas e marcadores | **Divisor** e **Ícone** |

Ao todo são cerca de 1.260 containers, 1.260 títulos, 340 ícones, 166 botões, 8 FAQs, 1 conjunto de abas e 1 formulário. Os nomes no **Navegador** (Estrutura) seguem os títulos das seções, por exemplo "Perguntas Frequentes sobre Atuação em Vila Velha".

**Continua em HTML só o que é interativo de verdade:** as barras de busca e filtro dos diretórios nos Guias de Delegacias e de Presídios (campo de busca, selects e "Apenas Plantão 24h"). Os **cards** que elas filtram são nativos. O script do filtro fica na última seção dessas duas páginas, "⚙ Filtros do diretório: CSS + script (não remover)".

## Requisitos

- WordPress com **Elementor 3.20 ou superior** e **Containers (Flexbox)** ativos. Desde a 3.16, essa opção já vem ligada em sites novos. Para conferir: Elementor → Configurações → Recursos.
- O **Elementor Pro** é necessário apenas para o formulário da página Contato. Sem o Pro, o widget aparece vazio. Nesse caso, apague-o e use WPForms ou Contact Form 7 no lugar.
- Tema recomendado: **Hello Elementor**.

## Instalação

1. Vá em **Modelos → Modelos Salvos → Importar Modelos** e envie `pablo-ribeiro-elementor-templates.zip`.
   - Na importação, o Elementor **baixa as imagens para a sua Biblioteca de Mídia**: retrato, mapas e fundos.
2. Para cada página, siga **Páginas → Adicionar nova** e clique em **Editar com Elementor**. Clique no ícone de pasta, abra **Meus Modelos** e escolha **Inserir**. Quando perguntar sobre as configurações do documento, responda **Sim**: isso aplica largura total e oculta o título.
3. Publique. O header e o footer vêm do Theme Builder (Pro) ou do seu tema.

## Editando

- **Textos:** clique no texto direto na página ou edite pelo painel (Conteúdo → Título).
- **Cores e fontes:** use a aba **Estilo** de cada widget. As fontes são **Newsreader** nos títulos e **Inter** no restante, carregadas automaticamente do Google Fonts.
- **Celular e tablet:** os valores de tablet e celular já vêm preenchidos (tamanhos de fonte, colunas da grade, espaçamentos). Use o seletor de dispositivo do Elementor para ajustar.
- **Home:** as seções "Mobile · …" só aparecem no celular, e as demais só no desktop e no tablet. Isso está configurado em Avançado → Responsivo.

### Cores globais (opcional): Configurações do site → Cores globais

| Nome | Hex |
|---|---|
| Navy Deep (Primária) | `#08102E` |
| Gold Accent (Destaque) | `#D4B16F` |
| Gold Muted | `#B59451` |
| Slate Charcoal (Texto) | `#2F3542` |
| Parchment (Fundo) | `#FAFAF7` |
| Hairline (bordas) | `#E5E3DC` |
| Urgência | `#BA1A1A` |

## Antes de publicar

1. **Imagens:** se as URLs temporárias do Stitch já tiverem expirado, o Elementor mostra a imagem padrão. Troque pelo seletor de imagem do widget.
2. **Formulário (Contato):** em Ações após envio → E-mail, preencha o destinatário. A mensagem de sucesso já vem configurada.
3. **Endereço divergente (template 04):** a seção "Unidades Físicas & Acesso Estratégico" mostra Rua Henrique Moscoso, 833, Sala 904 (Ed. Affinity) para Vila Velha. As outras páginas usam Rua João Pessoa de Matos, 530, Sala 205 (Ed. Master). Confirme qual é o correto.
4. **Links:** vários botões do Stitch apontam para `#`. Ajuste para as URLs reais das páginas.
5. **Ícones:** os Material Symbols foram trocados pelo equivalente do Font Awesome. Para trocar algum, use o seletor de ícone do widget.

## O que mudou em relação ao Stitch

- **Vila Velha:** o card "Orla & Centro Histórico", que estava duplicado, foi removido de "Como Funciona" e de "Depoimentos".
- **Home mobile:** o telefone provisório `(27) 99999-9999` foi trocado por `(27) 99623-9086`.
- **FAQs:** agora usam o widget Alternância, que começa com todas as perguntas fechadas.
- **Textos com reticências:** o recorte de linhas dos cards no celular foi removido, então o texto aparece inteiro.

## Como foi gerado e validado

`build/build_native.py` renderiza cada página no Chromium em 1280, 900 e 390 px, lê o estilo final de cada elemento (cores, fontes, espaçamentos, grade e flex) e escreve os containers e widgets do Elementor com os valores de desktop, tablet e celular. Os nomes de cada controle foram conferidos no código-fonte do Elementor.

A validação foi feita num WordPress com Elementor de verdade. Os 8 templates foram importados pela biblioteca do Elementor e abertos no editor, renderizaram sem rolagem lateral em nenhuma largura e ficaram com altura de seção próxima da prévia do Stitch (diferenças de poucos %). As exceções esperadas são o formulário (precisa do Pro) e as FAQs, que no Stitch vinham abertas.

```bash
cd elementor-kit/build && npm install && cd ..
python3 -I build/build.py          # prévias HTML em preview/ (referência visual)
python3 -I build/build_native.py   # templates nativos em templates/ + o .zip
```
