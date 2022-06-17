import { Construct } from 'constructs';
import { Bucket } from "aws-cdk-lib/aws-s3"
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import {
    OriginAccessIdentity, AllowedMethods,
    ViewerProtocolPolicy, Distribution
} from "aws-cdk-lib/aws-cloudfront";
import {
    Stack, StackProps,
    CfnOutput, RemovalPolicy
} from 'aws-cdk-lib';

export class OnDemandVideosStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        // Create an S3 bucket
        const videoBucket = new Bucket(this, "videoBucket", {
            versioned: false,
            removalPolicy: RemovalPolicy.DESTROY,
        });

        // Create a CloudFront origin access identity
        const originAccessIdentity = new OriginAccessIdentity(this, "cloudfrontOAI", {
            comment: "OAI for web application cloudfront distribution",
        });

        // Creating CloudFront distribution
        const cloudFrontDist = new Distribution(this, "cloudfrontDist", {
            defaultBehavior: {
                origin: new origins.S3Origin(videoBucket as any, {
                    originAccessIdentity: originAccessIdentity as any,
                }) as any,
                allowedMethods: AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
                viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS
            },
        });

        new CfnOutput(this, "Domain", {
            value: cloudFrontDist.distributionDomainName,
        });

        new CfnOutput(this, "Bucket", {
            value: videoBucket.bucketName
        });

    }
}
