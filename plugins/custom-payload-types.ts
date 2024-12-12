import { RecordId } from "surrealdb";

export default definePayloadPlugin(() => {
  definePayloadReducer("RecordId", (data) => {
    if (data instanceof RecordId) {
      return data.toString();
    }
  });

  definePayloadReviver("RecordId", (data) => {
    if (typeof data === "string") {
      const dataId = data.split(":");
      return new RecordId(dataId[0], dataId[1]);
    }
  });
});
