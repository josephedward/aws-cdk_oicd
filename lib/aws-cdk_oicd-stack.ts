import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CfnOicdStack } from 'aws-cdk-lib/aws_iam/OpenIdConnectProvider';

export class AwsCdkOicdStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

/**
 * Create an Identity provider for GitHub inside your AWS Account. This
 * allows GitHub to present itself to AWS IAM and assume a role.
 */
 const provider = new OpenIdConnectProvider(this, 'MyProvider', {
  url: 'https://token.actions.githubusercontent.com',
  clientIds: ['sts.amazonaws.com'],
});
  }
}
