#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { OnDemandVideosStack } from '../lib/on-demand-videos-stack';

const app = new cdk.App();
new OnDemandVideosStack(app, 'OnDemandVideosStack', {
    stackName: "on-demand-videos",
    description: "Hosting on-demand streaming video with Amazon S3, Amazon CloudFront, and Amazon Route 53",
    env: { account: '123456789012', region: 'us-east-1' }
});