// Messages use translation keys which will be resolved right here in this file
import i18n from "../i18n";

export const REGULAR_BACKUP = {
  title: i18n.t("dashboard.messages.regularBackup.title"),
  text: i18n.t("dashboard.messages.regularBackup.text"),
  link: {
    url: "/docs/interface#backup",
    text: i18n.t("dashboard.messages.regularBackup.link"),
  },
};
export const WHY_NO_LOGIN = {
  title: i18n.t("dashboard.messages.whyNoLogin.title"),
  text: i18n.t("dashboard.messages.whyNoLogin.text"),
  link: {
    url: "/docs/interface#authentication",
    text: i18n.t("dashboard.messages.whyNoLogin.link"),
  },
};
