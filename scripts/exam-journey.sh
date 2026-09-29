#!/bin/bash
# Parcours complet de l'examen final (24 questions, toutes correctes)
set -u
AB="agent-browser"

answers=(1 2 2 1 0 1 0 2 1 2 1 1 0 1 1 0 1 1 1 1 0 1 1 1)

for i in "${!answers[@]}"; do
  qn=$((i + 1))
  # Aller à la question qn via le saut rapide (sauf si on y est déjà)
  $AB find role button click --name "Aller à la question ${qn}" >/dev/null 2>&1
  sleep 0.4
  refs=$($AB snapshot -i 2>/dev/null | rg -o 'radio "[^"]+" \[checked=false, ref=(e[0-9]+)\]' -r '$1')
  mapfile -t refarr <<< "$refs"
  idx=${answers[$i]}
  target="${refarr[$idx]:-}"
  if [ -z "$target" ]; then
    echo "Q$qn : AUCUNE REF"
    continue
  fi
  $AB click "@$target" >/dev/null
  echo "Q$qn -> option $((idx + 1))"
done

# Soumettre
$AB find role button click --name "Soumettre mes réponses"
sleep 3
echo "--- Résultat ---"
$AB snapshot 2>&1 | rg -i "félicitations|presque|bonnes réponses|Voir mon certificat|Télécharger le PDF" | head -6
