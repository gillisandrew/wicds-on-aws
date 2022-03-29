import { Stack } from "aws-cdk-lib";
import { CfnInstance, InitCommand, InitConfig, InitFile } from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";
import CfnAutoReloaderConfFile from "../Files/CfnAutoReloaderConfFile";
import CfnHupConfFile from "../Files/CfnHupConfFile";
import CfnHupServiceFile from "../Files/CfnHupServiceFile";

export default (scope: Construct) => new InitConfig([
  InitFile.fromString('/etc/cfn/cfn-hup.conf', new CfnHupConfFile(Stack.of(scope).stackId, Stack.of(scope).region).toString()),
  InitFile.fromString('/etc/cfn/hooks.d/cfn-auto-reloader.conf', (new CfnAutoReloaderConfFile((scope.node.defaultChild as CfnInstance).logicalId, Stack.of(scope).stackName, Stack.of(scope).region)).toString()),
  InitFile.fromString('/etc/systemd/system/cfn-hup.service', (new CfnHupServiceFile()).toString()),
  InitCommand.shellCommand('systemctl start cfn-hup && systemctl enable cfn-hup'),
])