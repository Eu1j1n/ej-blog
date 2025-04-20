import { Client } from "@notionhq/client";
import { Post } from "../types/post";
import {
  BlockObjectResponse,
  ListBlockChildrenResponse,
  QueryDatabaseResponse,
  PageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";

if (!process.env.NOTION_TOKEN || !process.env.NOTION_DATABASE_ID) {
  throw new Error("Missing Notion credentials");
}

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

async function getPageContent(pageId: string): Promise<string> {
  try {
    const response: ListBlockChildrenResponse =
      await notion.blocks.children.list({
        block_id: pageId,
      });

    return response.results
      .map((block) => {
        const b = block as BlockObjectResponse;

        if (!b.type) return "";

        switch (b.type) {
          case "paragraph":
            return (
              b.paragraph.rich_text.map((text) => text.plain_text).join("") +
              "\n\n"
            );
          case "heading_1":
            return `# ${b.heading_1.rich_text
              .map((text) => text.plain_text)
              .join("")}\n\n`;
          case "heading_2":
            return `## ${b.heading_2.rich_text
              .map((text) => text.plain_text)
              .join("")}\n\n`;
          case "heading_3":
            return `### ${b.heading_3.rich_text
              .map((text) => text.plain_text)
              .join("")}\n\n`;
          case "bulleted_list_item":
            return `• ${b.bulleted_list_item.rich_text
              .map((text) => text.plain_text)
              .join("")}\n`;
          case "numbered_list_item":
            return `1. ${b.numbered_list_item.rich_text
              .map((text) => text.plain_text)
              .join("")}\n`;
          case "code":
            return `\`\`\`${b.code.language}\n${b.code.rich_text
              .map((text) => text.plain_text)
              .join("")}\n\`\`\`\n\n`;
          default:
            return "";
        }
      })
      .join("");
  } catch (error) {
    console.error("Error fetching page content:", error);
    return "";
  }
}

export async function getPosts(): Promise<Post[]> {
  try {
    const response: QueryDatabaseResponse = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID!,
      sorts: [
        {
          property: "날짜",
          direction: "descending",
        },
      ],
    });

    const posts = await Promise.all(
      response.results.map(async (page) => {
        try {
          const p = page as PageObjectResponse;
          const properties = p.properties;
          const content = await getPageContent(p.id);

          return {
            id: p.id,
            title:
              properties["이름"]?.type === "title"
                ? properties["이름"].title[0]?.plain_text || "Untitled"
                : "Untitled",
            slug:
              properties["이름"]?.type === "title"
                ? properties["이름"].title[0]?.plain_text
                    ?.toLowerCase()
                    .replace(/ /g, "-")
                    .replace(/[^\w-]+/g, "") || p.id
                : p.id,
            date:
              properties["날짜"]?.type === "date"
                ? properties["날짜"].date?.start ||
                  new Date().toISOString().split("T")[0]
                : new Date().toISOString().split("T")[0],
            content,
            description:
              properties["설명"]?.type === "rich_text"
                ? properties["설명"].rich_text[0]?.plain_text || ""
                : "",
          };
        } catch (error) {
          console.error("Error processing post:", error);
          return null;
        }
      })
    );

    return posts.filter((post) => post !== null) as Post[];
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const posts = await getPosts();
  return posts.find((post) => post.slug === slug) || null;
}

export async function getAllPostSlugs(): Promise<string[]> {
  const posts = await getPosts();
  return posts.map((post) => post.slug);
}
