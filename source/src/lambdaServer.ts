import serverlessExpress from '@vendia/serverless-express';
import {app} from './app';
import AWS from 'aws-sdk';

let serverlessExpressInstance: any;

async function retrieveSecret(secretName: string): Promise<string | undefined> {
  const secretsManager = new AWS.SecretsManager({
    region: process.env.AWS_REGION ?? 'us-west-2'
  });

  try {
    const data = await secretsManager.getSecretValue({ SecretId: secretName }).promise();

    if (data && data.SecretString) {
      return data.SecretString;
    }

    // If the secret is binary, you can access it using `data.SecretBinary`.

    return undefined;
  } catch (err) {
    console.error('Error retrieving the secret:', err);
    throw err;
  }
}

async function asyncTask () {
  const openAiSecret = await retrieveSecret('prod/Openai');
  return {openAiSecret}
}

async function setup (event: any, context: any) {
  const {openAiSecret}  = await asyncTask();
  process.env.OPENAI_API_KEY = openAiSecret;

  serverlessExpressInstance = serverlessExpress({ app })
  return serverlessExpressInstance(event, context)
}

export function handler (event: any, context: any) {
  if (serverlessExpressInstance) return serverlessExpressInstance(event, context)

  return setup(event, context)
}

