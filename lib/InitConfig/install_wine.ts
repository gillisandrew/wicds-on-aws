import { InitCommand, InitConfig, InitFile, InitPackage } from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";

export default (scope: Construct) => new InitConfig([
    InitPackage.apt('winehq-stable'),
    InitFile.fromAsset('/usr/local/bin/download-mono', './scripts/download-mono', { mode: '000755' }),
    InitCommand.shellCommand(`download-mono "$(wine --version | sed -E \'s/^wine-//\')"`)
  ])