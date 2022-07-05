import {resolve} from "path";

/**
 * Node Package Manager(npm) util class.
 */
export default class NPMUtil {
  /**
   * find esdoc2 package.json object.
   * @returns {Object} package.json object.
   */
  static findPackage() {
    let packageObj = null;
    try {
      const packageFilePath = resolve(__dirname, "../../package.json");
      packageObj = require(packageFilePath);
    } catch (e) {
      const packageFilePath = resolve(__dirname, "../../../package.json");
      packageObj = require(packageFilePath);
    }

    return packageObj;
  }
}
