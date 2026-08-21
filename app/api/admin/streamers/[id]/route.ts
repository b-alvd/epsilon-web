import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import { getDb } from "../../../../../lib/db";
import type { RowDataPacket } from "mysql2";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const { status } = await request.json();

  if (status !== "accepted" && status !== "refused" && status !== "pending") {
    return NextResponse.json({ error: "invalid_status" }, { status: 400 });
  }

  const db = getDb();
  const [rows] = await db.query<RowDataPacket[]>(
    `SELECT id FROM streamer_applications WHERE id = ?`,
    [id]
  );
  if (!rows.length) return NextResponse.json({ error: "not_found" }, { status: 404 });

  await db.query(`UPDATE streamer_applications SET status = ? WHERE id = ?`, [status, id]);

  return NextResponse.json({ ok: true, status });
}
