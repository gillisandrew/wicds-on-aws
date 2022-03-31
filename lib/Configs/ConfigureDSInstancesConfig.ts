import {
    InitCommand, InitConfig, InitElement, InitFile,
} from 'aws-cdk-lib/aws-ec2';
import * as fs from 'fs';
import * as YAML from 'yaml';
import { CONFIG_FILE_NAME, WICDS_CONFIG_DIR, WICDS_SERVICE_NAME } from '../constants';
import WicDsBanlistTxtFile from '../Files/WicDsBanlistTxtFile';
import WicDsCycleTxtFile from '../Files/WicDsCycleTxtFile';
import WicDsIniFile from '../Files/WicDsIniFile';
import WicDsMotdTxtFile from '../Files/WicDsMotdTxtFile';

const WICDS_CONFIG = YAML.parse(fs.readFileSync(`./${CONFIG_FILE_NAME}`).toString());

export default () => new InitConfig([
    ...Object.keys(WICDS_CONFIG.Instances).reduce<InitElement[]>((acc, instance) => [
        ...acc,
        InitCommand.shellCommand(`systemctl enable ${WICDS_SERVICE_NAME}@${instance}`),
        InitCommand.shellCommand(`service ${WICDS_SERVICE_NAME}@${instance} start`),
        InitFile.fromString(`${WICDS_CONFIG_DIR}/${instance}/wic_ds.ini`, (new WicDsIniFile(instance, WICDS_CONFIG)).toString() || ' '),
        InitFile.fromString(`${WICDS_CONFIG_DIR}/${instance}/wic_ds_motd.txt`, (new WicDsMotdTxtFile(instance, WICDS_CONFIG)).toString() || ' '),
        InitFile.fromString(`${WICDS_CONFIG_DIR}/${instance}/wic_ds_cycle.txt`, (new WicDsCycleTxtFile(instance, WICDS_CONFIG)).toString() || ' '),
        InitFile.fromString(`${WICDS_CONFIG_DIR}/${instance}/wic_ds_banlist.txt`, (new WicDsBanlistTxtFile(instance, WICDS_CONFIG)).toString() || ' '),
    ], []),
]);
