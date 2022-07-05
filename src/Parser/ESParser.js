"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fsExtra = require("fs-extra");

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _Plugin = require("../Plugin/Plugin.js");

var _Plugin2 = _interopRequireDefault(_Plugin);

var _babylon = require("babylon");

var babylon = _interopRequireWildcard(_babylon);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * ECMAScript Parser class.
 *
 * @example
 * let ast = ESParser.parse('./src/foo.js');
 */
var ESParser = function () {
  function ESParser() {
    _classCallCheck(this, ESParser);
  }

  _createClass(ESParser, null, [{
    key: "parse",

    /**
     * parse ECMAScript source code.
     * @param {string} filePath - source code file path.
     * @returns {AST} AST of source code.
     */
    value: function parse(filePath) {
      var code = _fsExtra2.default.readFileSync(filePath, { encode: "utf8" }).toString();
      code = _Plugin2.default.onHandleCode(code, filePath);
      if (code.charAt(0) === "#") code = code.replace(/^#!/, "//");

      var parserOption = { sourceType: "module", plugins: [] };
      var parser = function parser(code) {
        return babylon.parse(code, parserOption);
      };

      var _Plugin$onHandleCodeP = _Plugin2.default.onHandleCodeParser(parser, parserOption, filePath, code);

      parser = _Plugin$onHandleCodeP.parser;
      parserOption = _Plugin$onHandleCodeP.parserOption;


      var ast = parser(code);

      ast = _Plugin2.default.onHandleAST(ast, filePath, code);

      return ast;
    }
  }]);

  return ESParser;
}();

exports.default = ESParser;