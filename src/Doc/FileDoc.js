import fs from "fs";
import AbstractDoc from "./AbstractDoc.js";

/**
 * Doc Class from source file.
 */
export default class FileDoc extends AbstractDoc {
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

  /** Specify ``file`` to kind. */
  _$kind() {
    super._$kind();
    this._value.kind = "file";
  }

  /** Take out self name from file path */
  _$name() {
    super._$name();
    this._value.name = this._pathResolver.filePath;
  }

  /** Specify name to longname */
  _$longname() {
    this._value.longname = this._pathResolver.fileFullPath;
  }

  /** Specify file content to value.content */
  _$content() {
    super._$content();

    const filePath = this._pathResolver.fileFullPath;
    const content = fs.readFileSync(filePath, {encode: "utf8"}).toString();
    this._value.content = content;
  }
}
