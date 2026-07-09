// Post-build step: make the SPA readable to AI agents and no-JS crawlers.
// Generates dist/llms.txt and dist/sitemap.xml from the lesson data, and
// injects JSON-LD plus a static, crawlable snapshot of the Home page into
// dist/index.html (React's createRoot replaces it on mount).
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const SITE = "https://vim007.zayarnaing-pp.workers.dev";

const lessons = readdirSync(join(root, "src/lessons"))
  .filter((f) => /^\d+-.*\.json$/.test(f))
  .map((f) => JSON.parse(readFileSync(join(root, "src/lessons", f), "utf8")))
  .sort((a, b) => a.order - b.order);

const totalExercises = lessons.reduce((n, l) => n + l.exercises.length, 0);
const description = `Learn Vim in your browser with a real editor: ${lessons.length} lessons and ${totalExercises} hands-on exercises with instant feedback, keystroke-efficiency ranks, and progress tracking. Free, no signup, no backend.`;

/* ---------- sitemap.xml ---------- */
const urls = ["/", "/progress", ...lessons.map((l) => `/lesson/${l.slug}`)];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${SITE}${u}</loc></url>`).join("\n")}
</urlset>
`;
writeFileSync(join(dist, "sitemap.xml"), sitemap);

/* ---------- llms.txt ---------- */
const llms = `# Vim TypeTutor

> ${description}

Vim TypeTutor is a single-page web app (React + CodeMirror 6 with full Vim
emulation). Each exercise drops the user into a real editor with a small task —
move the cursor somewhere, transform the buffer — and validates the outcome,
not the keystroke sequence, so any valid Vim solution counts. Solutions are
ranked S/A/B/C by keystroke count against par. Every lesson ends with a free-key
practice session. Progress is stored locally in the browser (no accounts).

## Curriculum (${lessons.length} lessons, ${totalExercises} exercises)

${lessons
  .map(
    (l) =>
      `- [Lesson ${l.order}: ${l.title}](${SITE}/lesson/${l.slug}): ${l.summary} Teaches: ${l.keys.join(", ")}. ${l.exercises.length} exercises.`
  )
  .join("\n")}

## Pages

- [Home](${SITE}/): lesson list with completion status
- [Progress](${SITE}/progress): per-skill proficiency, practice suggestions, HTML report export

## Source

- [GitHub repository](https://github.com/ZayYarNaing98/vim007)
`;
writeFileSync(join(dist, "llms.txt"), llms);

/* ---------- markdown for content negotiation (Accept: text/markdown) ---------- */
mkdirSync(join(dist, "md/lesson"), { recursive: true });
writeFileSync(join(dist, "md/index.md"), llms);
writeFileSync(
  join(dist, "md/progress.md"),
  `# Vim TypeTutor — Progress\n\nProgress is stored locally in the visitor's browser (localStorage); there is no server-side account. The Progress page shows per-skill proficiency with daily decay, suggests what to practice next, and exports a self-contained HTML report.\n\n[Open the app](${SITE}/progress)\n`
);
for (const l of lessons) {
  const core = l.exercises.filter((e) => !e.practice);
  const practice = l.exercises.filter((e) => e.practice);
  const md = `# Lesson ${l.order}: ${l.title}

> ${l.summary}

${l.intro}

Teaches: ${l.keys.map((k) => `\`${k}\``).join(", ")} · Category: ${l.category}

## Exercises (${core.length})

${core.map((e, i) => `${i + 1}. ${e.instruction} (par: ${e.parKeystrokes} keystrokes)`).join("\n")}

## Practice session (${practice.length})

${practice.map((e, i) => `${i + 1}. ${e.instruction} (par: ${e.parKeystrokes} keystrokes)`).join("\n")}

[Do this lesson interactively](${SITE}/lesson/${l.slug})
`;
  writeFileSync(join(dist, "md/lesson", `${l.slug}.md`), md);
}

/* ---------- index.html: JSON-LD + static snapshot ---------- */
const esc = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Vim TypeTutor",
  url: SITE,
  description,
  applicationCategory: "EducationalApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  hasPart: lessons.map((l) => ({
    "@type": "LearningResource",
    name: `Lesson ${l.order}: ${l.title}`,
    url: `${SITE}/lesson/${l.slug}`,
    description: l.summary,
  })),
};

const staticHome = `<div class="page static-snapshot">
      <div class="hero">
        <p class="hero-eyebrow">Learn by doing</p>
        <h1>Master Vim, one motion at a time</h1>
        <p class="hero-sub">A real editor, real keybindings, instant feedback. Pick a lesson and build the muscle memory that makes editing feel effortless. ${lessons.length} lessons, ${totalExercises} exercises, free and no signup.</p>
      </div>
      <ul>
${lessons
  .map(
    (l) =>
      `        <li><a href="/lesson/${l.slug}">Lesson ${l.order}: ${esc(l.title)}</a> — ${esc(l.summary)} (${esc(l.keys.join(" "))})</li>`
  )
  .join("\n")}
      </ul>
      <p><a href="/progress">Your progress</a> · <a href="https://github.com/ZayYarNaing98/vim007">Source on GitHub</a></p>
    </div>`;

const indexPath = join(dist, "index.html");
let html = readFileSync(indexPath, "utf8");
html = html.replace(
  "</head>",
  `  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>\n  </head>`
);
const marker = '<div id="root"></div>';
if (!html.includes(marker)) throw new Error("agentify: #root marker not found in dist/index.html");
html = html.replace(marker, `<div id="root">${staticHome}</div>`);
writeFileSync(indexPath, html);

console.log(
  `agentify: sitemap.xml (${urls.length} urls), llms.txt, ${lessons.length + 2} markdown pages, JSON-LD + static home injected`
);
