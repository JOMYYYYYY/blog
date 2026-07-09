import type { APIRoute } from "astro";

export const prerender = true;

const config = `backend:
  name: github
  repo: JOMYYYYYY/blog
  branch: master
  base_url: https://www.tanyaxing.com/api

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
      - { label: Slug, name: slug, widget: string, pattern: ["^[a-z0-9]+(?:-[a-z0-9]+)*$", "Use lowercase letters, numbers, and hyphens only"] }
      - { label: Description, name: description, widget: string }
      - { label: Publish Date, name: pubDate, widget: datetime, format: "YYYY-MM-DD" }
      - label: Legacy Slugs
        name: legacySlugs
        widget: list
        required: false
        hint: Old URLs that should redirect to this post, without /blog/.
        field: { label: Legacy Slug, name: legacySlug, widget: string }
      - label: Tags
        name: tags
        widget: list
        required: false
        field: { label: 添加标签, name: tag, widget: string }
      - { label: Draft, name: draft, widget: boolean, default: false, required: false }
      - { label: Body, name: body, widget: markdown }
`;

export const GET: APIRoute = () => {
  return new Response(config, {
    headers: { "Content-Type": "text/yaml; charset=utf-8" },
  });
};
