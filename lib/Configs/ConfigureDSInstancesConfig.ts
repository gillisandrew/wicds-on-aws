import {
  InitCommand, InitConfig, InitElement, InitFile,
} from 'aws-cdk-lib/aws-ec2';
import * as fs from 'fs';
import * as YAML from 'yaml';
import { WICDS_SERVICE_NAME } from '../constants';
import WicDsBanlistTxtFile from '../Files/WicDsBanlistTxtFile';
import WicDsCycleTxtFile from '../Files/WicDsCycleTxtFile';
import WicDsIniFile from '../Files/WicDsIniFile';
import WicDsMotdTxtFile from '../Files/WicDsMotdTxtFile';

const WICDS_CONFIG = YAML.parse(fs.readFileSync(`./${process.env.CONFIG_YAML_FILE ?? 'config.yaml'}`).toString());

export default () => new InitConfig([
  ...Object.keys(WICDS_CONFIG.Instances).reduce<InitElement[]>((acc, instance) => [
    ...acc,
    InitCommand.shellCommand(`systemctl enable ${WICDS_SERVICE_NAME}@${instance}`),
    InitCommand.shellCommand(`service ${WICDS_SERVICE_NAME}@${instance} start`),
    InitFile.fromString(`/etc/wicds/${instance}/wic_ds.ini`, (new WicDsIniFile(instance, WICDS_CONFIG)).toString() || ' '),
    InitFile.fromString(`/etc/wicds/${instance}/wic_ds_motd.txt`, (new WicDsMotdTxtFile(instance, WICDS_CONFIG)).toString() || ' '),
    InitFile.fromString(`/etc/wicds/${instance}/wic_ds_cycle.txt`, (new WicDsCycleTxtFile(instance, WICDS_CONFIG)).toString() || ' '),
    InitFile.fromString(`/etc/wicds/${instance}/wic_ds_banlist.txt`, (new WicDsBanlistTxtFile(instance, WICDS_CONFIG)).toString() || ' '),
  ], []),
]);
