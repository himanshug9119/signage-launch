#!/bin/zsh
# cap.sh shot <out.png> <top> <height>          -> PNG of the Chrome page area, 1920 px wide
# cap.sh rec  <out.mp4> <top> <height> <secs>   -> recording of the page area, 1920 px wide, 30 fps
# <top>/<height> are logical points: top = screenY + outerHeight - innerHeight, height = innerHeight
# (read them from the page with JS right before capturing; Chrome's info bars move the page area).
mode=$1; out=$2; Y=${3:-219}; HH=${4:-893}
osascript -e 'tell application "Google Chrome" to activate' >/dev/null 2>&1
sleep 0.4
if [[ $mode == shot ]]; then
  screencapture -x -t png /tmp/_full.png || exit 1
  ffmpeg -y -loglevel error -i /tmp/_full.png -vf "crop=3420:$((HH*2)):0:$((Y*2)),scale=1920:-2:flags=lanczos" "$out" && echo "ok $out"
else
  secs=${5:-15}
  screencapture -x -v -V $secs /tmp/_rec_$$.mov && \
  ffmpeg -y -loglevel error -i /tmp/_rec_$$.mov -vf "crop=iw:trunc(ih*${HH}/1112/2)*2:0:ih*${Y}/1112,scale=1920:-2:flags=lanczos,fps=30" -c:v libx264 -crf 20 -preset medium -pix_fmt yuv420p -an "$out" && echo "ok $out"
fi
