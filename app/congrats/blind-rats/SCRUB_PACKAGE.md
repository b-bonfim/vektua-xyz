# Blind Rats cinematic scrub package

**Route:** `/congrats/blind-rats`  
**Date:** 2026-10-09  
**Basis:** user-supplied Site de 10K skill, adapted to the existing Next.js application.

## Brand premise

The visitor did not only receive an object. The object is a physical trace of choosing to keep a local scene moving. The scroll experience should feel like crossing a Blind Rats poster that comes alive, then settling into the band's thank-you page.

## Palette

- Canvas: `#090909`
- Paper: `#f0eadf`
- Accent: `#e30613`
- Accent hover: `#ff2633`
- Secondary text: `#bdb5aa`

## Band map

These ranges are starting points and are validated by the final scroll feel.

| Band | Range | Exact copy | Entry |
| --- | --- | --- | --- |
| 1 | 0.00 to 0.21 | "Você apoiou / uma cena." | already settled |
| 2 | 0.23 to 0.46 | "Um gesto / grande." | enters from the right |
| 3 | 0.49 to 0.72 | "Som local. / História local." | enters from the left |
| 4 | 0.75 to 1.00 | "Valeu por fazer / parte dela." | enters from the right and settles |

Kickers are, in order: "Blind Rats", "Peça pequena", "Cena local", "Blind Rats × Vektua XYZ".

## Static hero copy

Title: "Você apoiou uma cena. Valeu por fazer parte dela."

Body: "Este chaveiro da Blind Rats é uma peça pequena com um gesto grande: apoiar uma banda local independente. Obrigado por levar esse som com você."

CTA: "Seguir @blindratsband"

## Below the fold

1. The original 10-second Blind Rats message remains playable on request, with audio.
2. The existing local-scene manifesto follows.
3. Instagram remains the single primary conversion action.
4. Vektua remains only the host, exit path and final attribution.

## Engineering list

- Blob fetch for the scrub MP4
- frame-rate-normalized requestAnimationFrame interpolation
- locked seeks with one coalesced pending seek
- DOM writes only on changed values
- four caption bands measured in scroll progress
- global and per-band scrims
- five live static gates mirrored in CSS and JavaScript
- complete static fallback when video fails
- scrub video muted, decorative and outside keyboard order
- reduced motion never requests the scrub video

## Text gate

Visitor-facing copy added by this package does not use em dashes or stock corporate language. Existing campaign facts and the Instagram handle remain unchanged.
