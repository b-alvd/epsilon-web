import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import { getDb } from "../../../../../lib/db";

const ALLOWED_TRANSITIONS: Record<string, string[]> = {
  draft:         ["pending"],
  pending:       ["talk", "rejected_quiz"],
  talk:          ["accepted", "rejected_talk"],
  rejected_quiz: ["draft"],
  rejected_talk: ["draft"],
  accepted:      [],
};

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const { status: newStatus } = await request.json();

  if (!newStatus || typeof newStatus !== "string") {
    return NextResponse.json({ error: "missing_status" }, { status: 400 });
  }

  const db = getDb();

  // Vérifie l'état actuel
  const [rows] = await db.query<({ status: string } & import("mysql2").RowDataPacket)[]>(
    `SELECT status FROM whitelist_applications WHERE id = ?`,
    [id]
  );
  const current = rows[0];
  if (!current) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const allowed = ALLOWED_TRANSITIONS[current.status] ?? [];
  if (!allowed.includes(newStatus)) {
    return NextResponse.json({ error: "invalid_transition" }, { status: 400 });
  }

  await db.query(
    `UPDATE whitelist_applications SET status = ? WHERE id = ?`,
    [newStatus, id]
  );

  return NextResponse.json({ ok: true, status: newStatus });
}
