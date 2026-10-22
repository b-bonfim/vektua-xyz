# Algodão Pesado × Vektua XYZ | Cinematic campaign production brief

**Date:** 2026-10-22  
**Canonical route:** `/congrats/algodao-pesado`  
**Compatible typo:** `/congrats/agodao-pesado` redirects to the canonical route.  
**Source:** Algodão Pesado Instagram screenshots, logo and mascot provided by Founder, printed packaging concept, Site de 10K reference ZIP (Google Drive).  
**Implementation scope:** campaign micro-world only. No changes to the main Vektua storefront design system.

## Current implementation

- Full campaign copy and brand-specific rock visual language in `page.tsx`.
- Standalone dark rock concert design, stage lights, decorative mascot fallback, title choreography and story sections.
- Desktop landscape sticky 300svh scroll stage with four chapter titles, progressive scroll-driven display, deterministic CSS fallback.
- Mobile/portrait/reduced-motion static scene (no request for scrub MP4).
- Instagram is the sole prominent campaign action; Vektua XYZ appears as host/back attribution only.
- Campaign excluded from the global Vektua WhatsApp floating action.
- SEO metadata, canonical URL, accessible skip link and focus states.
- A **temporary illustrative SVG** stands in for approved Algodão Pesado photo/mascot assets. It must not be represented as the official mascot artwork.
- **Video is not yet integrated:** `VIDEO_ENABLED = false` in `rock-stage.tsx`, until a real approved media file has been supplied.

## Final asset contract (Founder / Commerce)

1. Approved high-resolution Algodão Pesado logo file, transparent PNG/WebP or vector, with permission to reproduce it in the campaign.
2. Approved mascot master art, ideally with transparent background, without screenshots/UI chrome, to replace the temporary illustrative SVG.
3. Final Google Flow 16:9 video, preferably 8 seconds, as MP4 (H.264), without text or baked-in CTA.
4. Approved poster or first frame (1920×1080; alternatively 1280×720), for mobile/reduced-motion and video failure.
5. Final client signoff on copy/branding and permission to use their identity and character in published campaign.
6. QR code on the printed packaging must target `https://vektua.xyz/congrats/algodao-pesado`. Reconfirm live route after deployment before printing.

## Suggested Google Flow generation

**Workflow:** Frames to Video, start image from a clean landscape 16:9 reference featuring the exact mascot. Add the user's original mascot reference as source material for consistency. Do not use a screenshot containing Instagram controls as a video start frame. A cinematic title-free frame avoids AI lettering artifacts.

**English master prompt:**

> One continuous cinematic tracking shot, 8 seconds, 16:9 horizontal, photorealistic stylized advertising film for a Brazilian rockwear store. In a dark intimate rock concert backstage, a distinctive friendly mascot made of cream-white cotton tufts stands at center-right. The mascot must retain exactly the reference identity: cloud-like tufted cotton head and body, thick expressive brows, glossy black sunglasses, matte black over-ear headphones, woven brown rope-like arms and legs, black high-top canvas sneakers with pale rubber toe caps and white laces, one hand showing rock horns. Keep anatomy and accessories consistent across every frame. The camera makes a smooth single forward push toward the mascot at a constant slow speed as red and warm amber stage spots slowly illuminate a wall of vintage guitar amps and drifting fine stage haze. Subtle practical light flickers, calm dust, gentle soft smoke movement, shallow cinematic depth of field, film grain, weathered grunge rock poster atmosphere, realistic tactile materials. The mascot shows restrained natural movement and a confident welcoming rock-horns gesture, never speaking or changing its face. Keep the upper-left region calm, with dark concert atmosphere suitable for website headline overlays, while maintaining a continuous full-bleed scene across the frame. End in a fully settled hero shot with mascot at center-right and warm rim-light, holding still for the final second. No cuts, no whip pans, no text, no captions, no typographic signs, no logos, no lettering anywhere, no extra fingers, no additional arms or legs, no sunglasses deformation, no face morphing, no sudden scene changes, no flashy zooms.

**Timing / chapter alignment:**

| Scroll band | Progress | Screen caption (HTML, not part of video) | Narrative moment |
| --- | --- | --- | --- |
| 1 | 0–25% | VOCÊ ACABA DE ENTRAR PRO BACKSTAGE! | backstage establishes |
| 2 | 25–50% | ESSE CHAVEIRO TEM ATITUDE. | lights reveal accessories |
| 3 | 50–75% | O ROCK VAI COM VOCÊ. | camera pushes toward the mascot |
| 4 | 75–100% | VOCÊ FAZ PARTE DA NOSSA TURMA. | end frame settles |

**Flow configuration proposed:** 16:9, 1080p if available, ~8 s, image-to-video/frames-to-video, no embedded titles, preserve original mascot identity. Provider presets and exact capabilities may differ; confirm them at time of generation. Silent clip is preferred for scroll playback. Do not include music requiring separate licensing.

**Evaluation gate (Founder / Commerce):** Reject if any face/limb/shoe mutates, cotton turns into hair/food, headset disappears, brand logos are hallucinated, text appears, video flickers/jumps, mascot is too dark, subject is behind the caption zone, or the end fails to settle.

## Integration after the Flow file is approved

1. Place the final H.264 web-optimized MP4 at `public/images/campaigns/algodao-pesado/backstage-scrub.mp4`; keep the production source outside of served public files.
2. Make a clean, approved landscape poster available for mobile/static presentation and replace the CSS SVG fallback with the approved mascot or poster.
3. Change `const VIDEO_ENABLED = false` to `true` in `rock-stage.tsx`, with a fresh QA pass.
4. For scroll seeking, prefer short keyframe interval (GOP ~6–12 frames). Example:
   ```bash
   ffmpeg -i flow-master.mp4 -an -vf "scale=1920:-2,fps=30,format=yuv420p" -c:v libx264 -preset slow -crf 22 -g 9 -keyint_min 9 -sc_threshold 0 -movflags +faststart public/images/campaigns/algodao-pesado/backstage-scrub.mp4
   ```
   Measure the result, tune for delivery size and verify desktop seek quality; do not assume target size or FPS until the master is inspected.
5. Verify local build with `npm ci`, `npm run build:hostinger` and HTTP smoke tests for both canonical and typo routes.
6. Manually inspect in Chrome desktop 1366px and mobile 390px, iOS/Android, portrait/landscape and reduced-motion mode.
7. Confirm real Hostinger deployment and live URLs separately; a merged PR is not verified deployment.

## Operational verification

- Server-rendered copy remains visible without the client JS/video.
- Static view on mobile and `prefers-reduced-motion` does not fetch video.
- Alt text and accessible CTA label convey the destination; social opens securely in a new tab.
- No misleading claim that the temporary illustration is official campaign art.
- No auto-payments, checkout changes or third-party tracking added.
- Date of live deployment, screenshots, browser tests and performance measures: **not verified in this document**.

**Founder gate:** Approve the final clip, use of official client artwork, final copy and release after visual/functional checks. This document is a delivery brief, not recorded media approval or client authorization.
