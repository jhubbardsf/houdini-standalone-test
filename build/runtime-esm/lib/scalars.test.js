import { test, expect, describe, beforeEach } from "vitest";
import { testConfigFile } from "../../test";
import { setMockConfig } from "./config";
import { marshalInputs, marshalSelection, unmarshalSelection } from "./scalars";
import { ArtifactKind } from "./types";
beforeEach(
  () => setMockConfig({
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
  kind: ArtifactKind.Query,
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
describe("marshal inputs", function() {
  test("lists of objects", async function() {
    const date1 = new Date(0);
    const date2 = new Date(1);
    const date3 = new Date(2);
    const inputs = await marshalInputs({
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
    expect(inputs).toEqual({
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
  test("list of scalars", async function() {
    const date1 = new Date(0);
    const date2 = new Date(1);
    const inputs = await marshalInputs({
      artifact,
      input: {
        date: [
          {
            dates: [date1, date2]
          }
        ]
      }
    });
    expect(inputs).toEqual({
      date: [
        {
          dates: [date1.getTime(), date2.getTime()]
        }
      ]
    });
  });
  test("empty list of scalars", async function() {
    const inputs = await marshalInputs({
      artifact,
      input: {
        date: [
          {
            dates: []
          }
        ]
      }
    });
    expect(inputs).toEqual({
      date: [
        {
          dates: []
        }
      ]
    });
  });
  test("root fields", async function() {
    const inputs = await marshalInputs({
      artifact,
      input: {
        booleanValue: true
      }
    });
    expect(inputs).toEqual({
      booleanValue: true
    });
  });
  test("non-custom scalar fields of objects", async function() {
    const inputs = await marshalInputs({
      artifact,
      input: {
        date: {
          name: "hello"
        }
      }
    });
    expect(inputs).toEqual({
      date: {
        name: "hello"
      }
    });
  });
  test("non-custom scalar fields of lists", async function() {
    const inputs = await marshalInputs({
      artifact,
      input: {
        date: [
          {
            name: "hello"
          }
        ]
      }
    });
    expect(inputs).toEqual({
      date: [
        {
          name: "hello"
        }
      ]
    });
  });
  test("null", async function() {
    const inputs = await marshalInputs({
      artifact,
      input: {
        date: null
      }
    });
    expect(inputs).toEqual({
      date: null
    });
  });
  test("undefined", async function() {
    const inputs = await marshalInputs({
      artifact,
      input: {
        date: void 0
      }
    });
    expect(inputs).toEqual({
      date: void 0
    });
  });
  test("enums", async function() {
    const inputs = await marshalInputs({
      artifact,
      input: {
        enumValue: "ValueA"
      }
    });
    expect(inputs).toEqual({
      enumValue: "ValueA"
    });
  });
  test("list of enums", async function() {
    const inputs = await marshalInputs({
      artifact,
      input: {
        enumValue: ["ValueA", "ValueB"]
      }
    });
    expect(inputs).toEqual({
      enumValue: ["ValueA", "ValueB"]
    });
  });
});
describe("unmarshal selection", function() {
  test("list of objects", function() {
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
    expect(unmarshalSelection(testConfigFile(), artifact.selection, data)).toEqual({
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
  test("list of scalars", function() {
    const date1 = new Date(1);
    const date2 = new Date(2);
    const data = {
      items: [
        {
          dates: [date1.getTime(), date2.getTime()]
        }
      ]
    };
    expect(unmarshalSelection(testConfigFile(), artifact.selection, data)).toEqual({
      items: [
        {
          dates: [date1, date2]
        }
      ]
    });
  });
  test("empty list of scalars", function() {
    const data = {
      items: [
        {
          dates: []
        }
      ]
    };
    expect(unmarshalSelection(testConfigFile(), artifact.selection, data)).toEqual({
      items: [
        {
          dates: []
        }
      ]
    });
  });
  test("missing unmarshal function", function() {
    const config = testConfigFile({
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
    expect(() => unmarshalSelection(config, artifact.selection, data)).toThrow(
      /scalar type DateTime is missing an `unmarshal` function/
    );
  });
  test("undefined", function() {
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
    expect(unmarshalSelection(testConfigFile(), selection, data)).toEqual({
      item: void 0
    });
  });
  test("null", function() {
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
    expect(unmarshalSelection(testConfigFile(), selection, data)).toEqual({
      item: null
    });
  });
  test("null inside", function() {
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
    expect(unmarshalSelection(testConfigFile(), selection, data)).toEqual({
      item: {
        createdAt: null
      }
    });
  });
  test("nested objects", function() {
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
    expect(unmarshalSelection(testConfigFile(), selection, data)).toEqual({
      item: {
        createdAt: date,
        creator: {
          firstName: "John"
        }
      }
    });
  });
  test("fields on root", function() {
    const data = {
      rootBool: true
    };
    const selection = {
      rootBool: {
        type: "Boolean",
        keyRaw: "rootBool"
      }
    };
    expect(unmarshalSelection(testConfigFile(), selection, data)).toEqual({
      rootBool: true
    });
  });
  test("enums", function() {
    const data = {
      enumValue: "Hello"
    };
    const selection = {
      enumValue: {
        type: "EnumValue",
        keyRaw: "enumValue"
      }
    };
    expect(unmarshalSelection(testConfigFile(), selection, data)).toEqual({
      enumValue: "Hello"
    });
  });
  test("list of enums", function() {
    const data = {
      enumValue: ["Hello", "World"]
    };
    const selection = {
      enumValue: {
        type: "EnumValue",
        keyRaw: "enumValue"
      }
    };
    expect(unmarshalSelection(testConfigFile(), selection, data)).toEqual({
      enumValue: ["Hello", "World"]
    });
  });
});
describe("marshal selection", function() {
  test("list of objects", async function() {
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
    await expect(
      marshalSelection({
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
  test("list of scalars", async function() {
    const date1 = new Date(1);
    const date2 = new Date(2);
    const data = {
      items: [
        {
          dates: [date1, date2]
        }
      ]
    };
    await expect(
      marshalSelection({
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
  test("empty list of scalars", async function() {
    const data = {
      items: [
        {
          dates: []
        }
      ]
    };
    await expect(
      marshalSelection({
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
  test("missing marshal function", async function() {
    setMockConfig(
      testConfigFile({
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
    await expect(
      () => marshalSelection({
        selection: artifact.selection,
        data
      })
    ).rejects.toThrow(/scalar type DateTime is missing a `marshal` function/);
  });
  test("undefined", async function() {
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
    await expect(
      marshalSelection({
        selection,
        data
      })
    ).resolves.toEqual({
      item: void 0
    });
  });
  test("null", async function() {
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
    await expect(
      marshalSelection({
        selection,
        data
      })
    ).resolves.toEqual({
      item: null
    });
  });
  test("nested objects", async function() {
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
    await expect(
      marshalSelection({
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
  test("fields on root", async function() {
    const data = {
      rootBool: true
    };
    const selection = {
      rootBool: {
        type: "Boolean",
        keyRaw: "rootBool"
      }
    };
    await expect(
      marshalSelection({
        selection,
        data
      })
    ).resolves.toEqual({
      rootBool: true
    });
  });
  test("enums", async function() {
    const data = {
      enumValue: "Hello"
    };
    const selection = {
      enumValue: {
        type: "EnumValue",
        keyRaw: "enumValue"
      }
    };
    await expect(
      marshalSelection({
        selection,
        data
      })
    ).resolves.toEqual({
      enumValue: "Hello"
    });
  });
  test("list of enums", async function() {
    const data = {
      enumValue: ["Hello", "World"]
    };
    const selection = {
      enumValue: {
        type: "EnumValue",
        keyRaw: "enumValue"
      }
    };
    await expect(
      marshalSelection({
        selection,
        data
      })
    ).resolves.toEqual({
      enumValue: ["Hello", "World"]
    });
  });
});
