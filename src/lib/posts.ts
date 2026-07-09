import type { CollectionEntry } from "astro:content";

type BlogPost = CollectionEntry<"blog">;

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const reservedSlugs = new Set(["admin", "api", "blog", "index", "rss", "rss.xml", "search"]);

export function sortPosts(posts: BlogPost[]) {
  return posts.sort((a, b) => {
    const d = b.data.pubDate.valueOf() - a.data.pubDate.valueOf();
    return d !== 0 ? d : b.id.localeCompare(a.id);
  });
}

export function getPublishedPosts(posts: BlogPost[]) {
  return sortPosts(posts.filter((post) => !post.data.draft));
}

export function getPostHref(post: BlogPost) {
  return `/blog/${post.data.slug}/`;
}

export function assertValidPostSlugs(posts: BlogPost[]) {
  const seen = new Map<string, BlogPost>();
  const legacySeen = new Map<string, BlogPost>();

  for (const post of posts) {
    const { slug } = post.data;

    if (!slugPattern.test(slug)) {
      throw new Error(
        `Invalid slug "${slug}" in ${post.id}. Use lowercase letters, numbers, and single hyphens only.`,
      );
    }

    if (reservedSlugs.has(slug)) {
      throw new Error(`Reserved slug "${slug}" in ${post.id}. Choose a different slug.`);
    }

    const existing = seen.get(slug);
    if (existing) {
      throw new Error(`Duplicate slug "${slug}" in ${existing.id} and ${post.id}. Slugs must be unique.`);
    }

    seen.set(slug, post);
  }

  for (const post of posts) {
    for (const legacySlug of post.data.legacySlugs) {
      const existingPost = seen.get(legacySlug);
      if (existingPost && existingPost.id !== post.id) {
        throw new Error(
          `Legacy slug "${legacySlug}" in ${post.id} conflicts with current slug in ${existingPost.id}.`,
        );
      }

      const existingLegacyPost = legacySeen.get(legacySlug);
      if (existingLegacyPost) {
        throw new Error(
          `Duplicate legacy slug "${legacySlug}" in ${existingLegacyPost.id} and ${post.id}.`,
        );
      }

      legacySeen.set(legacySlug, post);
    }
  }
}
