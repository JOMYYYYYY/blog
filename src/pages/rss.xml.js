import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { assertValidPostSlugs, getPostHref, getPublishedPosts } from "../lib/posts";

export async function GET(context) {
  const allPosts = await getCollection("blog");
  assertValidPostSlugs(allPosts);
  const posts = getPublishedPosts(allPosts);
  return rss({
    title: "My Blog",
    description: "分享技术、生活和思考",
    site: context.site,
    items: posts.map(post => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: getPostHref(post),
    })),
  });
}
