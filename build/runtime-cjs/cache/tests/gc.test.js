"use strict";
var import_vitest = require("vitest");
var import_test = require("../../../test");
var import_cache = require("../cache");
const config = (0, import_test.testConfigFile)();
config.cacheBufferSize = 10;
(0, import_vitest.test)("adequate ticks of garbage collector clear unsubscribed data", function() {
  const cache = new import_cache.Cache(config);
  const userFields = {
    id: {
      type: "ID",
      keyRaw: "id"
    },
    firstName: {
      type: "String",
      keyRaw: "firstName"
    }
  };
  cache.write({
    selection: {
      viewer: {
        type: "User",
        keyRaw: "viewer",
        fields: userFields
      }
    },
    data: {
      viewer: {
        id: "1",
        firstName: "bob"
      }
    }
  });
  for (const _ of Array.from({ length: config.cacheBufferSize })) {
    cache._internal_unstable.collectGarbage();
    (0, import_vitest.expect)(cache.read({ selection: userFields, parent: "User:1" })).toMatchObject({
      data: { id: "1" }
    });
  }
  cache._internal_unstable.collectGarbage();
  (0, import_vitest.expect)(cache.read({ selection: userFields, parent: "User:1" })).toMatchObject({
    data: null
  });
});
(0, import_vitest.test)("subscribed data shouldn't be garbage collected", function() {
  const cache = new import_cache.Cache((0, import_test.testConfigFile)());
  cache.write({
    selection: {
      viewer: {
        type: "User",
        keyRaw: "viewer",
        fields: {
          id: {
            type: "ID",
            keyRaw: "id"
          },
          firstName: {
            type: "String",
            keyRaw: "firstName"
          }
        }
      }
    },
    data: {
      viewer: {
        id: "1",
        firstName: "bob"
      }
    }
  });
  cache.subscribe({
    rootType: "Query",
    selection: {
      viewer: {
        type: "User",
        keyRaw: "viewer",
        fields: {
          id: {
            type: "ID",
            keyRaw: "id"
          }
        }
      }
    },
    set: import_vitest.vi.fn()
  });
  for (const _ of Array.from({ length: config.cacheBufferSize + 1 })) {
    cache._internal_unstable.collectGarbage();
  }
  (0, import_vitest.expect)(
    cache.read({
      selection: {
        id: {
          type: "ID",
          keyRaw: "id"
        }
      },
      parent: "User:1"
    }).data
  ).toEqual({ id: "1" });
});
(0, import_vitest.test)("resubscribing to fields marked for garbage collection resets counter", function() {
  const cache = new import_cache.Cache((0, import_test.testConfigFile)());
  cache.write({
    selection: {
      viewer: {
        type: "User",
        keyRaw: "viewer",
        fields: {
          id: {
            type: "ID",
            keyRaw: "id"
          },
          firstName: {
            type: "String",
            keyRaw: "firstName"
          }
        }
      }
    },
    data: {
      viewer: {
        id: "1",
        firstName: "bob"
      }
    }
  });
  for (const _ of Array.from({ length: 3 })) {
    cache._internal_unstable.collectGarbage();
  }
  const set = import_vitest.vi.fn();
  cache.subscribe({
    rootType: "Query",
    selection: {
      viewer: {
        type: "User",
        keyRaw: "viewer",
        fields: {
          id: {
            type: "ID",
            keyRaw: "id"
          }
        }
      }
    },
    set
  });
  for (const _ of Array.from({ length: config.cacheBufferSize })) {
    cache._internal_unstable.collectGarbage();
  }
  cache.unsubscribe({
    rootType: "Query",
    selection: {
      viewer: {
        type: "User",
        keyRaw: "viewer",
        fields: {
          id: {
            type: "ID",
            keyRaw: "id"
          }
        }
      }
    },
    set
  });
  for (const _ of Array.from({ length: config.cacheBufferSize })) {
    cache._internal_unstable.collectGarbage();
  }
  (0, import_vitest.expect)(
    cache.read({
      selection: {
        id: {
          type: "ID",
          keyRaw: "id"
        }
      },
      parent: "User:1"
    }).data
  ).toEqual({ id: "1" });
  cache._internal_unstable.collectGarbage();
  (0, import_vitest.expect)(
    cache.read({
      selection: {
        id: {
          type: "ID",
          keyRaw: "id"
        }
      },
      parent: "User:1"
    })
  ).toMatchObject({
    data: null
  });
});
(0, import_vitest.test)("ticks of gc delete list handlers", function() {
  const cache = new import_cache.Cache(config);
  const selection = {
    viewer: {
      type: "User",
      keyRaw: "viewer",
      fields: {
        id: {
          type: "ID",
          keyRaw: "id"
        },
        friends: {
          type: "User",
          keyRaw: "friends",
          list: {
            name: "All_Users",
            connection: false,
            type: "User"
          },
          fields: {
            id: {
              type: "ID",
              keyRaw: "id"
            },
            firstName: {
              type: "String",
              keyRaw: "firstName"
            }
          }
        }
      }
    }
  };
  cache.write({
    selection,
    variables: {
      var: "hello"
    },
    data: {
      viewer: {
        id: "1",
        friends: [
          {
            id: "2",
            firstName: "yves"
          }
        ]
      }
    }
  });
  const set = import_vitest.vi.fn();
  cache.subscribe(
    {
      rootType: "Query",
      set,
      selection
    },
    {
      var: "hello"
    }
  );
  cache.unsubscribe(
    {
      rootType: "Query",
      set,
      selection
    },
    {
      var: "hello"
    }
  );
  for (const _ of Array.from({ length: config.cacheBufferSize + 1 })) {
    cache._internal_unstable.collectGarbage();
  }
  (0, import_vitest.expect)(cache._internal_unstable.lists.get("All_Users")).toBeNull();
});
