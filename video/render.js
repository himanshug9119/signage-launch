// Renders video.html frame-by-frame with headless Chromium and pipes frames to ffmpeg.
// Usage:
//   node render.js stills 1.2 4.5 ...          -> out/still-<t>.png
//   node render.js video [fps] [workers]       -> out/video-silent.mp4
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const W = 1920, H = 1080, DUR = 60;
const page_url = 'file://' + path.join(__dirname, 'video.html') + '?t=0';
const OUT = path.join(__dirname, 'out');
fs.mkdirSync(OUT, { recursive: true });

async function open(browser) {
  const page = await browser.newPage({ viewport: { width: W, height: H } });
  await page.goto(page_url);
  await page.evaluate(() => window.__ready);
  return page;
}

async function stills(times) {
  const browser = await chromium.launch();
  const page = await open(browser);
  for (const t of times) {
    await page.evaluate(t => window.render(t), t);
    await page.screenshot({ path: path.join(OUT, `still-${t}.png`) });
  }
  await browser.close();
}

async function segment(browser, from, to, fps, file) {
  const page = await open(browser);
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '17', '-pix_fmt', 'yuv420p', '-r', String(fps), file]);
  for (let f = from; f < to; f++) {
    await page.evaluate(t => window.render(t), f / fps);
    const buf = await page.screenshot({ type: 'jpeg', quality: 95 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (f % 150 === 0) console.log(`frame ${f}`);
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  await page.close();
}

async function video(fps = 30, workers = 4) {
  const total = DUR * fps, per = Math.ceil(total / workers);
  const browser = await chromium.launch();
  const files = [];
  await Promise.all([...Array(workers)].map((_, i) => {
    const file = path.join(OUT, `seg${i}.mp4`); files.push(file);
    return segment(browser, i * per, Math.min(total, (i + 1) * per), fps, file);
  }));
  await browser.close();
  fs.writeFileSync(path.join(OUT, 'segs.txt'), files.sort().map(f => `file '${f}'`).join('\n'));
  await new Promise(r => spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', path.join(OUT, 'segs.txt'), '-c', 'copy', path.join(OUT, 'video-silent.mp4')], { stdio: 'inherit' }).on('close', r));
  files.forEach(f => fs.unlinkSync(f));
  console.log('done');
}

const [mode, ...args] = process.argv.slice(2);
if (mode === 'stills') stills(args.map(Number));
else video(Number(args[0]) || 30, Number(args[1]) || 4);
