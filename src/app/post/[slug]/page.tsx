import { getPostBySlug, getAllPostSlugs } from "../../lib/notion";
import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

type PostParams = {
  slug: string;
};

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export default async function Page({ params }: { params: PostParams }) {
  const post = await getPostBySlug(params.slug);
  if (!post) {
    notFound();
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg overflow-hidden p-8">
          <div className="mb-8">
            <Link
              href="/"
              className="text-gray-600 hover:text-gray-900 text-lg flex items-center"
            >
              <span className="mr-1">←</span> 목록
            </Link>
          </div>

          <article>
            <div className="mb-8 text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {post.title}
              </h1>
              <div className="flex items-center justify-center text-gray-600 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <time className="text-sm">{post.date}</time>
              </div>
              <div className="border-t border-gray-200 mt-8"></div>
            </div>

            <div className="prose prose-lg max-w-none text-gray-900">
              <ReactMarkdown
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mt-8 mb-4 text-gray-900">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mt-6 mb-4 text-gray-900">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mt-4 mb-2 text-gray-900">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="text-base sm:text-lg lg:text-xl my-4 leading-7 text-gray-900">
                      {children}
                    </p>
                  ),
                  hr: () => <hr className="my-8 border-gray-200" />,
                  strong: ({ children }) => (
                    <strong className="font-bold text-gray-900">
                      {children}
                    </strong>
                  ),
                  code: ({ children }) => (
                    <code className="bg-gray-100 rounded px-2 py-1 text-sm text-gray-900">
                      {children}
                    </code>
                  ),
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
