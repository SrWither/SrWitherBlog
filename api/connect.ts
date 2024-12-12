import { Surreal } from "surrealdb";

export const db = new Surreal();

const url = process.env.CLIENT_SURREAL_URL || "http://localhost:7435";

export const initDB = async (): Promise<void> => {
  await db.connect(url, {
    namespace: "blog",
    database: "blog",
  });
};