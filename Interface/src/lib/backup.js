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
