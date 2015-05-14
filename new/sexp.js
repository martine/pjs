// generated by pjs -- do not edit
var symlib = require("./symbol.js");
var sym = symlib.get;

function isAtomChar(char) {
  var re = new RegExp("[a-zA-Z_.\\[\\]0-9&!=|+<>#{}*-]");
  return re.test(char);
}

function isNumber(atom) {
  var re = new RegExp("^\\d+$");
  return re.test(atom);
}

function Reader(str) {
  this.str = str;
  this.ofs = 0;
  this.lineOfs = 0;
  this.line = 1;
}
Reader.prototype.pos = function(out) {
  if (!out) {
    out = {};
  }
  out.line = this.line;
  out.col = this.ofs - this.lineOfs;
  return out;
};
Reader.prototype.readQuote = function() {
  var str = "";
  for (; this.ofs < this.str.length; ++this.ofs) {
    var c = this.str[this.ofs];
    if (c == "\x22") {
      break;
    }
    str += c;
  }
  if (this.str[this.ofs] != "\x22") {
    throw new Error("expected quote, got EOF at " + pos.line + ":" + pos.col);
  }
  ++this.ofs;
  return str;
};
Reader.prototype.read = function() {
  while (this.ofs < this.str.length) {
    var c = this.str[this.ofs];
    ++this.ofs;
    switch (c) {
      case " ":
        continue;
      case "\n":
        ++this.line;
        this.lineOfs = this.ofs + 1;
        continue;
      case ";":
        for (; this.ofs < this.str.length; ++this.ofs) {
          if (this.str[this.ofs] == "\n") {
            break;
          }
        }
        continue;
      case "(":
        var sexp = [];
        this.pos(sexp);
        for (var s;
          (s = this.read()) != null;) {
          sexp.push(s);
        }
        if (this.str[this.ofs] != ")") {
          throw "expected rparen";
        }
        ++this.ofs;
        return sexp;
      case ")":
        --this.ofs;
        return null;
      case "\x22":
        return this.readQuote();
      case "`":
        return [sym("`"), this.read()];
      case ",":
        if (this.str[this.ofs] == "@") {
          ++this.ofs;
          return [sym(",@"), this.read()];
        }
        return [sym(","), this.read()];
      case ":":
        var symbol = this.read();
        return [sym("pjs.sym"), symlib.str(symbol)];
      case "#":
        var quoter = this.read();
        var text = this.read();
        return [sym("#"), quoter, text];
      default:
        if (!isAtomChar(c)) {
          var pos = this.pos();
          throw new Error("bad char " + c + " at " + pos.line + ":" + pos.col);
        }
        var atom = c;
        for (; this.ofs < this.str.length; ++this.ofs) {
          var c = this.str[this.ofs];
          if (!isAtomChar(c)) {
            break;
          }
          atom += c;
        }
        if (isNumber(atom)) {
          return parseInt(atom);
        } else {
          return sym(atom);
        }
    }
    throw "shouldn't be reached";
  }
  return null;
};

function parse(data) {
  var r = new Reader("(" + data.toString() + ")");
  return r.read();
}
exports.parse = parse;
exports.Reader = Reader;
