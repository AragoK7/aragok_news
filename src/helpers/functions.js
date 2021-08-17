function getDate() {
  return Date().toString().split(" ").slice(0, 6).join(" ");
}

module.exports = {
  getDate,
};
