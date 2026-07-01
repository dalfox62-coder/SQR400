import { NextResponse } from "next/server";
import { readDb, writeDb } from "../../../utils/db";

// GET all traffic logs (newest first)
export async function GET() {
  try {
    const db = readDb();
    const sortedTraffic = [...db.traffic].sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );
    return NextResponse.json({ success: true, traffic: sortedTraffic });
  } catch (error) {
    console.error("Admin Get Traffic API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE (flush) all traffic logs
export async function DELETE() {
  try {
    const db = readDb();
    db.traffic = [];
    writeDb(db);
    return NextResponse.json({ success: true, message: "Traffic logs cleared successfully" });
  } catch (error) {
    console.error("Admin Clear Traffic API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
