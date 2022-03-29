#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { WICDSStack } from '../lib/wicds-stack';

const app = new cdk.App();
new WICDSStack(app, 'WICDSStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.AWS_REGION },
});