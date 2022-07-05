"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _AbstractDoc2 = require("./AbstractDoc.js");

var _AbstractDoc3 = _interopRequireDefault(_AbstractDoc2);

var _babelGenerator = require("babel-generator");

var _babelGenerator2 = _interopRequireDefault(_babelGenerator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Doc Class from Method Definition AST node.
 */
var MethodDoc = function (_AbstractDoc) {
  _inherits(MethodDoc, _AbstractDoc);

  function MethodDoc() {
    _classCallCheck(this, MethodDoc);

    return _possibleConstructorReturn(this, (MethodDoc.__proto__ || Object.getPrototypeOf(MethodDoc)).apply(this, arguments));
  }

  _createClass(MethodDoc, [{
    key: "_apply",

    /**
     * apply own tag.
     * @private
     */
    value: function _apply() {
      _get(MethodDoc.prototype.__proto__ || Object.getPrototypeOf(MethodDoc.prototype), "_apply", this).call(this);

      Reflect.deleteProperty(this._value, "export");
      Reflect.deleteProperty(this._value, "importPath");
      Reflect.deleteProperty(this._value, "importStyle");
    }

    /** use kind property of self node. */

  }, {
    key: "_$kind",
    value: function _$kind() {
      _get(MethodDoc.prototype.__proto__ || Object.getPrototypeOf(MethodDoc.prototype), "_$kind", this).call(this);
      this._value.kind = this._node.kind;
    }

    /** take out self name from self node */

  }, {
    key: "_$name",
    value: function _$name() {
      _get(MethodDoc.prototype.__proto__ || Object.getPrototypeOf(MethodDoc.prototype), "_$name", this).call(this);

      if (this._node.computed) {
        var expression = (0, _babelGenerator2.default)(this._node.key).code;
        this._value.name = "[" + expression + "]";
      } else {
        this._value.name = this._node.key.name;
      }
    }

    /** take out memberof from parent class node */

  }, {
    key: "_$memberof",
    value: function _$memberof() {
      _get(MethodDoc.prototype.__proto__ || Object.getPrototypeOf(MethodDoc.prototype), "_$memberof", this).call(this);

      var memberof = void 0;
      var parent = this._node.parent;
      while (parent) {
        if (parent.type === "ClassDeclaration" || parent.type === "ClassExpression") {
          memberof = this._pathResolver.filePath + "~" + parent.doc.value.name;
          this._value.memberof = memberof;
          return;
        }
        parent = parent.parent;
      }
    }

    /** use generator property of self node. */

  }, {
    key: "_$generator",
    value: function _$generator() {
      _get(MethodDoc.prototype.__proto__ || Object.getPrototypeOf(MethodDoc.prototype), "_$generator", this).call(this);

      this._value.generator = this._node.generator;
    }

    /**
     * use async property of self node.
     */

  }, {
    key: "_$async",
    value: function _$async() {
      _get(MethodDoc.prototype.__proto__ || Object.getPrototypeOf(MethodDoc.prototype), "_$async", this).call(this);

      this._value.async = this._node.async;
    }
  }]);

  return MethodDoc;
}(_AbstractDoc3.default);

exports.default = MethodDoc;