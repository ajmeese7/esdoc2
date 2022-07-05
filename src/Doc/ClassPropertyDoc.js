"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _AbstractDoc2 = require("./AbstractDoc.js");

var _AbstractDoc3 = _interopRequireDefault(_AbstractDoc2);

var _MethodDoc = require("./MethodDoc.js");

var _MethodDoc2 = _interopRequireDefault(_MethodDoc);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Doc Class from ClassProperty AST node.
 */
var ClassPropertyDoc = function (_AbstractDoc) {
  _inherits(ClassPropertyDoc, _AbstractDoc);

  function ClassPropertyDoc() {
    _classCallCheck(this, ClassPropertyDoc);

    return _possibleConstructorReturn(this, (ClassPropertyDoc.__proto__ || Object.getPrototypeOf(ClassPropertyDoc)).apply(this, arguments));
  }

  _createClass(ClassPropertyDoc, [{
    key: "_apply",

    /**
     * apply own tag.
     * @private
     */
    value: function _apply() {
      _get(ClassPropertyDoc.prototype.__proto__ || Object.getPrototypeOf(ClassPropertyDoc.prototype), "_apply", this).call(this);

      Reflect.deleteProperty(this._value, "export");
      Reflect.deleteProperty(this._value, "importPath");
      Reflect.deleteProperty(this._value, "importStyle");
    }

    /** specify ``member`` to kind. */

  }, {
    key: "_$kind",
    value: function _$kind() {
      _get(ClassPropertyDoc.prototype.__proto__ || Object.getPrototypeOf(ClassPropertyDoc.prototype), "_$kind", this).call(this);
      this._value.kind = "member";
    }

    /** take out self name from self node */

  }, {
    key: "_$name",
    value: function _$name() {
      _get(ClassPropertyDoc.prototype.__proto__ || Object.getPrototypeOf(ClassPropertyDoc.prototype), "_$name", this).call(this);
      this._value.name = this._node.key.name;
    }

    /** borrow {@link MethodDoc#@_memberof} */

  }, {
    key: "_$memberof",
    value: function _$memberof() {
      Reflect.apply(_MethodDoc2.default.prototype._$memberof, this, []);
    }
  }]);

  return ClassPropertyDoc;
}(_AbstractDoc3.default);

exports.default = ClassPropertyDoc;