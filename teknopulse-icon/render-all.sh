#!/bin/bash
# TeknoPulse — regenerasi semua PNG dari SVG (butuh resvg-js CLI).
# Pakai: ./render-all.sh
# Override path resvg bila perlu: RESVG=/path/ke/resvg-js ./render-all.sh
set -e
cd "$(dirname "$0")"
RESVG="${RESVG:-$HOME/.npm/_npx/b640e5227d1ae726/node_modules/.bin/resvg-js}"
if [ ! -x "$RESVG" ]; then
  echo "resvg-js CLI tidak ditemukan di: $RESVG"
  echo "Set variabel RESVG ke path resvg-js Anda, contoh: RESVG=\$(which resvg-js) ./render-all.sh"
  exit 1
fi

# favicon 16/32 dari sumber garis tebal
"$RESVG" teknopulse-favicon.svg teknopulse-icon-16.png --fit-width 16
"$RESVG" teknopulse-favicon.svg teknopulse-icon-32.png --fit-width 32

# set persegi full-bleed
for s in 48 64 128 180 192 256 512 1024; do
  "$RESVG" teknopulse-icon.svg "teknopulse-icon-$s.png" --fit-width $s
done

# rounded
for s in 128 256 512 1024; do
  "$RESVG" teknopulse-icon-rounded.svg "teknopulse-icon-rounded-$s.png" --fit-width $s
done

# maskable
for s in 192 512; do
  "$RESVG" teknopulse-icon-maskable.svg "teknopulse-icon-maskable-$s.png" --fit-width $s
done

# mark
for s in 256 512; do
  "$RESVG" teknopulse-mark.svg "teknopulse-mark-$s.png" --fit-width $s
done

# alternatif (gelap)
"$RESVG" alternatif/teknopulse-icon-dark.svg alternatif/teknopulse-icon-dark-512.png --fit-width 512
"$RESVG" alternatif/teknopulse-icon-dark.svg alternatif/teknopulse-icon-dark-1024.png --fit-width 1024
for s in 256 512; do
  "$RESVG" alternatif/teknopulse-mark-putih.svg "alternatif/teknopulse-mark-putih-$s.png" --fit-width $s
done

echo "Selesai — semua PNG diperbarui."
