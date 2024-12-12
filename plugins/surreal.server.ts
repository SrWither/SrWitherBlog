import { Surreal } from "surrealdb";

export default defineNuxtPlugin(async (nuxtApp) => {
  const sdb = new Surreal();

  const url = process.env.SSR_SURREAL_URL || "http://localhost:7435";

  await sdb.connect(url, {
    namespace: "blog",
    database: "blog",
  });

  console.log("Connected to SurrealDB SSR");

  return {
    provide: {
      sdb,
    },
  };
});
