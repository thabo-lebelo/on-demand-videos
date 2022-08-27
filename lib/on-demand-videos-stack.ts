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

export class OnDemandVideosStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Create an S3 bucket
    const videoBucket = new Bucket(this, 'videoBucket', {
      versioned: false,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // Create a CloudFront origin access identity
    const originAccessIdentity = new OriginAccessIdentity(this, 'cloudfrontOAI', {
      comment: 'OAI for web application cloudfront distribution',
    });

    /* DNS, DOMAINS, CERTS */
    // I'm using a domain I own: thabolebelo.com
    const zone = route53.HostedZone.fromLookup(this, 'HostedZone', {
      domainName: 'thabolebelo.com',
    });

    const cert = new Certificate(this, 'Certificate', {
      domainName: 'videos.thabolebelo.com',
      subjectAlternativeNames: ['*.videos.thabolebelo.com'],
      validation: CertificateValidation.fromDns(zone),
    });

    // Creating CloudFront distribution
    const cloudFrontDist = new Distribution(this, 'cloudfrontDist', {
      defaultBehavior: {
        origin: new origins.S3Origin(videoBucket as any, {
          originAccessIdentity: originAccessIdentity as any,
        }) as any,
        allowedMethods: AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      domainNames: ['videos.thabolebelo.com'],
      certificate: cert,
    });

    // create DNS record to route traffic to CloudFront
    const dnsRecord = new route53.ARecord(this, 'videosSubdomain', {
      zone,
      recordName: 'videos',
      target: route53.RecordTarget.fromAlias(
        new route53Targets.CloudFrontTarget(cloudFrontDist),
      ),
      ttl: Duration.seconds(300),
      comment: 'videos subdomain',
    });

    new CfnOutput(this, 'SubDomain', {
      value: dnsRecord.domainName,
    });

    new CfnOutput(this, 'Domain', {
      value: cloudFrontDist.distributionDomainName,
    });

    new CfnOutput(this, 'Bucket', {
      value: videoBucket.bucketName,
    });

  }
}
