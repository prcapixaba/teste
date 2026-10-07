---
name: Sober Jurisprudence
colors:
  surface: '#f9f9f6'
  surface-dim: '#dadad7'
  surface-bright: '#f9f9f6'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f4f1'
  surface-container: '#eeeeeb'
  surface-container-high: '#e8e8e5'
  surface-container-highest: '#e2e3e0'
  on-surface: '#1a1c1b'
  on-surface-variant: '#46464e'
  inverse-surface: '#2f312f'
  inverse-on-surface: '#f1f1ee'
  outline: '#76767e'
  outline-variant: '#c6c5ce'
  surface-tint: '#555d7f'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#121a38'
  on-primary-container: '#7b82a6'
  inverse-primary: '#bec5ec'
  secondary: '#755a21'
  on-secondary: '#ffffff'
  secondary-container: '#fed892'
  on-secondary-container: '#785d23'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#161c28'
  on-tertiary-container: '#7e8493'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dde1ff'
  primary-fixed-dim: '#bec5ec'
  on-primary-fixed: '#121a38'
  on-primary-fixed-variant: '#3e4566'
  secondary-fixed: '#ffdea4'
  secondary-fixed-dim: '#e6c27e'
  on-secondary-fixed: '#261900'
  on-secondary-fixed-variant: '#5b430a'
  tertiary-fixed: '#dde2f3'
  tertiary-fixed-dim: '#c1c6d7'
  on-tertiary-fixed: '#161c28'
  on-tertiary-fixed-variant: '#414754'
  background: '#f9f9f6'
  on-background: '#1a1c1b'
  surface-variant: '#e2e3e0'
  navy-deep: '#08102E'
  gold-accent: '#D4B16F'
  gold-muted: '#B59451'
  slate-charcoal: '#2F3542'
  parchment-base: '#FAFAF7'
  surface-card: '#FFFFFF'
  border-hairline: '#E5E3DC'
typography:
  headline-xl:
    fontFamily: Newsreader
    fontSize: 48px
    fontWeight: '500'
    lineHeight: 56px
  headline-xl-mobile:
    fontFamily: Newsreader
    fontSize: 34px
    fontWeight: '500'
    lineHeight: 42px
  headline-lg:
    fontFamily: Newsreader
    fontSize: 36px
    fontWeight: '500'
    lineHeight: 44px
  headline-lg-mobile:
    fontFamily: Newsreader
    fontSize: 28px
    fontWeight: '500'
    lineHeight: 36px
  headline-md:
    fontFamily: Newsreader
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 34px
  headline-sm:
    fontFamily: Newsreader
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  title-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
  title-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.08em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.1em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 3rem
  margin-mobile: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
  space-xxl: 4rem
---

## Brand & Style

The design system projects authority, legal mastery, institutional trust, and refined sophistication. Built for legal practices and high-end jurisprudence services, the UI evokes stability, intellectual rigor, and security.

The aesthetic philosophy bridges **Editorial Classicism** and **Modern Corporate Precision**. It pairs deep midnight navy tones with warm champagne-gold accents and chalk-parchment neutrals. Interface elements rely on disciplined structural balance, intentional negative space, architectural framing, and subtle hairline divides rather than playful or fleeting visual trends.

## Colors

- **Primary (`#08102E`)**: Dominant corporate tone. Used for top-tier navigation, structural headers, high-contrast actions, and key authority landmarks.
- **Secondary (`#D4B16F`)**: Tailored metallic gold. Reserved for critical callouts, badges, authoritative status markers, hover accents, and elegant border trims. Never overused as solid full-screen backgrounds.
- **Tertiary (`#2F3542`)**: Neutral slate charcoal. Provides comfortable optical contrast for body typography, metadata labels, and secondary interactive states.
- **Neutral (`#FAFAF7`)**: Warm alabaster/parchment background that reduces eye strain compared to harsh optical white and conveys refined stationery heritage.
- **Surface & Lines (`#FFFFFF`, `#E5E3DC`)**: Clean elevated card containers paired with precise hairline borders to maintain visual structure.

## Typography

The typography pairs the editorial authority of **Newsreader** for primary titles with the utilitarian legibility of **Inter** for dense transactional legal copy, form fields, and navigation.

- **Headings (Newsreader)**: Evoke judicial gravity and academic rigor. Title headings utilize optical standard tracking with tight, disciplined leading.
- **UI Copy & Body (Inter)**: Maintains readability across legal briefs, case studies, contracts, and data-dense dashboards.
- **Labels & Subtitles**: Rendered in uppercase small-caps with `letterSpacing: 0.08em - 0.1em` to simulate traditional engraved legal documents.

## Layout & Spacing

A 12-column responsive fluid grid governs desktop viewports, transitioning to an 8-column layout on tablets and a 4-column layout on mobile viewports.

- **Desktop (min-width: 1024px)**: Outer margins set to `3rem` (`space-xl`), gutters at `1.5rem` (`gutter`). Max container width is fixed at `1280px` for optimal reading spans.
- **Tablet (640px to 1023px)**: Margins set to `2rem`, gutters at `1.25rem`.
- **Mobile (below 640px)**: Margins set to `1.25rem` (`margin-mobile`), gutters at `1rem` (`gutter-mobile`).
- **Vertical Rhythm**: Legal sections rely on generous breathing room (`space-xxl`) between thematic content zones to convey calm deliberation.

## Elevation & Depth

Visual hierarchy uses **low-contrast outlines** paired with subtle, warm-tinted ambient shadows.

- **Baseline Level (Level 0)**: Unlifted surfaces rely on the parchment base (`#FAFAF7`) with structural hairline borders (`1px solid #E5E3DC`).
- **Elevated Cards (Level 1)**: Pure white background (`#FFFFFF`) with `box-shadow: 0 4px 20px -2px rgba(8, 16, 46, 0.04)`.
- **Dropdowns & Floating Overlays (Level 2)**: Crisp 1px border (`#E5E3DC`) accompanied by `box-shadow: 0 12px 32px -4px rgba(8, 16, 46, 0.08)`.
- **Modals & Drawers (Level 3)**: High backdrop dimming using semi-transparent deep navy (`rgba(8, 16, 46, 0.6)`) with `box-shadow: 0 24px 48px -8px rgba(8, 16, 46, 0.16)`.

## Shapes

The system uses refined, tailored soft corners (`roundedness: 1`) to preserve corporate sobriety.

- Primary interactive elements (buttons, inputs, cards) use `4px` (`0.25rem`) radius.
- Large modals and dialogue containers use `8px` (`0.5rem`) maximum radius.
- Completely circular or pill geometries are reserved exclusively for compact status pips and circular counter badges.

## Components

### Buttons
- **Primary**: Deep navy background (`#08102E`), white text, `4px` radius, `0.75rem 1.75rem` padding. Hover transition incorporates a subtle gold bottom indicator or tone shift to `#141D42`.
- **Secondary / Gold**: Champagne gold background (`#D4B16F`), navy text (`#08102E`), semi-bold. Used strictly for high-conversion consultation requests.
- **Outlined / Tertiary**: Transparent background with a `1px solid #08102E` or `1px solid #D4B16F` border and matching text color.

### Form Inputs & Selects
- Inputs feature a pure white canvas (`#FFFFFF`), `1px solid #E5E3DC` border, and `4px` radius.
- Focus state switches the border to `#08102E` with a fine `1px` outer halo of `#D4B16F`.
- Floating labels or small-caps upper labels in `#2F3542` ensure accessible clarity.

### Cards & Case Modules
- White backgrounds (`#FFFFFF`) framed by hairline borders (`#E5E3DC`).
- An optional `2px` top accent border in `#D4B16F` distinguishes practice areas or landmark legal victories.

### Chips & Badges
- Practice area chips utilize subtle `#FAFAF7` background with `#2F3542` typography and a delicate `1px solid #E5E3DC` border.
- Active or highlighted badges use muted gold tinting (`rgba(212, 177, 111, 0.12)`) with `#B59451` text.

### Checkboxes & Radios
- Square (`4px` radius) and circular controls using `#08102E` fill upon selection, accented by sharp white check marks.

### Legal Specific Components
- **Attorney Bio Cards**: Modular layout with monochrome photography, Newsreader naming treatment, and gold qualification dividers.
- **Jurisprudence Callout Box**: Inset citation box with `#FAFAF7` background, `3px` left gold stripe (`#D4B16F`), and italic Newsreader quote typography.