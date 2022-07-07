import log from "npmlog";
import AbstractDoc from "./AbstractDoc.js";
import ParamParser from "../Parser/ParamParser.js";

/**
 * Doc class for virtual comment node of typedef.
 */
export default class TypedefDoc extends AbstractDoc {
  /**
   * Apply own tag.
   * @private
   */
  _apply() {
    super._apply();

    this._$typedef();

    Reflect.deleteProperty(this._value, "export");
    Reflect.deleteProperty(this._value, "importPath");
    Reflect.deleteProperty(this._value, "importStyle");
  }

  /** Specify ``typedef`` to kind. */
  _$kind() {
    super._$kind();
    this._value.kind = "typedef";
  }

  /** Set name by using tag. */
  _$name() {
    super._$name();
    if (this._value.name) return;

    const tags = this._findAll(["@typedef"]);
    if (!tags) {
      log.warn("can not resolve name.");
      return;
    }

    let name;
    for (const tag of tags) {
      const {paramName} = ParamParser.parseParamValue(tag.tagValue, true, true, false);
      name = paramName;
    }

    this._value.name = name;
  }

  /** Set memberof by using file path. */
  _$memberof() {
    super._$memberof();

    let memberof;
    let parent = this._node.parent;
    while (parent) {
      if (parent.type === "ClassDeclaration") {
        memberof = `${this._pathResolver.filePath}~${parent.id.name}`;
        this._value.memberof = memberof;
        return;
      }
      parent = parent.parent;
    }

    this._value.memberof = this._pathResolver.filePath;
  }

  /** For @typedef */
  _$typedef() {
    const value = this._findTagValue(["@typedef"]);
    if (!value) return;

    const {typeText, paramName, paramDesc} = ParamParser.parseParamValue(value, true, true, false);
    const result = ParamParser.parseParam(typeText, paramName, paramDesc);

    log.verbose("@typedef", result);

    Reflect.deleteProperty(result, "description");
    Reflect.deleteProperty(result, "nullable");
    Reflect.deleteProperty(result, "spread");

    this._value.type = result;
  }
}
