import {DockerImage, Duration} from 'aws-cdk-lib';
import {Alarm, Metric} from 'aws-cdk-lib/aws-cloudwatch';
import {LambdaDeploymentConfig, LambdaDeploymentGroup} from 'aws-cdk-lib/aws-codedeploy';
import {Alias, AssetCode, Function, IFunction, Runtime} from 'aws-cdk-lib/aws-lambda';
import {Construct} from 'constructs';

export interface ApprovedLambdaProps {
  readonly alarmThreshold?: number;
  readonly alarmEvaluationPeriod?: number;
  readonly codeDir: string;
  readonly bundleCommand?: string[];
  readonly bundleEnvironment?: Record<string, string>;
  readonly description: string;
  readonly handler: string;
  readonly image?: DockerImage;
  readonly memorySize?: number;
  readonly runtimeDuration?: Duration;
  readonly runtimeEnvironment?: Record<string, string>;
}

export interface ApprovedNodeLambdaProps extends ApprovedLambdaProps {
}

export class ApprovedNodeLambda extends Construct {
  readonly alarm: Alarm;
  readonly lambda: IFunction;
  readonly deploymentGroup: LambdaDeploymentGroup;

  constructor(scope: Construct, id: string, props: ApprovedNodeLambdaProps) {
    super(scope, id);

    const codeAsset = AssetCode.fromAsset(props.codeDir, {
      bundling: {
        image: Runtime.NODEJS_18_X.bundlingImage,
        command: props.bundleCommand ?? [
          'bash', '-c', `
        export npm_config_cache=/tmp/.npm &&
        npm install &&
        npm run build &&
        cp -au node_modules /asset-output &&
        cp -au build/* /asset-output
        `,
        ],
        environment: props.bundleEnvironment,
      },
    });

    const task = new Function(this, 'function', {
      runtime: Runtime.NODEJS_18_X,
      timeout: props.runtimeDuration ?? Duration.minutes(1),
      description: props.description,
      handler: props.handler,
      code: codeAsset,
      memorySize: props.memorySize ?? 2048,
      environment: props.runtimeEnvironment ?? {}
    });

    this.lambda = task;

    const funcErrorMetric = new Metric({
      metricName: 'Errors',
      namespace: 'AWS/Lambda',
      dimensionsMap: {
        FunctionName: task.functionName,
      },
      statistic: 'Sum',
      period: Duration.minutes(1),
    });

    this.alarm = new Alarm(this, 'RollbackAlarm', {
      metric: funcErrorMetric,
      threshold: props.alarmThreshold ?? 1,
      evaluationPeriods: props.alarmEvaluationPeriod ?? 1,
    });

    const alias = new Alias(this, 'x', {
      aliasName: 'Current',
      version: task.currentVersion,
    });

    this.deploymentGroup = new LambdaDeploymentGroup(this, 'DeploymentGroup', {
      alias,
      deploymentConfig: LambdaDeploymentConfig.LINEAR_10PERCENT_EVERY_1MINUTE,
      alarms: [this.alarm],
    });
  }
}
