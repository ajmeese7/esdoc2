"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fsExtra = require("fs-extra");

var _fsExtra2 = _interopRequireDefault(_fsExtra);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * logger for invalid code which can not be parsed with esdoc2.
 */
var InvalidCodeLogger = function () {
  function InvalidCodeLogger() {
    _classCallCheck(this, InvalidCodeLogger);

    this._logs = [];
  }

  /**
   * show log.
   * @param {string} filePath - invalid code in this file.
   * @param {ASTNode} [node] - fail parsing node.
   */


  _createClass(InvalidCodeLogger, [{
    key: "show",
    value: function show(filePath, node) {
      if (!node) {
        this.showFile(filePath);
        return;
      }

      var lines = _fsExtra2.default.readFileSync(filePath).toString().split("\n");
      var targetLines = [];
      var start = void 0;
      var end = node.loc.start.line;

      if (node.leadingComments && node.leadingComments[0]) {
        start = node.leadingComments[0].loc.start.line;
      } else {
        start = Math.max(0, end - 10);
      }

      for (var i = start - 1; i < end; i++) {
        targetLines.push(i + 1 + "| " + lines[i]);
      }

      console.log("[31merror: could not process the following code.[32m");
      console.log(filePath);
      console.log(targetLines.join("\n"));
      console.log("[0m");

      this._logs.push({ filePath: filePath, log: [start, end] });
    }

    /**
     * show error log.
     * @param {Error} error - target error.
     */

  }, {
    key: "showError",
    value: function showError(error) {
      console.log("[31m");
      console.log(error);
      console.log("[0m");
    }

    /**
     * show log.
     * @param {string} filePath - invalid code in this file.
     * @param {Error} error - error object.
     */

  }, {
    key: "showFile",
    value: function showFile(filePath, error) {
      var lines = _fsExtra2.default.readFileSync(filePath).toString().split("\n");
      var start = Math.max(error.loc.line - 3, 1);
      var end = Math.min(error.loc.line + 3, lines.length);
      var targetLines = [];
      for (var i = start - 1; i < end; i++) {
        targetLines.push(i + 1 + "| " + lines[i]);
      }

      console.log("[31mwarning: could not parse the following code. if you want to use ECMAScript proposals, see https://esdoc2.org/manual/feature.html#ecmascript-proposal[32m");
      console.log(filePath);
      console.log(targetLines.join("\n") + "\x1B[0m");

      this._logs.push({ filePath: filePath, log: [start, end] });
    }
  }]);

  return InvalidCodeLogger;
}();

/**
 * singleton for {@link InvalidCodeLogger}
 */


exports.default = new InvalidCodeLogger();