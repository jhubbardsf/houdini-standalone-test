"use strict";
var import_vitest = require("vitest");
var import_storage = require("../storage");
(0, import_vitest.describe)("in memory layers", function() {
  (0, import_vitest.test)("first layer written can be looked up", function() {
    const storage = new import_storage.InMemoryStorage();
    const layer = storage.createLayer();
    layer.writeField("User:1", "firstName", "John");
    (0, import_vitest.expect)(storage.get("User:1", "firstName")).toEqual({
      value: "John",
      displayLayers: [layer.id],
      kind: "scalar"
    });
    (0, import_vitest.expect)(storage.layerCount).toEqual(1);
  });
  (0, import_vitest.test)("non-optimistic layer overwrites base", function() {
    const storage = new import_storage.InMemoryStorage();
    storage.writeField("User:1", "firstName", "John");
    const layerID = storage.writeField("User:1", "firstName", "Marshal");
    (0, import_vitest.expect)(storage.get("User:1", "firstName")).toEqual({
      value: "Marshal",
      displayLayers: [layerID],
      kind: "scalar"
    });
    (0, import_vitest.expect)(storage.layerCount).toEqual(1);
  });
  (0, import_vitest.test)("optimistic layer overwrites base", function() {
    const storage = new import_storage.InMemoryStorage();
    storage.writeField("User:1", "firstName", "John");
    const optimisticLayerID = storage.createLayer(true).writeField("User:1", "firstName", "Marshal");
    (0, import_vitest.expect)(storage.get("User:1", "firstName")).toEqual({
      value: "Marshal",
      kind: "scalar",
      displayLayers: [optimisticLayerID]
    });
    (0, import_vitest.expect)(storage.layerCount).toEqual(2);
  });
  (0, import_vitest.test)("resolving layer merges into base", function() {
    const storage = new import_storage.InMemoryStorage();
    const baseLayerID = storage.writeField("User:1", "firstName", "John");
    (0, import_vitest.expect)(storage.get("User:1", "firstName")).toEqual({
      value: "John",
      displayLayers: [baseLayerID],
      kind: "scalar"
    });
    (0, import_vitest.expect)(storage.layerCount).toEqual(1);
    const optimisticLayer = storage.createLayer(true);
    optimisticLayer.writeField("User:1", "firstName", "Marshal");
    (0, import_vitest.expect)(storage.get("User:1", "firstName")).toEqual({
      value: "Marshal",
      kind: "scalar",
      displayLayers: [optimisticLayer.id]
    });
    (0, import_vitest.expect)(storage.layerCount).toEqual(2);
    optimisticLayer.writeField("User:1", "firstName", "Mike");
    storage.resolveLayer(optimisticLayer.id);
    (0, import_vitest.expect)(storage.get("User:1", "firstName")).toEqual({
      value: "Mike",
      displayLayers: [baseLayerID],
      kind: "scalar"
    });
    (0, import_vitest.expect)(storage.layerCount).toEqual(1);
  });
  (0, import_vitest.test)("resolving layer merges up", function() {
    const storage = new import_storage.InMemoryStorage();
    const baseLayerID = storage.writeField("User:1", "firstName", "John");
    const layer1 = storage.createLayer(true);
    layer1.writeField("User:1", "firstName", "Michael");
    const layer2 = storage.createLayer();
    layer2.writeField("User:1", "firstName", "Jeremy");
    layer2.writeField("User:1", "lastName", "Michelson");
    (0, import_vitest.expect)(storage.get("User:1", "firstName")).toEqual({
      value: "Jeremy",
      displayLayers: [layer2.id],
      kind: "scalar"
    });
    (0, import_vitest.expect)(storage.layerCount).toEqual(3);
    layer1.writeField("User:1", "firstName", "Michael");
    layer1.writeField("User:1", "lastName", "George'");
    layer1.writeField("User:1", "age", 5);
    storage.resolveLayer(layer1.id);
    (0, import_vitest.expect)(storage.layerCount).toEqual(1);
    (0, import_vitest.expect)(storage.get("User:1", "age")).toEqual({
      value: 5,
      displayLayers: [baseLayerID],
      kind: "scalar"
    });
    (0, import_vitest.expect)(storage.get("User:1", "firstName")).toEqual({
      value: "Jeremy",
      displayLayers: [baseLayerID],
      kind: "scalar"
    });
    (0, import_vitest.expect)(storage.get("User:1", "lastName")).toEqual({
      value: "Michelson",
      displayLayers: [baseLayerID],
      kind: "scalar"
    });
  });
  (0, import_vitest.test)("can write links", function() {
    const storage = new import_storage.InMemoryStorage();
    const layerID = storage.writeLink("User:1", "bestFriend", "User:2");
    (0, import_vitest.expect)(storage.get("User:1", "bestFriend")).toEqual({
      value: "User:2",
      displayLayers: [layerID],
      kind: "link"
    });
  });
  (0, import_vitest.test)("can write list of links", function() {
    const storage = new import_storage.InMemoryStorage();
    const layerID = storage.writeLink("User:1", "friends", ["User:1"]);
    (0, import_vitest.expect)(storage.get("User:1", "friends")).toEqual({
      value: ["User:1"],
      displayLayers: [layerID],
      kind: "link"
    });
  });
  (0, import_vitest.test)("values are reset when layer is cleared", function() {
    const storage = new import_storage.InMemoryStorage();
    const layer = storage.createLayer(true);
    layer.writeField("User:1", "firstName", "Alec");
    (0, import_vitest.expect)(storage.get("User:1", "firstName")).toEqual({
      value: "Alec",
      displayLayers: [layer.id],
      kind: "scalar"
    });
    layer.clear();
    (0, import_vitest.expect)(storage.get("User:1", "firstName").value).toBeUndefined();
  });
  (0, import_vitest.test)("can overwrite deletes for a specific link list", function() {
    const storage = new import_storage.InMemoryStorage();
    storage.writeLink("User:1", "friends", ["User:2"]);
    const layer = storage.createLayer(true);
    layer.delete("User:2");
    (0, import_vitest.expect)(storage.get("User:1", "friends").value).toEqual([]);
    storage.resolveLayer(layer.id);
    (0, import_vitest.expect)(storage.get("User:1", "friends").value).toEqual([]);
    storage.writeLink("User:1", "friends", ["User:2"]);
    (0, import_vitest.expect)(storage.get("User:1", "friends").value).toEqual(["User:2"]);
  });
  (0, import_vitest.test)("deleting specific fields removes the field", function() {
    const storage = new import_storage.InMemoryStorage();
    storage.writeField("User:1", "firstName", "Michael");
    storage.writeField("User:1", "lastName", "Aivazis");
    (0, import_vitest.expect)(storage.get("User:1", "firstName")).toEqual({
      value: "Michael",
      displayLayers: [storage.topLayer.id],
      kind: "scalar"
    });
    storage.deleteField("User:1", "firstName");
    storage.topLayer.removeUndefinedFields();
    (0, import_vitest.expect)(storage.get("User:1", "firstName")).toEqual({
      value: void 0,
      displayLayers: [],
      kind: "unknown"
    });
    (0, import_vitest.expect)(Object.keys(storage.topLayer.fields["User:1"])).toEqual(["lastName"]);
  });
  (0, import_vitest.test)("deleting all fields of a record deletes the record", function() {
    const storage = new import_storage.InMemoryStorage();
    storage.writeField("User:1", "firstName", "Michael");
    (0, import_vitest.expect)(storage.get("User:1", "firstName")).toEqual({
      value: "Michael",
      displayLayers: [storage.topLayer.id],
      kind: "scalar"
    });
    storage.deleteField("User:1", "firstName");
    storage.topLayer.removeUndefinedFields();
    (0, import_vitest.expect)(storage.get("User:1", "firstName")).toEqual({
      value: void 0,
      displayLayers: [],
      kind: "unknown"
    });
    (0, import_vitest.expect)(storage.topLayer.fields["User:1"]).toBeUndefined();
  });
  (0, import_vitest.test)("create and resolve on base layer", function() {
    const storage = new import_storage.InMemoryStorage();
    const layer = storage.createLayer(true);
    layer.writeField("User:1", "firstName", "bob");
    storage.resolveLayer(layer.id);
    (0, import_vitest.expect)(storage.get("User:1", "firstName").value).toEqual("bob");
  });
  import_vitest.test.todo("links are reset when layer is cleared");
  (0, import_vitest.describe)("operations", function() {
    (0, import_vitest.test)("optimistic deletes", function() {
      const storage = new import_storage.InMemoryStorage();
      storage.writeField("User:1", "firstName", "John");
      storage.writeField("User:1", "lastName", "Schmidt");
      const baseLayerID = storage.writeLink("User:2", "friends", ["User:1", "User:3"]);
      const middleLayer = storage.createLayer(true);
      middleLayer.delete("User:1");
      const topLayerID = storage.writeField("User:1", "middleName", "Jingleheymer");
      (0, import_vitest.expect)(storage.get("User:1", "middleName")).toEqual({
        value: "Jingleheymer",
        displayLayers: [topLayerID],
        kind: "scalar"
      });
      (0, import_vitest.expect)(storage.get("User:2", "friends")).toEqual({
        value: ["User:3"],
        kind: "link",
        displayLayers: [middleLayer.id, baseLayerID]
      });
      (0, import_vitest.expect)(storage.get("User:1", "firstName").value).toBeUndefined();
      (0, import_vitest.expect)(storage.get("User:1", "lastName").value).toBeUndefined();
      middleLayer.clear();
      middleLayer.delete("User:3");
      storage.resolveLayer(middleLayer.id);
      (0, import_vitest.expect)(storage.layerCount).toEqual(1);
      (0, import_vitest.expect)(storage.get("User:1", "firstName")).toEqual({
        value: "John",
        displayLayers: [baseLayerID],
        kind: "scalar"
      });
      (0, import_vitest.expect)(storage.get("User:1", "lastName")).toEqual({
        value: "Schmidt",
        displayLayers: [baseLayerID],
        kind: "scalar"
      });
      (0, import_vitest.expect)(storage.get("User:1", "middleName")).toEqual({
        value: "Jingleheymer",
        displayLayers: [baseLayerID],
        kind: "scalar"
      });
      (0, import_vitest.expect)(storage.get("User:2", "friends")).toEqual({
        value: ["User:1"],
        displayLayers: [baseLayerID],
        kind: "link"
      });
    });
    (0, import_vitest.test)("insert into linked list", function() {
      const storage = new import_storage.InMemoryStorage();
      const baseLayerID = storage.writeLink("User:1", "friends", ["User:2"]);
      const layer = storage.createLayer(true);
      layer.insert("User:1", "friends", import_storage.OperationLocation.end, "User:3");
      storage.insert("User:1", "friends", import_storage.OperationLocation.end, "User:5");
      (0, import_vitest.expect)(storage.get("User:1", "friends")).toEqual({
        value: ["User:2", "User:3", "User:5"],
        displayLayers: [storage.topLayer.id, layer.id, baseLayerID],
        kind: "link"
      });
      layer.clear();
      layer.insert("User:1", "friends", import_storage.OperationLocation.end, "User:4");
      storage.resolveLayer(layer.id);
      (0, import_vitest.expect)(storage.get("User:1", "friends")).toEqual({
        value: ["User:2", "User:5", "User:4"],
        displayLayers: [baseLayerID],
        kind: "link"
      });
      (0, import_vitest.expect)(storage.layerCount).toEqual(1);
    });
    (0, import_vitest.test)("remove from linked list", function() {
      const storage = new import_storage.InMemoryStorage();
      const baseLayerID = storage.writeLink("User:1", "friends", [
        "User:2",
        "User:3",
        "User:4"
      ]);
      const layer = storage.createLayer(true);
      layer.remove("User:1", "friends", "User:2");
      (0, import_vitest.expect)(storage.get("User:1", "friends")).toEqual({
        value: ["User:3", "User:4"],
        displayLayers: [layer.id, baseLayerID],
        kind: "link"
      });
      layer.clear();
      layer.remove("User:1", "friends", "User:4");
      layer.remove("User:1", "friends", "User:3");
      storage.resolveLayer(layer.id);
      (0, import_vitest.expect)(storage.get("User:1", "friends")).toEqual({
        value: ["User:2"],
        displayLayers: [baseLayerID],
        kind: "link"
      });
      (0, import_vitest.expect)(storage.layerCount).toEqual(1);
    });
    import_vitest.test.todo(
      "resolving layer with deletes and fields removes old data and retains the new stuff"
    );
    import_vitest.test.todo("an optimistic layer after a stack non-optimistic survives resolution");
  });
});
