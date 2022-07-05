"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _assert = require("assert");

var _assert2 = _interopRequireDefault(_assert);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Param Type Parser class.
 */
var ParamParser = function () {
  function ParamParser() {
    _classCallCheck(this, ParamParser);
  }

  _createClass(ParamParser, null, [{
    key: "parseParamValue",

    /**
     * parse param value.
     * @param {string} value - param value.
     * @param {boolean} [type=true] if true, contain param type.
     * @param {boolean} [name=true] if true, contain param name.
     * @param {boolean} [desc=true] if true, contain param description.
     * @return {{typeText: string, paramName: string, paramDesc: string}} parsed value.
     *
     * @example
     * let value = '{number} param - this is number param';
     * let {typeText, paramName, paramDesc} = ParamParser.parseParamValue(value);
     *
     * let value = '{number} this is number return value';
     * let {typeText, paramDesc} = ParamParser.parseParamValue(value, true, false, true);
     *
     * let value = '{number}';
     * let {typeText} = ParamParser.parseParamValue(value, true, false, false);
     */
    value: function parseParamValue(value) {
      var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      var name = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      var desc = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

      value = value.trim();

      var match = void 0;
      var typeText = null;
      var paramName = null;
      var paramDesc = null;

      // e.g {number}
      if (type) {
        var reg = /^\{([^@]*?)\}(\s+|$)/; // ``@`` is special char in ``{@link foo}``
        match = value.match(reg);
        if (match) {
          typeText = match[1];
          value = value.replace(reg, "");
        } else {
          typeText = "*";
        }
      }

      // e.g. [p1=123]
      if (name) {
        if (value.charAt(0) === "[") {
          paramName = "";
          var counter = 0;
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = value[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var c = _step.value;

              paramName += c;
              if (c === "[") counter++;
              if (c === "]") counter--;
              if (counter === 0) break;
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }

          if (paramName) {
            value = value.substr(paramName.length).trim();
          }
        } else {
          match = value.match(/^(\S+)/);
          if (match) {
            paramName = match[1];
            value = value.replace(/^\S+\s*/, "");
          }
        }
      }

      // e.g. this is p1 desc.
      if (desc) {
        match = value.match(/^\-?\s*((:?.|\n)*)$/m);
        if (match) {
          paramDesc = match[1];
        }
      }

      (0, _assert2.default)(typeText || paramName || paramDesc, "param is invalid. param = \"" + value + "\"");

      return { typeText: typeText, paramName: paramName, paramDesc: paramDesc };
    }

    /**
     * parse param text and build formatted result.
     * @param {string} typeText - param type text.
     * @param {string} [paramName] - param name.
     * @param {string} [paramDesc] - param description.
     * @returns {ParsedParam} formatted result.
     *
     * @example
     * let value = '{number} param - this is number param';
     * let {typeText, paramName, paramDesc} = ParamParser.parseParamValue(value);
     * let result = ParamParser.parseParam(typeText, paramName, paramDesc);
     */

  }, {
    key: "parseParam",
    value: function parseParam() {
      var typeText = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var paramName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var paramDesc = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      var result = {};

      if (typeText) {
        // check nullable
        if (typeText[0] === "?") {
          result.nullable = true;
        } else if (typeText[0] === "!") {
          result.nullable = false;
        } else {
          result.nullable = null;
        }
        typeText = typeText.replace(/^[?!]/, "");

        // check record and union
        if (typeText[0] === "{") {
          result.types = [typeText];
        } else if (typeText[0] === "(") {
          typeText = typeText.replace(/^[(]/, "").replace(/[)]$/, "");
          result.types = typeText.split("|");
        } else if (typeText.includes("|")) {
          if (typeText.match(/<.*?\|.*?>/)) {
            // union in generics. e.g. `Array<string|number>`
            // hack: in this case, process this type in DocBuilder#_buildTypeDocLinkHTML
            result.types = [typeText];
          } else if (typeText.match(/^\.\.\.\(.*?\)/)) {
            // union with spread. e.g. `...(string|number)`
            // hack: in this case, process this type in DocBuilder#_buildTypeDocLinkHTML
            result.types = [typeText];
          } else {
            result.types = typeText.split("|");
          }
        } else {
          result.types = [typeText];
        }

        if (typeText.indexOf("...") === 0) {
          result.spread = true;
        } else {
          result.spread = false;
        }
      } else {
        result.types = [""];
      }

      if (result.types.some(function (t) {
        return !t;
      })) {
        throw new Error("Empty Type found name=" + paramName + " desc=" + paramDesc);
      }

      if (paramName) {
        // check optional
        if (paramName[0] === "[") {
          result.optional = true;
          paramName = paramName.replace(/^[\[]/, "").replace(/[\]]$/, "");
        } else {
          result.optional = false;
        }

        // check default value
        var pair = paramName.split("=");
        if (pair.length === 2) {
          result.defaultValue = pair[1];
          try {
            var raw = JSON.parse(pair[1]);
            result.defaultRaw = raw;
          } catch (e) {
            result.defaultRaw = pair[1];
          }
        }

        result.name = pair[0].trim();
      }

      result.description = paramDesc;

      return result;
    }
  }]);

  return ParamParser;
}();

exports.default = ParamParser;