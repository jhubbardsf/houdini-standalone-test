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
var log_exports = {};
__export(log_exports, {
  cyan: () => cyan,
  error: () => error,
  green: () => green,
  info: () => info,
  red: () => red,
  yellow: () => yellow
});
module.exports = __toCommonJS(log_exports);
function colorize(message) {
  const matches = [...message.matchAll(/\$HOUDINI\$(\w*\$)?/g)];
  if (matches.length === 0) {
    return [message];
  }
  let final = message.replaceAll(/\$HOUDINI\$(\w*\$)?/g, "%c");
  let colors = [];
  for (const match of matches) {
    const color = match[1] ? `color:${match[1].slice(0, -1)}` : "";
    colors.push(color);
  }
  return [final, ...colors];
}
function error(message) {
  console.error(...colorize(message));
}
function info(message) {
  console.log(...colorize(message));
}
function cyan(message) {
  return wrapMessage("cyan", message);
}
function red(message) {
  return wrapMessage("red", message);
}
function yellow(message) {
  return wrapMessage("yellow", message);
}
function green(message) {
  return wrapMessage("green", message);
}
const tag = `$HOUDINI$`;
const wrapMessage = (color, message) => {
  return tag + `${color}$` + message + tag;
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  cyan,
  error,
  green,
  info,
  red,
  yellow
});
