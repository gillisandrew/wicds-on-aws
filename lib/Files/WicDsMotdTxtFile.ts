import File from './File';

export default class WicDsMotdTxtFile extends File {
    constructor(instanceKey: string, config: any) {
        super();

        if (config.GlobalConfig.MessageOfTheDayHeader) {
            this.write(config.GlobalConfig.MessageOfTheDayHeader);
        }

        this.write(
            config.Instances[instanceKey].MessageOfTheDay || config.Defaults.MessageOfTheDay,
        );

        if (config.GlobalConfig.MessageOfTheDayFooter) {
            this.write(config.GlobalConfig.MessageOfTheDayFooter);
        }
    }
}
