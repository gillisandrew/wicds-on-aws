import File from './File';

export default class CfnHupConfFile extends File {
    constructor(stackId: string, region: string) {
        super('\n');
        this.write('[main]');
        this.write(`stack=${stackId}`);
        this.write(`region=${region}`);
        this.write('interval=1');
    }
}
