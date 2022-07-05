"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _ParamParser = require("../Parser/ParamParser.js");

var _ParamParser2 = _interopRequireDefault(_ParamParser);

var _ASTUtil = require("../Util/ASTUtil.js");

var _ASTUtil2 = _interopRequireDefault(_ASTUtil);

var _InvalidCodeLogger = require("../Util/InvalidCodeLogger.js");

var _InvalidCodeLogger2 = _interopRequireDefault(_InvalidCodeLogger);

var _ASTNodeContainer = require("../Util/ASTNodeContainer.js");

var _ASTNodeContainer2 = _interopRequireDefault(_ASTNodeContainer);

var _babelGenerator = require("babel-generator");

var _babelGenerator2 = _interopRequireDefault(_babelGenerator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Abstract Doc Class.
 * @todo rename this class name.
 */
var AbstractDoc = function () {
  /**
   * create instance.
   * @param {AST} ast - this is AST that contains this doc.
   * @param {ASTNode} node - this is self node.
   * @param {PathResolver} pathResolver - this is file path resolver that contains this doc.
   * @param {Tag[]} commentTags - this is tags that self node has.
   */
  function AbstractDoc(ast, node, pathResolver) {
    var commentTags = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];

    _classCallCheck(this, AbstractDoc);

    this._ast = ast;
    this._node = node;
    this._pathResolver = pathResolver;
    this._commentTags = commentTags;
    this._value = {};

    Reflect.defineProperty(this._node, "doc", { value: this });

    this._value.__docId__ = _ASTNodeContainer2.default.addNode(node);

    this._apply();
  }

  /** @type {DocObject[]} */


  _createClass(AbstractDoc, [{
    key: "_apply",


    /**
     * apply doc comment.
     * @protected
     */
    value: function _apply() {
      this._$kind();
      this._$variation();
      this._$name();
      this._$memberof();
      this._$member();
      this._$content();
      this._$generator();
      this._$async();

      this._$static();
      this._$longname();
      this._$access();
      this._$export();
      this._$importPath();
      this._$importStyle();
      this._$desc();
      this._$example();
      this._$see();
      this._$lineNumber();
      this._$deprecated();
      this._$experimental();
      this._$since();
      this._$version();
      this._$todo();
      this._$ignore();
      this._$pseudoExport();
      this._$undocument();
      this._$unknown();
      this._$param();
      this._$property();
      this._$return();
      this._$type();
      this._$abstract();
      this._$override();
      this._$throws();
      this._$emits();
      this._$listens();
      this._$decorator();
    }

    /**
     * decide `kind`.
     * @abstract
     */

  }, {
    key: "_$kind",
    value: function _$kind() {}

    /** for @_variation */
    /**
     * decide `variation`.
     * @todo implements `@variation`.
     * @abstract
     */

  }, {
    key: "_$variation",
    value: function _$variation() {}

    /**
     * decide `name`
     * @abstract
     */

  }, {
    key: "_$name",
    value: function _$name() {}

    /**
     * decide `memberof`.
     * @abstract
     */

  }, {
    key: "_$memberof",
    value: function _$memberof() {}

    /**
     * decide `member`.
     * @abstract
     */

  }, {
    key: "_$member",
    value: function _$member() {}

    /**
     * decide `content`.
     * @abstract
     */

  }, {
    key: "_$content",
    value: function _$content() {}

    /**
     * decide `generator`.
     * @abstract
     */

  }, {
    key: "_$generator",
    value: function _$generator() {}

    /**
     * decide `async`.
     * @abstract
     */

  }, {
    key: "_$async",
    value: function _$async() {}

    /**
     * decide `static`.
     */

  }, {
    key: "_$static",
    value: function _$static() {
      if ("static" in this._node) {
        this._value.static = this._node.static;
      } else {
        this._value.static = true;
      }
    }

    /**
     * decide `longname`.
     */

  }, {
    key: "_$longname",
    value: function _$longname() {
      var memberof = this._value.memberof;
      var name = this._value.name;
      var scope = this._value.static ? "." : "#";
      if (memberof.includes("~")) {
        this._value.longname = "" + memberof + scope + name;
      } else {
        this._value.longname = memberof + "~" + name;
      }
    }

    /**
     * decide `access`.
     * process also @public, @private and @protected.
     */

  }, {
    key: "_$access",
    value: function _$access() {
      var tag = this._find(["@access", "@public", "@private", "@protected"]);
      if (tag) {
        var access = void 0;
        /* eslint-disable max-statements-per-line */
        switch (tag.tagName) {
          case "@access":
            access = tag.tagValue;break;
          case "@public":
            access = "public";break;
          case "@protected":
            access = "protected";break;
          case "@private":
            access = "private";break;
          default:
            throw new Error("unexpected token: " + tag.tagName);
        }

        this._value.access = access;
      } else {
        this._value.access = null;
      }
    }

    /**
     * avoid unknown tag.
     */

  }, {
    key: "_$public",
    value: function _$public() {}

    /**
     * avoid unknown tag.
     */

  }, {
    key: "_$protected",
    value: function _$protected() {}

    /**
     * avoid unknown tag.
     */

  }, {
    key: "_$private",
    value: function _$private() {}

    /**
     * decide `export`.
     */

  }, {
    key: "_$export",
    value: function _$export() {
      var parent = this._node.parent;
      while (parent) {
        if (parent.type === "ExportDefaultDeclaration") {
          this._value.export = true;
          return;
        } else if (parent.type === "ExportNamedDeclaration") {
          this._value.export = true;
          return;
        }

        parent = parent.parent;
      }

      this._value.export = false;
    }

    /**
     * decide `importPath`.
     */

  }, {
    key: "_$importPath",
    value: function _$importPath() {
      this._value.importPath = this._pathResolver.importPath;
    }

    /**
     * decide `importStyle`.
     */

  }, {
    key: "_$importStyle",
    value: function _$importStyle() {
      if (this._node.__PseudoExport__) {
        this._value.importStyle = null;
        return;
      }

      var parent = this._node.parent;
      var name = this._value.name;
      while (parent) {
        if (parent.type === "ExportDefaultDeclaration") {
          this._value.importStyle = name;
          return;
        } else if (parent.type === "ExportNamedDeclaration") {
          this._value.importStyle = "{" + name + "}";
          return;
        }
        parent = parent.parent;
      }

      this._value.importStyle = null;
    }

    /**
     * decide `description`.
     */

  }, {
    key: "_$desc",
    value: function _$desc() {
      this._value.description = this._findTagValue(["@desc"]);
    }

    /**
     * decide `examples`.
     */

  }, {
    key: "_$example",
    value: function _$example() {
      var tags = this._findAll(["@example"]);
      if (!tags) return;
      if (!tags.length) return;

      this._value.examples = [];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = tags[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var tag = _step.value;

          this._value.examples.push(tag.tagValue);
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
    }

    /**
     * decide `see`.
     */

  }, {
    key: "_$see",
    value: function _$see() {
      var tags = this._findAll(["@see"]);
      if (!tags) return;
      if (!tags.length) return;

      this._value.see = [];
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = tags[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var tag = _step2.value;

          this._value.see.push(tag.tagValue);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }

    /**
     * decide `lineNumber`.
     */

  }, {
    key: "_$lineNumber",
    value: function _$lineNumber() {
      var tag = this._find(["@lineNumber"]);
      if (tag) {
        this._value.lineNumber = parseInt(tag.tagValue, 10);
      } else {
        var node = this._node;
        if (node.loc) {
          this._value.lineNumber = node.loc.start.line;
        }
      }
    }

    /**
     * decide `deprecated`.
     */

  }, {
    key: "_$deprecated",
    value: function _$deprecated() {
      var tag = this._find(["@deprecated"]);
      if (tag) {
        if (tag.tagValue) {
          this._value.deprecated = tag.tagValue;
        } else {
          this._value.deprecated = true;
        }
      }
    }

    /**
     * decide `experimental`.
     */

  }, {
    key: "_$experimental",
    value: function _$experimental() {
      var tag = this._find(["@experimental"]);
      if (tag) {
        if (tag.tagValue) {
          this._value.experimental = tag.tagValue;
        } else {
          this._value.experimental = true;
        }
      }
    }

    /**
     * decide `since`.
     */

  }, {
    key: "_$since",
    value: function _$since() {
      var tag = this._find(["@since"]);
      if (tag) {
        this._value.since = tag.tagValue;
      }
    }

    /**
     * decide `version`.
     */

  }, {
    key: "_$version",
    value: function _$version() {
      var tag = this._find(["@version"]);
      if (tag) {
        this._value.version = tag.tagValue;
      }
    }

    /**
     * decide `todo`.
     */

  }, {
    key: "_$todo",
    value: function _$todo() {
      var tags = this._findAll(["@todo"]);
      if (tags) {
        this._value.todo = [];
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = tags[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var tag = _step3.value;

            this._value.todo.push(tag.tagValue);
          }
        } catch (err) {
          _didIteratorError3 = true;
          _iteratorError3 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion3 && _iterator3.return) {
              _iterator3.return();
            }
          } finally {
            if (_didIteratorError3) {
              throw _iteratorError3;
            }
          }
        }
      }
    }

    /**
     * decide `ignore`.
     */

  }, {
    key: "_$ignore",
    value: function _$ignore() {
      var tag = this._find(["@ignore"]);
      if (tag) {
        this._value.ignore = true;
      }
    }

    /**
     * decide `pseudoExport`.
     */

  }, {
    key: "_$pseudoExport",
    value: function _$pseudoExport() {
      if (this._node.__PseudoExport__) {
        this._value.pseudoExport = true;
      }
    }

    /**
     * decide `undocument` with internal tag.
     */

  }, {
    key: "_$undocument",
    value: function _$undocument() {
      var tag = this._find(["@undocument"]);
      if (tag) {
        this._value.undocument = true;
      }
    }

    /**
     * decide `unknown`.
     */

  }, {
    key: "_$unknown",
    value: function _$unknown() {
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = this._commentTags[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var tag = _step4.value;

          var methodName = tag.tagName.replace(/^[@]/, "_$");
          if (this[methodName]) continue;

          if (!this._value.unknown) this._value.unknown = [];
          this._value.unknown.push(tag);
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4.return) {
            _iterator4.return();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }
    }

    /**
     * decide `param`.
     */

  }, {
    key: "_$param",
    value: function _$param() {
      var values = this._findAllTagValues(["@param"]);
      if (!values) return;

      this._value.params = [];
      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = values[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          var value = _step5.value;

          var _ParamParser$parsePar = _ParamParser2.default.parseParamValue(value),
              typeText = _ParamParser$parsePar.typeText,
              paramName = _ParamParser$parsePar.paramName,
              paramDesc = _ParamParser$parsePar.paramDesc;

          if (!typeText || !paramName) {
            _InvalidCodeLogger2.default.show(this._pathResolver.fileFullPath, this._node);
            continue;
          }
          var result = _ParamParser2.default.parseParam(typeText, paramName, paramDesc);
          this._value.params.push(result);
        }
      } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion5 && _iterator5.return) {
            _iterator5.return();
          }
        } finally {
          if (_didIteratorError5) {
            throw _iteratorError5;
          }
        }
      }
    }

    /**
     * decide `return`.
     */

  }, {
    key: "_$return",
    value: function _$return() {
      var value = this._findTagValue(["@return", "@returns"]);
      if (!value) return;

      var _ParamParser$parsePar2 = _ParamParser2.default.parseParamValue(value, true, false, true),
          typeText = _ParamParser$parsePar2.typeText,
          paramName = _ParamParser$parsePar2.paramName,
          paramDesc = _ParamParser$parsePar2.paramDesc;

      var result = _ParamParser2.default.parseParam(typeText, paramName, paramDesc);
      this._value.return = result;
    }

    /**
     * decide `property`.
     */

  }, {
    key: "_$property",
    value: function _$property() {
      var values = this._findAllTagValues(["@property"]);
      if (!values) return;

      this._value.properties = [];
      var _iteratorNormalCompletion6 = true;
      var _didIteratorError6 = false;
      var _iteratorError6 = undefined;

      try {
        for (var _iterator6 = values[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
          var value = _step6.value;

          var _ParamParser$parsePar3 = _ParamParser2.default.parseParamValue(value),
              typeText = _ParamParser$parsePar3.typeText,
              paramName = _ParamParser$parsePar3.paramName,
              paramDesc = _ParamParser$parsePar3.paramDesc;

          var result = _ParamParser2.default.parseParam(typeText, paramName, paramDesc);
          this._value.properties.push(result);
        }
      } catch (err) {
        _didIteratorError6 = true;
        _iteratorError6 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion6 && _iterator6.return) {
            _iterator6.return();
          }
        } finally {
          if (_didIteratorError6) {
            throw _iteratorError6;
          }
        }
      }
    }

    /**
     * decide `type`.
     */

  }, {
    key: "_$type",
    value: function _$type() {
      var value = this._findTagValue(["@type"]);
      if (!value) return;

      var _ParamParser$parsePar4 = _ParamParser2.default.parseParamValue(value, true, false, false),
          typeText = _ParamParser$parsePar4.typeText,
          paramName = _ParamParser$parsePar4.paramName,
          paramDesc = _ParamParser$parsePar4.paramDesc;

      var result = _ParamParser2.default.parseParam(typeText, paramName, paramDesc);
      this._value.type = result;
    }

    /**
     * decide `abstract`.
     */

  }, {
    key: "_$abstract",
    value: function _$abstract() {
      var tag = this._find(["@abstract"]);
      if (tag) {
        this._value.abstract = true;
      }
    }

    /**
     * decide `override`.
     */

  }, {
    key: "_$override",
    value: function _$override() {
      var tag = this._find(["@override"]);
      if (tag) {
        this._value.override = true;
      }
    }

    /**
     * decide `throws`.
     */

  }, {
    key: "_$throws",
    value: function _$throws() {
      var values = this._findAllTagValues(["@throws"]);
      if (!values) return;

      this._value.throws = [];
      var _iteratorNormalCompletion7 = true;
      var _didIteratorError7 = false;
      var _iteratorError7 = undefined;

      try {
        for (var _iterator7 = values[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
          var value = _step7.value;

          var _ParamParser$parsePar5 = _ParamParser2.default.parseParamValue(value, true, false, true),
              typeText = _ParamParser$parsePar5.typeText,
              paramName = _ParamParser$parsePar5.paramName,
              paramDesc = _ParamParser$parsePar5.paramDesc;

          var result = _ParamParser2.default.parseParam(typeText, paramName, paramDesc);
          this._value.throws.push({
            types: result.types,
            description: result.description
          });
        }
      } catch (err) {
        _didIteratorError7 = true;
        _iteratorError7 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion7 && _iterator7.return) {
            _iterator7.return();
          }
        } finally {
          if (_didIteratorError7) {
            throw _iteratorError7;
          }
        }
      }
    }

    /**
     * decide `emits`.
     */

  }, {
    key: "_$emits",
    value: function _$emits() {
      var values = this._findAllTagValues(["@emits"]);
      if (!values) return;

      this._value.emits = [];
      var _iteratorNormalCompletion8 = true;
      var _didIteratorError8 = false;
      var _iteratorError8 = undefined;

      try {
        for (var _iterator8 = values[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
          var value = _step8.value;

          var _ParamParser$parsePar6 = _ParamParser2.default.parseParamValue(value, true, false, true),
              typeText = _ParamParser$parsePar6.typeText,
              paramName = _ParamParser$parsePar6.paramName,
              paramDesc = _ParamParser$parsePar6.paramDesc;

          var result = _ParamParser2.default.parseParam(typeText, paramName, paramDesc);
          this._value.emits.push({
            types: result.types,
            description: result.description
          });
        }
      } catch (err) {
        _didIteratorError8 = true;
        _iteratorError8 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion8 && _iterator8.return) {
            _iterator8.return();
          }
        } finally {
          if (_didIteratorError8) {
            throw _iteratorError8;
          }
        }
      }
    }

    /**
     * decide `listens`.
     */

  }, {
    key: "_$listens",
    value: function _$listens() {
      var values = this._findAllTagValues(["@listens"]);
      if (!values) return;

      this._value.listens = [];
      var _iteratorNormalCompletion9 = true;
      var _didIteratorError9 = false;
      var _iteratorError9 = undefined;

      try {
        for (var _iterator9 = values[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
          var value = _step9.value;

          var _ParamParser$parsePar7 = _ParamParser2.default.parseParamValue(value, true, false, true),
              typeText = _ParamParser$parsePar7.typeText,
              paramName = _ParamParser$parsePar7.paramName,
              paramDesc = _ParamParser$parsePar7.paramDesc;

          var result = _ParamParser2.default.parseParam(typeText, paramName, paramDesc);
          this._value.listens.push({
            types: result.types,
            description: result.description
          });
        }
      } catch (err) {
        _didIteratorError9 = true;
        _iteratorError9 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion9 && _iterator9.return) {
            _iterator9.return();
          }
        } finally {
          if (_didIteratorError9) {
            throw _iteratorError9;
          }
        }
      }
    }

    /**
     * decide `decorator`.
     */

  }, {
    key: "_$decorator",
    value: function _$decorator() {
      if (!this._node.decorators) return;

      this._value.decorators = [];
      var _iteratorNormalCompletion10 = true;
      var _didIteratorError10 = false;
      var _iteratorError10 = undefined;

      try {
        for (var _iterator10 = this._node.decorators[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
          var decorator = _step10.value;

          var value = {};
          switch (decorator.expression.type) {
            case "Identifier":
              value.name = decorator.expression.name;
              value.arguments = null;
              break;
            case "CallExpression":
              value.name = (0, _babelGenerator2.default)(decorator.expression).code.replace(/[(].*/, "");
              value.arguments = (0, _babelGenerator2.default)(decorator.expression).code.replace(/^[^(]+/, "");
              break;
            case "MemberExpression":
              value.name = (0, _babelGenerator2.default)(decorator.expression).code.replace(/[(].*/, "");
              value.arguments = null;
              break;
            default:
              throw new Error("unknown decorator expression type: " + decorator.expression.type);
          }
          this._value.decorators.push(value);
        }
      } catch (err) {
        _didIteratorError10 = true;
        _iteratorError10 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion10 && _iterator10.return) {
            _iterator10.return();
          }
        } finally {
          if (_didIteratorError10) {
            throw _iteratorError10;
          }
        }
      }
    }

    /**
     * find all tags.
     * @param {string[]} names - tag names.
     * @returns {Tag[]|null} found tags.
     * @private
     */

  }, {
    key: "_findAll",
    value: function _findAll(names) {
      var results = [];
      var _iteratorNormalCompletion11 = true;
      var _didIteratorError11 = false;
      var _iteratorError11 = undefined;

      try {
        for (var _iterator11 = this._commentTags[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
          var tag = _step11.value;

          if (names.includes(tag.tagName)) results.push(tag);
        }
      } catch (err) {
        _didIteratorError11 = true;
        _iteratorError11 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion11 && _iterator11.return) {
            _iterator11.return();
          }
        } finally {
          if (_didIteratorError11) {
            throw _iteratorError11;
          }
        }
      }

      if (results.length) {
        return results;
      } else {
        return null;
      }
    }

    /**
     * find last tag.
     * @param {string[]} names - tag names.
     * @returns {Tag|null} found tag.
     * @protected
     */

  }, {
    key: "_find",
    value: function _find(names) {
      var results = this._findAll(names);
      if (results && results.length) {
        return results[results.length - 1];
      } else {
        return null;
      }
    }

    /**
     * find all tag values.
     * @param {string[]} names - tag names.
     * @returns {*[]|null} found values.
     * @private
     */

  }, {
    key: "_findAllTagValues",
    value: function _findAllTagValues(names) {
      var tags = this._findAll(names);
      if (!tags) return null;

      var results = [];
      var _iteratorNormalCompletion12 = true;
      var _didIteratorError12 = false;
      var _iteratorError12 = undefined;

      try {
        for (var _iterator12 = tags[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
          var tag = _step12.value;

          results.push(tag.tagValue);
        }
      } catch (err) {
        _didIteratorError12 = true;
        _iteratorError12 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion12 && _iterator12.return) {
            _iterator12.return();
          }
        } finally {
          if (_didIteratorError12) {
            throw _iteratorError12;
          }
        }
      }

      return results;
    }

    /**
     * find ta value.
     * @param {string[]} names - tag names.
     * @returns {*|null} found value.
     * @private
     */

  }, {
    key: "_findTagValue",
    value: function _findTagValue(names) {
      var tag = this._find(names);
      if (tag) {
        return tag.tagValue;
      } else {
        return null;
      }
    }

    /**
     * resolve long name.
     * if the name relates import path, consider import path.
     * @param {string} name - identifier name.
     * @returns {string} resolved name.
     * @private
     */

  }, {
    key: "_resolveLongname",
    value: function _resolveLongname(name) {
      var importPath = _ASTUtil2.default.findPathInImportDeclaration(this._ast, name);
      if (!importPath) return name;

      if (importPath.charAt(0) === "." || importPath.charAt(0) === "/") {
        if (!_path2.default.extname(importPath)) importPath += ".js";

        var resolvedPath = this._pathResolver.resolve(importPath);
        var longname = resolvedPath + "~" + name;
        return longname;
      } else {
        var _longname = importPath + "~" + name;
        return _longname;
      }
    }

    /**
     * flatten member expression property name.
     * if node structure is [foo [bar [baz [this] ] ] ], flatten is ``this.baz.bar.foo``
     * @param {ASTNode} node - target member expression node.
     * @returns {string} flatten property.
     * @private
     */

  }, {
    key: "_flattenMemberExpression",
    value: function _flattenMemberExpression(node) {
      var results = [];
      var target = node;

      while (target) {
        if (target.type === "ThisExpression") {
          results.push("this");
          break;
        } else if (target.type === "Identifier") {
          results.push(target.name);
          break;
        } else if (target.type === "CallExpression") {
          results.push(target.callee.name);
          break;
        } else {
          results.push(target.property.name);
          target = target.object;
        }
      }

      return results.reverse().join(".");
    }

    /**
     * find class in same file, import or external.
     * @param {string} className - target class name.
     * @returns {string} found class long name.
     * @private
     */

  }, {
    key: "_findClassLongname",
    value: function _findClassLongname(className) {
      // find in same file.
      var _iteratorNormalCompletion13 = true;
      var _didIteratorError13 = false;
      var _iteratorError13 = undefined;

      try {
        for (var _iterator13 = this._ast.program.body[Symbol.iterator](), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
          var node = _step13.value;

          if (!["ExportDefaultDeclaration", "ExportNamedDeclaration"].includes(node.type)) continue;
          if (node.declaration && node.declaration.type === "ClassDeclaration" && node.declaration.id.name === className) {
            return this._pathResolver.filePath + "~" + className;
          }
        }

        // find in import.
      } catch (err) {
        _didIteratorError13 = true;
        _iteratorError13 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion13 && _iterator13.return) {
            _iterator13.return();
          }
        } finally {
          if (_didIteratorError13) {
            throw _iteratorError13;
          }
        }
      }

      var importPath = _ASTUtil2.default.findPathInImportDeclaration(this._ast, className);
      if (importPath) return this._resolveLongname(className);

      // find in external
      return className;
    }
  }, {
    key: "value",
    get: function get() {
      return JSON.parse(JSON.stringify(this._value));
    }
  }]);

  return AbstractDoc;
}();

exports.default = AbstractDoc;