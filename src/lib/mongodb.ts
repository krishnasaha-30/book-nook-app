import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error(
    "MONGODB_URI is missing. Add your connection string to .env.local.",
  );
}

// Next.js reloads modules in development, so keep a single client around.
const globalForMongo = globalThis as unknown as {
  booknookMongoClient?: MongoClient;
};

export const mongoClient =
  globalForMongo.booknookMongoClient ?? new MongoClient(uri);

if (process.env.NODE_ENV !== "production") {
  globalForMongo.booknookMongoClient = mongoClient;
}

export const db = mongoClient.db(process.env.DB_NAME || "booknook");
