import { APIGatewayEvent, APIGatewayProxyResultV2 } from "aws-lambda";
import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { ScanInput } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

export async function getAll(
  _event: APIGatewayEvent,
  tableName: string
): Promise<APIGatewayProxyResultV2> {
  const dynamoClient = new DynamoDB({
    region: "us-east-1",
  });

  const scan: ScanInput = {
    TableName: tableName,
  };

  try {
    const { Items } = await dynamoClient.scan(scan);

    const items = Items ? Items.map((item) => unmarshall(item)) : [];

    return {
      statusCode: 200,
      body: JSON.stringify({ items }),
    };
  } catch (err) {
    console.log(err);

    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "something went wrong",
        error: err,
      }),
    };
  }
}
