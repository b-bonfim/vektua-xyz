---
name: Vektua XYZ
description: Editorial commerce prototype for objects, occasion collections and stylized miniatures.
colors:
  petrol: "#176D67"
  petrol-hover: "#10564F"
  terra: "#C45C3B"
  ivory: "#F7F5F0"
  graphite: "#24302F"
  white: "#FFFFFF"
  soft: "#EAE8E1"
  muted: "#606B66"
  border: "#D8DBD4"
  destructive: "#AD3927"
typography:
  display:
    fontFamily: "Manrope, Arial, sans-serif"
    fontSize: "clamp(3rem, 4.85vw, 4.6rem)"
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Manrope, Arial, sans-serif"
    fontSize: "clamp(1.75rem, 2.5vw, 2.4rem)"
    fontWeight: 500
    lineHeight: 1.16
    letterSpacing: "-0.035em"
  title:
    fontFamily: "Manrope, Arial, sans-serif"
    fontSize: "1.35rem"
    fontWeight: 500
    lineHeight: 1.16
    letterSpacing: "-0.035em"
  body:
    fontFamily: "Manrope, Arial, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.65
  button:
    fontFamily: "Manrope, Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 650
    lineHeight: 1.4
  label:
    fontFamily: "Manrope, Arial, sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.65
rounded:
  concept: "2px"
  image: "3px"
  button: "4px"
  base: "0.75rem"
  chip: "30px"
spacing:
  control-gap: "12px"
  content-gap: "24px"
  mobile-gutter: "20px"
  tablet-gutter: "32px"
  desktop-gutter: "56px"
components:
  button-primary:
    backgroundColor: "{colors.petrol}"
    textColor: "{colors.white}"
    typography: "{typography.button}"
    rounded: "{rounded.button}"
    padding: "13px 21px"
  button-primary-hover:
    backgroundColor: "{colors.petrol-hover}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.graphite}"
    typography: "{typography.button}"
    rounded: "{rounded.button}"
    padding: "13px 21px"
  chip-selected:
    backgroundColor: "{colors.graphite}"
    textColor: "{colors.white}"
    typography: "{typography.label}"
    rounded: "{rounded.chip}"
    padding: "8px 15px"
  search-input:
    backgroundColor: "transparent"
    textColor: "{colors.graphite}"
    padding: "14px 0"
  concept-label:
    backgroundColor: "#F7F5F0ED"
    textColor: "#485149"
    rounded: "{rounded.concept}"
    padding: "4px 8px"
---

# Design System: Vektua XYZ

## Overview

**Creative North Star: "The Object Editorial"**

The Object Editorial describes the implemented system: warm paper, restrained typography and object imagery with generous surrounding space. Petrol identifies actions and selected emphasis; graphite anchors reading and navigation. Terra is a small identity accent. This description is an implementation decision, not a newly approved brand principle.

The current source is app/globals.css and components/storefront.tsx, captured on 2026-09-18. Local Manrope and the four named brand colors are established inputs. The code-led workflow and absence of a separate visual comp apply to this session only. This document records an implemented prototype and does not establish trademark or legal approval.

**Key Characteristics:**

- Warm ivory canvas with graphite text and petrol actions.
- Flat image-led cards, slim dividers and compact labels.
- Responsive grids with explicit demo and conceptual-image labeling.

## Colors

The normative palette is in the frontmatter; descriptive names below retain the established brand terminology.

### Primary

- **Petrol:** primary actions, highlighted hero text, selected controls and focus outlines. Its darker hover value identifies interaction.

### Secondary

- **Terra:** the compact square beside the wordmark, a small hero accent and illustrative product swatches.

### Neutral

- **Ivory:** page canvas and image labels; **Graphite:** body text, selected chips, demo strip and footer.
- **White:** primary-button text and component-library surfaces. **Soft:** secondary and muted component surfaces.
- **Muted:** semantic secondary text. **Border:** standard dividers and form boundaries. Individual editorial sections retain nearby muted green and cream values in the source.
- **Destructive:** reserved component-library semantic token; the storefront does not introduce a custom error treatment.

## Typography

**Display Font:** Manrope, with Arial and sans-serif fallbacks.  
**Body Font:** the same locally served variable family, supporting weights 200–800.

### Hierarchy

- **Display:** the hero scale in frontmatter; responsive overrides are 53px at 1190px, 45px at 960px, a mobile clamp of 2.8rem–3.6rem, and 76px at 1552px and above.
- **Headline / Title:** medium-weight, tightly tracked headings. Section and detail pages use local overrides within this family.
- **Body:** comfortable reading with paragraphs capped at 70ch; explanatory copy commonly uses 13–16px.
- **Label:** compact 12px metadata, filters and demo notes. Button labels use the separate action token.
- **Prices and quantity outputs:** tabular numerals where totals and counts must align.

## Layout

The main container caps at 1440px, with 56px desktop gutters, 32px at widths up to 1190px and 20px up to 640px. The sticky header is 94px tall, then 80px up to 960px and 72px up to 640px.

The catalog uses four product columns, changing to two at 960px. The three line cards become stacked image-and-text rows at 640px. Hero, product detail, personalization and editorial splits stack on small screens. Cart summary becomes a separate row at 960px. Repeated desktop grid gaps use 24px, with narrower responsive overrides; section spacing is deliberately larger and varies by composition.

## Elevation & Depth

The storefront is predominantly flat: tonal blocks, image crops, whitespace and one-pixel borders establish hierarchy. Content cards have no drop shadows. Search focus adds a one-pixel petrol underline shadow; overlays and notifications retain their component primitives rather than defining a new branded elevation scale.

## Shapes

Images and major surfaces are square or almost square. Buttons have gently softened corners, chips are rounded, and small action icons use circles. The component-library base radius remains in frontmatter; it is not applied indiscriminately to storefront cards. The small terra square is part of the implemented wordmark.

## Components

### Buttons

Compact and restrained. Primary buttons pair petrol with white, have a 50px minimum height and use the frontmatter padding. Hover darkens the fill and lifts by 2px over 200ms. Secondary buttons use transparent fill and a muted border. Text links use an underline with a 6px offset. Disabled buttons reduce opacity to 0.48 and use the not-allowed cursor.

### Chips

Outlined compact filters become graphite with white text when selected. Buttons expose their state through aria-pressed. The gallery uses the same visual treatment for composition and detail controls.

### Cards / Containers

Product cards are open layouts: nearly square image, concept label, category, linked name and illustrative price. No enclosing shadow or padded box is added. The small image action appears on hover or keyboard focus and remains visible on mobile. Product-image zoom is 1.05 on hover; line images use 1.04.

### Inputs / Fields

Search is a transparent field with a bottom rule, turning petrol on focus. Sort is a native select with a fine border and small radius. Personalization choices use bordered buttons with a pale green selected fill. All focusable controls inherit the 2px petrol outline with 5px offset unless the component provides its own visible focus treatment.

### Navigation

The sticky ivory header contains the wordmark, three catalog lines, search, help and simulated cart. Active desktop links gain a petrol underline. At 960px, an accessible Sheet menu replaces the three-line navigation; it closes on route changes. The skip link becomes visible on keyboard focus.

### Concept labels and motion

Small ivory labels distinguish generated concepts from product photography. Mobile personalization previews retain demo wording even where the overlaid image label is hidden. The hero settles from scale 1.045 over one second; image zoom uses 500–550ms easing. Reduced-motion preference removes these animations, transitions and hover transforms.

## Do's and Don'ts

### Do:

- **Do** retain the observed palette, locally served Manrope and visible keyboard focus.
- **Do** preserve conceptual-image labels and illustrative-price wording when extending prototype cards.
- **Do** keep reduced-motion behavior and responsive navigation intact.

### Don't:

- **Don't** present the simulated cart or disabled checkout as a real purchase.
- **Don't** describe generated scenes as photographs of finished products.
- **Don't** promote this session’s code-led workflow into a permanent user preference.
