#!/usr/bin/env node
/* Génère les photos du site RodLab Studio v7 via z-ai CLI + post-traitement sharp.
 * Concurrency 4, 2 retries par image, sortie JPEG optimisée dans public/images/site/
 */
const { execFile } = require("child_process");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const TMP = "/home/z/my-project/scripts/img-gen";
const OUT = "/home/z/my-project/public/images/site";
fs.mkdirSync(TMP, { recursive: true });
fs.mkdirSync(OUT, { recursive: true });

const L = "1344x768";   // paysage cartes / sections
const W = "1440x720";   // bandeau large
const P = "864x1152";   // portrait équipe
const S = "1024x1024";  // avatar carré

const IMAGES = [
  { id: "hero-agence", size: L, w: 1280, prompt: "Professional photograph of a modern creative web agency office in West Africa, three young African designers and developers collaborating around laptops on a wooden table, bright natural light, warm terracotta and green accents, plants, candid atmosphere, photorealistic, high quality, no text" },
  { id: "real-kafo-market", size: L, w: 1280, prompt: "African woman entrepreneur in her colorful fashion boutique, holding a smartphone, shelves with vibrant African wax fabric clothing and accessories, warm natural light, joyful, photorealistic, high quality, no text" },
  { id: "real-hotel-palm-beach", size: L, w: 1280, prompt: "Luxury tropical beach resort hotel, infinity swimming pool lined with palm trees, white loungers and parasols, golden hour light, serene and inviting, photorealistic, high quality, no text" },
  { id: "real-clinique-sante", size: L, w: 1280, prompt: "Modern medical clinic reception, friendly African female doctor in white coat holding a tablet, clean bright interior with green plants, welcoming, photorealistic, high quality, no text" },
  { id: "real-togo-deliveries", size: L, w: 1280, prompt: "Motorbike delivery rider with a large orange delivery box riding through a busy West African city street, tropical light, sense of motion, photorealistic, high quality, no text" },
  { id: "real-academie-horizon", size: L, w: 1280, prompt: "African students in a bright modern computer classroom, rows of laptops, young teacher helping a student, focused and smiling, photorealistic, high quality, no text" },
  { id: "real-pharma-lome", size: L, w: 1280, prompt: "Modern pharmacy interior, clean organized shelves with medicine boxes, African pharmacist in white coat advising a customer at the counter, bright, photorealistic, high quality" },
  { id: "svc-design", size: L, w: 1280, prompt: "Graphic designer workspace seen from above, color palette swatches, sketchbook with logo sketches, graphics tablet with stylus, warm terracotta and cream tones, photorealistic, high quality, no text" },
  { id: "svc-dev", size: L, w: 1280, prompt: "Close-up of a web developer hands typing on a laptop keyboard with colorful code on screen, second monitor with website design, dark modern desk, soft bokeh lights, photorealistic, high quality" },
  { id: "svc-formation", size: L, w: 1280, prompt: "Professional training workshop in West Africa, small group of young adults following a lesson on laptops, trainer presenting near a whiteboard, bright modern room, photorealistic, high quality, no text" },
  { id: "svc-social", size: L, w: 1280, prompt: "Young African woman content creator filming a product video with a smartphone on a tripod and a ring light, colorful props around, modern studio, photorealistic, high quality, no text" },
  { id: "blog-site-web", size: L, w: 1280, prompt: "Proud African small business owner standing at the door of his shop holding a smartphone, colorful street scene, warm afternoon light, photorealistic, high quality, no text" },
  { id: "blog-mobile-money", size: L, w: 1280, prompt: "Close-up of African hands holding a smartphone making a contactless mobile money payment, colorful market stall blurred in background, photorealistic, high quality, no text" },
  { id: "blog-pwa", size: L, w: 1280, prompt: "Hand holding a smartphone showing a colorful abstract mobile app interface, modern wooden desk background, shallow depth of field, photorealistic, high quality, no readable text" },
  { id: "blog-checklist", size: L, w: 1280, prompt: "Clean minimal desk with an open laptop, a notebook with a checked checklist and a pen, coffee cup, soft morning light, photorealistic, high quality, no readable text" },
  { id: "about-equipe", size: L, w: 1280, prompt: "Creative team brainstorming around a glass wall covered with colorful sticky notes, African startup office, laughter and energy, photorealistic, high quality, no text" },
  { id: "about-bureau", size: L, w: 1280, prompt: "Cozy modern creative agency lounge, terracotta accent wall, green plants, wooden shelves, African woven decor, warm sunlight through large windows, photorealistic, high quality, no text" },
  { id: "why-us", size: L, w: 1280, prompt: "African account manager shaking hands with a smiling client across a wooden table with a laptop, bright office, trust and partnership, photorealistic, high quality, no text" },
  { id: "cta-lome", size: W, w: 1440, prompt: "Aerial panoramic view of Lome Togo coastline, palm trees along the ocean, city rooftops at golden hour, warm cinematic light, photorealistic, high quality, no text" },
  { id: "team-rodrigue", size: P, w: 720, prompt: "Professional portrait of a confident African man in his early thirties, software developer, glasses, casual smart navy shirt, warm terracotta studio background, soft light, photorealistic, high quality" },
  { id: "team-afi", size: P, w: 720, prompt: "Professional portrait of a creative African woman designer with natural hair, elegant mustard blouse, jewelry, warm deep green studio background, soft light, photorealistic, high quality" },
  { id: "team-komlan", size: P, w: 720, prompt: "Professional portrait of a friendly African man in his late twenties, mobile app developer, denim shirt, warm golden studio background, soft light, photorealistic, high quality" },
  { id: "team-sika", size: P, w: 720, prompt: "Professional portrait of a smiling African woman communications specialist with braided hair, smart terracotta blazer, warm cream studio background, soft light, photorealistic, high quality" },
  { id: "avatar-aicha", size: S, w: 400, sq: true, prompt: "Portrait of a smiling African businesswoman in her forties, market entrepreneur wearing a colorful headwrap, natural light, photorealistic, high quality" },
  { id: "avatar-kodjo", size: S, w: 400, sq: true, prompt: "Portrait of an African male doctor in his fifties with glasses and a white coat, warm confident smile, clinic background blurred, photorealistic, high quality" },
  { id: "avatar-yao", size: S, w: 400, sq: true, prompt: "Portrait of a distinguished African hotel owner in his sixties, elegant cream linen shirt, warm smile, tropical hotel background blurred, photorealistic, high quality" },
];

function run(cmd, args) {
  return new Promise((resolve) => {
    execFile(cmd, args, { timeout: 240000 }, (err, stdout, stderr) => {
      resolve({ err, stdout: stdout?.toString() ?? "", stderr: stderr?.toString() ?? "" });
    });
  });
}

async function generateOne(img) {
  const png = path.join(TMP, `${img.id}.png`);
  for (let attempt = 1; attempt <= 3; attempt++) {
    if (fs.existsSync(png) && fs.statSync(png).size > 30000) return { id: img.id, ok: true, reused: true };
    const r = await run("z-ai", ["image", "-p", img.prompt, "-o", png, "-s", img.size]);
    if (!r.err && fs.existsSync(png) && fs.statSync(png).size > 30000) return { id: img.id, ok: true };
    console.error(`  ✗ ${img.id} tentative ${attempt} échouée${r.err ? " : " + r.err.message : ""}`);
    await new Promise((res) => setTimeout(res, 4000 * attempt));
  }
  return { id: img.id, ok: false };
}

async function postProcess(img) {
  const png = path.join(TMP, `${img.id}.png`);
  const out = path.join(OUT, `${img.id}.jpg`);
  let pipe = sharp(png).resize(img.sq ? { width: img.w, height: img.w, fit: "cover" } : { width: img.w });
  await pipe.jpeg({ quality: 80, mozjpeg: true }).toFile(out);
  return out;
}

async function main() {
  // concurrence 4
  const queue = [...IMAGES];
  const results = [];
  const workers = Array.from({ length: 4 }, async () => {
    while (queue.length) {
      const img = queue.shift();
      console.log(`→ génération ${img.id}…`);
      results.push(await generateOne(img));
    }
  });
  await Promise.all(workers);

  const failed = results.filter((r) => !r.ok);
  console.log(`\nGénérées : ${results.filter((r) => r.ok).length}/${IMAGES.length}, échecs : ${failed.map((f) => f.id).join(", ") || "aucun"}`);
  if (failed.length) process.exitCode = 2;

  // post-traitement
  for (const img of IMAGES) {
    const png = path.join(TMP, `${img.id}.png`);
    if (!fs.existsSync(png)) continue;
    const out = await postProcess(img);
    const kb = Math.round(fs.statSync(out).size / 1024);
    console.log(`✓ ${img.id}.jpg ${kb} Ko`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
