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
var network_exports = {};
__export(network_exports, {
  Environment: () => Environment,
  HoudiniClient: () => HoudiniClient,
  executeQuery: () => executeQuery,
  fetchQuery: () => fetchQuery
});
module.exports = __toCommonJS(network_exports);
var import_cache = __toESM(require("../cache"), 1);
var log = __toESM(require("./log"), 1);
var import_types = require("./types");
class HoudiniClient {
  fetchFn;
  socket;
  constructor(networkFn, subscriptionHandler) {
    this.fetchFn = networkFn;
    this.socket = subscriptionHandler;
  }
  async sendRequest(ctx, params) {
    let url = "";
    const result = await this.fetchFn({
      fetch: async (...args) => {
        const response = await ctx.fetch(...args);
        if (response.url) {
          url = response.url;
        }
        return response;
      },
      ...params,
      metadata: ctx.metadata,
      session: ctx.session || {}
    });
    return {
      body: result,
      ssr: !url
    };
  }
}
class Environment extends HoudiniClient {
  constructor(...args) {
    super(...args);
    log.info(
      `${log.red("\u26A0\uFE0F  Environment has been renamed to HoudiniClient. \u26A0\uFE0F")}
You should update your client to look something like the following:

import { HoudiniClient } from '$houdini/runtime'

export default new HoudiniClient(fetchQuery)
`
    );
  }
}
async function executeQuery({
  client,
  artifact,
  variables,
  session,
  cached,
  fetch,
  metadata
}) {
  const { result: res, partial } = await fetchQuery({
    client,
    context: {
      fetch: fetch ?? globalThis.fetch.bind(globalThis),
      metadata,
      session
    },
    artifact,
    variables,
    cached
  });
  if (res.errors && res.errors.length > 0) {
    throw res.errors;
  }
  if (!res.data) {
    throw new Error("Encountered empty data response in payload");
  }
  return { result: res, partial };
}
async function fetchQuery({
  client,
  artifact,
  variables,
  cached = true,
  policy,
  context
}) {
  if (!client) {
    throw new Error("could not find houdini environment");
  }
  if (cached && artifact.kind === "HoudiniQuery") {
    if (!policy) {
      policy = artifact.policy;
    }
    if (policy !== import_types.CachePolicy.NetworkOnly) {
      const value = import_cache.default.read({ selection: artifact.selection, variables });
      const allowed = !value.partial || artifact.partial;
      if (value.data !== null && allowed) {
        return {
          result: {
            data: value.data,
            errors: []
          },
          source: import_types.DataSource.Cache,
          partial: value.partial
        };
      } else if (policy === import_types.CachePolicy.CacheOnly) {
        return {
          result: {
            data: null,
            errors: []
          },
          source: import_types.DataSource.Cache,
          partial: false
        };
      }
    }
  }
  setTimeout(() => {
    import_cache.default._internal_unstable.collectGarbage();
  }, 0);
  const result = await client.sendRequest(context, {
    text: artifact.raw,
    hash: artifact.hash,
    variables
  });
  return {
    result: result.body,
    source: result.ssr ? import_types.DataSource.Ssr : import_types.DataSource.Network,
    partial: false
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Environment,
  HoudiniClient,
  executeQuery,
  fetchQuery
});
