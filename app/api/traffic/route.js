import { NextResponse } from "next/server";
import { readDb, writeDb } from "../../utils/db";

export async function POST(req) {
  try {
    const body = await req.json();
    const { username, bank, amount, currency, senderRef } = body;

    if (!username || !bank) {
      return NextResponse.json(
        { error: "Username and bank name are required" },
        { status: 400 }
      );
    }

    const db = readDb();
    const newLog = {
      id: Date.now() + Math.random().toString(36).substr(2, 5),
      timestamp: new Date().toISOString(),
      username: username,
      bank: bank,
      amount: amount || "0.00",
      currency: currency || "EUR",
      senderRef: senderRef || "N/A",
    };

    db.traffic.push(newLog);
    writeDb(db);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Traffic Log API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
