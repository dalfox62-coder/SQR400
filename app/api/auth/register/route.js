import { NextResponse } from "next/server";
import { readDb, writeDb, normalizeUsername } from "../../../utils/db";

export async function POST(req) {
  try {
    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    const trimmedUsername = username.trim();
    if (trimmedUsername.length < 3) {
      return NextResponse.json(
        { error: "Username must be at least 3 characters" },
        { status: 400 }
      );
    }

    if (password.length < 5) {
      return NextResponse.json(
        { error: "Password must be at least 5 characters" },
        { status: 400 }
      );
    }

    const db = readDb();
    const normalizedInput = normalizeUsername(trimmedUsername);

    // Prevent matching default admin as well (vinz_admin normalized is vinzadmin)
    const exists = db.users.some(
      (u) => normalizeUsername(u.username) === normalizedInput
    );

    if (exists) {
      return NextResponse.json(
        { error: "Username is already taken or conflicts with an existing account" },
        { status: 400 }
      );
    }

    const newUser = {
      username: trimmedUsername,
      password: password,
      role: "user",
      registeredAt: new Date().toISOString(),
    };

    db.users.push(newUser);
    writeDb(db);

    return NextResponse.json({ success: true, username: trimmedUsername });
  } catch (error) {
    console.error("Register API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
