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
var constants_exports = {};
__export(constants_exports, {
  InfoReleaseNote: () => InfoReleaseNote,
  OutdatedFunctionInlineInfo: () => OutdatedFunctionInlineInfo,
  siteURL: () => siteURL
});
module.exports = __toCommonJS(constants_exports);
const siteURL = "SITE_URL";
const InfoReleaseNote = (focus) => {
  return `\u2753 For more info, visit this guide: ${siteURL}/guides/release-notes${focus ? `${focus}` : ""}`;
};
const OutdatedFunctionInlineInfo = (type, name) => {
  return `\u274C inline function "${type}" no longer exist (update: '${name}' ${type}).`;
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  InfoReleaseNote,
  OutdatedFunctionInlineInfo,
  siteURL
});
