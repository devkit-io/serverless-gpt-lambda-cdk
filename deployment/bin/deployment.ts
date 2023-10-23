#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import {BackendPipelineStack} from '../lib/pipeline';
import {configuration as config} from "./config"

const app = new cdk.App();
new BackendPipelineStack(app, `${config.repoName}-GptPipelineStack`, {
    env: {
        account: config.account,
        region: config.region
    },
    repoOwner: config.repoOwner,
    repoName: config.repoName,
    branch: config.codeBranch,
    connectionArn: config.connectionArn,
    account: config.account,
    region: config.region,
    openAiSecretName: config.openAiSecretName,
});
