#!/bin/bash
# Package RodLab Studio PWA — v8.3.0 → rodlab-studio-pwa-v14.zip
set -euo pipefail

PROJ=/home/z/my-project
OLD_ZIP=$PROJ/download/rodlab-studio-pwa-v13.zip
NEW_ZIP=$PROJ/download/rodlab-studio-pwa-v14.zip
STAGE=$PROJ/.zstaging-v14

rm -rf "$STAGE" "$NEW_ZIP"
mkdir -p "$STAGE"

# 1) Liste des fichiers du ZIP v11 comme base
unzip -Z1 "$OLD_ZIP" | grep -v '^$' | sort -u > "$STAGE/_filelist.txt"

# 2) Copier chaque fichier : priorité au projet actuel, sinon extraire du ZIP v11
while IFS= read -r f; do
  mkdir -p "$STAGE/$(dirname "$f")"
  if [ -f "$PROJ/$f" ]; then
    cp "$PROJ/$f" "$STAGE/$f"
  else
    unzip -p "$OLD_ZIP" "$f" > "$STAGE/$f" 2>/dev/null || echo "MANQUANT: $f" >> "$STAGE/_missing.txt"
  fi
done < "$STAGE/_filelist.txt"

# 3) Nouveaux fichiers v8.3 (chatbot)
mkdir -p "$STAGE/src/app/api/chat" "$STAGE/src/components/chat"
cp "$PROJ/src/app/api/chat/route.ts" "$STAGE/src/app/api/chat/route.ts"
cp "$PROJ/src/components/chat/chat-widget.tsx" "$STAGE/src/components/chat/chat-widget.tsx"
cp "$PROJ/src/lib/rodbot-local.ts" "$STAGE/src/lib/rodbot-local.ts"

# 4) .env du ZIP v11 (complet : secret + VAPID) réutilisé tel quel
unzip -p "$OLD_ZIP" .env > "$STAGE/.env"

# 5) Vérifs clés avant zip
echo "── Vérifications ──"
for f in .env .env.example README.md package.json public/sw.js src/app/layout.tsx \
         src/components/pwa/pwa-register.tsx src/app/api/chat/route.ts \
         src/components/chat/chat-widget.tsx db/custom.db; do
  [ -f "$STAGE/$f" ] && echo "OK  $f" || echo "ABSENT!  $f"
done

grep -o '"version": "[^"]*"' "$STAGE/package.json"
grep -o 'const VERSION = "[^"]*"' "$STAGE/public/sw.js"

# 6) Créer le ZIP (depuis le staging, chemins relatifs, sans entrées de répertoires)
cd "$STAGE"
zip -r -q -X "$NEW_ZIP" . -x "_filelist.txt" -x "_missing.txt" -x "*/"
cd "$PROJ"

# 7) Contrôle d'intégrité
unzip -t "$NEW_ZIP" > /dev/null && echo "INTEGRITE: OK"
echo "FICHIERS: $(unzip -Z1 "$NEW_ZIP" | grep -vc '^$')"
ls -lh "$NEW_ZIP" | awk '{print "TAILLE: " $5}'

# 8) Nettoyage
rm -rf "$STAGE"
