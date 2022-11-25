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
var stuff_exports = {};
__export(stuff_exports, {
  evaluateKey: () => evaluateKey,
  flattenList: () => flattenList
});
module.exports = __toCommonJS(stuff_exports);
function flattenList(source) {
  const flat = [];
  const unvisited = [source || []];
  while (unvisited.length > 0) {
    const target = unvisited.shift();
    for (const id of target) {
      if (Array.isArray(id)) {
        unvisited.push(id);
        continue;
      }
      flat.push(id);
    }
  }
  return flat;
}
function evaluateKey(key, variables = {}) {
  let evaluated = "";
  let varName = "";
  let inString = false;
  for (const char of key) {
    if (varName) {
      if (varChars.includes(char)) {
        varName += char;
        continue;
      }
      const value = variables[varName.slice(1)];
      evaluated += typeof value !== "undefined" ? JSON.stringify(value) : "undefined";
      varName = "";
    }
    if (char === "$" && !inString) {
      varName = "$";
      continue;
    }
    if (char === '"') {
      inString = !inString;
    }
    evaluated += char;
  }
  return evaluated;
}
const varChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_0123456789";
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  evaluateKey,
  flattenList
});
