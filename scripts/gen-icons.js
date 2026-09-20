/* eslint-disable @typescript-eslint/no-require-imports */
// Génère les icônes PWA de RodLab Studio à partir du logo officiel
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const SRC = "/home/z/my-project/public/images/logo-original.png";
const OUT = "/home/z/my-project/public/icons";

async function main() {
  fs.mkdirSync(OUT, { recursive: true });

  // Fond crème de marque pour les icônes
  const cream = { r: 250, g: 246, b: 238, alpha: 1 };

  // 1) Icônes standard (logo sur fond crème)
  for (const size of [192, 256, 384, 512]) {
    const pad = Math.round(size * 0.06);
    const inner = size - pad * 2;
    const resized = await sharp(SRC).resize(inner, inner, { fit: "contain", background: cream }).toBuffer();
    await sharp({
      create: { width: size, height: size, channels: 4, background: cream },
    })
      .composite([{ input: resized, left: pad, top: pad }])
      .png()
      .toFile(path.join(OUT, `icon-${size}.png`));
  }

  // 2) Maskable (logo réduit dans la zone sûre 80%)
  for (const size of [192, 512]) {
    const inner = Math.round(size * 0.72);
    const offset = Math.round((size - inner) / 2);
    const resized = await sharp(SRC).resize(inner, inner, { fit: "contain", background: cream }).toBuffer();
    await sharp({
      create: { width: size, height: size, channels: 4, background: cream },
    })
      .composite([{ input: resized, left: offset, top: offset }])
      .png()
      .toFile(path.join(OUT, `maskable-${size}.png`));
  }

  // 3) Apple touch icon 180
  const resizedApple = await sharp(SRC).resize(180, 180, { fit: "contain", background: cream }).toBuffer();
  await sharp({ create: { width: 180, height: 180, channels: 4, background: cream } })
    .composite([{ input: resizedApple, left: 0, top: 0 }])
    .png()
    .toFile(path.join(OUT, "apple-touch-icon.png"));

  // 4) Favicon 64 + logo brut
  await sharp(SRC).resize(64, 64).png().toFile(path.join(OUT, "favicon-64.png"));
  await sharp(SRC).resize(512, 512).png().toFile(path.join(OUT, "logo-mark.png"));

  console.log("OK — icônes PWA générées:", fs.readdirSync(OUT).join(", "));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
