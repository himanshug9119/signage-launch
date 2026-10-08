// Shared by index.html (visuals) and audio.py (soundtrack). Keep it valid JSON after "window.TL = ".
// Cut entry: [scene, seconds, speed, offset]. The scene's own clock runs as  u = offset + localTime * speed,
// so a short cut can play a scene faster (speed > 1) or start part-way in (offset > 0).
window.TL = {
  "fps": 30,
  "cuts": {
    "long": [
      ["hook", 8], ["problem", 6], ["logo", 8], ["overview", 10], ["pair", 15], ["content", 13],
      ["daypart", 12], ["instant", 10], ["takeover", 12], ["health", 12], ["overlays", 8], ["pricing", 8], ["cta", 8]
    ],
    "short": [
      ["hook", 6, 1.33], ["logo", 6, 1.33], ["pair", 10, 1.5], ["daypart", 8, 1.5], ["instant", 7, 1.43],
      ["takeover", 8, 1.5], ["health", 6, 1], ["pricing", 4, 1, 4], ["cta", 5, 1.6]
    ]
  },
  "sfx": {
    "hook":     [[3.1, "sting", 0.8]],
    "problem":  [[2.0, "swipe"], [2.5, "swipe"]],
    "logo":     [[0.0, "impact"], [2.2, "type"]],
    "overview": [[0.4, "swoosh"], [4.6, "swoosh"], [5.2, "tick4"]],
    "pair":     [[1.2, "click"], [1.8, "type"], [4.3, "click"], [4.6, "ping"], [5.6, "type"], [7.8, "click"], [8.3, "ping_hi"], [9.8, "ping"]],
    "content":  [[1.0, "click"], [1.6, "tick4"], [6.0, "swoosh"], [8.4, "click"], [9.6, "drop"]],
    "daypart":  [[3.66, "ping"], [7.23, "ping"]],
    "instant":  [[2.4, "click"], [3.0, "drop"], [4.0, "click"], [5.1, "ping_hi"]],
    "takeover": [[1.5, "click"], [2.2, "click"], [3.2, "click"], [4.2, "click"], [4.3, "alarm"], [4.3, "impact"], [8.6, "ping"]],
    "health":   [[1.6, "glitch"], [3.6, "ping"], [6.2, "swoosh"], [6.4, "click"]],
    "overlays": [[1.2, "click"], [2.0, "ping"], [2.6, "click"], [3.0, "type"]],
    "pricing":  [[0.6, "tick4"], [4.0, "swoosh"]],
    "cta":      [[0.0, "impact_soft"], [1.6, "ping"]]
  }
};
