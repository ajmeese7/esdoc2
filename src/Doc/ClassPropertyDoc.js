import AbstractDoc from "./AbstractDoc.js";
import MethodDoc from "./MethodDoc.js";

/**
 * Doc Class from ClassProperty AST node.
 */
export default class ClassPropertyDoc extends AbstractDoc {
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

  /** Specify ``member`` to kind. */
  _$kind() {
    super._$kind();
    this._value.kind = "member";
  }

  /** Rake out self name from self node */
  _$name() {
    super._$name();
    this._value.name = this._node.key.name;
  }

  /** Borrow {@link MethodDoc#@_memberof} */
  _$memberof() {
    Reflect.apply(MethodDoc.prototype._$memberof, this, []);
  }
}
