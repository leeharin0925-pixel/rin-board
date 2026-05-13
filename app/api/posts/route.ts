import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { title, content, author } = await request.json();

    if (!title || !content || !author) {
      return NextResponse.json(
        { error: "모든 항목을 입력해주세요." },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `INSERT INTO posts (title, content, author)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [title, content, author]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error("게시글 작성 오류:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}