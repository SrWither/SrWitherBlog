import { Surreal } from "surrealdb";

export const db = new Surreal();

export const initDB = async (): Promise<void> => {
  await db.connect("https://db.srwither.com.ar", {
    namespace: "blog",
    database: "blog",
  });
};