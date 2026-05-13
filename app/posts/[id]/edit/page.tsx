"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect, use } from "react";

type Props = {
  params: Promise<{ id: string }>;
};

export default function EditPostPage({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 페이지 처음 열 때 기존 게시글 데이터 불러오기
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${id}`);
        if (!response.ok) throw new Error("게시글을 불러올 수 없습니다");
        const post = await response.json();
        setTitle(post.title);
        setAuthor(post.author);
        setContent(post.content);
      } catch (error) {
        alert("게시글을 불러오는 중 오류가 발생했습니다.");
        console.error(error);
        router.push("/");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPost();
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !author.trim() || !content.trim()) {
      alert("모든 항목을 입력해주세요!");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, author, content }),
      });

      if (!response.ok) throw new Error("수정 실패");

      router.push(`/posts/${id}`);
      router.refresh();
    } catch (error) {
      alert("수정 중 오류가 발생했습니다.");
      console.error(error);
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            불러오는 중...
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Link
          href={`/posts/${id}`}
          className="text-sm text-gray-600 hover:text-gray-900 mb-4 inline-block"
        >
          ← 상세로
        </Link>

        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            ✏️ 행운 수정하기
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                제목
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={200}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                작성자
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                maxLength={50}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                내용
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={10}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                disabled={isSubmitting}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "수정 중..." : "✅ 수정 완료"}
              </button>
              <Link
                href={`/posts/${id}`}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                취소
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}