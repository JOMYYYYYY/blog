import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import pagefind from "astro-pagefind";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

function getLegacyBlogPaths() {
  const blogDir = join(process.cwd(), "src/content/blog");
  return readdirSync(blogDir)
    .filter((file) => /\.(md|mdx)$/.test(file))
    .flatMap((file) => {
      const content = readFileSync(join(blogDir, file), "utf8");
      const match = content.match(/^legacySlugs:\n((?:  - .+\n?)+)/m);
      if (!match) return [];

      return match[1]
        .split("\n")
        .map((line) => line.match(/^  - (.+)$/)?.[1])
        .filter(Boolean)
        .map((slug) => `/blog/${slug}/`);
    });
}

const legacyBlogPaths = getLegacyBlogPaths();

export default defineConfig({
  site: "https://tanyaxing.com",
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => {
        const url = new URL(page);
        return !legacyBlogPaths.includes(decodeURI(url.pathname));
      },
    }),
    pagefind(),
  ],
});
