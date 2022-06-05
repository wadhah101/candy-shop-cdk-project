import { APIGatewayEvent, APIGatewayProxyResultV2 } from "aws-lambda";
import { DeleteItemInput, DynamoDB } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { sendError } from "./sendError";

export async function deleteOne(
  event: APIGatewayEvent,
  tableName: string
): Promise<APIGatewayProxyResultV2> {
  const id = event.pathParameters?.product;

  if (!id) return sendError({ message: "Id not found" });

  const dynamoClient = new DynamoDB({
    region: "us-east-1",
  });

  const params: DeleteItemInput = {
    Key: marshall({ id }),
    ReturnValues: "ALL_OLD",
    TableName: tableName,
  };

  try {
    const { Attributes } = await dynamoClient.deleteItem(params);

    const item = Attributes ? unmarshall(Attributes) : null;

    return {
      statusCode: 200,
      body: JSON.stringify({ item }),
    };
  } catch (err) {
    console.log(err);

    return sendError({ message: { error: err } });
  }
}
