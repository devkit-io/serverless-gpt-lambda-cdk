import {Stage, StageProps} from "aws-cdk-lib";
import {Construct} from "constructs";
import {DeploymentStack} from "./stack";

interface BackendServiceStageProps extends StageProps {
  openAiSecretName: string;
  envVars?: Record<string, string>,

}

export class BackendServiceStage extends Stage {

  constructor(scope: Construct, id: string, props: BackendServiceStageProps) {
    super(scope, id, props);

    new DeploymentStack(this, 'BackendStack', {
      openAiSecretName: props.openAiSecretName,
    });
  }

}
