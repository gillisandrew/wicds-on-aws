export const CONFIG_FILE_NAME = 'config.yaml';

export const WICDS_USER = 'wicds-user';
export const WICDS_CONFIG_DIR = '/etc/wicds';
export const WICDS_USER_HOME_DIRECTORY = `/home/${WICDS_USER}`;
export const WINE_C_DRIVE_DIRECTORY = `${WICDS_USER_HOME_DIRECTORY}/.wine/drive_c`;
export const WICDS_INSTALL_RELATIVE_PATH = 'WICDS';
export const WICDS_INSTALL_DIRECTORY = `${WINE_C_DRIVE_DIRECTORY}/${WICDS_INSTALL_RELATIVE_PATH}`;
export const WICDS_INSTALL_DIRECTORY_WINDOWS = `C:\\\\${WICDS_INSTALL_RELATIVE_PATH.replace('/', '\\')}`;
export const WICDS_SERVICE_NAME = 'wicds';
export const WICDS_HELPER_SCRIPT_NAME = 'wicds';
export const WICDS_PID_DIR = '/run/wicds';

export const env = Object.entries({
  WICDS_USER,
  WICDS_CONFIG_DIR,
  WICDS_INSTALL_DIRECTORY,
  WICDS_SERVICE_NAME,
  WICDS_HELPER_SCRIPT_NAME,
  WICDS_PID_DIR,
}).reduce<string[]>((acc, [key, value]) => [...acc, `${key}='${value}'`], []);
