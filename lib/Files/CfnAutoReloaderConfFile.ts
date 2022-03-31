import File from './File';

export default class CfnAutoReloaderConfFile extends File {
    constructor(instanceId: string, stackName: string, region: string) {
        super('\n');
        this.write('[cfn-auto-reloader-hook]');
        this.write('triggers=post.update');
        this.write(`path=Resources.${instanceId}.Metadata.AWS::CloudFormation::Init`);
        this.write(`action=/opt/aws/bin/cfn-init -v --stack ${stackName} --resource ${instanceId} --configsets default --region ${region}`);
        this.write('runas=root');
    }
}
