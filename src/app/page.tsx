import Link from "next/link";
import { getPosts } from "./lib/notion";

export default async function Home() {
  const posts = await getPosts();

  return (
    <>
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">EJ Blog</h1>
          <p className="text-gray-600">나만의 기술 블로그</p>
        </div>
      </header>
      <main className="flex-grow bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">최근 포스트</h2>
              <div className="relative">
                <input
                  type="text"
                  placeholder="검색..."
                  className="w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/post/${post.slug}`}
                  className="block transform transition duration-200 hover:scale-105"
                >
                  <article className="bg-white rounded-lg shadow-md overflow-hidden h-full border border-gray-100 hover:shadow-lg hover:border-blue-200">
                    <div className="p-6">
                      <time className="text-sm text-gray-500 mb-2 block">
                        {post.date}
                      </time>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                        {post.title}
                      </h3>
                      <div className="text-gray-600 text-sm">
                        {post.description && (
                          <p className="line-clamp-2">{post.description}</p>
                        )}
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
