import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

type Params = {
  params: Promise<{ id: string; commentId: string }>;
};

// 댓글 삭제
export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    const { commentId } = await params;

    const result = await pool.query(
      "DELETE FROM comments WHERE id = $1 RETURNING *",
      [commentId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "댓글을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "삭제되었습니다." });
  } catch (error) {
    console.error("댓글 삭제 오류:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}