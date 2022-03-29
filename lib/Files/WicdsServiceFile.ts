import File from "./File";

export default class WicdsServiceFile extends File {
    constructor() {
        super('\n')
        this.write('[Unit]')
        this.write('Description=World in Conflict: Dedicated Server')
        this.write('After=network.target')
        this.write('StartLimitIntervalSec=0')

        this.write('[Service]')
        this.write('Type=simple')
        this.write('Restart=always')
        this.write('RestartSec=1')
        this.write('User=wicds')
        this.write('ExecStart=/usr/local/bin/wicds start %i')
        this.write('KillMode=process')
        this.write('TimeoutSec=120')

        this.write('[Install]')
        this.write('WantedBy=multi-user.target')
    }
}