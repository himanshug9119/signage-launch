#!/usr/bin/env bash
# Builds all four ScreenSetu launch videos into ../ (video/).
#   ./build.sh            -> long+short, landscape+portrait
#   ./build.sh long l     -> just one
set -euo pipefail
cd "$(dirname "$0")"
export NODE_PATH=${NODE_PATH:-/opt/node22/lib/node_modules}
python3 prep_media.py >/dev/null
cuts=${1:-"long short"}; orients=${2:-"l p"}
name() { local c=$1 o=$2; local len=$([ "$c" = long ] && echo 2min || echo 1min); local f=$([ "$o" = l ] && echo 16x9 || echo 9x16); echo "ScreenSetu-Launch-$len-$f.mp4"; }
for c in $cuts; do
  python3 audio.py "$c"
  for o in $orients; do
    node render.js video "$c" "$o" 4
    ffmpeg -loglevel error -y -i "out/$c-$o-silent.mp4" -i "out/audio-$c.wav" -af loudnorm=I=-14:TP=-1.5:LRA=11 \
      -c:v copy -c:a aac -b:a 192k -ar 48000 -shortest -movflags +faststart "../$(name "$c" "$o")"
    echo "built ../$(name "$c" "$o")"
  done
done
