#!/usr/bin/env python3
"""RODLAB STUDIO — Régénération de src/lib/bootstrap-schema.ts depuis la base SQLite réelle.
Usage : python3 scripts/gen-bootstrap-schema.py
"""
import sqlite3, os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB = os.path.join(ROOT, "db", "custom.db")
OUT = os.path.join(ROOT, "src", "lib", "bootstrap-schema.ts")

con = sqlite3.connect(DB)
rows = con.execute(
    "SELECT type, name, sql FROM sqlite_master "
    "WHERE sql IS NOT NULL AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_prisma%' "
    "ORDER BY CASE WHEN type='table' THEN 0 ELSE 1 END, name"
).fetchall()
con.close()

stmts = []
for typ, name, sql in rows:
    sql = re.sub(r"\s+", " ", sql).strip()
    # Format identique à l'ancien fichier : apostrophes SQL échappées avec backslash
    stmts.append(sql.replace("\\", "\\\\"))

lines = []
for s in stmts:
    lines.append("  `" + s + "`")
body = ",\n".join(lines)

ts = f"""/**
 * RODLAB STUDIO — Schéma SQLite embarqué (généré depuis prisma db push)
 * Utilisé par src/lib/bootstrap.ts pour auto-créer la base si elle est absente,
 * afin que la connexion fonctionne même sans avoir lancé les scripts de setup.
 * Régénération : python3 scripts/gen-bootstrap-schema.py
 */

export const SCHEMA_STATEMENTS: string[] = [
{body},
];
"""

with open(OUT, "w", encoding="utf-8") as f:
    f.write(ts)

print(f"[bootstrap-schema] {len(stmts)} statements écrits dans {os.path.relpath(OUT, ROOT)}")
