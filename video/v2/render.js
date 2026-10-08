// Frame-accurate renderer for index.html.
//   node render.js stills <cut> <l|p> t1 t2 ...   -> out/still-<cut>-<o>-<t>.png
//   node render.js video  <cut> <l|p> [workers]   -> out/<cut>-<o>-silent.mp4
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, 'out');
fs.mkdirSync(OUT, { recursive: true });
const [mode, cut = 'long', o = 'l', ...rest] = process.argv.slice(2);
const W = o === 'p' ? 1080 : 1920, H = o === 'p' ? 1920 : 1080;
const url = 'file://' + path.join(__dirname, 'index.html') + `?cut=${cut}&o=${o}&t=0`;

async function open(browser) {
  const page = await browser.newPage({ viewport: { width: W, height: H } });
  page.on('pageerror', e => console.error('PAGE ERROR', e.message));
  await page.goto(url);
  await page.evaluate(() => window.__ready);
  return page;
}

async function stills(times) {
  const browser = await chromium.launch();
  const page = await open(browser);
  for (const t of times) {
    await page.evaluate(t => window.render(t), t);
    await page.screenshot({ path: path.join(OUT, `still-${cut}-${o}-${t}.png`) });
  }
  await browser.close();
}

async function segment(browser, from, to, fps, file) {
  const page = await open(browser);
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-r', String(fps), file]);
  for (let f = from; f < to; f++) {
    await page.evaluate(t => window.render(t), f / fps);
    const buf = await page.screenshot({ type: 'jpeg', quality: 94 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  await page.close();
}

async function video(workers) {
  const browser = await chromium.launch();
  const probe = await open(browser);
  const total = await probe.evaluate(() => window.TOTAL);
  const fps = await probe.evaluate(() => window.TL.fps);
  await probe.close();
  const frames = Math.round(total * fps), per = Math.ceil(frames / workers);
  const files = [...Array(workers)].map((_, i) => path.join(OUT, `seg-${cut}-${o}-${i}.mp4`));
  await Promise.all(files.map((f, i) => segment(browser, i * per, Math.min(frames, (i + 1) * per), fps, f)));
  await browser.close();
  const list = path.join(OUT, `segs-${cut}-${o}.txt`);
  fs.writeFileSync(list, files.map(f => `file '${f}'`).join('\n'));
  await new Promise(r => spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', list, '-c', 'copy', path.join(OUT, `${cut}-${o}-silent.mp4`)], { stdio: 'inherit' }).on('close', r));
  files.forEach(f => fs.unlinkSync(f));
  console.log(`done ${cut}-${o}: ${total}s, ${frames} frames`);
}

if (mode === 'stills') stills(rest.map(Number));
else video(Number(rest[0]) || 4);
