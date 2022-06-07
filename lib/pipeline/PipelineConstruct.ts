import { Construct } from "constructs";

import {
  aws_codecommit,
  aws_iam,
  aws_lambda_nodejs,
  Duration,
} from "aws-cdk-lib";
import { ITable } from "aws-cdk-lib/aws-dynamodb";

import {
  StackProps,
  aws_codepipeline as codepipeline,
  aws_codebuild as codebuild,
  aws_codepipeline_actions as actions,
  SecretValue,
  aws_codepipeline_actions,
  aws_cloudfront,
} from "aws-cdk-lib";
import { IRepository } from "aws-cdk-lib/aws-ecr";
import { IBaseService, IService } from "aws-cdk-lib/aws-ecs";
import { IBucket } from "aws-cdk-lib/aws-s3";

interface Props {}

export class PipelineDeployTest extends Construct {
  constructor(scope: Construct, id: string, private props: Props) {
    super(scope, id);
  }

  private adminRole = new aws_iam.Role(this, "Role", {
    assumedBy: new aws_iam.ServicePrincipal("codebuild.amazonaws.com"),
    managedPolicies: [
      aws_iam.ManagedPolicy.fromAwsManagedPolicyName("AdministratorAccess"),
    ],
    description: "Policy used to deploy infrastructure",
  });

  private sourceActions = new actions.GitHubSourceAction({
    owner: "wadhah101",
    repo: "candy-shop-cdk-project",
    oauthToken: SecretValue.secretsManager("GITHUB_TOKEN"),
    actionName: "sourceFromGithub",
    output: new codepipeline.Artifact("Source"),
    branch: "master",
  });

  TestingCodeBuildProject = new codebuild.PipelineProject(
    this,
    "CodeBuildProject",
    {
      // role: this.adminRole,
      environment: {
        privileged: true,
        buildImage: codebuild.LinuxBuildImage.STANDARD_5_0,
        computeType: codebuild.ComputeType.MEDIUM,
      },
      buildSpec: codebuild.BuildSpec.fromObject({
        version: 0.2,
        phases: {
          install: {
            "runtime-versions": { nodejs: "14" },
            commands: ["n 16", "npm install -g pnpm", "pnpm install"],
          },
          pre_build: {
            commands: ["echo initialise..."],
          },
          build: {
            commands: ["echo Build started on `date`", "npm run test-ci"],
          },
        },
        reports: {
          "candy-shop-report-grouo": {
            files: ["junit.xml"],
            "file-format": "JUNITXML",
          },
        },
      }),
    }
  );

  DeploygCodeBuildProject = new codebuild.PipelineProject(
    this,
    "CodeBuildProjectDeploy",
    {
      role: this.adminRole,
      environment: {
        privileged: true,
        buildImage: codebuild.LinuxBuildImage.STANDARD_5_0,
        computeType: codebuild.ComputeType.MEDIUM,
      },
      buildSpec: codebuild.BuildSpec.fromObject({
        version: 0.2,
        phases: {
          install: {
            "runtime-versions": { nodejs: "14" },
            commands: ["n 16", "npm install -g pnpm", "pnpm install"],
          },
          pre_build: {
            commands: ["echo initialise..."],
          },
          build: {
            commands: ["echo Build started on `date`", "npm run cdk deploy"],
          },
        },
      }),
    }
  );

  private testAction = new actions.CodeBuildAction({
    actionName: "TestAction",
    runOrder: 1,
    project: this.TestingCodeBuildProject,
    input: new codepipeline.Artifact("Source"),
    outputs: [new codepipeline.Artifact("TestOutput")],
    environmentVariables: {},
  });

  private deployAction = new actions.CodeBuildAction({
    actionName: "deployAction",
    runOrder: 1,
    project: this.DeploygCodeBuildProject,
    input: new codepipeline.Artifact("Source"),
    outputs: [new codepipeline.Artifact("DeployOutput")],
    environmentVariables: {},
  });

  private buildImagePipeline = new codepipeline.Pipeline(
    this,
    "TestDeployPipeline",
    {
      pipelineName: `test-deploy-candyshop`,

      stages: [
        { stageName: "source", actions: [this.sourceActions] },
        {
          stageName: "build",
          actions: [this.testAction],
        },
        { stageName: "deploy", actions: [this.deployAction] },
      ],
    }
  );
}
