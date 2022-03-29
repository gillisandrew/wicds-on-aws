import { Construct } from "constructs";
import add_utils from "./add_utils";
import add_wine_repo from "./add_wine_repo";
import enable_cfn from "./enable_cfn";
import install_wicds from "./install_wicds";
import install_wine from "./install_wine";

export default (scope: Construct) => ({
    add_utils: add_utils(scope),
    add_wine_repo: add_wine_repo(scope),
    enable_cfn: enable_cfn(scope),
    install_wicds: install_wicds(scope),
    install_wine: install_wine(scope),
})