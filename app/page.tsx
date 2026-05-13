export const dynamic = "force-dynamic";

import Image from "next/image";
import Link from "next/link";
import pool from "@/lib/db";

type Post = {
  id: number;
  title: string;
  content: string;
  author: string;
  created_at: string;
  updated_at: string;
  likes: number;
};

export default async function Home() {
  const result = await pool.query<Post>(
    "SELECT * FROM posts ORDER BY created_at DESC"
  );
  const posts = result.rows;

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="flex flex-col items-center justify-center pt-16 pb-12 px-4">
        <Image
          src="/banner.jpg"
          alt="사내 게시판 배너"
          width={300}
          height={200}
          className="mx-auto mb-6 rounded-lg"
          priority
        />
        <h1 className="text-4xl font-bold text-gray-800 mb-4 text-center">
          만월회 행운 발견.zip
        </h1>
        <p className="text-lg text-gray-600 text-center">
          맛집, 카페, 공간까지 슬쩍 공유하는 행운 저장소
        </p>
      </section>

      <section className="max-w-3xl mx-auto px-4 pb-16">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            🍀 행운 모음 ({posts.length})
          </h2>
          <Link
            href="/posts/new"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            + 행운 공유하기
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          {posts.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              아직 공유된 행운이 없어요. 첫 행운을 나눠보세요! ✨
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {posts.map((post) => (
                <li key={post.id} className="hover:bg-blue-50 transition">
                  <Link href={`/posts/${post.id}`} className="block px-6 py-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">
                          🍀 {post.title}
                        </h3>
                        <div className="flex items-center text-sm text-gray-500 gap-3">
                          <span>👤 {post.author}</span>
                          <span>•</span>
                          <span>
                            🕒{" "}
                            {new Date(post.created_at).toLocaleDateString(
                              "ko-KR"
                            )}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-pink-500 text-sm font-medium shrink-0">
                        <span>❤️</span>
                        <span>{post.likes}</span>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}