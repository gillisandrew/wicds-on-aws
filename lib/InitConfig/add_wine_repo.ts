import { InitCommand, InitConfig, InitFile, InitSource } from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";

export default (scope: Construct) => new InitConfig([
    InitFile.fromAsset('/usr/local/bin/add-wine-repo', './scripts/add-wine-repo', { mode: '000755' }),
    InitCommand.shellCommand('add-wine-repo'),
    InitCommand.shellCommand('dpkg --add-architecture i386'),
    InitCommand.shellCommand('apt-get update -y'),
])