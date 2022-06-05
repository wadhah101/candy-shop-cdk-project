import { APIGatewayEvent } from "aws-lambda";
import * as yup from "yup";

import { createOne } from "./createOne";
import { getAll } from "./getAll";
import { getOne } from "./getOne";
import { deleteOne } from "./deleteOne";

const TABLE_NAME = "orders";

export const orderInputSchema = yup.object({
  id: yup.string(),
  userId: yup.string().required(),
  productId: yup.string().required(),
  quantity: yup.string().required(),
});

// type Product = yup.InferType<typeof productInputSchema>;

export const handler = async (event: APIGatewayEvent) => {
  try {
    if (event.httpMethod === "GET" && event.resource === "/order")
      return getAll(event, TABLE_NAME);
    if (event.httpMethod === "POST" && event.resource === "/order")
      return createOne(event, TABLE_NAME);
    if (event.httpMethod === "GET" && event.resource === "/order/{order}")
      return getOne(event, TABLE_NAME);
    if (event.httpMethod === "DELETE" && event.resource === "/order/{order}")
      return deleteOne(event, TABLE_NAME);

    return {
      statusCode: 401,
      headers: {},
      body: JSON.stringify(event),
    };
  } catch (e) {
    return {
      statusCode: 401,
      headers: {},
      body: JSON.stringify(e),
    };
  }
};
