import fs from "fs-extra";
import Plugin from "../Plugin/Plugin.js";
import * as babylon from "babylon";

/**
 * ECMAScript Parser class.
 *
 * @example
 * let ast = ESParser.parse('./src/foo.js');
 */
export default class ESParser {
  /**
   * Parse ECMAScript source code.
   * @param {string} filePath - source code file path.
   * @returns {AST} AST of source code.
   */
  static parse(filePath) {
    let code = fs.readFileSync(filePath, {encode: "utf8"}).toString();
    Plugin.init();
    code = Plugin.onHandleCode(code, filePath);
    if (code.charAt(0) === "#") code = code.replace(/^#!/, "//");

    let parserOption = {sourceType: "module", plugins: []};
    let parser = (code) => {
      return babylon.parse(code, parserOption);
    };

    ({parser, parserOption} = Plugin.onHandleCodeParser(parser, parserOption, filePath, code));

    let ast = parser(code);
    ast = Plugin.onHandleAST(ast, filePath, code);

    return ast;
  }
}
