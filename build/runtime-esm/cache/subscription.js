import { evaluateKey, flattenList } from "./stuff";
class InMemorySubscriptions {
  cache;
  constructor(cache) {
    this.cache = cache;
  }
  subscribers = {};
  referenceCounts = {};
  keyVersions = {};
  add({
    parent,
    spec,
    selection,
    variables,
    parentType
  }) {
    for (const fieldSelection of Object.values(selection)) {
      const { keyRaw, fields, type } = fieldSelection;
      const key = evaluateKey(keyRaw, variables);
      this.addFieldSubscription({
        id: parent,
        key,
        selection: fieldSelection,
        spec,
        parentType: parentType || spec.rootType,
        variables
      });
      if (fields) {
        const { value: linkedRecord } = this.cache._internal_unstable.storage.get(
          parent,
          key
        );
        let children = !Array.isArray(linkedRecord) ? [linkedRecord] : flattenList(linkedRecord) || [];
        for (const child of children) {
          if (!child) {
            continue;
          }
          this.add({
            parent: child,
            spec,
            selection: fields,
            variables,
            parentType: type
          });
        }
      }
    }
  }
  addFieldSubscription({
    id,
    key,
    selection,
    spec,
    parentType,
    variables
  }) {
    if (!this.subscribers[id]) {
      this.subscribers[id] = {};
    }
    if (!this.subscribers[id][key]) {
      this.subscribers[id][key] = [];
    }
    if (!this.keyVersions[key]) {
      this.keyVersions[key] = /* @__PURE__ */ new Set();
    }
    this.keyVersions[key].add(key);
    if (!this.subscribers[id][key].map(({ set }) => set).includes(spec.set)) {
      this.subscribers[id][key].push(spec);
    }
    if (!this.referenceCounts[id]) {
      this.referenceCounts[id] = {};
    }
    if (!this.referenceCounts[id][key]) {
      this.referenceCounts[id][key] = /* @__PURE__ */ new Map();
    }
    const counts = this.referenceCounts[id][key];
    counts.set(spec.set, (counts.get(spec.set) || 0) + 1);
    this.cache._internal_unstable.lifetimes.resetLifetime(id, key);
    const { fields, list, filters } = selection;
    if (fields && list) {
      this.cache._internal_unstable.lists.add({
        name: list.name,
        connection: list.connection,
        recordID: id,
        recordType: this.cache._internal_unstable.storage.get(id, "__typename")?.value || parentType,
        listType: list.type,
        key,
        selection: fields,
        filters: Object.entries(filters || {}).reduce((acc, [key2, { kind, value }]) => {
          return {
            ...acc,
            [key2]: kind !== "Variable" ? value : variables[value]
          };
        }, {})
      });
    }
  }
  addMany({
    parent,
    selection,
    variables,
    subscribers,
    parentType
  }) {
    for (const fieldSelection of Object.values(selection)) {
      const { type: linkedType, keyRaw, fields } = fieldSelection;
      const key = evaluateKey(keyRaw, variables);
      for (const spec of subscribers) {
        this.addFieldSubscription({
          id: parent,
          key,
          selection: fieldSelection,
          spec,
          parentType,
          variables
        });
      }
      if (fields) {
        const { value: link } = this.cache._internal_unstable.storage.get(parent, key);
        const children = !Array.isArray(link) ? [link] : flattenList(link);
        for (const linkedRecord of children) {
          if (!linkedRecord) {
            continue;
          }
          this.addMany({
            parent: linkedRecord,
            selection: fields,
            variables,
            subscribers,
            parentType: linkedType
          });
        }
      }
    }
  }
  get(id, field) {
    return this.subscribers[id]?.[field] || [];
  }
  remove(id, fields, targets, variables, visited = []) {
    visited.push(id);
    const linkedIDs = [];
    for (const selection of Object.values(fields)) {
      const key = evaluateKey(selection.keyRaw, variables);
      this.removeSubscribers(id, key, targets);
      if (!selection.fields) {
        continue;
      }
      if (selection.list) {
      }
      const { value: previousValue } = this.cache._internal_unstable.storage.get(id, key);
      const links = !Array.isArray(previousValue) ? [previousValue] : flattenList(previousValue);
      for (const link of links) {
        if (link !== null) {
          linkedIDs.push([link, selection.fields]);
        }
      }
    }
    for (const [linkedRecordID, linkFields] of linkedIDs) {
      this.remove(linkedRecordID, linkFields, targets, visited);
    }
  }
  removeSubscribers(id, fieldName, specs) {
    let targets = [];
    for (const spec of specs) {
      if (!this.referenceCounts[id]?.[fieldName]?.has(spec.set)) {
        continue;
      }
      const counts = this.referenceCounts[id][fieldName];
      const newVal = (counts.get(spec.set) || 0) - 1;
      counts.set(spec.set, newVal);
      if (newVal <= 0) {
        targets.push(spec.set);
        counts.delete(spec.set);
      }
    }
    if (this.subscribers[id]) {
      this.subscribers[id][fieldName] = this.get(id, fieldName).filter(
        ({ set }) => !targets.includes(set)
      );
    }
  }
  removeAllSubscribers(id, targets, visited = []) {
    visited.push(id);
    for (const field of Object.keys(this.subscribers[id] || [])) {
      const subscribers = targets || this.subscribers[id][field];
      this.removeSubscribers(id, field, subscribers);
      const { value, kind } = this.cache._internal_unstable.storage.get(id, field);
      if (kind === "scalar") {
        continue;
      }
      const nextTargets = Array.isArray(value) ? flattenList(value) : [value];
      for (const id2 of nextTargets) {
        if (visited.includes(id2)) {
          continue;
        }
        this.removeAllSubscribers(id2, subscribers, visited);
      }
    }
  }
}
export {
  InMemorySubscriptions
};
