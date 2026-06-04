import type { APIRoute } from "astro";
import fs from "node:fs";
import path from "node:path";

export const prerender = true;

function extractTags(): string[] {
  const blogDir = path.join(process.cwd(), "src", "content", "blog");
  try {
    const files = fs.readdirSync(blogDir);
    const tags = new Set<string>();
    for (const file of files) {
      if (!file.endsWith(".md") && !file.endsWith(".mdx")) continue;
      const content = fs.readFileSync(path.join(blogDir, file), "utf-8");
      const match = content.match(/^---\n([\s\S]*?)\n---/);
      if (!match) continue;
      const fm = match[1];
      const tagMatch = fm.match(/tags:\s*\[([\s\S]*?)\]/);
      if (!tagMatch) continue;
      tagMatch[1].split(",").forEach(t => {
        const tag = t.trim().replace(/^["']|["']$/g, "");
        if (tag) tags.add(tag);
      });
    }
    return Array.from(tags).sort();
  } catch {
    return [];
  }
}

const tags = extractTags();
const tagsOptions = tags.map(t => `          - ${t}`).join("\n");

const config = `backend:
  name: github
  repo: JOMYYYYYY/blog
  branch: master
  base_url: https://tanyaxing.com/api

publish_mode: editorial_workflow

media_folder: public/img
public_folder: /img

collections:
  - name: blog
    label: Blog
    folder: src/content/blog
    create: true
    delete: true
    extension: md
    format: frontmatter
    slug: "{{slug}}"
    preview_path: blog/{{slug}}
    editor:
      preview: false
    fields:
      - { label: Title, name: title, widget: string }
      - { label: Description, name: description, widget: string }
      - { label: Publish Date, name: pubDate, widget: datetime, format: "YYYY-MM-DD" }
      - label: Tags
        name: tags
        widget: select
        multiple: true
        required: false
        options:
${tagsOptions}
      - { label: Draft, name: draft, widget: boolean, default: false, required: false }
      - { label: Body, name: body, widget: markdown }
`;

export const GET: APIRoute = () => {
  return new Response(config, {
    headers: { "Content-Type": "text/yaml; charset=utf-8" },
  });
};
