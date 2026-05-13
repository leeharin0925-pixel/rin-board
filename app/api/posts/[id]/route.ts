import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

type Params = {
  params: Promise<{ id: string }>;
};

// 게시글 1개 조회
export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    const result = await pool.query(
      "SELECT * FROM posts WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "게시글을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("게시글 조회 오류:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// 게시글 수정
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const { title, content, author } = await request.json();

    if (!title || !content || !author) {
      return NextResponse.json(
        { error: "모든 항목을 입력해주세요." },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `UPDATE posts
       SET title = $1, content = $2, author = $3, updated_at = CURRENT_TIMESTAMP
       WHERE id = $4
       RETURNING *`,
      [title, content, author, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "게시글을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("게시글 수정 오류:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// 게시글 삭제
export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    const result = await pool.query(
      "DELETE FROM posts WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "게시글을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "삭제되었습니다." });
  } catch (error) {
    console.error("게시글 삭제 오류:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}