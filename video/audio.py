"""Synthesises the 60 s soundtrack (120 BPM electronic bed + SFX) timed to video.html.
Writes out/audio.wav. Pure numpy, no samples needed."""
import numpy as np, wave, os
from scipy.signal import lfilter

SR = 44100
DUR = 60.0
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


# ---------- music ----------
# progression (MIDI roots): C - G - Am - F, one chord per bar (2 s)
prog = [(48, [60, 64, 67, 71]), (43, [59, 62, 67, 74]), (45, [60, 64, 69, 72]), (41, [60, 65, 69, 72])]

# intro 0-6: tense filtered pad (Am), ticking hats, glitches
add(pad([57, 60, 64], 6.2, bright=0.45), 0.0, 0.9)
for b in np.arange(0, 6, BEAT / 2):
    add(hat(), b, 0.5 if (b * 4) % 2 else 0.8, pan=0.3)
for g in (1.0, 1.9):
    add(glitch(), g, 1.0)
for b in (3.0, 3.5, 4.0, 4.5, 5.0):
    add(kick(), b, 0.45)
add(riser(1.0), 5.0, 1.0)

# main 6 - 55
duck_ranges = [(27.4, 28.9)]
def duck(at):
    for a, b in duck_ranges:
        if a <= at < b:
            return 0.35
    return 1.0

start, end = 6.0, 55.0
b = start
while b < end - 1e-6:
    beat_i = int(round((b - start) / BEAT))
    bar = beat_i // 4
    root, chord = prog[bar % 4]
    d = duck(b)
    add(kick(), b, 0.95 * d)
    add(hat(), b + BEAT / 2, 0.9 * d, pan=0.25)
    if beat_i % 4 in (1, 3):
        add(clap(), b, 0.9 * d, pan=-0.05)
    if beat_i % 2 == 1:
        add(hat(True), b + BEAT * 0.75, 0.35 * d, pan=-0.3)
    # bass on 8ths: root, octave pattern
    for k, off in enumerate((0, 0.25)):
        add(bass(root + (12 if k else 0), 0.22), b + off, 1.0 * d)
    if beat_i % 4 == 0:
        add(pad(chord, 2.05, bright=1.0 if b > 11 else 0.8), b, 0.85 * d)
    # arp plucks from 11s on
    if b >= 11:
        for k in range(2):
            m = chord[(beat_i * 2 + k) % 4] + 12
            add(pluck(m), b + k * 0.25, 0.8 * d, pan=0.4 if k else -0.4)
    b += BEAT

# outro 55-60: resolve on bright C chord
add(impact(), 55.0, 0.6)
add(pad([48, 60, 64, 67, 71, 76], 5.0, bright=1.3), 55.0, 1.4)
add(bass(36, 2.5), 55.0, 0.8)
for k, m in enumerate([72, 76, 79, 84]):
    add(pluck(m, 1.2), 55.0 + k * 0.12, 0.9)

# ---------- SFX (times match video.html) ----------
for w in (3.0, 11.0, 16.0, 21.0, 26.0, 31.0, 36.0, 41.0, 46.0, 51.0, 55.0):
    add(whoosh(0.55), w - 0.3, 0.9, pan=0.0)
add(impact(), 6.0, 0.9)
for s in (4.3, 4.8):
    add(swipe(), s, 1.0)
    add(click(), s + 0.05, 0.6)
for i in range(10):
    add(click(), 8.2 + i * 0.06, 0.25)
for c in (17.6, 27.4, 29.5, 38.4):
    add(click(), c, 1.0)
for k, p in enumerate((18.0, 18.25, 18.5)):
    add(ping(1568 + k * 196), p, 1.0, pan=0.3)
for p in (22.98, 24.36):
    add(ping(1318, 0.5, 0.18), p, 1.0)
add(alarm(1.2), 27.45, 1.0)
add(impact(), 27.42, 0.7)
add(ping(1760), 29.6, 0.9)
add(glitch(0.2), 32.2, 0.8)
add(ping(1975, 0.7), 33.6, 1.0)
add(ping(2093, 0.7), 35.0, 0.8)
add(ping(1760), 39.6, 0.9)
for k in range(4):
    add(pluck(84 + [0, 4, 7, 12][k], 0.3), 42.0 + k * 0.3, 1.0)
for k, p in enumerate((46.6, 47.9, 49.2)):
    add(ping(1318 * 2 ** (k * 4 / 12)), p, 0.9)
add(ping(1568, 0.6), 53.0, 0.8)

# ---------- master ----------
# light reverb: decaying noise IR via FFT convolution
ir_t = t_(1.6)
ir = rng.standard_normal((len(ir_t), 2)) * np.exp(-ir_t * 3.5)[:, None]
ir = lp(ir[:, 0], 5000)[:, None] * [1, 0] + lp(ir[:, 1], 5000)[:, None] * [0, 1]
L = N + len(ir_t)
nfft = 1 << (L - 1).bit_length()
wet = np.stack([np.fft.irfft(np.fft.rfft(mix[:, c], nfft) * np.fft.rfft(ir[:, c], nfft), nfft)[:N] for c in range(2)], 1)
out = mix + wet * 0.012
# fade in/out
tt = np.arange(N) / SR
out *= np.clip(tt / 0.3, 0, 1)[:, None] * np.clip((DUR - tt) / 1.2, 0, 1)[:, None]
# soft clip + normalise
out = np.tanh(out * 1.1)
out = out / np.max(np.abs(out)) * 0.89
os.makedirs('out', exist_ok=True)
with wave.open('out/audio.wav', 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((out * 32767).astype('<i2').tobytes())
print('wrote out/audio.wav')
