import store from "../store";
import i18n from "../i18n";
import { WHY_NO_LOGIN, REGULAR_BACKUP } from "./messages";

function betaTo1(backup) {
  try {
    backup.version = 1.0;
    // IPv6 introduction
    backup.server.ip = Object.assign({}, { v6: "", v4: backup.server.ip });
    backup.server.subnet = Object.assign(
      {},
      { v6: "1010:1010:1010:1010:", v4: backup.server.subnet }
    );
    backup.devices = backup.devices.map((device) => {
      device.ip = Object.assign({}, { v6: "", v4: device.ip });
      return device;
    });
    // New dashboard logic
    backup.dashboard = {
      messages: [WHY_NO_LOGIN, REGULAR_BACKUP],
      widgets: ["server", "devices", "settings"],
      firstUse: false,
    };
    return backup;
  } catch (error) {
    console.error(error);
    throw Error(i18n.t("errors.backupUpgradeTo1dot0"));
  }
}

function oneToOneDotOne(backup) {
  try {
    backup.version = 1.1;
    backup.network = {
      dnsName: "wirt.internal"
    }
    backup.dashboard.widgets = ["network", ...backup.dashboard.widgets];
    return backup;
  } catch (error) {
    console.error(error);
    throw Error(i18n.t("errors.backupUpgradeTo1dot1"));
  }

}

// Returns upgraded Backup as JSON string
export function upgradeBackup(backupAsJSONString) {
  const backup = JSON.parse(backupAsJSONString);

  const appVersion = store.state.version || 1.0;
  const backupVersion = backup.version;
  let updatedBackup = backup;

  if (
    !backup.version
  ) {
    console.log("hi here beta")
    updatedBackup = betaTo1(updatedBackup);
  }
  if (updatedBackup.version == 1.0) {
    console.log("hi here ione")
    updatedBackup = oneToOneDotOne(updatedBackup)
  }
  if (appVersion < backupVersion) {
    throw Error(i18n.t("errors.backupNotCompatible"));
  }

  return JSON.stringify(updatedBackup);
}
