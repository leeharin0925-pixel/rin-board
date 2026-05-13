"use client";

import { useState } from "react";

type Props = {
  postId: number;
  initialLikes: number;
};

export default function LikeButton({ postId, initialLikes }: Props) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiking, setIsLiking] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleLike = async () => {
    if (isLiking) return;

    setIsLiking(true);
    setIsAnimating(true);

    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: "POST",
      });

      if (!response.ok) throw new Error("좋아요 실패");

      const data = await response.json();
      setLikes(data.likes);
    } catch (error) {
      console.error(error);
      alert("좋아요 처리 중 오류가 발생했습니다.");
    } finally {
      setIsLiking(false);
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={isLiking}
      className="flex items-center gap-2 px-4 py-2 bg-pink-50 hover:bg-pink-100 text-pink-600 rounded-lg font-medium transition disabled:opacity-50"
    >
      <span
        className={`text-xl transition-transform ${
          isAnimating ? "scale-150" : "scale-100"
        }`}
      >
        ❤️
      </span>
      <span>좋아요 {likes}</span>
    </button>
  );
}