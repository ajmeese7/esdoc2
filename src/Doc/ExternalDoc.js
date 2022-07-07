import log from "npmlog";
import AbstractDoc from "./AbstractDoc.js";
import ParamParser from "../Parser/ParamParser.js";
/**
 * Doc Class from virtual comment node of external.
 */
export default class ExternalDoc extends AbstractDoc {
  /**
   * Apply own tag.
   * @private
   */
  _apply() {
    super._apply();

    Reflect.deleteProperty(this._value, "export");
    Reflect.deleteProperty(this._value, "importPath");
    Reflect.deleteProperty(this._value, "importStyle");
  }

  /** Specify ``external`` to kind. */
  _$kind() {
    super._$kind();
    this._value.kind = "external";
  }

  /** Take out self name from tag */
  _$name() {
    super._$name();
    if (this._value.name) return;

    const value = this._findTagValue(["@external"]);
    if (!value) {
      log.warn("can not resolve name.");
    }

    this._value.name = value;

    const tags = this._findAll(["@external"]);
    if (!tags) {
      log.warn("can not resolve name.");
      return;
    }

    let name;
    for (const tag of tags) {
      const {typeText, paramDesc} = ParamParser.parseParamValue(tag.tagValue, true, false, true);
      name = typeText;
      this._value.externalLink = paramDesc;
    }

    this._value.name = name;
  }

  /** Take out self memberof from file path. */
  _$memberof() {
    super._$memberof();
    this._value.memberof = this._pathResolver.filePath;
  }

  /** Specify name to longname */
  _$longname() {
    super._$longname();
    if (this._value.longname) return;
    this._value.longname = this._value.name;
  }

  /** Avoid unknown tag */
  _$external() {}
}

