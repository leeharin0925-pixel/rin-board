import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

type Params = {
  params: Promise<{ id: string }>;
};

export async function POST(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    const result = await pool.query(
      `UPDATE posts
       SET likes = likes + 1
       WHERE id = $1
       RETURNING likes`,
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "게시글을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json({ likes: result.rows[0].likes });
  } catch (error) {
    console.error("좋아요 오류:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}