import { APIGatewayProxyResultV2 } from "aws-lambda";

export function sendError(message: Object): APIGatewayProxyResultV2 {
  return {
    statusCode: 400,
    body: JSON.stringify({ message }),
  };
}
