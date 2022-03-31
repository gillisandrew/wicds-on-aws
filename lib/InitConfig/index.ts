import { Construct } from "constructs";
import add_wine_repo from "./add_wine_repo";
import enable_cfn from "./enable_cfn";
import install_instances from "./install_instances";
import install_wicds from "./install_wicds";
import install_wine from "./install_wine";
import setup_environment from "./setup_environment";

export default (scope: Construct) => ({
    add_wine_repo: add_wine_repo(scope),
    enable_cfn: enable_cfn(scope),
    install_wicds: install_wicds(scope),
    install_wine: install_wine(scope),
    install_instances: install_instances(scope),
    setup_environment: setup_environment(scope),
})