import File from "./File";

export default class WicDsBanlistTxtFile extends File {
    constructor(instanceKey: string, config: any) {
        super()
        this.write(...(config.Instances[instanceKey].BanList || config.Defaults.BanList), '')
    }
}