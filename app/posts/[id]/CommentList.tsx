"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Comment = {
  id: number;
  post_id: number;
  author: string;
  content: string;
  created_at: string;
};

type Props = {
  postId: number;
  comments: Comment[];
};

export default function CommentList({ postId, comments }: Props) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = async (commentId: number) => {
    const confirmed = confirm("이 댓글을 삭제할까요?");
    if (!confirmed) return;

    setDeletingId(commentId);

    try {
      const response = await fetch(
        `/api/posts/${postId}/comments/${commentId}`,
        { method: "DELETE" }
      );

      if (!response.ok) throw new Error("삭제 실패");

      router.refresh();
    } catch (error) {
      alert("댓글 삭제 중 오류가 발생했습니다.");
      console.error(error);
      setDeletingId(null);
    }
  };

  const getRelativeTime = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHour = Math.floor(diffMs / 3600000);
    const diffDay = Math.floor(diffMs / 86400000);

    if (diffMin < 1) return "방금 전";
    if (diffMin < 60) return `${diffMin}분 전`;
    if (diffHour < 24) return `${diffHour}시간 전`;
    if (diffDay < 7) return `${diffDay}일 전`;
    return date.toLocaleDateString("ko-KR");
  };

  if (comments.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8 text-sm">
        아직 댓글이 없어요. 첫 댓글을 남겨보세요! ✨
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {comments.map((comment) => (
        <li
          key={comment.id}
          className="border-b border-gray-100 pb-3 last:border-b-0"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-sm text-gray-800">
                  👤 {comment.author}
                </span>
                <span className="text-xs text-gray-400">
                  {getRelativeTime(comment.created_at)}
                </span>
              </div>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                {comment.content}
              </p>
            </div>
            <button
              onClick={() => handleDelete(comment.id)}
              disabled={deletingId === comment.id}
              className="text-xs text-gray-400 hover:text-red-500 transition shrink-0"
            >
              {deletingId === comment.id ? "삭제 중..." : "삭제"}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}