"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var networkUtils_exports = {};
__export(networkUtils_exports, {
  extractFiles: () => extractFiles,
  isExtractableFile: () => isExtractableFile
});
module.exports = __toCommonJS(networkUtils_exports);
function isExtractableFile(value) {
  return typeof File !== "undefined" && value instanceof File || typeof Blob !== "undefined" && value instanceof Blob;
}
function extractFiles(value) {
  if (!arguments.length)
    throw new TypeError("Argument 1 `value` is required.");
  const clones = /* @__PURE__ */ new Map();
  const files = /* @__PURE__ */ new Map();
  function recurse(value2, path, recursed) {
    if (isExtractableFile(value2)) {
      const filePaths = files.get(value2);
      filePaths ? filePaths.push(path) : files.set(value2, [path]);
      return null;
    }
    const valueIsList = Array.isArray(value2) || typeof FileList !== "undefined" && value2 instanceof FileList;
    const valueIsPlainObject = isPlainObject(value2);
    if (valueIsList || valueIsPlainObject) {
      let clone = clones.get(value2);
      const uncloned = !clone;
      if (uncloned) {
        clone = valueIsList ? [] : value2 instanceof Object ? {} : /* @__PURE__ */ Object.create(null);
        clones.set(value2, clone);
      }
      if (!recursed.has(value2)) {
        const pathPrefix = path ? `${path}.` : "";
        const recursedDeeper = new Set(recursed).add(value2);
        if (valueIsList) {
          let index = 0;
          for (const item of value2) {
            const itemClone = recurse(item, pathPrefix + index++, recursedDeeper);
            if (uncloned)
              clone.push(itemClone);
          }
        } else
          for (const key in value2) {
            const propertyClone = recurse(value2[key], pathPrefix + key, recursedDeeper);
            if (uncloned)
              clone[key] = propertyClone;
          }
      }
      return clone;
    }
    return value2;
  }
  return {
    clone: recurse(value, "", /* @__PURE__ */ new Set()),
    files
  };
}
function isPlainObject(value) {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const prototype = Object.getPrototypeOf(value);
  return (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null) && !(Symbol.toStringTag in value) && !(Symbol.iterator in value);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  extractFiles,
  isExtractableFile
});
