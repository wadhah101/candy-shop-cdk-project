# Candy shop backend

This is infrastrcture as code project Generated using the AWS CDK.
Its main functionality is to translate TS code into Cloudformation Template and deploy it on AWS.

## AWS CDK

The AWS Cloud Development Kit (AWS CDK) is an open-source next generation software development framework to define cloud application resources using familiar programming languages.

## Project Parts

This Project is devided into services, a comman API Gateway alongside with DyanamoDB table. It relies on constructs to devide the resources into relevant groups.

A construct is like components for infrastrcture, it reduces boilerplate and helps in code reuse.

## Testing project

Task Cat : TaskCat is a tool that tests AWS CloudFormation templates. It deploys your AWS CloudFormation template in multiple AWS Regions and generates a report with a pass/fail grade for each region. You can specify the regions and number of Availability Zones you want to include in the test, and pass in parameter values from your AWS CloudFormation template. TaskCat is implemented as a Python class that you import, instantiate, and run.

The main interest in testing CDK projects is :

- Integration Testing : Lambda function

- System Testing : Template Code Generation

- Static testing using CDK Nag for security and best practises

- System Testing using task cat

### Integration Testing : Lambda function

We are testing to see if the item creation lambda succeeds with status code of 200
Jest is used for this test with file : test/createOne.test.ts

```typescript
const event = JSON.parse(fs.readFileSync("test/create.event.json", "utf-8"));
test("Can Create One Product", async () => {
  const result = await createOne(event, "products");
  expect(result).toMatchObject({ statusCode: 200 });
  return result;
});

```

### Template code generation

Our resource template contains a lot of resources and with adding more constructs making sure that the desired new resource is present manually grows harder.

The solution is to generate the template and test for its presence.

In the following example we are going to check if proper api gateway resource is generated

### Static testing with CDK Nag

### System Testing using task cat

## Devops Project

The CDK pipeline will consist of building the project, performing the tests and deploying it.

