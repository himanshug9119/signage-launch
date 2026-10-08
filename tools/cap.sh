#!/bin/zsh
# cap.sh shot <outfile.png>          -> 1920x1080 PNG of the Chrome page area
# cap.sh rec  <outfile.mp4> <secs>   -> screen recording of the Chrome page area, 1920x1080 30fps
R="0,171,1672,941"
mode=$1; out=$2
osascript -e 'tell application "Google Chrome" to activate' >/dev/null 2>&1
sleep 0.4
if [[ $mode == shot ]]; then
  screencapture -x -t png -R$R /tmp/_cap.png && sips -z 1080 1920 /tmp/_cap.png --out "$out" >/dev/null && echo "ok $out"
else
  secs=${3:-15}
  screencapture -x -v -V $secs -R$R /tmp/_rec.mov && \
  ffmpeg -y -loglevel error -i /tmp/_rec.mov -vf "scale=1920:1080:flags=lanczos,fps=30" -c:v libx264 -crf 20 -preset medium -pix_fmt yuv420p -an "$out" && echo "ok $out"
fi
