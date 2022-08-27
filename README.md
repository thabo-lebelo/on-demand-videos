# Template for "Init AWS CloudFront/S3 CDN"

This is a template to configure your own CDN, hosted on AWS.

It uses the following components:
- AWS S3: For storing files in an AWS Bucket
- AWS CloudFront: For applying a CDN on top of the AWS S3 Bucket and using a custom domain for the hosted files
- AWS Route 53: For using a Hosted Zone and a SSL Certificate

> Forked from https://github.com/thabo-lebelo/on-demand-videos

---
<details>
<summary>ℹ️ "Welcome to your CDK TypeScript project!" original documentation</summary>
# Welcome to your CDK TypeScript project!

This is a blank project for TypeScript development with CDK.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template
</details>
