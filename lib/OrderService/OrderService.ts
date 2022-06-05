import { Construct } from "constructs";

import { aws_lambda_nodejs, Duration } from "aws-cdk-lib";
import { ITable } from "aws-cdk-lib/aws-dynamodb";

interface Props {
  table: ITable;
}

export class OrderService extends Construct {
  constructor(scope: Construct, id: string, private props: Props) {
    super(scope, id);
  }

  public crud = new aws_lambda_nodejs.NodejsFunction(this, "crud", {
    bundling: { minify: true },
    entry: `${__dirname}/crud/OrderService.crud.ts`,
    functionName: `crud-orders`,

    memorySize: 128,
    timeout: Duration.minutes(2),
  });
}
