import {Stack, StackProps} from "aws-cdk-lib";
import {Construct} from "constructs";
import {ApprovedNodeLambda} from "./constructs/approvedNodeLambdaConstruct";
import {Cors, LambdaIntegration, RestApi} from "aws-cdk-lib/aws-apigateway";
import {Secret} from "aws-cdk-lib/aws-secretsmanager";

export interface DeploymentStackProps extends StackProps {
  openAiSecretName: string;
  envVars?: Record<string, string>,
}

export class DeploymentStack extends Stack {
  constructor(scope: Construct, id: string, props: DeploymentStackProps) {
    super(scope, id, props);

    const openAiSecret = Secret.fromSecretNameV2(this, 'openAiSecret', props.openAiSecretName);

    const serverFunction = new ApprovedNodeLambda(this, 'backend-server', {
      codeDir: '../source/',
      description: 'backend server lambda function',
      handler: 'src/lambdaServer.handler',
      runtimeEnvironment: props.envVars ?? {}
    });

    openAiSecret.grantRead(serverFunction.lambda);

    const api = new RestApi(this, 'api', {
      restApiName: 'BackendApi',
      description: 'Api gateway for backend api',
      binaryMediaTypes: ['*/*']
    });

    api.root.addProxy({
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS,
      },
      defaultIntegration: new LambdaIntegration(serverFunction.lambda, {
        proxy: true
      }),

    });
  }
}