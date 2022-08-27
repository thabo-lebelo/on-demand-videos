#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import 'source-map-support/register';
import { InitCdnStack } from '../lib/init-cdn-stack';

const app = new cdk.App();
new InitCdnStack(app, 'CDNStack', {
  stackName: 'cdn',
  description: 'Hosting on-demand streaming video with Amazon S3, Amazon CloudFront, and Amazon Route 53',
  env: { account: '123456789012', region: 'us-east-1' },
});
