import {
  WICDS_CONFIG_DIR, WICDS_HELPER_SCRIPT_NAME, WICDS_PID_DIR, WICDS_USER,
} from '../constants';
import File from './File';

export default class WicdsServiceFile extends File {
  constructor() {
    super('\n');
    this.write('[Unit]');
    this.write('Description=World in Conflict: Dedicated Server - %i');
    this.write('After=network.target windows.service');
    this.write('StartLimitIntervalSec=0');

    this.write('[Service]');
    this.write('Type=forking');
    this.write('Restart=always');
    this.write('RestartSec=1');
    this.write(`User=${WICDS_USER}`);
    this.write(`ExecStart=${WICDS_HELPER_SCRIPT_NAME} start %i`);
    this.write('TimeoutSec=120');
    this.write(`PIDFile=${WICDS_PID_DIR}/%i.pid`);
    this.write('KillMode=process');

    this.write(`EnvironmentFile=${WICDS_CONFIG_DIR}/environment`);

    this.write('[Install]');
    this.write('WantedBy=multi-user.target');
  }
}
