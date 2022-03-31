import File from './File';

export default class WicDsCycleTxtFile extends File {
    constructor(instanceKey: string, config: any) {
        super();
        this.write(...(config.Instances[instanceKey].MapCycle || config.Defaults.MapCycle), '');
    }
}
