import { APIGatewayEvent, APIGatewayProxyResultV2 } from "aws-lambda";
import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { GetItemInput } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { sendError } from "./sendError";

export async function getOne(
  event: APIGatewayEvent,
  tableName: string
): Promise<APIGatewayProxyResultV2> {
  const id = event.pathParameters?.product;

  if (!id) return sendError({ message: "Id not found" });

  const dynamoClient = new DynamoDB({
    region: "us-east-1",
  });

  const itemInput: GetItemInput = {
    Key: marshall({
      id: id,
    }),
    TableName: tableName,
  };

  try {
    const { Item } = await dynamoClient.getItem(itemInput);

    const item = Item ? unmarshall(Item) : null;

    return {
      statusCode: 200,
      body: JSON.stringify({ item }),
    };
  } catch (err) {
    console.log(err);
    return sendError({
      message: { text: "something went wrong ", error: err },
    });
  }
}
