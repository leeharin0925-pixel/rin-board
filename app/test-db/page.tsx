import pool from "@/lib/db";

export default async function TestDBPage() {
  const result = await pool.query("SELECT * FROM posts");
  const posts = result.rows;

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          DB 연결 테스트
        </h1>
        <p className="mb-4 text-gray-600">
          총 {posts.length}개의 게시글이 있습니다.
        </p>
        <pre className="bg-white p-4 rounded-lg shadow text-sm overflow-auto">
          {JSON.stringify(posts, null, 2)}
        </pre>
      </div>
    </main>
  );
}