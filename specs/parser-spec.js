"use strict";

const main = require("../main.js");

describe("parser", () => {
    it("should parse facts composed of atoms", () => {
        let tokens = main.lex("a(a,a).");
        let ast = main.parse(tokens);
        expect(ast).toEqual(
            [{type: "predicate", name: "a", args: ["a", "a"], isRule: false}]);
    });
});
