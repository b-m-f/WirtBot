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

export function validateIPv4(ip){
      let newValue;
      let valid = true;
      try {
        newValue = ip.split(".").map((val, index) => {
          const number = parseInt(val);
          if (!number && number != 0) {
            valid = false;
            return 0;
          }
          if (number > 255) {
            valid = false;
            return number;
          }
          if ((index == 3 || index == 0) && number < 1) {
            valid = false;
            return number;
          }
          if (number < 0) {
            valid = false;
            return number;
          }
          return number;
        });

        if (newValue.length < 4) {
          valid = false;
        }
        return valid;
      } catch (error) {
        return false;
      }

}