import { APIGatewayEvent, APIGatewayProxyResultV2 } from "aws-lambda";
import { DynamoDB, PutItemInput } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { v4 as uuid } from "uuid";
import { productInputSchema } from "./ProductService.crud";
import { sendError } from "./sendError";

export async function createOne<T>(
  event: APIGatewayEvent,
  tableName: string
): Promise<APIGatewayProxyResultV2> {
  const { body } = event;

  if (!body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "no body in post" }),
    };
  }

  try {
    await productInputSchema.validate(body);
  } catch (e) {
    return sendError({ message: { error: e } });
  }
  const validatedItem = await productInputSchema.validate(body);

  const item = { ...validatedItem, id: uuid() };

  const dynamoClient = new DynamoDB({
    region: "us-east-1",
  });

  const params: PutItemInput = {
    Item: marshall(item),
    TableName: tableName,
  };

  try {
    await dynamoClient.putItem(params);

    return {
      statusCode: 200,
      body: JSON.stringify({ item }),
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: 400,
      body: JSON.stringify({ err }),
    };
  }
}
