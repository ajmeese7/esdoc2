"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _babelGenerator = require("babel-generator");

var _babelGenerator2 = _interopRequireDefault(_babelGenerator);

var _AbstractDoc2 = require("./AbstractDoc.js");

var _AbstractDoc3 = _interopRequireDefault(_AbstractDoc2);

var _NamingUtil = require("../Util/NamingUtil.js");

var _NamingUtil2 = _interopRequireDefault(_NamingUtil);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Doc Class from Function declaration AST node.
 */
var FunctionDoc = function (_AbstractDoc) {
  _inherits(FunctionDoc, _AbstractDoc);

  function FunctionDoc() {
    _classCallCheck(this, FunctionDoc);

    return _possibleConstructorReturn(this, (FunctionDoc.__proto__ || Object.getPrototypeOf(FunctionDoc)).apply(this, arguments));
  }

  _createClass(FunctionDoc, [{
    key: "_$kind",

    /** specify ``function`` to kind. */
    value: function _$kind() {
      _get(FunctionDoc.prototype.__proto__ || Object.getPrototypeOf(FunctionDoc.prototype), "_$kind", this).call(this);
      this._value.kind = "function";
    }

    /** take out self name from self node */

  }, {
    key: "_$name",
    value: function _$name() {
      _get(FunctionDoc.prototype.__proto__ || Object.getPrototypeOf(FunctionDoc.prototype), "_$name", this).call(this);

      if (this._node.id) {
        if (this._node.id.type === "MemberExpression") {
          // e.g. foo[bar.baz] = function bal(){}
          var expression = (0, _babelGenerator2.default)(this._node.id).code;
          this._value.name = "[" + expression + "]";
        } else {
          this._value.name = this._node.id.name;
        }
      } else {
        this._value.name = _NamingUtil2.default.filePathToName(this._pathResolver.filePath);
      }
    }

    /** take out self name from file path */

  }, {
    key: "_$memberof",
    value: function _$memberof() {
      _get(FunctionDoc.prototype.__proto__ || Object.getPrototypeOf(FunctionDoc.prototype), "_$memberof", this).call(this);
      this._value.memberof = this._pathResolver.filePath;
    }

    /** check generator property in self node */

  }, {
    key: "_$generator",
    value: function _$generator() {
      _get(FunctionDoc.prototype.__proto__ || Object.getPrototypeOf(FunctionDoc.prototype), "_$generator", this).call(this);
      this._value.generator = this._node.generator;
    }

    /**
     * use async property of self node.
     */

  }, {
    key: "_$async",
    value: function _$async() {
      _get(FunctionDoc.prototype.__proto__ || Object.getPrototypeOf(FunctionDoc.prototype), "_$async", this).call(this);
      this._value.async = this._node.async;
    }
  }]);

  return FunctionDoc;
}(_AbstractDoc3.default);

exports.default = FunctionDoc;