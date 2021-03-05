export function expandIPv6(ip) {
  const parts = ip.split(":");
  const potentialExpansionIndex = parts.findIndex((part) => part === "");
  const containsEmptyString = potentialExpansionIndex > -1;

  if (containsEmptyString) {
    if (parts[parts.length - 1] === "") {
      parts.pop();
    }
    parts.splice(potentialExpansionIndex, 1);
    const amountToBeInserted = 7 - parts.length;
    const newParts = [...Array(amountToBeInserted)].map(() => "0000");
    parts.splice(potentialExpansionIndex, 0, ...newParts);
  }
  return parts.join(":");
}
