import { InitCommand, InitConfig, InitElement, InitFile, InitService, InitSource } from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";

import * as YAML from 'yaml'
import * as fs from 'fs'
import WicDsIniFile from "../Files/WicDsIniFile";
import WicDsMotdTxtFile from "../Files/WicDsMotdTxtFile";
import WicDsCycleTxtFile from "../Files/WicDsCycleTxtFile";
import WicDsBanlistTxtFile from "../Files/WicDsBanlistTxtFile";
import WicdsServiceFile from "../Files/WicdsServiceFile";
import { WICDS_HELPER_SCRIPT_NAME, WICDS_PID_DIR, WICDS_SERVICE_NAME, WICDS_USER } from "../constants";


const WICDS_CONNFIG = YAML.parse(fs.readFileSync(`./${process.env.CONFIG_YAML_FILE ?? 'config.yaml'}`).toString())

const instances = Object.keys(WICDS_CONNFIG.Instances).reduce<InitElement[]>((acc, instance) => {
    return [
        ...acc,
        InitCommand.shellCommand(`systemctl enable ${WICDS_SERVICE_NAME}@${instance} && service ${WICDS_SERVICE_NAME}@${instance} start`),
        InitFile.fromString(`/etc/wicds/${instance}/wic_ds.ini`, (new WicDsIniFile(instance, WICDS_CONNFIG)).toString() || ' '),
        InitFile.fromString(`/etc/wicds/${instance}/wic_ds_motd.txt`, (new WicDsMotdTxtFile(instance, WICDS_CONNFIG)).toString() || ' '),
        InitFile.fromString(`/etc/wicds/${instance}/wic_ds_cycle.txt`, (new WicDsCycleTxtFile(instance, WICDS_CONNFIG)).toString() || ' '),
        InitFile.fromString(`/etc/wicds/${instance}/wic_ds_banlist.txt`, (new WicDsBanlistTxtFile(instance, WICDS_CONNFIG)).toString() || ' '),
    ]
}, [])

export default (scope: Construct) => new InitConfig([
  InitFile.fromAsset(`/usr/local/bin/${WICDS_HELPER_SCRIPT_NAME}`, './scripts/wicds-manager', { mode: '000755' }),
  InitFile.fromString(`/etc/systemd/system/${WICDS_SERVICE_NAME}@.service`, (new WicdsServiceFile()).toString()),
  InitCommand.shellCommand(`mkdir ${WICDS_PID_DIR} && chown -R ${WICDS_USER}:${WICDS_USER} ${WICDS_PID_DIR} || true`),
  InitCommand.shellCommand(`sudo -Hu ${WICDS_USER} ${WICDS_HELPER_SCRIPT_NAME} install`),
  InitCommand.shellCommand('systemctl daemon-reload'),
  ...instances,
])