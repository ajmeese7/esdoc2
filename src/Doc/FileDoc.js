"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _AbstractDoc2 = require("./AbstractDoc.js");

var _AbstractDoc3 = _interopRequireDefault(_AbstractDoc2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Doc Class from source file.
 */
var FileDoc = function (_AbstractDoc) {
  _inherits(FileDoc, _AbstractDoc);

  function FileDoc() {
    _classCallCheck(this, FileDoc);

    return _possibleConstructorReturn(this, (FileDoc.__proto__ || Object.getPrototypeOf(FileDoc)).apply(this, arguments));
  }

  _createClass(FileDoc, [{
    key: "_apply",

    /**
     * apply own tag.
     * @private
     */
    value: function _apply() {
      _get(FileDoc.prototype.__proto__ || Object.getPrototypeOf(FileDoc.prototype), "_apply", this).call(this);

      Reflect.deleteProperty(this._value, "export");
      Reflect.deleteProperty(this._value, "importPath");
      Reflect.deleteProperty(this._value, "importStyle");
    }

    /** specify ``file`` to kind. */

  }, {
    key: "_$kind",
    value: function _$kind() {
      _get(FileDoc.prototype.__proto__ || Object.getPrototypeOf(FileDoc.prototype), "_$kind", this).call(this);
      this._value.kind = "file";
    }

    /** take out self name from file path */

  }, {
    key: "_$name",
    value: function _$name() {
      _get(FileDoc.prototype.__proto__ || Object.getPrototypeOf(FileDoc.prototype), "_$name", this).call(this);
      this._value.name = this._pathResolver.filePath;
    }

    /** specify name to longname */

  }, {
    key: "_$longname",
    value: function _$longname() {
      this._value.longname = this._pathResolver.fileFullPath;
    }

    /** specify file content to value.content */

  }, {
    key: "_$content",
    value: function _$content() {
      _get(FileDoc.prototype.__proto__ || Object.getPrototypeOf(FileDoc.prototype), "_$content", this).call(this);

      var filePath = this._pathResolver.fileFullPath;
      var content = _fs2.default.readFileSync(filePath, { encode: "utf8" }).toString();
      this._value.content = content;
    }
  }]);

  return FileDoc;
}(_AbstractDoc3.default);

exports.default = FileDoc;