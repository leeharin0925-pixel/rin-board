import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

type Params = {
  params: Promise<{ id: string }>;
};

// 댓글 목록 조회
export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    const result = await pool.query(
      `SELECT * FROM comments
       WHERE post_id = $1
       ORDER BY created_at DESC`,
      [id]
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("댓글 조회 오류:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// 댓글 작성
export async function POST(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const { author, content } = await request.json();

    if (!author || !content) {
      return NextResponse.json(
        { error: "이름과 댓글 내용을 입력해주세요." },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `INSERT INTO comments (post_id, author, content)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [id, author, content]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error("댓글 작성 오류:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}