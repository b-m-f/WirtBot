import store from "../store";
import i18n from "../i18n";
import { guidGenerator } from "./helpers";

// Returns upgraded Backup as JSON string
export function upgradeBackup(backupAsJSONString) {
  const backup = JSON.parse(backupAsJSONString);

  const appVersion = store.state.version || 1.0;
  const backupVersion = backup.version;
  let updatedBackup = backup;

  if (appVersion < backupVersion) {
    throw Error(i18n.t("errors.backupNotCompatible"));
  }

  if (backupVersion < "2.3.4") {
    updatedBackup.server.ip.v4 = backup.server.ip.v4.join(".")
    updatedBackup.network.dns.ip.v4 = backup.network.dns.ip.v4.join(".")
  }

  // Set to the current version of the app where it is now being imported in
  updatedBackup.version = appVersion;

  // Check that all devices have an ID
  // This should only trigger when backups are changed manually
  updatedBackup.devices = backup.devices.map(device => {
    if (!device.id) {
      device.id = `${guidGenerator()}-generated-at-import`;
    }
    return device
  })

  return JSON.stringify(Object.assign({}, store.state, updatedBackup));
}
