#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { OnDemandVideosStack } from '../lib/on-demand-videos-stack';

const app = new cdk.App();
new OnDemandVideosStack(app, 'OnDemandVideosStack', {
  // env: { account: '123456789012', region: 'us-east-1' },
});