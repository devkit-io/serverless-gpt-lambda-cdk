# serverless-gpt-lambda-cdk

A serverless express GPT chat endpoint using AWS Lambda deployed with AWS CDK. This starter kit provides you with everything you need to set up a serverless endpoint that interacts with GPT models on AWS infrastructure.

## Features

- **Serverless**: Runs on AWS Lambda, reducing costs and scaling effortlessly.
- **Express**: Familiar ExpressJS setup making it easy for Node.js developers to get started.
- **AWS CDK**: Infrastructure as code, ensuring consistent deployments.
- **GPT-Enabled**: Integrated with GPT, allowing for natural language interactions.

## Pre-requisites

1. AWS account
2. AWS CLI installed and configured
3. Node.js & NPM
4. AWS CDK installed (`npm install -g aws-cdk`)

## Setup & Deployment

1. **Clone the Repository**:
    ```bash
    git clone https://github.com/devkit-io/serverless-gpt-lambda-cdk.git
    cd serverless-gpt-lambda-cdk
    ```

2. **Install Dependencies**:
    ```bash
    npm install
    ```

3. **Bootstrap AWS CDK** (if you haven't done this before):
    ```bash
    cdk bootstrap
    ```

4. **Deploy to AWS**:
    ```bash
    cdk deploy
    ```

After deployment, the CDK will output the API Gateway URL where your serverless endpoint is accessible.

## Usage

Send a POST request to the deployed endpoint:

```
POST /api/v1/chat
{
  "messages": [ { "role": "user", "content": "Hello, GPT!"}]
}
```

Response:
```json
{
    "role": "assistant",
    "content": "Hello, how can i help?"
}
```

## Contribution

Contributions are welcome! Fork the repo, make your changes, and submit a pull request.

## License

MIT License. See [LICENSE](LICENSE) for more information.

## Support & Issues

For any support or issues, please raise an issue on the GitHub repository.

---

Happy coding, and enjoy your serverless GPT chatbot!
