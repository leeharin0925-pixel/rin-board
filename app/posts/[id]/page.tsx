export const dynamic = "force-dynamic";

import pool from "@/lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";
import DeleteButton from "./DeleteButton";
import LikeButton from "./LikeButton";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";

type Post = {
  id: number;
  title: string;
  content: string;
  author: string;
  created_at: string;
  updated_at: string;
  likes: number;
};

type Comment = {
  id: number;
  post_id: number;
  author: string;
  content: string;
  created_at: string;
};

type Props = {
  params: Promise<{ id: string }>;
};

export default async function PostDetailPage({ params }: Props) {
  const { id } = await params;

  // 게시글 조회
  const postResult = await pool.query<Post>(
    "SELECT * FROM posts WHERE id = $1",
    [id]
  );

  if (postResult.rows.length === 0) {
    notFound();
  }

  const post = postResult.rows[0];

  // 댓글 조회
  const commentsResult = await pool.query<Comment>(
    "SELECT * FROM comments WHERE post_id = $1 ORDER BY created_at DESC",
    [id]
  );
  const comments = commentsResult.rows;

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Link
          href="/"
          className="text-sm text-gray-600 hover:text-gray-900 mb-4 inline-block"
        >
          ← 목록으로
        </Link>

        {/* 게시글 영역 */}
        <article className="bg-white rounded-lg shadow p-8 mb-6">
          <header className="border-b border-gray-200 pb-4 mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-3">
              🍀 {post.title}
            </h1>
            <div className="flex items-center text-sm text-gray-500 gap-3">
              <span>👤 {post.author}</span>
              <span>•</span>
              <span>
                🕒{" "}
                {new Date(post.created_at).toLocaleString("ko-KR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </header>

          <div className="text-gray-700 whitespace-pre-wrap leading-relaxed mb-8">
            {post.content}
          </div>

          <div className="flex justify-center mb-6">
            <LikeButton postId={post.id} initialLikes={post.likes} />
          </div>

          <div className="flex gap-2 pt-4 border-t border-gray-200">
            <Link
              href={`/posts/${post.id}/edit`}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition"
            >
              ✏️ 수정
            </Link>
            <DeleteButton postId={post.id} />
          </div>
        </article>

        {/* 댓글 영역 */}
        <section className="bg-white rounded-lg shadow p-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            💬 댓글 ({comments.length})
          </h2>
          <CommentForm postId={post.id} />
          <CommentList postId={post.id} comments={comments} />
        </section>
      </div>
    </main>
  );
}