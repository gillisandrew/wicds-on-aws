import { InitCommand, InitConfig, InitFile, InitPackage, InitSource, InitUser } from "aws-cdk-lib/aws-ec2";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";
import { WICDS_USER } from "../constants";


export default (scope: Construct) => new InitConfig([
    InitSource.fromS3Object('/usr/local/src/wicds', Bucket.fromBucketName(scope, 'WicdsInstallAssetsBucket', 'wicdsinstallassetsstack-bucket83908e77-sh3yb82xboev'), 'wicds.zip'),
    InitPackage.apt('xvfb'),
    InitPackage.apt('x11-utils'),
    InitPackage.apt('xdotool'),
    InitUser.fromName(WICDS_USER, {
        homeDir: `/home/${WICDS_USER}`,
    }),
    InitCommand.shellCommand(`mkdir /home/${WICDS_USER} && chown -R ${WICDS_USER}:${WICDS_USER} /home/${WICDS_USER}`),
  ])