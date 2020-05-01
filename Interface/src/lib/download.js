export function downloadText(text, filename) {
  const blob = new Blob([text], { type: "text/plain" });
  if (window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveBlob(blob, filename);
  } else {
    const elem = window.document.createElement("a");
    elem.href = window.URL.createObjectURL(blob);
    elem.download = filename;
    document.body.appendChild(elem);
    elem.click();
    document.body.removeChild(elem);
  }
}

export function downloadFile(file, filename) {
  if (window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveBlob(file, filename);
  } else {
    const elem = window.document.createElement("a");
    elem.href = window.URL.createObjectURL(file);
    elem.download = filename;
    document.body.appendChild(elem);
    elem.click();
    document.body.removeChild(elem);
  }
}
