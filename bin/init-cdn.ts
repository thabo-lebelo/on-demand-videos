#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import 'source-map-support/register';
import { InitCdnStack } from '../lib/init-cdn-stack';

const app = new cdk.App();
new InitCdnStack(app, 'CDNStack', {
  stackName: 'cdn',
  description: 'CDN powered by AWS S3, AWS CloudFront, and AWS Route 53',
  env: { account: '123456789012', region: 'us-east-1' },
});
