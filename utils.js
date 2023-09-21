function getCurrentDate() {
  let d = new Date();

  let month = `${
    d.getMonth() + 1 < 10 ? "0" + (d.getMonth() + 1) : d.getMonth()
  }`;

  let day = `${d.getDate() + 1 < 10 ? "0" + (d.getDate() + 1) : d.getDate()}`;

  return `${d.getFullYear()}-${month}-${day}T${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}.${d.getMilliseconds()}Z`;
}

console.log(getCurrentDate());

module.exports = {
  getCurrentDate,
};
