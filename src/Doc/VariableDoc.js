"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _AbstractDoc2 = require("./AbstractDoc.js");

var _AbstractDoc3 = _interopRequireDefault(_AbstractDoc2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Doc Class from Variable Declaration AST node.
 */
var VariableDoc = function (_AbstractDoc) {
  _inherits(VariableDoc, _AbstractDoc);

  function VariableDoc() {
    _classCallCheck(this, VariableDoc);

    return _possibleConstructorReturn(this, (VariableDoc.__proto__ || Object.getPrototypeOf(VariableDoc)).apply(this, arguments));
  }

  _createClass(VariableDoc, [{
    key: "_$kind",

    /** specify ``variable`` to kind. */
    value: function _$kind() {
      _get(VariableDoc.prototype.__proto__ || Object.getPrototypeOf(VariableDoc.prototype), "_$kind", this).call(this);
      this._value.kind = "variable";
    }

    /** set name by using self node. */

  }, {
    key: "_$name",
    value: function _$name() {
      _get(VariableDoc.prototype.__proto__ || Object.getPrototypeOf(VariableDoc.prototype), "_$name", this).call(this);

      var type = this._node.declarations[0].id.type;
      switch (type) {
        case "Identifier":
          this._value.name = this._node.declarations[0].id.name;
          break;
        case "ObjectPattern":
          // TODO: optimize for multi variables.
          // e.g. export const {a, b} = obj
          this._value.name = this._node.declarations[0].id.properties[0].key.name;
          break;
        case "ArrayPattern":
          // TODO: optimize for multi variables.
          // e.g. export cont [a, b] = arr
          this._value.name = this._node.declarations[0].id.elements.find(function (v) {
            return v;
          }).name;
          break;
        default:
          throw new Error("unknown declarations type: " + type);
      }
    }

    /** set memberof by using file path. */

  }, {
    key: "_$memberof",
    value: function _$memberof() {
      _get(VariableDoc.prototype.__proto__ || Object.getPrototypeOf(VariableDoc.prototype), "_$memberof", this).call(this);
      this._value.memberof = this._pathResolver.filePath;
    }
  }]);

  return VariableDoc;
}(_AbstractDoc3.default);

exports.default = VariableDoc;