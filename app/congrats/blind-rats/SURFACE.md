# Blind Rats — Surface Brief

**Route:** `/congrats/blind-rats`  
**Date:** 2026-10-09  
**Mode:** Experience + Persuade  
**Status:** Founder-directed visual exception for this route only.

## Purpose

Create a thank-you page that feels like entering the Blind Rats visual world while remaining hosted inside Vektua XYZ. The visitor should immediately understand that the page belongs to the Blind Rats campaign, watch the band's short message if desired, and have a clear path to follow the band.

## Visual authority

Use the Blind Rats assets already present in the repository as the dominant identity on this route. The visual world is black, Blind Rats red, off-white paper tones, high-contrast poster composition, dense typography and raw/grunge energy.

Vektua XYZ remains visible only as host, exit path and final attribution. Do not reuse the standard Vektua ivory/petrol editorial storefront language inside the campaign body.

## Content and truth constraints

Preserve the existing factual copy, Instagram handle, campaign video and supplied Blind Rats logo. Do not add claims about sales, attendance, releases, partnerships, rights, performance or commercial results.

## Interaction

The hero gives the short Blind Rats video strong prominence. Instagram is the primary CTA. Vektua discovery is secondary and moves to the page boundary rather than competing inside the hero.

## Scope boundary

This visual system is specific to `/congrats/blind-rats`. It does not replace `DESIGN.md`, does not redefine Vektua XYZ globally and must not leak into Orion Tattoo or storefront surfaces.


## Motion and loading

Motion is intentionally concentrated in one authored first-view sequence: the headline settles into place, the video frame receives a short red ink-scan gesture, and supporting hero copy follows with restrained timing. On capable browsers, the manifesto uses scroll-linked entry motion; unsupported browsers keep the content fully visible with no JavaScript dependency.

The campaign MP4 is interaction-loaded: the browser receives the poster in the first viewport, but the video source is not attached or requested until the visitor presses play. Below-fold sections use `content-visibility: auto` with intrinsic-size reservations, and the footer logo is explicitly lazy-loaded. The header identity and hero poster remain eager because they are first-viewport assets.

`prefers-reduced-motion` removes authored spatial movement and loading pulse while preserving controls and content.


## Scroll effect

The page uses a scroll-driven motion layer where supported: a thin Blind Rats red progress signal tracks page depth, the hero copy and video separate subtly in opposing directions to create poster-like depth, and the oversized Blind Rats watermark drifts laterally through the manifesto. These effects are tied directly to scroll position rather than timers, require no scroll event listener, and fall back to the static composition on unsupported browsers.

The scroll layer is disabled under `prefers-reduced-motion`; content order, readability and interaction remain unchanged.


## Scroll choreography v2

The scroll experience is deliberately more theatrical. On capable browsers and when reduced motion is not requested, the desktop hero becomes a 170svh stage with a sticky viewport: copy recedes and softens while the Blind Rats video expands, shifts across the composition and becomes the dominant visual object.

The manifesto is restructured as a two-column chapter system. Its statement stays sticky while each supporting point occupies a substantial portion of the viewport and enters from alternating directions with scale and rotation. On smaller viewports the layout returns to one column but preserves the stronger chapter entrances.

The closing red section uses a view-linked clip-path takeover and content scale-in so the final Instagram CTA arrives as a distinct scene change rather than another static section. All choreography falls back to the readable static layout when scroll-driven animation is unsupported, and is removed under `prefers-reduced-motion`.


## Cinematic scrub implementation

The founder requested the supplied Site de 10K scroll-scrub method as the new interaction reference. This route keeps the existing Next.js architecture, but adopts the proven scrub pipeline rather than converting the campaign into standalone HTML.

The first scene is now a long scroll stage. On capable landscape desktop screens, the existing Blind Rats campaign MP4 is fetched as a Blob and assigned through an object URL, so seeking does not depend on HTTP Range support. Scroll progress maps to video time through a frame-rate-normalized requestAnimationFrame loop. Seeks are locked so only one seek can be in flight, with one coalesced follow-up target.

Four caption bands own explicit progress ranges and are updated only when their opacity or transform values change. The first band starts settled. The final band remains settled at the end of the journey.

The five static gates match the Site de 10K reference in CSS and JavaScript: narrow phones, portrait tablets, portrait coarse pointers, short landscape coarse-pointer screens and reduced motion. These visitors receive a designed static Blind Rats hero and the scrub video is not requested. The page also stays complete if the video fetch fails.

The source MP4 already in the repository is reused for this first implementation and is muted in the scrub because the scrub layer is decorative. The same source remains available below the hero as the explicit user-triggered message with audio.
