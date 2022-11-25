"use strict";
var import_vitest = require("vitest");
var import_stuff = require("../stuff");
(0, import_vitest.describe)("key evaluation", function() {
  const table = [
    {
      title: "string",
      key: "fieldName",
      expected: "fieldName"
    },
    {
      title: "variable",
      key: "fieldName(foo: $bar)",
      variables: { bar: "baz" },
      expected: 'fieldName(foo: "baz")'
    },
    {
      title: "$ in string",
      key: 'fieldName(foo: "$bar")',
      variables: { bar: "baz" },
      expected: 'fieldName(foo: "$bar")'
    },
    {
      title: "undefined variable",
      key: "fieldName(foo: $bar)",
      expected: "fieldName(foo: undefined)"
    }
  ];
  for (const row of table) {
    (0, import_vitest.test)(row.title, function() {
      (0, import_vitest.expect)((0, import_stuff.evaluateKey)(row.key, row.variables)).toEqual(row.expected);
    });
  }
});
