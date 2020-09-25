function dateToText(date) {
  const arr = [
    date.getFullYear(),
    "-",
    date.getMonth() + 1,
    "-",
    date.getDate(),
    " ",
    date.getHours(),
    ":",
    date.getMinutes(),
  ];
  return arr.reduce((result, value) => {
    if (typeof value === "number" && value < 10) {
      value = "0" + value;
    }
    return result + value;
  });
}

function unixToText(unixTime) {
  const date = new Date(unixTime * 1000);
  return dateToText(date);
}

function utcDateToText(utc) {
  const date = new Date(utc);
  //return dateToText(new Date(date.toLocaleString()));
  return dateToText(date);
}

export { unixToText, utcDateToText };
