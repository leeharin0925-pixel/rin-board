"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  postId: number;
};

export default function CommentForm({ postId }: Props) {
  const router = useRouter();
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!author.trim() || !content.trim()) {
      alert("이름과 댓글 내용을 입력해주세요!");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ author, content }),
      });

      if (!response.ok) throw new Error("댓글 작성 실패");

      setAuthor("");
      setContent("");
      router.refresh();
    } catch (error) {
      alert("댓글 작성 중 오류가 발생했습니다.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 bg-gray-50 p-4 rounded-lg">
      <input
        type="text"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        placeholder="이름"
        maxLength={50}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={isSubmitting}
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="댓글을 입력하세요..."
        rows={3}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        disabled={isSubmitting}
      />
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "등록 중..." : "💬 댓글 등록"}
        </button>
      </div>
    </form>
  );
}