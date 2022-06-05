import { ServiceMesh } from "./ServiceMesh";
import { Stack, StackProps } from "aws-cdk-lib";

import { RemovalPolicy, aws_dynamodb as dynamodb } from "aws-cdk-lib";
import { Construct } from "constructs";
import { ApiGatewayConstruct } from "./ApiGateway";

export class ArchiStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
  }

  // product table

  public productTable = new dynamodb.Table(this, "products", {
    removalPolicy: RemovalPolicy.DESTROY,
    tableName: `products`,
    partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
    stream: dynamodb.StreamViewType.NEW_IMAGE,
    billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
  });

  // user table

  public userTable = new dynamodb.Table(this, "users", {
    removalPolicy: RemovalPolicy.DESTROY,
    tableName: `users`,
    partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
    billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
  });

  // order table

  public orderTable = new dynamodb.Table(this, "orders", {
    removalPolicy: RemovalPolicy.DESTROY,
    tableName: `orders`,
    partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
    stream: dynamodb.StreamViewType.NEW_IMAGE,
    billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
  });

  // subscription table

  public subscriptionTable = new dynamodb.Table(this, "subscriptions", {
    removalPolicy: RemovalPolicy.DESTROY,
    tableName: `subscriptions`,
    partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
    billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
  });

  public ServiceMesh = new ServiceMesh(this, "servicemesh", {
    authTable: this.userTable,
    orderTable: this.orderTable,
    productTable: this.productTable,
    subscriptionTable: this.subscriptionTable,
  });

  public apiGatewayConstruct = new ApiGatewayConstruct(this, "api", {
    ServiceMesh: this.ServiceMesh,
  });
}
