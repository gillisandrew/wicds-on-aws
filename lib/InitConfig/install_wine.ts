import { InitCommand, InitConfig, InitFile, InitPackage } from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";
import WineserverServiceFile from "../Files/WineserverServiceFile";

export default (scope: Construct) => new InitConfig([
    InitPackage.apt('winehq-stable'),
    InitFile.fromString('/etc/systemd/system/wineserver.service', (new WineserverServiceFile()).toString()),
    InitFile.fromAsset('/usr/local/bin/download-mono', './scripts/download-mono', { mode: '000755' }),
    InitCommand.shellCommand(`download-mono "$(wine --version | sed -E \'s/^wine-//\')"`),
    InitCommand.shellCommand(`systemctl enable wineserver`)
])