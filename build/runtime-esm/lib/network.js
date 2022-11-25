import cache from "../cache";
import * as log from "./log";
import {
  CachePolicy,
  DataSource
} from "./types";
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
    if (policy !== CachePolicy.NetworkOnly) {
      const value = cache.read({ selection: artifact.selection, variables });
      const allowed = !value.partial || artifact.partial;
      if (value.data !== null && allowed) {
        return {
          result: {
            data: value.data,
            errors: []
          },
          source: DataSource.Cache,
          partial: value.partial
        };
      } else if (policy === CachePolicy.CacheOnly) {
        return {
          result: {
            data: null,
            errors: []
          },
          source: DataSource.Cache,
          partial: false
        };
      }
    }
  }
  setTimeout(() => {
    cache._internal_unstable.collectGarbage();
  }, 0);
  const result = await client.sendRequest(context, {
    text: artifact.raw,
    hash: artifact.hash,
    variables
  });
  return {
    result: result.body,
    source: result.ssr ? DataSource.Ssr : DataSource.Network,
    partial: false
  };
}
export {
  Environment,
  HoudiniClient,
  executeQuery,
  fetchQuery
};
