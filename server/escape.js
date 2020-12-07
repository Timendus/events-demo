module.exports = str =>
  str.replace(/&/g, "")
     .replace(/</g, "")
     .replace(/>/g, "")
     .replace(/"/g, "")
     .replace(/'/g, "");
