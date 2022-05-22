import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { OpenIdConnectProvider, OpenIdConnectPrincipal, Role, PolicyDocument, PolicyStatement, Effect } from "aws-cdk-lib/aws-iam";


export class AwsCdkOicdStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    /**
     * Create an Identity provider for GitHub inside your AWS Account. This
     * allows GitHub to present itself to AWS IAM and assume a role.
     */
    const provider = new OpenIdConnectProvider(this, "MyProvider", {
      url: "https://token.actions.githubusercontent.com",
      clientIds: ["sts.amazonaws.com"],
    });

    const githubOrganisation = "josephedward";
    const repoName = "aws-cdk_oicd";
    /**
     * Create a principal for the OpenID; which can allow it to assume
     * deployment roles.
     */
    const GitHubPrincipal = new OpenIdConnectPrincipal(provider).withConditions(
      {
        StringLike: {
          "token.actions.githubusercontent.com:sub": `repo:${githubOrganisation}/${repoName}:*`,
        },
      }
    );
/**
  * Create a deployment role that has short lived credentials. The only
  * principal that can assume this role is the GitHub Open ID provider.
  *
  * This role is granted authority to assume aws cdk roles; which are created
  * by the aws cdk v2.
  */
 new Role(this, 'GitHubActionsRole', {
  assumedBy: GitHubPrincipal,
  description:
    'Role assumed by GitHubPrincipal for deploying from CI using aws cdk',
  roleName: 'github-ci-role',
  inlinePolicies: {
    CdkDeploymentPolicy: new PolicyDocument({
      assignSids: true,
      statements: [
        new PolicyStatement({
          effect: Effect.ALLOW,
          actions: ['sts:AssumeRole'],
          resources: [`arn:aws:iam::${this.account}:role/cdk-*`],
        }),
      ],
    }),
  },
});
    
  }
  
}
