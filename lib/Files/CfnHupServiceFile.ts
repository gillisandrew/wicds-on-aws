import File from './File';

export default class CfnHupServiceFile extends File {
  constructor() {
    super('\n');
    this.write('[Unit]');
    this.write('Description=cfn-hup daemon');

    this.write('[Service]');
    this.write('Type=simple');
    this.write('ExecStart=/opt/aws/bin/cfn-hup -v');
    this.write('Restart=always');

    this.write('[Install]');
    this.write('WantedBy=multi-user.target');
  }
}
