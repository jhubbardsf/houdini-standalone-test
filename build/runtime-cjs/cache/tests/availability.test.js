"use strict";
var import_vitest = require("vitest");
var import_test = require("../../../test");
var import_cache = require("../cache");
const config = (0, import_test.testConfigFile)();
(0, import_vitest.test)("not partial", function() {
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
          type: "User",
          keyRaw: "friends",
          nullable: true,
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
  (0, import_vitest.expect)(cache.read({ selection })).toMatchObject({
    data: null,
    partial: false
  });
  cache.write({
    selection,
    data: {
      viewer: {
        id: "1",
        firstName: "bob",
        friends: [
          {
            id: "2",
            firstName: "jane"
          },
          null
        ]
      }
    }
  });
  (0, import_vitest.expect)(cache.read({ selection })).toMatchObject({
    partial: false
  });
});
(0, import_vitest.test)("not partial with empty list", function() {
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
          type: "User",
          keyRaw: "friends",
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
  (0, import_vitest.expect)(cache.read({ selection })).toMatchObject({
    data: null,
    partial: false
  });
  cache.write({
    selection,
    data: {
      viewer: {
        id: "1",
        firstName: "bob",
        friends: []
      }
    }
  });
  (0, import_vitest.expect)(cache.read({ selection })).toMatchObject({
    partial: false
  });
});
(0, import_vitest.test)("partial with missing linked record", function() {
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
        parent: {
          type: "User",
          keyRaw: "parent",
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
  (0, import_vitest.expect)(cache.read({ selection })).toMatchObject({
    data: null,
    partial: false
  });
  cache.write({
    selection,
    data: {
      viewer: {
        id: "1",
        firstName: "bob"
      }
    }
  });
  (0, import_vitest.expect)(cache.read({ selection })).toMatchObject({
    partial: true
  });
});
(0, import_vitest.test)("partial with missing single field", function() {
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
          type: "User",
          keyRaw: "friends",
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
    data: {
      viewer: {
        id: "1",
        friends: []
      }
    }
  });
  (0, import_vitest.expect)(cache.read({ selection })).toMatchObject({
    partial: true
  });
});
(0, import_vitest.test)("partial missing data inside of linked list", function() {
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
    data: {
      viewer: {
        id: "1",
        friends: [{ id: "2", firstName: "anthony" }, { id: "3" }]
      }
    }
  });
  (0, import_vitest.expect)(cache.read({ selection })).toMatchObject({
    partial: true
  });
});
(0, import_vitest.test)("missing cursor of item in connection from operation should not trigger null cascade", function() {
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
            connection: true,
            type: "User"
          },
          fields: {
            edges: {
              type: "UserEdge",
              keyRaw: "edges",
              fields: {
                cursor: {
                  type: "Node",
                  keyRaw: "cursor",
                  nullable: false
                },
                node: {
                  type: "Node",
                  keyRaw: "node",
                  abstract: true,
                  fields: {
                    __typename: {
                      type: "String",
                      keyRaw: "__typename"
                    },
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
          }
        }
      }
    }
  };
  cache.write({
    selection,
    data: {
      viewer: {
        id: "1",
        friends: {
          edges: [
            {
              node: {
                __typename: "User",
                id: "2",
                firstName: "jane"
              }
            }
          ]
        }
      }
    }
  });
  cache.subscribe({
    set: import_vitest.vi.fn(),
    selection,
    rootType: "Query"
  });
  cache.list("All_Users").prepend(
    {
      __typename: {
        type: "String",
        keyRaw: "__typename"
      },
      id: {
        type: "ID",
        keyRaw: "id"
      },
      firstName: {
        type: "String",
        keyRaw: "firstName"
      }
    },
    {
      __typename: "User",
      id: "2",
      firstName: "Sally"
    }
  );
  (0, import_vitest.expect)(cache.read({ selection })).not.toMatchObject({
    data: {
      viewer: {
        friends: {
          edges: import_vitest.expect.arrayContaining([null])
        }
      }
    }
  });
});
