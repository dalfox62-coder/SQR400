import fs from "fs";
import path from "path";

// Ensure data folder exists
const dbDir = path.join(process.cwd(), "data");
const dbPath = path.join(dbDir, "db.json");

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Normalize username: lowercase and strip non-alphanumeric characters
export const normalizeUsername = (username) => {
  if (!username) return "";
  return username.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
};

const getInitialData = () => {
  return {
    users: [
      {
        username: "vinz_admin",
        password: "vinzsqr400",
        role: "admin",
        registeredAt: new Date().toISOString(),
      },
    ],
    traffic: [],
  };
};

export const readDb = () => {
  try {
    if (!fs.existsSync(dbPath)) {
      const initial = getInitialData();
      fs.writeFileSync(dbPath, JSON.stringify(initial, null, 2), "utf8");
      return initial;
    }
    const data = fs.readFileSync(dbPath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading db.json, returning default:", error);
    return getInitialData();
  }
};

export const writeDb = (data) => {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), "utf8");
    return true;
  } catch (error) {
    console.error("Error writing to db.json:", error);
    return false;
  }
};
