"use strict";

const main = require("../main.js");

describe("lexer", () => {
    it("should know capitals are variables", () => {
        let r = main.lex("A");
        expect(r).toEqual([new main.Token("variable", "A")]);
    });

    it("should know lowercase letters are atoms", () => {
        let r = main.lex("a");
        expect(r).toEqual([new main.Token("atom", "a")]);
    });

    it("should identify left and right parentheses", () => {
        let r = main.lex("()");
        expect(r).toEqual([
            new main.Token("lparen"),
            new main.Token("rparen")
        ]);
    });

    it("should identify commas", () => {
        let r = main.lex(",");
        expect(r).toEqual([new main.Token("comma")]);
    });

    it("should identify periods", () => {
        let r = main.lex(".");
        expect(r).toEqual([new main.Token("period")]);
    });

    it("should handle combinations of the different tokens", () => {
        let r = main.lex("a(B,C).");
        expect(r).toEqual([
            new main.Token("atom", "a"),
            new main.Token("lparen"),
            new main.Token("variable", "B"),
            new main.Token("comma"),
            new main.Token("variable", "C"),
            new main.Token("rparen"),
            new main.Token("period")
        ]);
    });

    it("should ignore whitespace", () => {
        let r = main.lex("\n\t  A \t\n   B");
        expect(r).toEqual([
            new main.Token("variable", "A"),
            new main.Token("variable", "B")
        ]);
    });
});
