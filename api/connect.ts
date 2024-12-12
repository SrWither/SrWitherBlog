import { Surreal } from "surrealdb";

export const db = new Surreal();

export const initDB = async (): Promise<void> => {
  const url = useRuntimeConfig().public.surrealUrl;
  await db.connect(url, {
    namespace: "blog",
    database: "blog",
  });
};
