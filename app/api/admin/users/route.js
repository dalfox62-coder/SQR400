import { NextResponse } from "next/server";
import { readDb, writeDb, normalizeUsername } from "../../../utils/db";

// GET user list with aggregated traffic count
export async function GET() {
  try {
    const db = readDb();
    const usersWithTraffic = db.users
      .filter((u) => u.role !== "admin")
      .map((u) => {
        const count = db.traffic.filter(
          (t) => normalizeUsername(t.username) === normalizeUsername(u.username)
        ).length;
        return {
          username: u.username,
          registeredAt: u.registeredAt,
          printCount: count,
        };
      });

    return NextResponse.json({ success: true, users: usersWithTraffic });
  } catch (error) {
    console.error("Admin Get Users API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE a specific user
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const usernameToDelete = searchParams.get("username");

    if (!usernameToDelete) {
      return NextResponse.json(
        { error: "Username is required to delete" },
        { status: 400 }
      );
    }

    const db = readDb();
    const initialCount = db.users.length;
    
    // Do not allow deleting admin
    if (normalizeUsername(usernameToDelete) === "vinzadmin") {
      return NextResponse.json(
        { error: "Cannot delete admin account" },
        { status: 400 }
      );
    }

    db.users = db.users.filter(
      (u) => normalizeUsername(u.username) !== normalizeUsername(usernameToDelete)
    );

    if (db.users.length === initialCount) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Also clean up their traffic if desired, or keep it?
    // The user said: "bisa hapus user yg terdaftar dan bisa melihat traffic user itu mencetak form, dan itu juga bisa di berihkan semuanya"
    // So cleaning up user logs is covered under "clear traffic" action, we can keep the records or filter them out.
    
    writeDb(db);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin Delete User API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
