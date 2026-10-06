#!/bin/bash
# Recherche d'images pour RodLab Studio v7 — 2 vagues en parallèle
OUT=/home/z/my-project/scripts/img-json
mkdir -p "$OUT"

z() { # name query count
  z-ai image-search -q "$2" --count "$3" --gl us -o "$OUT/$1.json" 2>"$OUT/$1.err" && echo "OK $1" || echo "FAIL $1"
}

# ——— Vague 1 ———
z hero "african web design agency team working together on laptops in a bright modern creative office" 8 &
z kafo "african woman selling colorful fashion clothing market stall smartphone" 6 &
z hotel "luxury tropical beach resort hotel swimming pool palm trees sunset" 6 &
z clinique "modern medical clinic reception desk doctor with tablet africa" 6 &
z delivery "delivery motorbike scooter rider with package box city street africa" 6 &
z ecole "african students learning computers in a bright classroom" 6 &
z pharma "modern pharmacy interior shelves with medicine products" 6 &
z svc-design "graphic designer desk with color palette swatches brand identity moodboard" 6 &
z svc-dev "web developer coding on laptop with code on screen close up" 6 &
z svc-formation "professional training workshop adults learning on computers africa" 6 &
wait

# ——— Vague 2 ———
z svc-social "social media content creator filming smartphone ring light flatlay" 6 &
z blog-siteweb "small business owner standing in front of shop store africa entrepreneur" 6 &
z blog-mobilemoney "hand holding smartphone mobile money payment africa fintech" 6 &
z blog-pwa "hand holding smartphone showing mobile app interface" 6 &
z blog-checklist "laptop notebook checklist planning on clean desk workspace" 6 &
z about-office "creative startup team brainstorming around table with sticky notes" 6 &
z portrait-man "professional headshot portrait african businessman smiling office" 8 &
z portrait-woman "professional headshot portrait african businesswoman smiling office" 8 &
z lome "aerial view of lome togo city coastline" 6 &
wait

echo "=== DONE ==="
