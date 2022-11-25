"use strict";
var import_vitest = require("vitest");
var import_test = require("../../test");
var import_config = require("./config");
var import_scalars = require("./scalars");
var import_types = require("./types");
(0, import_vitest.beforeEach)(
  () => (0, import_config.setMockConfig)({
    client: "",
    scalars: {
      DateTime: {
        type: "Date",
        unmarshal(val) {
          return new Date(val);
        },
        marshal(date) {
          return date.getTime();
        }
      }
    }
  })
);
const artifact = {
  name: "AllItems",
  kind: import_types.ArtifactKind.Query,
  hash: "hash",
  raw: "does not matter",
  selection: {
    items: {
      type: "TodoItem",
      keyRaw: "allItems",
      fields: {
        createdAt: {
          type: "DateTime",
          keyRaw: "createdAt"
        },
        dates: {
          type: "DateTime",
          keyRaw: "dates"
        },
        creator: {
          type: "User",
          keyRaw: "creator",
          fields: {
            firstName: {
              type: "String",
              keyRaw: "firstName"
            }
          },
          list: {
            name: "All_Items",
            type: "User",
            connection: false
          }
        }
      },
      list: {
        name: "All_Items",
        type: "User",
        connection: false
      }
    }
  },
  rootType: "Query",
  input: {
    fields: {
      date: "NestedDate",
      booleanValue: "Boolean",
      enumValue: "EnumValue"
    },
    types: {
      NestedDate: {
        date: "DateTime",
        dates: "DateTime",
        nested: "NestedDate",
        enumValue: "EnumValue"
      }
    }
  }
};
(0, import_vitest.describe)("marshal inputs", function() {
  (0, import_vitest.test)("lists of objects", async function() {
    const date1 = new Date(0);
    const date2 = new Date(1);
    const date3 = new Date(2);
    const inputs = await (0, import_scalars.marshalInputs)({
      artifact,
      input: {
        date: [
          {
            date: date1,
            nested: {
              date: date2,
              nested: {
                date: date3,
                enumValue: "asdf"
              }
            }
          }
        ]
      }
    });
    (0, import_vitest.expect)(inputs).toEqual({
      date: [
        {
          date: date1.getTime(),
          nested: {
            date: date2.getTime(),
            nested: {
              date: date3.getTime(),
              enumValue: "asdf"
            }
          }
        }
      ]
    });
  });
  (0, import_vitest.test)("list of scalars", async function() {
    const date1 = new Date(0);
    const date2 = new Date(1);
    const inputs = await (0, import_scalars.marshalInputs)({
      artifact,
      input: {
        date: [
          {
            dates: [date1, date2]
          }
        ]
      }
    });
    (0, import_vitest.expect)(inputs).toEqual({
      date: [
        {
          dates: [date1.getTime(), date2.getTime()]
        }
      ]
    });
  });
  (0, import_vitest.test)("empty list of scalars", async function() {
    const inputs = await (0, import_scalars.marshalInputs)({
      artifact,
      input: {
        date: [
          {
            dates: []
          }
        ]
      }
    });
    (0, import_vitest.expect)(inputs).toEqual({
      date: [
        {
          dates: []
        }
      ]
    });
  });
  (0, import_vitest.test)("root fields", async function() {
    const inputs = await (0, import_scalars.marshalInputs)({
      artifact,
      input: {
        booleanValue: true
      }
    });
    (0, import_vitest.expect)(inputs).toEqual({
      booleanValue: true
    });
  });
  (0, import_vitest.test)("non-custom scalar fields of objects", async function() {
    const inputs = await (0, import_scalars.marshalInputs)({
      artifact,
      input: {
        date: {
          name: "hello"
        }
      }
    });
    (0, import_vitest.expect)(inputs).toEqual({
      date: {
        name: "hello"
      }
    });
  });
  (0, import_vitest.test)("non-custom scalar fields of lists", async function() {
    const inputs = await (0, import_scalars.marshalInputs)({
      artifact,
      input: {
        date: [
          {
            name: "hello"
          }
        ]
      }
    });
    (0, import_vitest.expect)(inputs).toEqual({
      date: [
        {
          name: "hello"
        }
      ]
    });
  });
  (0, import_vitest.test)("null", async function() {
    const inputs = await (0, import_scalars.marshalInputs)({
      artifact,
      input: {
        date: null
      }
    });
    (0, import_vitest.expect)(inputs).toEqual({
      date: null
    });
  });
  (0, import_vitest.test)("undefined", async function() {
    const inputs = await (0, import_scalars.marshalInputs)({
      artifact,
      input: {
        date: void 0
      }
    });
    (0, import_vitest.expect)(inputs).toEqual({
      date: void 0
    });
  });
  (0, import_vitest.test)("enums", async function() {
    const inputs = await (0, import_scalars.marshalInputs)({
      artifact,
      input: {
        enumValue: "ValueA"
      }
    });
    (0, import_vitest.expect)(inputs).toEqual({
      enumValue: "ValueA"
    });
  });
  (0, import_vitest.test)("list of enums", async function() {
    const inputs = await (0, import_scalars.marshalInputs)({
      artifact,
      input: {
        enumValue: ["ValueA", "ValueB"]
      }
    });
    (0, import_vitest.expect)(inputs).toEqual({
      enumValue: ["ValueA", "ValueB"]
    });
  });
});
(0, import_vitest.describe)("unmarshal selection", function() {
  (0, import_vitest.test)("list of objects", function() {
    const date = new Date();
    const data = {
      items: [
        {
          createdAt: date.getTime(),
          creator: {
            firstName: "John"
          }
        }
      ]
    };
    (0, import_vitest.expect)((0, import_scalars.unmarshalSelection)((0, import_test.testConfigFile)(), artifact.selection, data)).toEqual({
      items: [
        {
          createdAt: date,
          creator: {
            firstName: "John"
          }
        }
      ]
    });
  });
  (0, import_vitest.test)("list of scalars", function() {
    const date1 = new Date(1);
    const date2 = new Date(2);
    const data = {
      items: [
        {
          dates: [date1.getTime(), date2.getTime()]
        }
      ]
    };
    (0, import_vitest.expect)((0, import_scalars.unmarshalSelection)((0, import_test.testConfigFile)(), artifact.selection, data)).toEqual({
      items: [
        {
          dates: [date1, date2]
        }
      ]
    });
  });
  (0, import_vitest.test)("empty list of scalars", function() {
    const data = {
      items: [
        {
          dates: []
        }
      ]
    };
    (0, import_vitest.expect)((0, import_scalars.unmarshalSelection)((0, import_test.testConfigFile)(), artifact.selection, data)).toEqual({
      items: [
        {
          dates: []
        }
      ]
    });
  });
  (0, import_vitest.test)("missing unmarshal function", function() {
    const config = (0, import_test.testConfigFile)({
      scalars: {
        DateTime: {
          type: "Date",
          marshal(date) {
            return date.getTime();
          }
        }
      }
    });
    const data = {
      items: [
        {
          dates: [new Date()]
        }
      ]
    };
    (0, import_vitest.expect)(() => (0, import_scalars.unmarshalSelection)(config, artifact.selection, data)).toThrow(
      /scalar type DateTime is missing an `unmarshal` function/
    );
  });
  (0, import_vitest.test)("undefined", function() {
    const data = {
      item: void 0
    };
    const selection = {
      item: {
        type: "TodoItem",
        keyRaw: "item",
        fields: {
          createdAt: {
            type: "DateTime",
            keyRaw: "createdAt"
          }
        }
      }
    };
    (0, import_vitest.expect)((0, import_scalars.unmarshalSelection)((0, import_test.testConfigFile)(), selection, data)).toEqual({
      item: void 0
    });
  });
  (0, import_vitest.test)("null", function() {
    const data = {
      item: null
    };
    const selection = {
      item: {
        type: "TodoItem",
        keyRaw: "item",
        fields: {
          createdAt: {
            type: "DateTime",
            keyRaw: "createdAt"
          }
        }
      }
    };
    (0, import_vitest.expect)((0, import_scalars.unmarshalSelection)((0, import_test.testConfigFile)(), selection, data)).toEqual({
      item: null
    });
  });
  (0, import_vitest.test)("null inside", function() {
    const data = {
      item: {
        createdAt: null
      }
    };
    const selection = {
      item: {
        type: "TodoItem",
        keyRaw: "item",
        fields: {
          createdAt: {
            type: "DateTime",
            keyRaw: "createdAt"
          }
        }
      }
    };
    (0, import_vitest.expect)((0, import_scalars.unmarshalSelection)((0, import_test.testConfigFile)(), selection, data)).toEqual({
      item: {
        createdAt: null
      }
    });
  });
  (0, import_vitest.test)("nested objects", function() {
    const date = new Date();
    const data = {
      item: {
        createdAt: date.getTime(),
        creator: {
          firstName: "John"
        }
      }
    };
    const selection = {
      item: {
        type: "TodoItem",
        keyRaw: "item",
        fields: {
          createdAt: {
            type: "DateTime",
            keyRaw: "createdAt"
          },
          creator: {
            type: "User",
            keyRaw: "creator",
            fields: {
              firstName: {
                type: "String",
                keyRaw: "firstName"
              }
            },
            list: {
              name: "All_Items",
              type: "User",
              connection: false
            }
          }
        }
      }
    };
    (0, import_vitest.expect)((0, import_scalars.unmarshalSelection)((0, import_test.testConfigFile)(), selection, data)).toEqual({
      item: {
        createdAt: date,
        creator: {
          firstName: "John"
        }
      }
    });
  });
  (0, import_vitest.test)("fields on root", function() {
    const data = {
      rootBool: true
    };
    const selection = {
      rootBool: {
        type: "Boolean",
        keyRaw: "rootBool"
      }
    };
    (0, import_vitest.expect)((0, import_scalars.unmarshalSelection)((0, import_test.testConfigFile)(), selection, data)).toEqual({
      rootBool: true
    });
  });
  (0, import_vitest.test)("enums", function() {
    const data = {
      enumValue: "Hello"
    };
    const selection = {
      enumValue: {
        type: "EnumValue",
        keyRaw: "enumValue"
      }
    };
    (0, import_vitest.expect)((0, import_scalars.unmarshalSelection)((0, import_test.testConfigFile)(), selection, data)).toEqual({
      enumValue: "Hello"
    });
  });
  (0, import_vitest.test)("list of enums", function() {
    const data = {
      enumValue: ["Hello", "World"]
    };
    const selection = {
      enumValue: {
        type: "EnumValue",
        keyRaw: "enumValue"
      }
    };
    (0, import_vitest.expect)((0, import_scalars.unmarshalSelection)((0, import_test.testConfigFile)(), selection, data)).toEqual({
      enumValue: ["Hello", "World"]
    });
  });
});
(0, import_vitest.describe)("marshal selection", function() {
  (0, import_vitest.test)("list of objects", async function() {
    const date = new Date();
    const data = {
      items: [
        {
          createdAt: date,
          creator: {
            firstName: "John"
          }
        }
      ]
    };
    await (0, import_vitest.expect)(
      (0, import_scalars.marshalSelection)({
        selection: artifact.selection,
        data
      })
    ).resolves.toEqual({
      items: [
        {
          createdAt: date.getTime(),
          creator: {
            firstName: "John"
          }
        }
      ]
    });
  });
  (0, import_vitest.test)("list of scalars", async function() {
    const date1 = new Date(1);
    const date2 = new Date(2);
    const data = {
      items: [
        {
          dates: [date1, date2]
        }
      ]
    };
    await (0, import_vitest.expect)(
      (0, import_scalars.marshalSelection)({
        selection: artifact.selection,
        data
      })
    ).resolves.toEqual({
      items: [
        {
          dates: [date1.getTime(), date2.getTime()]
        }
      ]
    });
  });
  (0, import_vitest.test)("empty list of scalars", async function() {
    const data = {
      items: [
        {
          dates: []
        }
      ]
    };
    await (0, import_vitest.expect)(
      (0, import_scalars.marshalSelection)({
        selection: artifact.selection,
        data
      })
    ).resolves.toEqual({
      items: [
        {
          dates: []
        }
      ]
    });
  });
  (0, import_vitest.test)("missing marshal function", async function() {
    (0, import_config.setMockConfig)(
      (0, import_test.testConfigFile)({
        scalars: {
          DateTime: {
            type: "Date"
          }
        }
      })
    );
    const data = {
      items: [
        {
          dates: [new Date()]
        }
      ]
    };
    await (0, import_vitest.expect)(
      () => (0, import_scalars.marshalSelection)({
        selection: artifact.selection,
        data
      })
    ).rejects.toThrow(/scalar type DateTime is missing a `marshal` function/);
  });
  (0, import_vitest.test)("undefined", async function() {
    const data = {
      item: void 0
    };
    const selection = {
      item: {
        type: "TodoItem",
        keyRaw: "item",
        fields: {
          createdAt: {
            type: "DateTime",
            keyRaw: "createdAt"
          }
        }
      }
    };
    await (0, import_vitest.expect)(
      (0, import_scalars.marshalSelection)({
        selection,
        data
      })
    ).resolves.toEqual({
      item: void 0
    });
  });
  (0, import_vitest.test)("null", async function() {
    const data = {
      item: null
    };
    const selection = {
      item: {
        type: "TodoItem",
        keyRaw: "item",
        fields: {
          createdAt: {
            type: "DateTime",
            keyRaw: "createdAt"
          }
        }
      }
    };
    await (0, import_vitest.expect)(
      (0, import_scalars.marshalSelection)({
        selection,
        data
      })
    ).resolves.toEqual({
      item: null
    });
  });
  (0, import_vitest.test)("nested objects", async function() {
    const date = new Date();
    const data = {
      item: {
        createdAt: date,
        creator: {
          firstName: "John"
        }
      }
    };
    const selection = {
      item: {
        type: "TodoItem",
        keyRaw: "item",
        fields: {
          createdAt: {
            type: "DateTime",
            keyRaw: "createdAt"
          },
          creator: {
            type: "User",
            keyRaw: "creator",
            fields: {
              firstName: {
                type: "String",
                keyRaw: "firstName"
              }
            },
            list: {
              name: "All_Items",
              type: "User",
              connection: false
            }
          }
        }
      }
    };
    await (0, import_vitest.expect)(
      (0, import_scalars.marshalSelection)({
        selection,
        data
      })
    ).resolves.toEqual({
      item: {
        createdAt: date.getTime(),
        creator: {
          firstName: "John"
        }
      }
    });
  });
  (0, import_vitest.test)("fields on root", async function() {
    const data = {
      rootBool: true
    };
    const selection = {
      rootBool: {
        type: "Boolean",
        keyRaw: "rootBool"
      }
    };
    await (0, import_vitest.expect)(
      (0, import_scalars.marshalSelection)({
        selection,
        data
      })
    ).resolves.toEqual({
      rootBool: true
    });
  });
  (0, import_vitest.test)("enums", async function() {
    const data = {
      enumValue: "Hello"
    };
    const selection = {
      enumValue: {
        type: "EnumValue",
        keyRaw: "enumValue"
      }
    };
    await (0, import_vitest.expect)(
      (0, import_scalars.marshalSelection)({
        selection,
        data
      })
    ).resolves.toEqual({
      enumValue: "Hello"
    });
  });
  (0, import_vitest.test)("list of enums", async function() {
    const data = {
      enumValue: ["Hello", "World"]
    };
    const selection = {
      enumValue: {
        type: "EnumValue",
        keyRaw: "enumValue"
      }
    };
    await (0, import_vitest.expect)(
      (0, import_scalars.marshalSelection)({
        selection,
        data
      })
    ).resolves.toEqual({
      enumValue: ["Hello", "World"]
    });
  });
});
