"""Copies dashboard/demo-media into assets/ with the 'DEMO –' labels replaced (labels sit on vertical gradients)."""
import numpy as np
from PIL import Image, ImageDraw, ImageFont
import os
SRC = os.path.join(os.path.dirname(__file__), '..', '..', 'dashboard', 'demo-media')
DST = os.path.join(os.path.dirname(__file__), 'assets')
FONT = '/usr/share/fonts/opentype/inter/Inter-SemiBold.otf'

# file: (search box x0,y0,x1,y1, replacement text or None, align)
JOBS = {
    'demo-breakfast-menu.png': ((100, 95, 900, 170), 'SETU CAFÉ', 'left'),
    'demo-lunch-menu.png':     ((100, 95, 900, 170), 'SETU CAFÉ', 'left'),
    'demo-dinner-menu.png':    ((100, 95, 900, 170), 'SETU CAFÉ', 'left'),
    'demo-weekend-offer.png':  ((100, 125, 1400, 205), 'WEEKEND OFFER', 'left'),
    'demo-emergency-notice.png': ((300, 20, 1620, 125), 'EMERGENCY NOTICE', 'center'),
    'demo-welcome.png':        ((600, 920, 1320, 1000), None, 'center'),
}

def fix(name, box, text, align):
    im = np.asarray(Image.open(os.path.join(SRC, name)).convert('RGB')).astype(float)
    x0, y0, x1, y1 = box
    # background estimate: per column, interpolate between the rows just outside the box
    top, bot = im[y0 - 2, x0:x1], im[y1 + 2, x0:x1]
    a = np.linspace(0, 1, y1 - y0)[:, None, None]
    bg = top[None] * (1 - a) + bot[None] * a
    region = im[y0:y1, x0:x1]
    diff = np.abs(region - bg).sum(2)
    mask = diff > 60
    ys, xs = np.where(mask)
    tx0, tx1, ty0, ty1 = xs.min() + x0, xs.max() + x0, ys.min() + y0, ys.max() + y0
    color = tuple(int(c) for c in np.median(region[mask], axis=0))
    im[y0:y1, x0:x1] = bg
    out = Image.fromarray(im.clip(0, 255).astype('uint8'))
    if text:
        cap = ty1 - ty0 + 1                      # label is all caps; É accent adds a little height
        font = ImageFont.truetype(FONT, int(cap / 0.80))
        d = ImageDraw.Draw(out)
        l, t, r, b = d.textbbox((0, 0), text, font=font, anchor='ls')
        base = ty1 + 1
        x = tx0 if align == 'left' else (tx0 + tx1) / 2 - (r - l) / 2
        d.text((x, base), text, font=font, fill=color, anchor='ls')
    out.save(os.path.join(DST, name.replace('demo-', 'media-')))
    print(name, 'label', (tx0, ty0, tx1, ty1), 'color', color)

os.makedirs(DST, exist_ok=True)
for n, (box, text, align) in JOBS.items():
    fix(n, box, text, align)
