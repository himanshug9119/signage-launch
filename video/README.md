# ScreenSetu launch video

`ScreenSetu-Launch-60s.mp4` is a 60-second, 1920×1080, 30 fps product launch video built from `../BRIEF.md` and the screenshots in `../screenshots/`.

## How it's made
- `video.html` holds all 13 scenes as HTML/CSS motion graphics. `render(t)` draws the frame at time `t` in seconds. Open the file in a browser to watch a live loop.
- `render.js` captures every frame with headless Chromium (Playwright) and encodes them with ffmpeg.
- `audio.py` synthesises the 120 BPM soundtrack and sound effects with numpy/scipy, timed to the scenes.

## Rebuild
```bash
cd video
python3 audio.py                              # -> out/audio.wav
node render.js video 30 4                     # -> out/video-silent.mp4
ffmpeg -i out/video-silent.mp4 -i out/audio.wav -af loudnorm=I=-14:TP=-1.5 \
  -c:v copy -c:a aac -b:a 192k -shortest ScreenSetu-Launch-60s.mp4
node render.js stills 14 28 54                # preview single frames
```
Requires Node with `playwright`, Python 3 with numpy and scipy, and ffmpeg.
