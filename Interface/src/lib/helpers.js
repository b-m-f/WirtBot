import i18n from "../i18n";

export function getTranslationWithVariables(key, template, replacement) {
  return i18n.t(key).replace(`{{${template}}}`, replacement);
}


// https://stackoverflow.com/questions/6860853/generate-random-string-for-div-id/6860916#6860916
export function guidGenerator() {
  var S4 = function () {
    return (((1 + Math.random()) * 0x10000) | 0)
      .toString(16)
      .substring(1);
  };
  return (
    S4() +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    S4() +
    S4()
  );
}
