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

var _babelGenerator = require("babel-generator");

var _babelGenerator2 = _interopRequireDefault(_babelGenerator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Doc Class from Member Expression AST node.
 */
var MemberDoc = function (_AbstractDoc) {
  _inherits(MemberDoc, _AbstractDoc);

  function MemberDoc() {
    _classCallCheck(this, MemberDoc);

    return _possibleConstructorReturn(this, (MemberDoc.__proto__ || Object.getPrototypeOf(MemberDoc)).apply(this, arguments));
  }

  _createClass(MemberDoc, [{
    key: "_apply",

    /**
     * apply own tag.
     * @private
     */
    value: function _apply() {
      _get(MemberDoc.prototype.__proto__ || Object.getPrototypeOf(MemberDoc.prototype), "_apply", this).call(this);

      Reflect.deleteProperty(this._value, "export");
      Reflect.deleteProperty(this._value, "importPath");
      Reflect.deleteProperty(this._value, "importStyle");
    }

    /** specify ``member`` to kind. */

  }, {
    key: "_$kind",
    value: function _$kind() {
      _get(MemberDoc.prototype.__proto__ || Object.getPrototypeOf(MemberDoc.prototype), "_$kind", this).call(this);
      this._value.kind = "member";
    }

    /** use static property in class */

  }, {
    key: "_$static",
    value: function _$static() {
      var parent = this._node.parent;
      while (parent) {
        if (parent.type === "ClassMethod") {
          this._value.static = parent.static;
          break;
        }
        parent = parent.parent;
      }
    }

    /** take out self name from self node */

  }, {
    key: "_$name",
    value: function _$name() {
      var name = void 0;
      if (this._node.left.computed) {
        var expression = (0, _babelGenerator2.default)(this._node.left.property).code.replace(/^this/, "");
        name = "[" + expression + "]";
      } else {
        name = this._flattenMemberExpression(this._node.left).replace(/^this\./, "");
      }
      this._value.name = name;
    }

    /** borrow {@link MethodDoc#@_memberof} */

  }, {
    key: "_$memberof",
    value: function _$memberof() {
      Reflect.apply(_MethodDoc2.default.prototype._$memberof, this, []);
    }
  }]);

  return MemberDoc;
}(_AbstractDoc3.default);

exports.default = MemberDoc;