import { Surreal } from "surrealdb";

export default defineNuxtPlugin(async (nuxtApp) => {
  console.log("Starting SurrealDB SSR WS...");
  const sdb = new Surreal();

  console.log("Connecting to SurrealDB SSR...");

  await sdb.connect("http://10.1.1.20:7435/", {
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
