"use strict";
var import_vitest = require("vitest");
var import_test = require("../../../test");
var import_cache = require("../cache");
const config = (0, import_test.testConfigFile)();
(0, import_vitest.test)("write selection to root", function() {
  const cache = new import_cache.Cache(config);
  const data = {
    viewer: {
      id: "1",
      firstName: "bob"
    }
  };
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
        }
      }
    }
  };
  cache.write({
    selection,
    data
  });
  (0, import_vitest.expect)(
    cache.read({
      selection
    }).data
  ).toEqual({
    viewer: {
      id: "1",
      firstName: "bob"
    }
  });
});
(0, import_vitest.test)("linked records with updates", function() {
  const cache = new import_cache.Cache(config);
  const deeplyNestedSelection = {
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
  const userFields = {
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
      nullable: true,
      fields: {
        id: {
          type: "ID",
          keyRaw: "id"
        }
      }
    }
  };
  cache.write({
    selection: deeplyNestedSelection,
    data: {
      viewer: {
        id: "1",
        firstName: "bob",
        parent: {
          id: "2",
          firstName: "jane"
        }
      }
    }
  });
  (0, import_vitest.expect)(cache.read({ selection: userFields, parent: "User:1" }).data).toEqual({
    id: "1",
    firstName: "bob",
    parent: {
      id: "2"
    }
  });
  (0, import_vitest.expect)(cache.read({ selection: userFields, parent: "User:2" }).data).toEqual({
    id: "2",
    firstName: "jane",
    parent: null
  });
  cache.write({
    selection: deeplyNestedSelection,
    data: {
      viewer: {
        id: "2",
        firstName: "jane-prime",
        parent: {
          id: "3",
          firstName: "mary"
        }
      }
    }
  });
  (0, import_vitest.expect)(cache.read({ selection: userFields, parent: "User:2" }).data).toEqual({
    id: "2",
    firstName: "jane-prime",
    parent: {
      id: "3"
    }
  });
  (0, import_vitest.expect)(cache.read({ selection: userFields, parent: "User:3" }).data).toEqual({
    id: "3",
    firstName: "mary",
    parent: null
  });
});
(0, import_vitest.test)("linked lists", function() {
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
        firstName: "bob",
        friends: [
          {
            id: "2",
            firstName: "jane"
          },
          {
            id: "3",
            firstName: "mary"
          }
        ]
      }
    }
  });
  (0, import_vitest.expect)(cache.read({ selection: selection.viewer.fields, parent: "User:1" }).data).toEqual({
    id: "1",
    firstName: "bob",
    friends: [
      {
        id: "2",
        firstName: "jane"
      },
      {
        id: "3",
        firstName: "mary"
      }
    ]
  });
});
(0, import_vitest.test)("list as value with args", function() {
  const cache = new import_cache.Cache(config);
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
          },
          favoriteColors: {
            type: "String",
            keyRaw: 'favoriteColors(where: "foo")'
          }
        }
      }
    },
    data: {
      viewer: {
        id: "1",
        firstName: "bob",
        favoriteColors: ["red", "green", "blue"]
      }
    }
  });
  (0, import_vitest.expect)(
    cache.read({
      selection: {
        favoriteColors: {
          type: "String",
          keyRaw: 'favoriteColors(where: "foo")'
        }
      },
      parent: "User:1"
    }).data
  ).toEqual({
    favoriteColors: ["red", "green", "blue"]
  });
});
(0, import_vitest.test)("writing abstract objects", function() {
  const cache = new import_cache.Cache(config);
  const data = {
    viewer: {
      __typename: "User",
      id: "1",
      firstName: "bob"
    }
  };
  cache.write({
    selection: {
      viewer: {
        type: "Node",
        abstract: true,
        keyRaw: "viewer",
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
    },
    data
  });
  (0, import_vitest.expect)(
    cache.read({
      parent: "User:1",
      selection: {
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
    }).data
  ).toEqual({
    __typename: "User",
    id: "1",
    firstName: "bob"
  });
});
(0, import_vitest.test)("writing abstract lists", function() {
  const cache = new import_cache.Cache(config);
  const data = {
    nodes: [
      {
        __typename: "User",
        id: "1",
        firstName: "bob"
      },
      {
        __typename: "User",
        id: "2",
        firstName: "bob"
      }
    ]
  };
  cache.write({
    selection: {
      nodes: {
        type: "Node",
        abstract: true,
        keyRaw: "nodes",
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
    },
    data
  });
  (0, import_vitest.expect)(
    cache.read({
      parent: "User:1",
      selection: {
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
    }).data
  ).toEqual({
    __typename: "User",
    id: "1",
    firstName: "bob"
  });
});
(0, import_vitest.test)("can pull enum from cached values", function() {
  const cache = new import_cache.Cache(config);
  const selection = {
    node: {
      type: "Node",
      keyRaw: "node",
      fields: {
        enumValue: {
          type: "MyEnum",
          keyRaw: "enumValue"
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
      enumValue: "Hello"
    }
  };
  cache.write({ selection, data });
  (0, import_vitest.expect)(cache.read({ selection }).data).toEqual({
    node: {
      id: "1",
      enumValue: "Hello"
    }
  });
});
(0, import_vitest.test)("can store and retrieve lists with null values", function() {
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
  (0, import_vitest.expect)(cache.read({ selection }).data).toEqual({
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
  });
});
(0, import_vitest.test)("can store and retrieve lists of lists of records", function() {
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
        firstName: "bob",
        friends: [
          [
            {
              id: "2",
              firstName: "jane"
            },
            null
          ],
          [
            {
              id: "3",
              firstName: "jane"
            },
            {
              id: "4",
              firstName: "jane"
            }
          ]
        ]
      }
    }
  });
  (0, import_vitest.expect)(cache.read({ selection }).data).toEqual({
    viewer: {
      id: "1",
      firstName: "bob",
      friends: [
        [
          {
            id: "2",
            firstName: "jane"
          },
          null
        ],
        [
          {
            id: "3",
            firstName: "jane"
          },
          {
            id: "4",
            firstName: "jane"
          }
        ]
      ]
    }
  });
});
(0, import_vitest.test)("can store and retrieve links with null values", function() {
  const cache = new import_cache.Cache(config);
  const selection = {
    viewer: {
      type: "User",
      keyRaw: "viewer",
      nullable: true,
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
      viewer: null
    }
  });
  (0, import_vitest.expect)(cache.read({ selection }).data).toEqual({
    viewer: null
  });
});
(0, import_vitest.test)("can write list of just null", function() {
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
        firstName: "bob",
        friends: [null]
      }
    }
  });
  (0, import_vitest.expect)(cache.read({ selection }).data).toEqual({
    viewer: {
      id: "1",
      firstName: "bob",
      friends: [null]
    }
  });
});
(0, import_vitest.test)("null-value cascade from field value", function() {
  const cache = new import_cache.Cache(config);
  cache.write({
    selection: {
      viewer: {
        type: "User",
        keyRaw: "viewer",
        fields: {
          id: {
            keyRaw: "id",
            type: "String"
          }
        }
      }
    },
    data: {
      viewer: {
        id: "1"
      }
    }
  });
  (0, import_vitest.expect)(
    cache.read({
      selection: {
        viewer: {
          type: "User",
          keyRaw: "viewer",
          nullable: true,
          fields: {
            id: {
              keyRaw: "id",
              type: "String"
            }
          }
        }
      }
    }).data
  ).toEqual({
    viewer: {
      id: "1"
    }
  });
  (0, import_vitest.expect)(
    cache.read({
      selection: {
        viewer: {
          type: "User",
          keyRaw: "viewer",
          nullable: true,
          fields: {
            firstName: {
              keyRaw: "firstName",
              type: "String"
            },
            id: {
              keyRaw: "id",
              type: "String"
            }
          }
        }
      }
    }).data
  ).toEqual({
    viewer: null
  });
});
(0, import_vitest.test)("null-value field", function() {
  const cache = new import_cache.Cache(config);
  cache.write({
    selection: {
      viewer: {
        type: "User",
        keyRaw: "viewer",
        fields: {
          id: {
            keyRaw: "id",
            type: "String"
          },
          firstName: {
            keyRaw: "firstName",
            type: "String"
          }
        }
      }
    },
    data: {
      viewer: {
        id: "1",
        firstName: null
      }
    }
  });
  (0, import_vitest.expect)(
    cache.read({
      selection: {
        viewer: {
          type: "User",
          keyRaw: "viewer",
          nullable: true,
          fields: {
            id: {
              keyRaw: "id",
              type: "String"
            }
          }
        }
      }
    }).data
  ).toEqual({
    viewer: {
      id: "1"
    }
  });
  (0, import_vitest.expect)(
    cache.read({
      selection: {
        viewer: {
          type: "User",
          keyRaw: "viewer",
          nullable: true,
          fields: {
            firstName: {
              keyRaw: "firstName",
              type: "String",
              nullable: true
            }
          }
        }
      }
    }).data
  ).toEqual({
    viewer: {
      firstName: null
    }
  });
});
(0, import_vitest.test)("null-value cascade from object value", function() {
  const cache = new import_cache.Cache(config);
  cache.write({
    selection: {
      viewer: {
        type: "User",
        keyRaw: "viewer",
        fields: {
          id: {
            keyRaw: "id",
            type: "String"
          }
        }
      }
    },
    data: {
      viewer: {
        id: "1"
      }
    }
  });
  (0, import_vitest.expect)(
    cache.read({
      selection: {
        viewer: {
          type: "User",
          keyRaw: "viewer",
          nullable: true,
          fields: {
            id: {
              keyRaw: "id",
              type: "String"
            },
            parent: {
              keyRaw: "parent",
              type: "User"
            }
          }
        }
      }
    })
  ).toEqual({
    partial: true,
    data: {
      viewer: null
    }
  });
  (0, import_vitest.expect)(
    cache.read({
      selection: {
        viewer: {
          type: "User",
          keyRaw: "viewer",
          nullable: true,
          fields: {
            id: {
              keyRaw: "id",
              type: "String"
            },
            parent: {
              keyRaw: "parent",
              type: "User",
              nullable: true
            }
          }
        }
      }
    })
  ).toEqual({
    partial: true,
    data: {
      viewer: {
        id: "1",
        parent: null
      }
    }
  });
});
(0, import_vitest.test)("null-value cascade to root", function() {
  const cache = new import_cache.Cache(config);
  cache.write({
    selection: {
      viewer: {
        type: "User",
        keyRaw: "viewer",
        fields: {
          id: {
            keyRaw: "id",
            type: "String"
          }
        }
      }
    },
    data: {
      viewer: {
        id: "1"
      }
    }
  });
  (0, import_vitest.expect)(
    cache.read({
      selection: {
        viewer: {
          type: "User",
          keyRaw: "viewer",
          fields: {
            id: {
              keyRaw: "id",
              type: "String"
            },
            parent: {
              keyRaw: "parent",
              type: "User"
            }
          }
        }
      }
    })
  ).toEqual({
    data: null,
    partial: true
  });
  (0, import_vitest.expect)(
    cache.read({
      selection: {
        viewer: {
          type: "User",
          keyRaw: "viewer",
          nullable: true,
          fields: {
            parent: {
              keyRaw: "parent",
              type: "User"
            },
            id: {
              keyRaw: "id",
              type: "String"
            }
          }
        }
      }
    }).data
  ).toEqual({
    viewer: null
  });
});
(0, import_vitest.test)("must have a single value in order to use partial data", function() {
  const cache = new import_cache.Cache(config);
  cache.write({
    selection: {
      viewer: {
        type: "User",
        keyRaw: "viewer",
        nullable: true,
        fields: {
          id: {
            keyRaw: "id",
            type: "String"
          }
        }
      }
    },
    data: {
      viewer: {
        id: "1"
      }
    }
  });
  (0, import_vitest.expect)(
    cache.read({
      selection: {
        viewer: {
          type: "User",
          keyRaw: "viewer",
          nullable: true,
          fields: {
            parent: {
              keyRaw: "parent",
              type: "User"
            }
          }
        }
      }
    })
  ).toEqual({
    partial: false,
    data: null
  });
  (0, import_vitest.expect)(
    cache.read({
      selection: {
        viewer: {
          type: "User",
          keyRaw: "viewer",
          nullable: true,
          fields: {
            id: {
              keyRaw: "id",
              type: "String"
            },
            parent: {
              keyRaw: "parent",
              type: "User"
            }
          }
        }
      }
    })
  ).toEqual({
    partial: true,
    data: {
      viewer: null
    }
  });
});
(0, import_vitest.test)("reading an empty list counts as data", function() {
  const cache = new import_cache.Cache(config);
  cache.write({
    selection: {
      viewer: {
        type: "User",
        keyRaw: "viewer",
        nullable: true,
        fields: {
          id: {
            keyRaw: "id",
            type: "String"
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
    },
    data: {
      viewer: {
        id: "1",
        friends: []
      }
    }
  });
  (0, import_vitest.expect)(
    cache.read({
      selection: {
        viewer: {
          type: "User",
          keyRaw: "viewer",
          nullable: true,
          fields: {
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
      }
    })
  ).toEqual({
    partial: false,
    data: {
      viewer: {
        friends: []
      }
    }
  });
});
