import { lessons } from "./lessons";

/**
 * WebMCP: expose the curriculum as in-page tools via the experimental
 * navigator.modelContext API (https://webmachinelearning.github.io/webmcp/).
 * Silently does nothing in browsers that don't implement it.
 */

type WebMcpContent = { content: { type: "text"; text: string }[] };

const asText = (data: unknown): WebMcpContent => ({
  content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
});

export function registerWebMcpTools(): void {
  const modelContext = (
    navigator as Navigator & {
      modelContext?: { provideContext: (ctx: unknown) => void };
    }
  ).modelContext;
  if (!modelContext?.provideContext) return;

  try {
    modelContext.provideContext({
      tools: [
        {
          name: "list_lessons",
          description:
            "List all Vim TypeTutor lessons: slug, title, category, summary, taught keys, and exercise counts.",
          inputSchema: { type: "object", properties: {} },
          async execute() {
            return asText(
              lessons.map((l) => ({
                slug: l.slug,
                title: l.title,
                category: l.category,
                summary: l.summary,
                keys: l.keys,
                exercises: l.exercises.length,
              }))
            );
          },
        },
        {
          name: "get_lesson",
          description:
            "Get one lesson by slug, including its intro and every exercise (instruction, initial code, goal, par keystrokes).",
          inputSchema: {
            type: "object",
            properties: {
              slug: { type: "string", description: 'Lesson slug, e.g. "survival".' },
            },
            required: ["slug"],
          },
          async execute({ slug }: { slug: string }) {
            const lesson = lessons.find((l) => l.slug === slug);
            return asText(lesson ?? { error: `Unknown slug "${slug}". Use list_lessons.` });
          },
        },
        {
          name: "open_lesson",
          description: "Navigate the app to a lesson page so the user can practice it.",
          inputSchema: {
            type: "object",
            properties: {
              slug: { type: "string", description: 'Lesson slug, e.g. "survival".' },
            },
            required: ["slug"],
          },
          async execute({ slug }: { slug: string }) {
            if (!lessons.some((l) => l.slug === slug)) {
              return asText({ error: `Unknown slug "${slug}". Use list_lessons.` });
            }
            window.location.assign(`/lesson/${slug}`);
            return asText({ ok: true, opened: `/lesson/${slug}` });
          },
        },
      ],
    });
  } catch {
    // Experimental API — never let registration break the app.
  }
}
