"""Synthesises the soundtrack for one cut of the v2 video (120 BPM bed + SFX), timed from timeline.js.
Usage: python3 audio.py <cut>  ->  out/audio-<cut>.wav"""
import numpy as np, wave, os, sys, json
from scipy.signal import lfilter

SR = 44100
TL = json.loads(open(os.path.join(os.path.dirname(__file__) or ".", "timeline.js")).read().rsplit("window.TL =", 1)[1].strip().rstrip(";"))
CUT = sys.argv[1] if len(sys.argv) > 1 else "long"
ENT, _acc = [], 0.0
for e in TL["cuts"][CUT]:
    sid, d, sp, off = (list(e) + [1, 0])[:4]
    ENT.append(dict(id=sid, d=d, sp=sp, off=off, s=_acc)); _acc += d
DUR = _acc
N = int(SR * DUR)
BEAT = 0.5  # 120 BPM
rng = np.random.default_rng(7)
mix = np.zeros((N, 2))


def t_(d):
    return np.arange(int(d * SR)) / SR


def add(sig, at, gain=1.0, pan=0.0):
    i = int(at * SR)
    if i >= N:
        return
    sig = sig[: N - i]
    l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    if sig.ndim == 1:
        mix[i:i + len(sig), 0] += sig * gain * l * 1.414
        mix[i:i + len(sig), 1] += sig * gain * r * 1.414
    else:
        mix[i:i + len(sig)] += sig * gain


def env(n, a=0.005, r=0.1, total=None):
    total = total or n / SR
    t = np.arange(n) / SR
    e = np.minimum(1, t / max(a, 1e-4))
    e *= np.clip((total - t) / max(r, 1e-4), 0, 1)
    return e


def lp(x, cutoff):
    """one-pole low-pass; cutoff may be array"""
    if np.ndim(cutoff) == 0:
        a = 1 - np.exp(-2 * np.pi * cutoff / SR)
        return lfilter([a], [1, a - 1], x)
    y = np.zeros_like(x)
    c = np.broadcast_to(np.asarray(cutoff, float), x.shape)
    a = 1 - np.exp(-2 * np.pi * c / SR)
    acc = 0.0
    for i in range(len(x)):
        acc += a[i] * (x[i] - acc)
        y[i] = acc
    return y


def hp(x, cutoff):
    return x - lp(x, cutoff)


def note(m):
    return 440 * 2 ** ((m - 69) / 12)


# ---------- instruments ----------
def kick():
    t = t_(0.35)
    f = 50 + 120 * np.exp(-t * 28)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.exp(-t * 9) * 0.9


def hat(open_=False):
    d = 0.18 if open_ else 0.05
    t = t_(d)
    n = rng.standard_normal(len(t))
    n = n - lp(n, 7000)
    return n * np.exp(-t * (18 if open_ else 70)) * 0.18


def clap():
    t = t_(0.22)
    n = rng.standard_normal(len(t))
    n = lp(n - lp(n, 900), 5000)
    e = np.exp(-t * 22) + 0.6 * np.exp(-((t - 0.012) % 0.011) * 300) * (t < 0.035)
    return n * e * 0.35


def saw(f, d, detune=0.0):
    t = t_(d)
    out = 0
    for dt in (-detune, 0, detune):
        out = out + 2 * ((t * f * (1 + dt)) % 1) - 1
    return out / 3


def bass(m, d):
    s = saw(note(m), d) * 0.6 + np.sin(2 * np.pi * note(m - 12) * t_(d)) * 0.6
    s = lp(s, 600 + 900 * np.exp(-t_(d) * 10))
    return s * env(len(s), 0.004, 0.05) * 0.38


def pad(ms, d, bright=1.0):
    s = sum(saw(note(m), d, 0.006) for m in ms) / len(ms)
    s = lp(s, 1400 * bright)
    return s * env(len(s), 0.25, 0.4) * 0.22


def pluck(m, d=0.25):
    t = t_(d)
    s = (2 * ((t * note(m)) % 1) - 1) * 0.5 + np.sin(2 * np.pi * note(m) * t) * 0.5
    s = lp(s, 800 + 5000 * np.exp(-t * 20))
    return s * np.exp(-t * 9) * 0.22


def ping(f=1760, d=0.6, g=0.25):
    t = t_(d)
    s = (np.sin(2 * np.pi * f * t) + 0.4 * np.sin(2 * np.pi * f * 2.01 * t)) * np.exp(-t * 7)
    return s * g


def click():
    t = t_(0.04)
    return (np.sin(2 * np.pi * 2400 * t) * np.exp(-t * 160) + rng.standard_normal(len(t)) * np.exp(-t * 300) * 0.3) * 0.35


def whoosh(d=0.6, up=True, g=0.28):
    t = t_(d)
    n = rng.standard_normal(len(t))
    sweep = np.linspace(300, 6000, len(t)) if up else np.linspace(6000, 300, len(t))
    s = lp(n, sweep)
    e = np.sin(np.pi * np.clip(t / d, 0, 1)) ** 2
    return s * e * g


def riser(d=1.0):
    t = t_(d)
    n = rng.standard_normal(len(t))
    s = lp(n, np.linspace(200, 9000, len(t))) * (t / d) ** 2
    tone = np.sin(2 * np.pi * np.cumsum(np.linspace(200, 900, len(t))) / SR) * (t / d) ** 3 * 0.25
    return (s * 0.3 + tone) * 0.6


def glitch(d=0.25):
    t = t_(d)
    sq = np.sign(np.sin(2 * np.pi * 90 * t * (1 + 3 * (rng.random(len(t)) > .97))))
    n = rng.standard_normal(len(t))
    gate = (np.floor(t * 60) % 2)
    return (sq * 0.3 + n * 0.5) * gate * np.exp(-t * 6) * 0.35


def impact():
    t = t_(1.2)
    f = 40 + 60 * np.exp(-t * 10)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 3)
    n = lp(rng.standard_normal(len(t)), 2500) * np.exp(-t * 8) * 0.4
    return (s + n) * 0.7


def alarm(d=1.1):
    t = t_(d)
    f = np.where((t * 6) % 1 < 0.5, 880, 660)
    ph = 2 * np.pi * np.cumsum(f) / SR
    s = np.sign(np.sin(ph)) * 0.5 + np.sin(ph) * 0.5
    s = lp(s, 3000)
    return s * env(len(t), 0.01, 0.2) * 0.22


def swipe():
    return whoosh(0.22, True, 0.22)


# ---------- music (structure follows the cut's scenes) ----------
# progression (MIDI roots): C - G - Am - F, one chord per bar (2 s)
prog = [(48, [60, 64, 67, 71]), (43, [59, 62, 67, 74]), (45, [60, 64, 69, 72]), (41, [60, 65, 69, 72])]

def start_of(sid, default=None):
    for e in ENT:
        if e["id"] == sid:
            return e["s"]
    return default

def scene_time(sid, u):
    """real time of scene-time u, or None if that moment is not in this cut"""
    for e in ENT:
        if e["id"] == sid and e["off"] <= u <= e["off"] + e["d"] * e["sp"]:
            return e["s"] + (u - e["off"]) / e["sp"]
    return None

drop = start_of("logo", 0.0)
end_main = start_of("cta", DUR - 6)
alarm_t = scene_time("takeover", 4.3)
duck_ranges = [(alarm_t, alarm_t + 1.6)] if alarm_t else []

# intro: tense filtered pad, ticking hats, glitch hits on the stale-screen beat
if drop > 0.5:
    add(pad([57, 60, 64], drop + 0.2, bright=0.45), 0.0, 0.9)
    for b in np.arange(0, drop, BEAT / 2):
        add(hat(), b, 0.5 if (b * 4) % 2 else 0.8, pan=0.3)
    for b in np.arange(max(0, drop - 3), drop, BEAT):
        add(kick(), b, 0.45)
    add(riser(min(1.0, drop)), drop - min(1.0, drop), 1.0)

def duck(at):
    for a, b in duck_ranges:
        if a <= at < b:
            return 0.3
    return 1.0

b = drop
while b < end_main - 1e-6:
    beat_i = int(round((b - drop) / BEAT))
    bar = beat_i // 4
    root, chord = prog[bar % 4]
    d = duck(b)
    # every 16 bars: a 1-bar breather (no kick) to keep a long bed from droning
    breather = (bar % 16 == 15)
    if not breather:
        add(kick(), b, 0.9 * d)
    add(hat(), b + BEAT / 2, 0.85 * d, pan=0.25)
    if beat_i % 4 in (1, 3):
        add(clap(), b, 0.85 * d, pan=-0.05)
    if beat_i % 2 == 1:
        add(hat(True), b + BEAT * 0.75, 0.32 * d, pan=-0.3)
    for k, off in enumerate((0, 0.25)):
        add(bass(root + (12 if k else 0), 0.22), b + off, 0.95 * d)
    if beat_i % 4 == 0:
        add(pad(chord, 2.05, bright=1.0 if b > drop + 4 else 0.8), b, 0.8 * d)
    if b >= drop + 4:
        for k in range(2):
            m = chord[(beat_i * 2 + k) % 4] + 12
            add(pluck(m), b + k * 0.25, 0.7 * d, pan=0.4 if k else -0.4)
    b += BEAT

# outro: resolve on a bright C chord
add(impact(), end_main, 0.6)
add(pad([48, 60, 64, 67, 71, 76], DUR - end_main, bright=1.3), end_main, 1.4)
add(bass(36, 2.5), end_main, 0.8)
for k, m in enumerate([72, 76, 79, 84]):
    add(pluck(m, 1.2), end_main + k * 0.12, 0.9)

# ---------- SFX ----------
def typing(n=10, gap=0.07):
    out = np.zeros(int(SR * (n * gap + 0.05)))
    for i in range(n):
        c = click() * (0.5 + 0.3 * rng.random())
        j = int(i * gap * SR); out[j:j + len(c)] += c[: len(out) - j]
    return out * 0.6

def ticks4():
    out = np.zeros(int(SR * 1.0))
    for i in range(4):
        p = ping(2093 + i * 220, 0.25, 0.12); j = int(i * 0.12 * SR); out[j:j + len(p)] += p[: len(out) - j]
    return out

def soft_drop():
    t = t_(0.25)
    return np.sin(2 * np.pi * (180 + 300 * np.exp(-t * 30)) * t) * np.exp(-t * 18) * 0.5

SFX = {
    "sting": lambda: np.concatenate([glitch(0.3), np.zeros(int(SR * 0.5))]) + ping(220, 0.8, 0.25),
    "swipe": lambda: whoosh(0.22, True, 0.22),
    "impact": impact, "impact_soft": lambda: impact() * 0.5,
    "type": typing, "swoosh": lambda: whoosh(0.45, True, 0.2), "tick4": ticks4,
    "click": click, "ping": lambda: ping(1568, 0.6, 0.22), "ping_hi": lambda: ping(2093, 0.7, 0.25),
    "drop": soft_drop, "alarm": lambda: alarm(1.4), "glitch": lambda: glitch(0.25),
}
for e in ENT[1:]:
    add(whoosh(0.55), e["s"] - 0.3, 0.8)
for e in ENT:
    for ev in TL["sfx"].get(e["id"], []):
        u, kind = ev[0], ev[1]
        g = ev[2] if len(ev) > 2 else 1.0
        t = scene_time(e["id"], u)
        if t is not None:
            add(SFX[kind](), t, g)

# ---------- master ----------
ir_t = t_(1.6)
ir = rng.standard_normal((len(ir_t), 2)) * np.exp(-ir_t * 3.5)[:, None]
ir = np.stack([lp(ir[:, 0], 5000), lp(ir[:, 1], 5000)], 1)
L_ = N + len(ir_t)
nfft = 1 << (L_ - 1).bit_length()
wet = np.stack([np.fft.irfft(np.fft.rfft(mix[:, c], nfft) * np.fft.rfft(ir[:, c], nfft), nfft)[:N] for c in range(2)], 1)
out = mix + wet * 0.012
tt = np.arange(N) / SR
out *= np.clip(tt / 0.3, 0, 1)[:, None] * np.clip((DUR - tt) / 1.2, 0, 1)[:, None]
out = np.tanh(out * 1.1)
out = out / np.max(np.abs(out)) * 0.89
os.makedirs('out', exist_ok=True)
with wave.open(f'out/audio-{CUT}.wav', 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((out * 32767).astype('<i2').tobytes())
print(f'wrote out/audio-{CUT}.wav ({DUR:.0f}s)')
