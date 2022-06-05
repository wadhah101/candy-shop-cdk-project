import { Construct } from "constructs";

import { aws_lambda_nodejs, Duration } from "aws-cdk-lib";
import { ITable } from "aws-cdk-lib/aws-dynamodb";

interface Props {
  table: ITable;
}

export class AuthService extends Construct {
  constructor(scope: Construct, id: string, private props: Props) {
    super(scope, id);
  }

  public crud = new aws_lambda_nodejs.NodejsFunction(this, "api", {
    bundling: { minify: true },
    functionName: `auth-fn`,
    memorySize: 128,
    timeout: Duration.minutes(2),
  });
}
