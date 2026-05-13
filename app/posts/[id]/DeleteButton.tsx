"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  postId: number;
};

export default function DeleteButton({ postId }: Props) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const confirmed = confirm("정말 이 행운을 삭제하시겠어요? 🥺");
    if (!confirmed) return;

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("삭제 실패");

      alert("삭제되었어요!");
      router.push("/");
      router.refresh();
    } catch (error) {
      alert("삭제 중 오류가 발생했습니다.");
      console.error(error);
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isDeleting ? "삭제 중..." : "🗑️ 삭제"}
    </button>
  );
}