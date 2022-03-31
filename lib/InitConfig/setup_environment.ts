import { InitCommand, InitConfig, InitFile, InitPackage } from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";
import { env } from "../constants";

export default (scope: Construct) => new InitConfig([
    InitFile.fromString('/etc/profile.d/wicds-environment.sh', env.join('\n'), {
        mode: '000755'
    })
])