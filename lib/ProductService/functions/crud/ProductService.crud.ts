import { APIGatewayEvent } from "aws-lambda";
import * as yup from "yup";

import { createOne } from "./createOne";
import { getAll } from "./getAll";
import { getOne } from "./getOne";
import { deleteOne } from "./deleteOne";

const TABLE_NAME = "products";

export const productInputSchema = yup.object({
  id: yup.string(),
  name: yup.string().required(),
  price: yup.number().required(),
  description: yup.string().required(),
  stocks: yup.number().required().integer(),
});

// type Product = yup.InferType<typeof productInputSchema>;

export const handler = async (event: APIGatewayEvent) => {
  try {
    if (event.httpMethod === "GET" && event.resource === "/product")
      return getAll(event, TABLE_NAME);
    if (event.httpMethod === "POST" && event.resource === "/product")
      return createOne(event, TABLE_NAME);
    if (event.httpMethod === "GET" && event.resource === "/product/{product}")
      return getOne(event, TABLE_NAME);
    if (
      event.httpMethod === "DELETE" &&
      event.resource === "/product/{product}"
    )
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
