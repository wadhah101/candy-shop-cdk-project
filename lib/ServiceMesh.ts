import { SubscriptionService } from "./SubscriptionService/SubscriptionService";
import { AuthService } from "./AuthService/AuthService";
import { OrderService } from "./OrderService/OrderService";
import { ProductService } from "./ProductService/ProductService";
import { Construct } from "constructs";
import { ITable } from "aws-cdk-lib/aws-dynamodb";

interface Props {
  productTable: ITable;
  orderTable: ITable;
  authTable: ITable;
  subscriptionTable: ITable;
}

export class ServiceMesh extends Construct {
  constructor(scope: Construct, id: string, private props: Props) {
    super(scope, id);

    this.props.productTable.grantFullAccess(this.ProductService.crud);
    this.props.orderTable.grantFullAccess(this.OrderService.crud);
    this.props.authTable.grantFullAccess(this.AuthService.crud);
    this.props.subscriptionTable.grantFullAccess(this.AuthService.crud);
  }

  public ProductService = new ProductService(this, "productService", {
    table: this.props.productTable,
  });
  public OrderService = new OrderService(this, "orderService", {
    table: this.props.orderTable,
  });
  public AuthService = new AuthService(this, "authService", {
    table: this.props.authTable,
  });
  public SubscriptionService = new SubscriptionService(
    this,
    "subscriptionService",
    { table: this.props.subscriptionTable }
  );
}
