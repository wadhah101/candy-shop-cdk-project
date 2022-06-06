import { createOne } from "../lib/ProductService/functions/crud/createOne";
import * as fs from "fs";

const event = JSON.parse(fs.readFileSync("test/create.event.json", "utf-8"));
test("Can Create One Product", async () => {
  const result = await createOne(event, "products");
  expect(result).toMatchObject({ statusCode: 200 });
  return result;
});
