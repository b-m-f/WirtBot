export function downloadText(text, filename) {
  const blob = new Blob([text], { type: "octet/stream" });
  if (window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveBlob(blob, filename);
  } else {
    const a = document.createElement("a");
    a.style = "display: none";
    document.body.appendChild(a);
    a.style = "display: none";

    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
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
