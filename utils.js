const trimStr = (str) => {
  if (!str) {
    return '';
  }

  return str.trim().toLowerCase();
};

module.exports = { trimStr };