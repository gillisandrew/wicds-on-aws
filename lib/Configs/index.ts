import { Construct } from 'constructs';
import AddWineRepoConfig from './AddWineRepoConfig';
import EnableCfnInitConfig from './EnableCfnInitConfig';
import InstallDSConfig from './InstallDSConfig';
import InstallWineConfig from './InstallWineConfig';
import ConfigureDSInstancesConfig from './ConfigureDSInstancesConfig';

export default (scope: Construct) => ({
    add_wine_repo: AddWineRepoConfig(),
    enable_cfn: EnableCfnInitConfig(scope),
    install_wicds: InstallDSConfig(scope),
    install_wine: InstallWineConfig(),
    install_instances: ConfigureDSInstancesConfig(),
});
