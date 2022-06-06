import * as cdk from "aws-cdk-lib";
import { Template, Match } from "aws-cdk-lib/assertions";
import * as Archi from "../lib/archi-stack";

test("Check for dynamodb table creation in template", () => {
  // Launch the cdk process and generate stack object
  const app = new cdk.App();
  const stack = new Archi.ArchiStack(app, "MyTestStack");

  // Get standard Cloudformation template from stack
  const template = Template.fromStack(stack);

  /** search explicitely for table named products  */
  template.hasResource("AWS::DynamoDB::Table", {
    Properties: { TableName: "products" },
  });
});
