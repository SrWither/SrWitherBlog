import { Surreal } from "surrealdb";

export default defineNuxtPlugin(async (nuxtApp) => {
  const sdb = new Surreal();

  await sdb.connect("https://db.srwither.com.ar", {
    namespace: "blog",
    database: "blog",
  });

  return {
    provide: {
      sdb,
    },
  };
});
