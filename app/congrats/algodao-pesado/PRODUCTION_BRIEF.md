# Algodão Pesado × Vektua XYZ — Creative direction v2: two separate films

**Date:** 2026-10-22  
**State:** Film A supplied by Founder and integrated into the site source on 2026-10-22; Film B remains pending. Live deployment is not verified.  
**Route:** `/congrats/algodao-pesado` (canonical), `/congrats/agodao-pesado` (compatibility redirect).  
**Domain owner:** 07 Commerce & Brand Experience; implementation through existing Next/Vinext/Hostinger architecture; Founder approves final media and publication.

## Film A media integration evidence (22 Oct 2026)

- **Input received:** `video-scroll-site.mp4`, 10.000 s, H.264 1920×1080 at 24 fps with AAC audio, 10,658,793 bytes. Visual frames were reviewed at 0, 2, 4, 6, 8 and 9.8 seconds: continuous backward movement toward the backstage while the crowd remains the subject. No mascot is present.
- **Optimized site artifact:** 1280×720 H.264, 24 fps, 10.000 s, no audio stream, 3,187,285 bytes, short GOP (-g 8), MP4 faststart.
- **SHA-256 of assembled MP4:** `b951df7d2becdb03cf1c9aff7e6d0b7f99942745011bf6182221122ef4dfb208`.
- **Binary source in Git:** `media-src/algodao-pesado/scrub-00.part` through `scrub-09.part` (ten ordered binary Git blobs). The runtime never fetches these parts individually.
- **Build:** `scripts/assemble-algodao-scrub.mjs` concatenates and validates the parts before writing the playable MP4 under `public/images/campaigns/algodao-pesado/audience-tribute-scrub.mp4`. It is invoked by `npm run dev`, `npm run build` and `npm run build:hostinger`. The generated public MP4 is Git-ignored. This workflow does not require GitHub Actions or LFS.
- **Poster:** `public/images/campaigns/algodao-pesado/audience-tribute-poster.jpg`, 1600×900, rendered as the initial frame / fallback.
- **Confirmed local test:** Reassembled ten parts with Node, validated SHA-256 and byte count, and probed the resulting MP4 with ffprobe (H.264, 1280×720, 24 fps, 10 seconds).
- **Site playback design:** desktop landscape uses Blob URL for Range-independent scroll scrubbing, rAF with refresh-rate-normalized smoothing, lock/coalesce seeks, dynamic display of HTML text chapters. Other screens, motion-reduced devices and video failures keep the poster.
- **Not verified:** a full Next/Vinext/Hostinger build, production HTTP Range/asset delivery, screenshots on actual desktop/mobile devices, live Hostinger deployment. These remain QA tasks, not PASS claims.
- **Second Film B:** speaking mascot video remains a separate user-triggered component, still pending video and poster delivery and review.

## Executive creative premise

The friend/supporter who receives the keyring is the **artist on stage** in a heavy metal concert metaphor. The Algodão Pesado brand and its founder Diego are the **crowd**, raising devil horns to honor and thank the supporter for being part of their story.

**Do not place the Algodão Pesado mascot in Film A, the scroll-controlled hero.** Its first and only intended audiovisual appearance is at the **end of the page in Film B**, a separate spoken message thanking the visitor on Diego's behalf. The two films may be produced, tested and approved independently. The final film plays only on deliberate user action, with audible dialogue and video controls. It is NOT synchronized to scroll.

This concept replaces the v1 storyline "you entered our backstage" and the v1 Film A prompt featuring the mascot. The previous mascot start frame for the scrub is invalid for this concept; never use it as the first frame of Film A.

## Narrative map

| Scene | UX treatment | Narrative | Hero title |
|---|---|---|---|
| 1 | Film A, muted scrub 0–25% | Point of view from center stage, concert light and the crowd in darkness | HOJE O PALCO É TODO SEU |
| 2 | Film A, muted scrub 25–50% | Last note reverberates; silhouettes raise devil horns | E A PLATEIA SE LEVANTA |
| 3 | Film A, muted scrub 50–75% | More hands rise, cheering and respect | AS MÃOS SE ERGUEM POR VOCÊ |
| 4 | Film A, muted scrub 75–100% | The audience holds horns in still reverence; end frame settles | ESSA VAI PRA VOCÊ! |
| 5 | Static copy and message | The friend/supporter is thanked for standing by Diego and the store | ESSA VAI PRA VOCÊ |
| 6 | Film B, separate click-to-play (with sound) | Mascot speaks to camera **in Diego's name** | UM RECADO DE CORAÇÃO |
| 7 | Final Instagram CTA | Optional invitation to follow the store | NOSSA REVERÊNCIA É PRA VOCÊ |

## Film A — Google Flow, silent scroll-scrub, NO MASCOT

**Suggested settings:** Generate 16:9 landscape, ~8 seconds, single uninterrupted shot. Keep the video silent for deterministic scroll-scrubbing. The opening image must show the **perspective from the stage facing the audience**; it cannot feature a mascot, a lead singer or the band.

**English prompt:**

> One continuous 8-second cinematic concert shot, widescreen 16:9, filmed entirely from the exact point of view of someone standing on a large rock and heavy metal stage after the final thunderous chord of their favorite song. The camera looks OUT from the stage over the edge toward the audience. The viewer is the performer being honored, NEVER one of the people in the audience. The crowded audience starts as dramatic silhouettes under deep scarlet and warm amber stage lighting. Slow, smooth, gentle forward dolly movement with very stable framing, designed for smooth video seeking based on page scroll. As the last chord fades, the people in the first rows slowly raise their hands, making the unmistakable classic heavy metal devil horns gesture in tribute and appreciation to the viewer on stage. More and more hands and arms rise toward the lights. The gesture feels genuine and emotionally powerful rather than exaggerated or aggressive. Fine concert haze, warm backlit atmospheric particles, beams of burgundy-red and amber light, subtle film grain, dramatic authentic rock concert photography, premium cinematic detail and physical human proportions. Preserve a composition with dark, readable negative space in the upper-left/mid-left region for later website titles applied separately by HTML. During the final second the motion comes to complete rest on a powerful tableau of raised horns and grateful fans. The film must remain one continuous exact concert environment, without any cut, jump, logo or graphic overlay. **ABSOLUTELY NO mascot, no cotton character, no cartoon character, no band member, no performer visible on stage, no text, no readable banners or logos, no letterforms, no surreal fingers, no extra fingers, no melted hands, no flicker, no whip-pan, no zoom jump, no voice, no music.** Leave the center stage foreground open so the camera viewpoint unmistakably belongs to the honored recipient.

**Ideal initial frame:** 16:9 view from the concert stage toward a dark, smoke-filled crowd, a few near hands lowered and many silhouettes visible; rich deep reds/amber and a large low-contrast upper-left area. **No mascot.** The composition may be supplied as the Flow start-frame still.

**Approval checks:** stage-to-audience perspective is correct; visible hands form recognizable devil horns; no mascot or performer; no malformed anatomy, hallucinated logos or AI lettering; smooth camera and end hold; overlay text remains readable.

**Delivery path:** `public/images/campaigns/algodao-pesado/audience-tribute-scrub.mp4`. Film A is now enabled in `rock-stage.tsx`. Its 10-second approved-to-integrate source was converted to a 1280×720, 24 fps, video-only H.264 asset (3,187,285 bytes). The static poster is stored at `public/images/campaigns/algodao-pesado/audience-tribute-poster.jpg`. The MP4 is assembled from ten binary parts by `scripts/assemble-algodao-scrub.mjs` before npm dev/build/Hostinger build and served at the same delivery path. Responsive gates prevent video requests on mobile, portrait layouts and reduced-motion mode.

## Film B — talking mascot, ending on-click video

**Only here** should the mascot appear. The mascot represents Algodão Pesado and conveys Diego's gratitude. Use its exact client-approved reference identity, without reinterpreting the cotton head, sunglasses, headphones, rope-like limbs, black high-top sneakers or hand gesture. Camera is frontal or very light three-quarter, with the mascot speaking naturally and looking directly toward the viewer. The animation can contain small gestures and a concluding devil horns sign, but no dancing, morphing or costume changes.

**Suggested speech draft (requires Founder/Diego approval):**

> "Essa vai pra você! Aqui é a Algodão Pesado, e o Diego mandou um recado: obrigado de coração por estar com a gente e fortalecer nossa história. Tamo junto! Rock'n'roll!"

**English video prompt (Portuguese dialogue retained verbatim):**

> A single warm cinematic 16:9 medium shot of the exact client-supplied Algodão Pesado Rockwear cotton mascot, standing in an intimate rock backstage with soft red-and-amber practical concert lights. Faithfully preserve the cotton tuft texture, cream-white cotton cloud face/body, glossy black sunglasses, prominent black over-ear headphones, dark brows, woven brown rope arms and legs, and black canvas high-top sneakers. The mascot looks into the camera as if addressing one valued friend. It speaks in friendly natural Brazilian Portuguese on behalf of Diego, with warm gratitude and playful rock attitude, saying only the provided approved Portuguese voiceover script. Keep the little mouth moving in sync with spoken sounds; subtle shoulders and hand gesture; end by raising one devil-horns hand clearly and holding it. No changes in character silhouette or outfit, no additional arms, no fake logos, no subtitles baked into frames, no cuts, no aggressive performance, no extra characters. Natural even voice level with clear pronunciation, no copyrighted music. This is a personal thank-you, not a sales advertisement.

**Technical note:** A spoken script longer than one generation may need multiple approved clips and edit/voice postproduction, depending on the generator's duration, audio support and natural speaking rate. Do not compress the dialogue unnaturally. Use an original synthetic mascot voice or user-authorized recording, not an unapproved impersonation of Diego. Produce an accessible transcript/captions based on the **final** recording.

**Delivery paths:**
- `public/images/campaigns/algodao-pesado/diego-mascot-thank-you.mp4`
- `public/images/campaigns/algodao-pesado/diego-mascot-thank-you-poster.webp`
- Optional caption track `diego-mascot-thank-you.vtt` after transcription verification.

**Page behavior:** The end section uses `thank-you-message.tsx`, following the established Blind Rats request-to-play UX. It has sound and native playback controls after the visitor presses play. The current `VIDEO_AVAILABLE = false` displays a static, accessible thank-you message rather than a broken or fake play button. Enable only when the actual assets and transcript have been supplied and validated.

## Operational QA and authorization

1. Confirm the Algodão Pesado logo and original mascot rights/permission with client/Founder before live use.
2. Inspect and approve both videos **separately** (visual identity, perspective, anatomy, copy, audio).
3. Keep Film A silent, seeking via scroll only on supported landscape desktop; static fallback on mobile, portrait, reduced motion and media failure.
4. Keep Film B outside the scrub lifecycle, with explicit start, audio controls, correct pause behavior and accessible transcript/captions.
5. Verify build `npm run build:hostinger`, route smoke checks, privacy of media assets and mobile/desktop layouts.
6. Validate both /congrats paths, live Hostinger deployment and QR code scanning before printing.
7. Do not claim production tests, actual publication, client approval or media readiness without evidence.

**Founder gate:** Approval of the final campaign copy and both audiovisual assets is pending. No marketing claim, music rights, public launch or deployment is implied by a documentation or code merge.
