"use strict";

function lex(s) {
    let out = [];
    for (let c of s) {
        if (c === " " || c === "\t" || c === "\n") {
            continue;
        } else if (c === "(") {
            out.push(new Token("lparen"));
        } else if (c === ")") {
            out.push(new Token("rparen"));
        } else if (c === ".") {
            out.push(new Token("period"));
        } else if (c === ",") {
            out.push(new Token("comma"));
        } else if (c === c.toLowerCase()) {
            out.push(new Token("atom", c));
        } else if (c === c.toUpperCase()) {
            out.push(new Token("variable", c));
        } else {
            throw new Error("Unexpected character encountered.");
        }
    }
    return out;
}

class Token {
    constructor(type, value) {
        this._type = type;
        this._value = value || "";
    }

    get type() {
        return this._type;
    }

    get value() {
        return this._value;
    }

    toString() {
        return `${this._type}(${this._value})`;
    }
}


// CFG:
// Root -> Predicate Root | e
// Predicate -> atom ( VarList ) RuleBody period | predicate ( ValueList ) period
// VarList -> variable comma VarList | variable
// ValueList -> Value comma ValueList | Value
// RuleBody -> period

function parse(tokens) {
    let ctx = new ParsingContext(tokens);
    let ast = parseRoot(ctx);
    return ast;
}

function parseRoot(ctx) {
    let predicates = [];
    while (ctx.hasNext) {
        predicates.push(parsePredicate(ctx));
    }
    return predicates;
}

function parsePredicate(ctx) {
    let name = ctx.match('atom');
    ctx.match('lparen');
    let isRule = false;
    let args;
    if (ctx.lookahead('variable')) {
        isRule = true;
        args = parseVarList(ctx);
    } else {
        args = parseValueList(ctx);
    }
    ctx.match('rparen');
    if (isRule) {
        // TODO
    }
    ctx.match('period');
    return {
        type: 'predicate',
        name: name,
        isRule: isRule,
        args: args
    }
}

function parseVarList(ctx) {
    let vars = [ctx.match('variable')];
    while (!ctx.lookahead('rparen')) {
        ctx.match('comma');
        vars.push(ctx.match('variable'));
    }
    return vars;
}

function parseValueList(ctx) {
    let values = [ctx.match('atom')];
    while (!ctx.lookahead('rparen')) {
        ctx.match('comma');
        values.push(ctx.match('atom'));
    }
    return values;
}

class ParsingContext {
    constructor(tokens) {
        this._tokens = tokens;
        this._i = 0;
    }

    lookahead(expected) {
        return this._i < this._tokens.length &&
            this._tokens[this._i].type === expected;
    }

    match(expected) {
        if (this._i >= this._tokens.length) {
            throw new Error("No more tokens.");
        }
        let token = this._tokens[this._i];
        if (token.type !== expected) {
            throw new Error(`Expected "${expected}", found "${token.type}".`);
        }
        this._i += 1;
        return token.value;
    }

    get hasNext() {
        return this._i < this._tokens.length;
    }
}

exports.lex = lex;
exports.Token = Token;
exports.parse = parse;
