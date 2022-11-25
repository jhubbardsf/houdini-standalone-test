"use strict";
var import_vitest = require("vitest");
var import_test = require("../../../test");
var import_cache = require("../cache");
const config = (0, import_test.testConfigFile)({
  scalars: {
    DateTime: {
      type: "Date",
      marshal(val) {
        return val.getTime();
      },
      unmarshal(val) {
        return new Date(val);
      }
    }
  }
});
(0, import_vitest.test)("extracting data with custom scalars unmarshals the value", () => {
  const cache = new import_cache.Cache(config);
  const selection = {
    node: {
      type: "Node",
      keyRaw: "node",
      fields: {
        date: {
          type: "DateTime",
          keyRaw: "date"
        },
        id: {
          type: "ID",
          keyRaw: "id"
        }
      }
    }
  };
  const data = {
    node: {
      id: "1",
      date: new Date().getTime()
    }
  };
  cache.write({ selection, data });
  (0, import_vitest.expect)(cache.read({ parent: import_cache.rootID, selection }).data).toEqual({
    node: {
      id: "1",
      date: new Date(data.node.date)
    }
  });
});
(0, import_vitest.test)("can store and retrieve lists of lists of scalars", function() {
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
        strings: {
          type: "String",
          keyRaw: "strings"
        }
      }
    }
  };
  cache.write({
    selection,
    data: {
      viewer: {
        id: "1",
        strings: ["bob", "john"]
      }
    }
  });
  (0, import_vitest.expect)(cache.read({ parent: import_cache.rootID, selection }).data).toEqual({
    viewer: {
      id: "1",
      strings: ["bob", "john"]
    }
  });
});
(0, import_vitest.test)("can write list of scalars", function() {
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
        firstName: {
          type: "String",
          keyRaw: "firstName"
        },
        friends: {
          type: "Int",
          keyRaw: "friends"
        }
      }
    }
  };
  cache.write({
    selection,
    data: {
      viewer: {
        id: "1",
        firstName: "bob",
        friends: [1]
      }
    }
  });
  (0, import_vitest.expect)(cache.read({ parent: import_cache.rootID, selection }).data).toEqual({
    viewer: {
      id: "1",
      firstName: "bob",
      friends: [1]
    }
  });
});
(0, import_vitest.test)("writing a scalar marked with replace", function() {
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
        firstName: {
          type: "String",
          keyRaw: "firstName"
        },
        friends: {
          type: "Int",
          keyRaw: "friends",
          update: "append"
        }
      }
    }
  };
  cache.write({
    selection,
    data: {
      viewer: {
        id: "1",
        firstName: "bob",
        friends: [1]
      }
    }
  });
  (0, import_vitest.expect)(cache.read({ parent: import_cache.rootID, selection }).data).toEqual({
    viewer: {
      id: "1",
      firstName: "bob",
      friends: [1]
    }
  });
  cache.write({
    selection,
    data: {
      viewer: {
        id: "1",
        firstName: "bob",
        friends: [2]
      }
    }
  });
  (0, import_vitest.expect)(cache.read({ parent: import_cache.rootID, selection }).data).toEqual({
    viewer: {
      id: "1",
      firstName: "bob",
      friends: [2]
    }
  });
});
