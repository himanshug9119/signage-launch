# ScreenSetu launch videos

| File | Length | Format | Use |
|---|---|---|---|
| `ScreenSetu-Launch-2min-16x9.mp4` | 2:10 | 1920×1080 | YouTube, website, LinkedIn |
| `ScreenSetu-Launch-1min-16x9.mp4` | 1:00 | 1920×1080 | Short landscape teaser |
| `ScreenSetu-Launch-2min-9x16.mp4` | 2:10 | 1080×1920 | Reels / Shorts / TikTok (long) |
| `ScreenSetu-Launch-1min-9x16.mp4` | 1:00 | 1080×1920 | Reels / Shorts / TikTok |
| `ScreenSetu-Launch-60s.mp4` | 1:00 | 1920×1080 | First version (v1, marketing-site screenshots only) |

All are captions-only (no voiceover), 30 fps, with a generated 120 BPM soundtrack and sound effects, loudness-normalised to −14 LUFS.

## v2 storyboard (2-minute cut)
1. **Hook:** a café TV still showing the dinner menu at 8 AM.
2. **Problem:** USB sticks and site visits.
3. **Logo** and tagline.
4. **Overview:** real dashboard screenshots, then the Dashboard page.
5. **① Pair a screen:** "Pair New Screen" → "Generate Pairing Code" → the code is typed on the web player → online.
6. **② Content & playlists:** "Upload Media" → drag-and-drop playlist order.
7. **③ Dayparting:** breakfast, lunch and dinner schedules swap the café menu as the clock runs.
8. **④ Instant updates:** Save → the TV changes in under 2 s.
9. **⑤ Emergency takeover:** Target Scope "Company-wide (All Screens)" → "Activate Takeover" → café, lobby and metro screens.
10. **⑥ Always on:** the Wi-Fi drops and screens keep playing from cache (SHA-256); then the "Device Health" modal.
11. **⑦ Display overlays:** logo watermark and scrolling ticker.
12. **Hardware and pricing:** "Plans from ₹799/mo", BASIC 5 / PRO 20 / MAX 50 / ULTRA custom screens.
13. **CTA:** "Get started free", screensetu.com.

The 1-minute cuts use scenes 1, 3, 5, 7, 8, 9, the first half of 10, the pricing half of 12, and 13. Some of them play faster.

## How it's made (`v2/`)
- **`index.html`**: the engine, plus reusable pieces:
  - TV mockups and CSS-built venues (café, office lobby, metro platform)
  - a rebuilt dark dashboard shell matching the real UI (labels taken from `dashboard/PAGES.md`)
  - the cursor
  - `?cut=long|short&o=l|p` chooses the cut and the orientation.
- **`scenes.js`**: the 13 scenes. Each has a landscape and a portrait layout via `L(landscape, portrait)`.
- **`timeline.js`**: the cuts and the SFX cue points, shared by the visuals and the audio.
- **`audio.py`**: synthesises the soundtrack for a cut from `timeline.js`. It needs numpy and scipy.
- **`prep_media.py`**: copies `dashboard/demo-media/` into `v2/assets/` with the "DEMO –" labels replaced.
- **`render.js`**: renders frames with headless Chromium (Playwright) and encodes them with ffmpeg.
- **`build.sh`**: builds all four videos, or `./build.sh long l` for just one.

Content notes:
- **Real vs rebuilt screens:** the dashboard screenshots shown in the overview are real (with the capture-tool glow cropped off). The animated flows use rebuilt screens filled with demo data (screens online, Pune, Mumbai and Delhi locations), because the live test account has offline screens.
- **Claims:** nothing claims "unlimited screens", and no customer names or metrics are invented.

Preview a frame: `node v2/render.js stills long l 45` → `v2/out/still-long-l-45.png`.

## v1 (`video.html`, `render.js`, `audio.py`)
The original 60-second version, built from `BRIEF.md` and `screenshots/`.
