import { WICDS_INSTALL_DIRECTORY_WINDOWS } from '../constants';
import File from './File';

export default class Install1IssFile extends File {
  constructor() {
    super();
    this.write('[InstallShield Silent]');
    this.write('Version=v7.00');
    this.write('File=Response File');
    this.write('[File Transfer]');
    this.write('OverwrittenReadOnly=NoToAll');
    this.write('[{996A20B5-5C83-4ADE-92E1-7CC2C02FD0B2}-DlgOrder]');
    this.write('Dlg0={996A20B5-5C83-4ADE-92E1-7CC2C02FD0B2}-SdWelcome-0');
    this.write('Count=4');
    this.write('Dlg1={996A20B5-5C83-4ADE-92E1-7CC2C02FD0B2}-SdAskDestPath2-0');
    this.write('Dlg2={996A20B5-5C83-4ADE-92E1-7CC2C02FD0B2}-SdStartCopy2-0');
    this.write('Dlg3={996A20B5-5C83-4ADE-92E1-7CC2C02FD0B2}-SdFinish-0');
    this.write('[{996A20B5-5C83-4ADE-92E1-7CC2C02FD0B2}-SdWelcome-0]');
    this.write('Result=1');
    this.write('[{996A20B5-5C83-4ADE-92E1-7CC2C02FD0B2}-SdAskDestPath2-0]');
    this.write(`szDir=${WICDS_INSTALL_DIRECTORY_WINDOWS}`);
    this.write('Result=1');
    this.write('[{996A20B5-5C83-4ADE-92E1-7CC2C02FD0B2}-SdStartCopy2-0]');
    this.write('Result=1');
    this.write('[Application]');
    this.write('Name=World in Conflict: Soviet Assault Server');
    this.write('Version=1.0.1.0');
    this.write('Company=Massive Entertainment AB');
    this.write('Lang=0009');
    this.write('[{996A20B5-5C83-4ADE-92E1-7CC2C02FD0B2}-SdFinish-0]');
    this.write('Result=1');
    this.write('bOpt1=0');
    this.write('bOpt2=0');
  }
}
