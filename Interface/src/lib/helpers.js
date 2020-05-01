import i18n from "../i18n";

export function getTranslationWithVariables(key, template, replacement) {
  return i18n.t(key).replace(`{{${template}}}`, replacement);
}
