import path from "path";
import ParamParser from "../Parser/ParamParser.js";
import ASTUtil from "../Util/ASTUtil.js";
import InvalidCodeLogger from "../Util/InvalidCodeLogger.js";
import ASTNodeContainer from "../Util/ASTNodeContainer.js";
import babelGenerator from "babel-generator";
import { name } from "../Factory/DocFactory";

/**
 * Abstract Doc Class.
 * @todo rename this class name.
 */
export default class AbstractDoc {
  /**
   * Create instance.
   * @param {AST} ast - this is AST that contains this doc.
   * @param {ASTNode} node - this is self node.
   * @param {PathResolver} pathResolver - this is file path resolver that contains this doc.
   * @param {Tag[]} commentTags - this is tags that self node has.
   */
  constructor(ast, node, pathResolver, commentTags = []) {
    this._ast = ast;
    this._node = node;
    this._pathResolver = pathResolver;
    this._commentTags = commentTags;
    this._value = {};

    Reflect.defineProperty(this._node, "doc", {value: this});

    this._value.__docId__ = ASTNodeContainer.addNode(node);

    this._apply();
  }

  /** @type {DocObject[]} */
  get value() {
    return JSON.parse(JSON.stringify(this._value));
  }

  /**
   * Apply doc comment.
   * @protected
   */
  _apply() {
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
   * Decide `kind`.
   * @abstract
   */
  _$kind() {}

  /** for @_variation */
  /**
   * Decide `variation`.
   * @todo implements `@variation`.
   * @abstract
   */
  _$variation() {}

  /**
   * Decide `name`
   */
  _$name() {
    if (this._node[name]) {
      this._value.name = this._node[name];
    }
  }

  /**
   * Decide `memberof`.
   * @abstract
   */
  _$memberof() {}

  /**
   * Decide `member`.
   * @abstract
   */
  _$member() {}

  /**
   * Decide `content`.
   * @abstract
   */
  _$content() {}

  /**
   * Decide `generator`.
   * @abstract
   */
  _$generator() {}

  /**
   * Decide `async`.
   * @abstract
   */
  _$async() {}

  /**
   * Decide `static`.
   */
  _$static() {
    if ("static" in this._node) {
      this._value.static = this._node.static;
    } else {
      this._value.static = true;
    }
  }

  /**
   * Decide `longname`.
   */
  _$longname() {
    const memberof = this._value.memberof;
    const name = this._value.name;
    const scope = this._value.static ? "." : "#";
    if (memberof.includes("~")) {
      this._value.longname = `${memberof}${scope}${name}`;
    } else {
      this._value.longname = `${memberof}~${name}`;
    }
  }

  /**
   * Decide `access`.
   * process also @public, @private and @protected.
   */
  _$access() {
    const tag = this._find(["@access", "@public", "@private", "@protected"]);
    if (tag) {
      let access;
      /* eslint-disable max-statements-per-line */
      switch (tag.tagName) {
        case "@access": access = tag.tagValue; break;
        case "@public": access = "public"; break;
        case "@protected": access = "protected"; break;
        case "@private": access = "private"; break;
        default:
          throw new Error(`unexpected token: ${tag.tagName}`);
      }

      this._value.access = access;
    } else {
      this._value.access = null;
    }
  }

  /**
   * avoid unknown tag.
   */
  _$public() {}

  /**
   * avoid unknown tag.
   */
  _$protected() {}

  /**
   * avoid unknown tag.
   */
  _$private() {}

  /**
   * Decide `export`.
   */
  _$export() {
    let parent = this._node.parent;
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
   * Decide `importPath`.
   */
  _$importPath() {
    this._value.importPath = this._pathResolver.importPath;
  }

  /**
   * Decide `importStyle`.
   */
  _$importStyle() {
    if (this._node.__PseudoExport__) {
      this._value.importStyle = null;
      return;
    }

    let parent = this._node.parent;
    const name = this._value.name;
    while (parent) {
      if (parent.type === "ExportDefaultDeclaration") {
        this._value.importStyle = name;
        return;
      } else if (parent.type === "ExportNamedDeclaration") {
        this._value.importStyle = `{${name}}`;
        return;
      }
      parent = parent.parent;
    }

    this._value.importStyle = null;
  }

  /**
   * Decide `description`.
   */
  _$desc() {
    this._value.description = this._findTagValue(["@desc"]);
  }

  /**
   * Decide `examples`.
   */
  _$example() {
    const tags = this._findAll(["@example"]);
    if (!tags) return;
    if (!tags.length) return;

    this._value.examples = [];
    for (const tag of tags) {
      this._value.examples.push(tag.tagValue);
    }
  }

  /**
   * Decide `see`.
   */
  _$see() {
    const tags = this._findAll(["@see"]);
    if (!tags) return;
    if (!tags.length) return;

    this._value.see = [];
    for (const tag of tags) {
      this._value.see.push(tag.tagValue);
    }
  }

  /**
   * Decide `lineNumber`.
   */
  _$lineNumber() {
    const tag = this._find(["@lineNumber"]);
    if (tag) {
      this._value.lineNumber = parseInt(tag.tagValue, 10);
    } else {
      const node = this._node;
      if (node.loc) {
        this._value.lineNumber = node.loc.start.line;
      }
    }
  }

  /**
   * Decide `deprecated`.
   */
  _$deprecated() {
    const tag = this._find(["@deprecated"]);
    if (tag) {
      if (tag.tagValue) {
        this._value.deprecated = tag.tagValue;
      } else {
        this._value.deprecated = true;
      }
    }
  }

  /**
   * Decide `experimental`.
   */
  _$experimental() {
    const tag = this._find(["@experimental"]);
    if (tag) {
      if (tag.tagValue) {
        this._value.experimental = tag.tagValue;
      } else {
        this._value.experimental = true;
      }
    }
  }

  /**
   * Decide `since`.
   */
  _$since() {
    const tag = this._find(["@since"]);
    if (tag) {
      this._value.since = tag.tagValue;
    }
  }

  /**
   * Decide `version`.
   */
  _$version() {
    const tag = this._find(["@version"]);
    if (tag) {
      this._value.version = tag.tagValue;
    }
  }

  /**
   * Decide `todo`.
   */
  _$todo() {
    const tags = this._findAll(["@todo"]);
    if (tags) {
      this._value.todo = [];
      for (const tag of tags) {
        this._value.todo.push(tag.tagValue);
      }
    }
  }

  /**
   * Decide `ignore`.
   */
  _$ignore() {
    const tag = this._find(["@ignore"]);
    if (tag) {
      this._value.ignore = true;
    }
  }

  /**
   * Decide `pseudoExport`.
   */
  _$pseudoExport() {
    if (this._node.__PseudoExport__) {
      this._value.pseudoExport = true;
    }
  }

  /**
   * Decide `undocument` with internal tag.
   */
  _$undocument() {
    const tag = this._find(["@undocument"]);
    if (tag) {
      this._value.undocument = true;
    }
  }

  /**
   * Decide `unknown`.
   */
  _$unknown() {
    for (const tag of this._commentTags) {
      const methodName = tag.tagName.replace(/^[@]/, "_$");
      if (this[methodName]) continue;

      if (!this._value.unknown) this._value.unknown = [];
      this._value.unknown.push(tag);
    }
  }

  /**
   * Decide `param`.
   */
  _$param() {
    const values = this._findAllTagValues(["@param"]);
    if (!values) return;

    this._value.params = [];
    for (const value of values) {
      const {typeText, paramName, paramDesc} = ParamParser.parseParamValue(value);
      if (!typeText || !paramName) {
        InvalidCodeLogger.show(this._pathResolver.fileFullPath, this._node);
        continue;
      }
      const result = ParamParser.parseParam(typeText, paramName, paramDesc);
      this._value.params.push(result);
    }
  }

  /**
   * Decide `return`.
   */
  _$return() {
    const value = this._findTagValue(["@return", "@returns"]);
    if (!value) return;

    const {typeText, paramName, paramDesc} = ParamParser.parseParamValue(value, true, false, true);
    const result = ParamParser.parseParam(typeText, paramName, paramDesc);
    this._value.return = result;
  }

  /**
   * Decide `property`.
   */
  _$property() {
    const values = this._findAllTagValues(["@property"]);
    if (!values) return;

    this._value.properties = [];
    for (const value of values) {
      const {typeText, paramName, paramDesc} = ParamParser.parseParamValue(value);
      const result = ParamParser.parseParam(typeText, paramName, paramDesc);
      this._value.properties.push(result);
    }
  }

  /**
   * Decide `type`.
   */
  _$type() {
    const value = this._findTagValue(["@type"]);
    if (!value) return;

    const {typeText, paramName, paramDesc} = ParamParser.parseParamValue(value, true, false, false);
    const result = ParamParser.parseParam(typeText, paramName, paramDesc);
    this._value.type = result;
  }

  /**
   * Decide `abstract`.
   */
  _$abstract() {
    const tag = this._find(["@abstract"]);
    if (tag) {
      this._value.abstract = true;
    }
  }

  /**
   * Decide `override`.
   */
  _$override() {
    const tag = this._find(["@override"]);
    if (tag) {
      this._value.override = true;
    }
  }

  /**
   * Decide `throws`.
   */
  _$throws() {
    const values = this._findAllTagValues(["@throws"]);
    if (!values) return;

    this._value.throws = [];
    for (const value of values) {
      const {typeText, paramName, paramDesc} = ParamParser.parseParamValue(value, true, false, true);
      const result = ParamParser.parseParam(typeText, paramName, paramDesc);
      this._value.throws.push({
        types: result.types,
        description: result.description
      });
    }
  }

  /**
   * Decide `emits`.
   */
  _$emits() {
    const values = this._findAllTagValues(["@emits"]);
    if (!values) return;

    this._value.emits = [];
    for (const value of values) {
      const { typeText, paramName, paramDesc } = ParamParser.parseParamValue(value);
      if (!typeText || !paramName) {
        InvalidCodeLogger.show(this._pathResolver.fileFullPath, this._node);
        continue;
      }

      const result = ParamParser.parseParam(typeText, paramName, paramDesc);
      this._value.emits.push({
        types: result.types,
        name: result.name,
        description: result.description
      });
    }
  }

  /**
   * Decide `listens`.
   */
  _$listens() {
    const values = this._findAllTagValues(["@listens"]);
    if (!values) return;

    this._value.listens = [];
    for (const value of values) {
      const { typeText, paramName, paramDesc } = ParamParser.parseParamValue(value);
      const result = ParamParser.parseParam(typeText, paramName, paramDesc);
      this._value.listens.push({
        types: result.types,
        name: result.name,
        description: result.description
      });
    }
  }

  /**
   * Decide `decorator`.
   */
  _$decorator() {
    if (!this._node.decorators) return;

    this._value.decorators = [];
    for (const decorator of this._node.decorators) {
      const value = {};
      switch (decorator.expression.type) {
        case "Identifier":
          value.name = decorator.expression.name;
          value.arguments = null;
          break;
        case "CallExpression":
          value.name = babelGenerator(decorator.expression).code.replace(/[(].*/, "");
          value.arguments = babelGenerator(decorator.expression).code.replace(/^[^(]+/, "");
          break;
        case "MemberExpression":
          value.name = babelGenerator(decorator.expression).code.replace(/[(].*/, "");
          value.arguments = null;
          break;
        default:
          throw new Error(`unknown decorator expression type: ${decorator.expression.type}`);
      }
      this._value.decorators.push(value);
    }
  }

  /**
   * find all tags.
   * @param {string[]} names - tag names.
   * @returns {Tag[]|null} found tags.
   * @private
   */
  _findAll(names) {
    const results = [];
    for (const tag of this._commentTags) {
      if (names.includes(tag.tagName)) results.push(tag);
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
  _find(names) {
    const results = this._findAll(names);
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
  _findAllTagValues(names) {
    const tags = this._findAll(names);
    if (!tags) return null;

    const results = [];
    for (const tag of tags) {
      results.push(tag.tagValue);
    }

    return results;
  }

  /**
   * find ta value.
   * @param {string[]} names - tag names.
   * @returns {*|null} found value.
   * @private
   */
  _findTagValue(names) {
    const tag = this._find(names);
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
  _resolveLongname(name) {
    let importPath = ASTUtil.findPathInImportDeclaration(this._ast, name);
    if (!importPath) return name;

    if (importPath.charAt(0) === "." || importPath.charAt(0) === "/") {
      if (!path.extname(importPath)) importPath += ".js";

      const resolvedPath = this._pathResolver.resolve(importPath);
      const longname = `${resolvedPath}~${name}`;
      return longname;
    } else {
      const longname = `${importPath}~${name}`;
      return longname;
    }
  }

  /**
   * flatten member expression property name.
   * if node structure is [foo [bar [baz [this] ] ] ], flatten is ``this.baz.bar.foo``
   * @param {ASTNode} node - target member expression node.
   * @returns {string} flatten property.
   * @private
   */
  _flattenMemberExpression(node) {
    const results = [];
    let target = node;

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
  _findClassLongname(className) {
    // find in same file.
    for (const node of this._ast.program.body) {
      if (!["ExportDefaultDeclaration", "ExportNamedDeclaration"].includes(node.type)) continue;
      if (node.declaration && node.declaration.type === "ClassDeclaration" && node.declaration.id.name === className) {
        return `${this._pathResolver.filePath}~${className}`;
      }
    }

    // find in import.
    const importPath = ASTUtil.findPathInImportDeclaration(this._ast, className);
    if (importPath) return this._resolveLongname(className);

    // find in external
    return className;
  }
}
