"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var config_exports = {};
__export(config_exports, {
  computeID: () => computeID,
  defaultConfigValues: () => defaultConfigValues,
  getCurrentConfig: () => getCurrentConfig,
  getMockConfig: () => getMockConfig,
  keyFieldsForType: () => keyFieldsForType,
  setMockConfig: () => setMockConfig
});
module.exports = __toCommonJS(config_exports);
let mockConfig = null;
function getMockConfig() {
  return mockConfig;
}
function setMockConfig(config) {
  mockConfig = config;
}
function defaultConfigValues(file) {
  return {
    defaultKeys: ["id"],
    ...file,
    types: {
      Node: {
        keys: ["id"],
        resolve: {
          queryField: "node",
          arguments: (node) => ({ id: node.id })
        }
      },
      ...file.types
    }
  };
}
function keyFieldsForType(configFile, type) {
  return configFile.types?.[type]?.keys || configFile.defaultKeys;
}
function computeID(configFile, type, data) {
  const fields = keyFieldsForType(configFile, type);
  let id = "";
  for (const field of fields) {
    id += data[field] + "__";
  }
  return id.slice(0, -2);
}
async function getCurrentConfig() {
  const mockConfig2 = getMockConfig();
  if (mockConfig2) {
    return mockConfig2;
  }
  return defaultConfigValues((await import("HOUDINI_CONFIG_PATH")).default);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  computeID,
  defaultConfigValues,
  getCurrentConfig,
  getMockConfig,
  keyFieldsForType,
  setMockConfig
});
