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
var gc_exports = {};
__export(gc_exports, {
  GarbageCollector: () => GarbageCollector
});
module.exports = __toCommonJS(gc_exports);
class GarbageCollector {
  cache;
  lifetimes = /* @__PURE__ */ new Map();
  get cacheBufferSize() {
    return this.cache._internal_unstable.config.cacheBufferSize ?? 10;
  }
  constructor(cache) {
    this.cache = cache;
  }
  resetLifetime(id, field) {
    if (!this.lifetimes.get(id)) {
      this.lifetimes.set(id, /* @__PURE__ */ new Map());
    }
    this.lifetimes.get(id).set(field, 0);
  }
  tick() {
    for (const [id, fieldMap] of this.lifetimes.entries()) {
      for (const [field, lifetime] of fieldMap.entries()) {
        if (this.cache._internal_unstable.subscriptions.get(id, field).length > 0) {
          continue;
        }
        fieldMap.set(field, lifetime + 1);
        if (fieldMap.get(field) > this.cacheBufferSize) {
          this.cache._internal_unstable.storage.deleteField(id, field);
          this.cache._internal_unstable.lists.deleteField(id, field);
          fieldMap.delete(field);
          if ([...fieldMap.keys()].length === 0) {
            this.lifetimes.delete(id);
          }
        }
      }
    }
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GarbageCollector
});
