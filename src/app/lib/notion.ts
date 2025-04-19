import { Client } from '@notionhq/client';
import { Post } from '../types/post';

if (!process.env.NOTION_TOKEN || !process.env.NOTION_DATABASE_ID) {
  throw new Error('Missing Notion credentials');
}

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

async function getPageContent(pageId: string): Promise<string> {
  try {
    const response = await notion.blocks.children.list({
      block_id: pageId,
    });

    return response.results
      .map((block: any) => {
        if (!block.type) return '';

        switch (block.type) {
          case 'paragraph':
            return block.paragraph.rich_text.map((text: any) => text.plain_text).join('') + '\n\n';
          case 'heading_1':
            return `# ${block.heading_1.rich_text.map((text: any) => text.plain_text).join('')}\n\n`;
          case 'heading_2':
            return `## ${block.heading_2.rich_text.map((text: any) => text.plain_text).join('')}\n\n`;
          case 'heading_3':
            return `### ${block.heading_3.rich_text.map((text: any) => text.plain_text).join('')}\n\n`;
          case 'bulleted_list_item':
            return `• ${block.bulleted_list_item.rich_text.map((text: any) => text.plain_text).join('')}\n`;
          case 'numbered_list_item':
            return `1. ${block.numbered_list_item.rich_text.map((text: any) => text.plain_text).join('')}\n`;
          case 'code':
            return `\`\`\`${block.code.language}\n${block.code.rich_text.map((text: any) => text.plain_text).join('')}\n\`\`\`\n\n`;
          default:
            return '';
        }
      })
      .join('');
  } catch (error) {
    console.error('Error fetching page content:', error);
    return '';
  }
}

export async function getPosts(): Promise<Post[]> {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID!,
      sorts: [
        {
          property: '날짜',
          direction: 'descending',
        },
      ],
    });

    const posts = await Promise.all(
      response.results.map(async (page: any) => {
        try {
          const properties = page.properties;
          const content = await getPageContent(page.id);
          
          return {
            id: page.id,
            title: properties['이름']?.title[0]?.plain_text || 'Untitled',
            slug: properties['이름']?.title[0]?.plain_text
              ?.toLowerCase()
              .replace(/ /g, '-')
              .replace(/[^\w-]+/g, '') || page.id,
            date: properties['날짜']?.date?.start || new Date().toISOString().split('T')[0],
            content,
            description: properties['설명']?.rich_text[0]?.plain_text || '',
          };
        } catch (error) {
          console.error('Error processing post:', error);
          return null;
        }
      })
    );

    return posts.filter((post): post is Post => post !== null);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    // 모든 포스트를 가져와서 slug로 필터링
    const posts = await getPosts();
    const post = posts.find(p => p.slug === slug);
    
    if (!post) {
      console.log('Post not found with slug:', slug);
      return null;
    }

    return post;
  } catch (error) {
    console.error('Error fetching post by slug:', error);
    return null;
  }
} 