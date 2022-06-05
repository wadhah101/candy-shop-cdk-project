# Candy shop backend

This is infrastrcture as code project Generated using the AWS CDK.
Its main functionality is to translate TS code into Cloudformation Template and deploy it on AWS.

## AWS CDK

The AWS Cloud Development Kit (AWS CDK) is an open-source next generation software development framework to define cloud application resources using familiar programming languages.

## Project Parts

This Project is devided into services, a comman API Gateway alongside with DyanamoDB table. It relies on constructs to devide the resource into relevant groups.

A construct is like an components for infrastrcture, it reduces boilerplate and helps in code reuse.

## Testing project

Task Cat : TaskCat is a tool that tests AWS CloudFormation templates. It deploys your AWS CloudFormation template in multiple AWS Regions and generates a report with a pass/fail grade for each region. You can specify the regions and number of Availability Zones you want to include in the test, and pass in parameter values from your AWS CloudFormation template. TaskCat is implemented as a Python class that you import, instantiate, and run.

The main interest in testing CDK projects is :

- Unti Testing Lambda functions

- Integration Testing : Template Code Generation

- Static testing using CDK Nag for security and best practises

- System Testing using task cat

### Unit testing

### Template code generation

### Static testing with CDK Nag

### System Testing using task cat

## Devops Project

The CDK pipeline will consist of building the project, performing the tests and deploying it.

# candy-shop-cdk-project
