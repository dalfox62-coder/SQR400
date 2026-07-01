import { NextResponse } from "next/server";
import { query, normalizeUsername, verifyPassword, getAdminVerifyToken, trackOnlineUser } from "../../../utils/db";

export async function POST(req: any) {
  try {
    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password are required" }, { status: 400 });
    }

    const normalizedUsername = normalizeUsername(username);

    // Admin credential check against environment variables
    const adminUser = process.env.ADMIN_USERNAME || "vinz_admin_default_secure";
    const adminPass = process.env.ADMIN_PASSWORD || "change_this_default_password";
    
    let user;
    if (normalizedUsername === normalizeUsername(adminUser) && password === adminPass) {
      user = { username: adminUser, role: "admin", passwordHash: "", passwordSalt: "" };
    } else {
      const res = await query("SELECT username, role, password_hash as \"passwordHash\", password_salt as \"passwordSalt\" FROM users WHERE username = $1", [normalizedUsername]);
      user = res.rows[0];
    }

    if (!user) {
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
    }
    
    if (normalizedUsername !== normalizeUsername(adminUser)) {
      if (!user.passwordHash || !user.passwordSalt) {
         return NextResponse.json({ error: "Account corrupted, contact administrator" }, { status: 500 });
      }

      const isValid = verifyPassword(password, user.passwordHash, user.passwordSalt);
      if (!isValid) {
        return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
      }
    }

    trackOnlineUser(user.username);

    const sessionData: any = {
      username: user.username,
      role: user.role,
      token: Math.random().toString(36).substring(2) + Date.now().toString(36), 
    };

    if (user.role === "admin") {
      sessionData.adminToken = getAdminVerifyToken();
    }

    return NextResponse.json({ user: sessionData });
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
