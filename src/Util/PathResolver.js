import path from "path";
import assert from "assert";
import os from "os";

/**
 * File path resolver.
 * @example
 * let pathResolver = new PathResolver("./src", "foo/bar.js", "foo-bar", "foo/bar.js");
 * pathResolver.importPath; // "foo-bar"
 * pathResolver.filePath; // "src/foo/bar.js"
 * pathResolver.resolve("./baz.js"); // "src/foo/baz.js"
 */
export default class PathResolver {
  /**
   * Create instance.
   * @param {string} inDirPath - root directory path.
   * @param {string} filePath - relative file path from root directory path.
   * @param {string} [packageName] - npm package name.
   * @param {string} [mainFilePath] - npm main file path.
   */
  constructor(inDirPath, filePath, packageName = null, mainFilePath = null) {
    assert(inDirPath);
    assert(filePath);

    /** @type {string} */
    this._inDirPath = path.resolve(inDirPath);

    /** @type {string} */
    this._filePath = path.resolve(filePath);

    /** @type {NPMPackageObject} */
    this._packageName = packageName;

    if (mainFilePath) {
      /** @type {string} */
      this._mainFilePath = path.resolve(mainFilePath);
    }
  }

  /**
   * Import path that is considered package name, main file and path prefix.
   * @type {string}
   */
  get importPath() {
    const relativeFilePath = this.filePath;

    if (this._mainFilePath === path.resolve(relativeFilePath)) {
      return this._packageName;
    }

    let filePath;
    if (this._packageName) {
      filePath = path.normalize(`${this._packageName}${path.sep}${relativeFilePath}`);
    } else {
      filePath = `./${relativeFilePath}`;
    }

    return this._slash(filePath);
  }

  /**
   * File full path.
   * @type {string}
   */
  get fileFullPath() {
    return this._slash(this._filePath);
  }

  /**
   * File path that is relative path on root directory.
   * @type {string}
   */
  get filePath() {
    const relativeFilePath = path.relative(path.dirname(this._inDirPath), this._filePath);
    return this._slash(relativeFilePath);
  }

  /**
   * Resolve file path on this file.
   * @param {string} relativePath - relative path on this file.
   * @param {boolean} relative - relative path or not.
   * @returns {string} resolved and converted path.
   */
  resolve(relativePath, relative = true) {
    const selfDirPath = path.dirname(this._filePath);
    let resolvedPath = path.resolve(selfDirPath, relativePath);
    if (relative) {
      resolvedPath = path.relative(path.dirname(this._inDirPath), resolvedPath);
    }

    return this._slash(resolvedPath);
  }

  /**
   * Convert "back slash" to "slash".
   * Path separator is "back slash" if platform is Windows.
   * @param {string} filePath - target file path.
   * @returns {string} converted path.
   * @private
   */
  _slash(filePath) {
    if (os.platform() === "win32") {
      filePath = filePath.replace(/\\/g, "/");
    }

    return filePath;
  }
}
