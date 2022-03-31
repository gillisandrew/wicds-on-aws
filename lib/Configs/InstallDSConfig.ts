import {
  InitCommand, InitConfig, InitFile, InitPackage, InitSource, InitUser,
} from 'aws-cdk-lib/aws-ec2';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import {
  env,
  WICDS_CONFIG_DIR,
  WICDS_HELPER_SCRIPT_NAME,
  WICDS_INSTALL_DIRECTORY,
  WICDS_PID_DIR,
  WICDS_SERVICE_NAME,
  WICDS_USER,
  WICDS_USER_HOME_DIRECTORY,
} from '../constants';
import Install1IssFile from '../Files/Install1IssFile';
import Install2IssFile from '../Files/Install2IssFile';
import WicdsServiceFile from '../Files/WicdsServiceFile';
import WindowsServiceFile from '../Files/WindowsServiceFile';

export default (scope: Construct) => new InitConfig([
  InitSource.fromS3Object('/usr/local/src/wicds', Bucket.fromBucketName(scope, 'WicdsInstallAssetsBucket', 'wicdsinstallassetsstack-bucket83908e77-sh3yb82xboev'), 'wicds.zip'),
  InitPackage.apt('xvfb'),
  InitPackage.apt('x11-utils'),
  InitPackage.apt('xdotool'),
  InitUser.fromName(WICDS_USER, { homeDir: `/home/${WICDS_USER}` }),
  InitFile.fromString('/etc/wicds/environment', env.join('\n')),
  InitFile.fromString(`${WICDS_CONFIG_DIR}/install-1.iss`, (new Install1IssFile()).toString()),
  InitFile.fromString(`${WICDS_CONFIG_DIR}/install-2.iss`, (new Install2IssFile()).toString()),
  InitFile.fromAsset(`/usr/local/bin/${WICDS_HELPER_SCRIPT_NAME}`, './scripts/wicds-manager', { mode: '000755' }),
  InitFile.fromString('/etc/systemd/system/windows.service', (new WindowsServiceFile()).toString()),
  InitFile.fromString(`/etc/systemd/system/${WICDS_SERVICE_NAME}@.service`, (new WicdsServiceFile()).toString()),
  InitCommand.shellCommand('systemctl daemon-reload'),
  InitCommand.shellCommand(`(mkdir -p "${WICDS_USER_HOME_DIRECTORY}" || true) && chown -R ${WICDS_USER}:${WICDS_USER} "${WICDS_USER_HOME_DIRECTORY}"`, {
    testCmd: `(! test -d "${WICDS_USER_HOME_DIRECTORY}") && printf "Creating ${WICDS_USER_HOME_DIRECTORY} home directory..."`,
  }),
  InitCommand.shellCommand(`(mkdir -p "${WICDS_PID_DIR}" || true) && chown -R ${WICDS_USER}:${WICDS_USER} "${WICDS_PID_DIR}"`, {
    testCmd: `(! test -d ${WICDS_PID_DIR}) && printf "Creating ${WICDS_PID_DIR} PID directory..."`,
  }),
  InitCommand.shellCommand(`sudo -Hu ${WICDS_USER} wineboot`, {
    testCmd: `(! test -d ${WICDS_USER_HOME_DIRECTORY}/.wine) && printf "Booting wine..."`,
  }),
  InitCommand.shellCommand('systemctl enable windows'),
  InitCommand.shellCommand(`sudo -Hu ${WICDS_USER} WICDS_INSTALL_DIRECTORY="${WICDS_INSTALL_DIRECTORY}" ${WICDS_HELPER_SCRIPT_NAME} install`, {
    testCmd: `(! test -f ${WICDS_USER_HOME_DIRECTORY}/.wicds-installed) && printf "Installing dedicated server..."`,
  }),
  InitCommand.shellCommand('service windows start'),
]);
