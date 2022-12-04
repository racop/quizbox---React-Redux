const empty = (str) => {
  if (typeof str === "boolean") return false;
  if (
    typeof str === "undefined" ||
    (typeof str !== "number" && !str) ||
    str === undefined ||
    str === null ||
    str.length === 0 ||
    str === "" ||
    (typeof str === "object" && Object.keys(str).length === 0) ||
    !/[^\s]/.test(str) ||
    /^\s*$/.test(str)
  ) {
    return true;
  }
  return false;
};

export { empty };
