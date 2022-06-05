#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { ArchiStack } from "../lib/archi-stack";

const app = new cdk.App();
new ArchiStack(app, "ArchiStack", {
  tags: {
    owner: "wadhah",
    project: "archi",
  },
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: "us-east-1",
  },
});
