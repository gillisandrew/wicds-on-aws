import File from "./File";

export default class WineserverServiceFile extends File {
    constructor() {
        super('\n')
        this.write('[Unit]')
        this.write('Description=Turn on wineserver')

        this.write('[Service]')
        this.write('Type=oneshot')
        this.write('ExecStart=/opt/wine-stable/bin/wineserver -p')
        this.write('RemainAfterExit=yes')
        this.write('User=wicds')

        this.write('[Install]')
        this.write('WantedBy=multi-user.target')
    }
}