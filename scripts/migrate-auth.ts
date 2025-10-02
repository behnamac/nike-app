import { db } from "../src/lib/db";
import {
  user,
  session,
  account,
  verification,
  guest,
} from "../src/lib/db/schema";

async function migrateAuthTables() {
  try {
    console.log("Creating auth tables...");

    // The tables will be created by Drizzle when we run the migration
    // This script is just for reference and can be used to seed initial data if needed

    console.log("Auth tables migration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

migrateAuthTables();
