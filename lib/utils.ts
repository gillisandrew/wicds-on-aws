/* eslint-disable import/prefer-default-export */
import { Duration } from 'aws-cdk-lib';
import { CfnInstance, Instance } from 'aws-cdk-lib/aws-ec2';
import { createHash } from 'crypto';

export const hash = (value: any): string => {
    const md5 = createHash('md5');
    md5.update(JSON.stringify(value));
    return md5.digest('hex');
};

export const setCreationTimeout = (
    instance: Instance,
    duration: Duration = Duration.minutes(15),
) => {
    const resource = instance.node.defaultChild as CfnInstance;
    resource.cfnOptions.creationPolicy = {
        resourceSignal: {
            count: 1,
            timeout: duration.toIsoString(),
        },
    };
};
