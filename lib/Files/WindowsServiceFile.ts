import {
    WICDS_CONFIG_DIR, WICDS_HELPER_SCRIPT_NAME, WICDS_USER,
} from '../constants';
import File from './File';

export default class WineserverServiceFile extends File {
    constructor() {
        super('\n');
        this.addMarker('#~~ ');
        this.write('[Unit]');
        this.write('Description=Boot windows services.');

        this.write('[Service]');
        this.write('Type=simple');
        this.write(`ExecStart=${WICDS_HELPER_SCRIPT_NAME} boot`);
        this.write(`User=${WICDS_USER}`);
        this.write(`EnvironmentFile=${WICDS_CONFIG_DIR}/environment`);
        this.write('RemainAfterExit=yes');

        this.write('[Install]');
        this.write('WantedBy=multi-user.target');
    }
}
