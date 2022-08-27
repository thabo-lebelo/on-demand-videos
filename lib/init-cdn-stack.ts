import {
  CfnOutput,
  Duration,
  RemovalPolicy,
  Stack,
  StackProps,
} from 'aws-cdk-lib';
import {
  Certificate,
  CertificateValidation,
} from 'aws-cdk-lib/aws-certificatemanager';
import {
  AllowedMethods,
  Distribution,
  OriginAccessIdentity,
  ViewerProtocolPolicy,
} from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as route53Targets from 'aws-cdk-lib/aws-route53-targets';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

const config = require('../config.json');

export class InitCdnStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Create an S3 bucket, to host all files that'll be stored into our CDN
    const cdnBucket = new Bucket(this, config.s3.bucketId, {
      versioned: false,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // Create a CloudFront origin access identity
    const originAccessIdentity = new OriginAccessIdentity(this, `${config.stack.name}CloudfrontOAI`, {
      comment: 'Origin Access Identity (OAI) for web application cloudfront distribution',
    });

    /* DNS, DOMAINS, CERTS */
    const zone = route53.HostedZone.fromLookup(this, `${config.stack.name}HostedZone`, {
      domainName: config.route53.domainName,
    });

    const cert = new Certificate(this, `${config.stack.name}Certificate`, {
      domainName: config.customDomain.domainName,
      subjectAlternativeNames: [config.customDomain.subjectAlternativeNames],
      validation: CertificateValidation.fromDns(zone),
    });

    // Creating CloudFront distribution
    const cloudFrontDist = new Distribution(this, `${config.stack.name}CloudfrontDist`, {
      defaultBehavior: {
        origin: new origins.S3Origin(cdnBucket as any, {
          originAccessIdentity: originAccessIdentity as any,
        }) as any,
        allowedMethods: AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      domainNames: [config.customDomain.domainName],
      certificate: cert,
    });

    // create DNS record to route traffic to CloudFront
    const dnsRecord = new route53.ARecord(this, `${config.stack.name}Subdomain`, {
      zone,
      recordName: config.stack.name,
      target: route53.RecordTarget.fromAlias(
        new route53Targets.CloudFrontTarget(cloudFrontDist),
      ),
      ttl: Duration.seconds(300),
      comment: `${config.stack.name} subdomain`,
    });

    new CfnOutput(this, 'SubDomain', {
      value: dnsRecord.domainName,
    });

    new CfnOutput(this, 'Domain', {
      value: cloudFrontDist.distributionDomainName,
    });

    new CfnOutput(this, 'Bucket', {
      value: cdnBucket.bucketName,
    });
  }
}
