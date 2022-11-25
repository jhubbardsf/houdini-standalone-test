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
var types_exports = {};
__export(types_exports, {
  ArtifactKind: () => ArtifactKind,
  CachePolicy: () => CachePolicy,
  CompiledFragmentKind: () => CompiledFragmentKind,
  CompiledMutationKind: () => CompiledMutationKind,
  CompiledQueryKind: () => CompiledQueryKind,
  CompiledSubscriptionKind: () => CompiledSubscriptionKind,
  DataSource: () => DataSource,
  RefetchUpdateMode: () => RefetchUpdateMode
});
module.exports = __toCommonJS(types_exports);
var CachePolicy = /* @__PURE__ */ ((CachePolicy2) => {
  CachePolicy2["CacheOrNetwork"] = "CacheOrNetwork";
  CachePolicy2["CacheOnly"] = "CacheOnly";
  CachePolicy2["NetworkOnly"] = "NetworkOnly";
  CachePolicy2["CacheAndNetwork"] = "CacheAndNetwork";
  return CachePolicy2;
})(CachePolicy || {});
var ArtifactKind = /* @__PURE__ */ ((ArtifactKind2) => {
  ArtifactKind2["Query"] = "HoudiniQuery";
  ArtifactKind2["Subscription"] = "HoudiniSubscription";
  ArtifactKind2["Mutation"] = "HoudiniMutation";
  ArtifactKind2["Fragment"] = "HoudiniFragment";
  return ArtifactKind2;
})(ArtifactKind || {});
const CompiledFragmentKind = "HoudiniFragment" /* Fragment */;
const CompiledMutationKind = "HoudiniMutation" /* Mutation */;
const CompiledQueryKind = "HoudiniQuery" /* Query */;
const CompiledSubscriptionKind = "HoudiniSubscription" /* Subscription */;
var RefetchUpdateMode = /* @__PURE__ */ ((RefetchUpdateMode2) => {
  RefetchUpdateMode2["append"] = "append";
  RefetchUpdateMode2["prepend"] = "prepend";
  RefetchUpdateMode2["replace"] = "replace";
  return RefetchUpdateMode2;
})(RefetchUpdateMode || {});
var DataSource = /* @__PURE__ */ ((DataSource2) => {
  DataSource2["Cache"] = "cache";
  DataSource2["Network"] = "network";
  DataSource2["Ssr"] = "ssr";
  return DataSource2;
})(DataSource || {});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ArtifactKind,
  CachePolicy,
  CompiledFragmentKind,
  CompiledMutationKind,
  CompiledQueryKind,
  CompiledSubscriptionKind,
  DataSource,
  RefetchUpdateMode
});
