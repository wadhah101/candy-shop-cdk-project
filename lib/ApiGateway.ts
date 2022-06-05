import { SubscriptionService } from "./SubscriptionService/SubscriptionService";
import { AuthService } from "./AuthService/AuthService";
import { OrderService } from "./OrderService/OrderService";
import { ProductService } from "./ProductService/ProductService";
import { Construct } from "constructs";
import { TableClass } from "aws-cdk-lib/aws-dynamodb";
import { aws_apigateway as apigateway } from "aws-cdk-lib";
import { ServiceMesh } from "./ServiceMesh";

interface Props {
  ServiceMesh: ServiceMesh;
}

export class ApiGatewayConstruct extends Construct {
  constructor(scope: Construct, id: string, private props: Props) {
    super(scope, id);
    const productResource = this.api.root.addResource("product");
    const orderResource = this.api.root.addResource("order");
    const SubscriptionResource = this.api.root.addResource("subscription");
    const authResource = this.api.root.addResource("auth");

    productResource.addMethod("GET", this.productCrudIntegration);
    productResource.addMethod("POST", this.productCrudIntegration);

    const productResourceOne = productResource.addResource("{product}");
    productResourceOne.addMethod("GET", this.productCrudIntegration);
    productResourceOne.addMethod("DELETE", this.productCrudIntegration);
    productResourceOne.addMethod("PUT", this.productCrudIntegration);

    // orders
    orderResource.addMethod("GET", this.orderCrudIntegration);
    orderResource.addMethod("POST", this.orderCrudIntegration);

    const orderResourceOne = orderResource.addResource("{order}");
    orderResourceOne.addMethod("GET", this.orderCrudIntegration);
    orderResourceOne.addMethod("DELETE", this.orderCrudIntegration);
    orderResourceOne.addMethod("PUT", this.orderCrudIntegration);
  }

  public api = new apigateway.RestApi(this, "api", {
    restApiName: "Archi api",
    description: "Api containing lambdas",
  });

  public productCrudIntegration = new apigateway.LambdaIntegration(
    this.props.ServiceMesh.ProductService.crud,
    {
      requestTemplates: { "application/json": '{ "statusCode": "200" }' },
    }
  );

  public orderCrudIntegration = new apigateway.LambdaIntegration(
    this.props.ServiceMesh.OrderService.crud,
    {
      requestTemplates: { "application/json": '{ "statusCode": "200" }' },
    }
  );
}
