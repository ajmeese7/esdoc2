#!/usr/bin/env node
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _minimist = require("minimist");

var _minimist2 = _interopRequireDefault(_minimist);

var _ESDoc = require("./ESDoc.js");

var _ESDoc2 = _interopRequireDefault(_ESDoc);

var _NPMUtil = require("./Util/NPMUtil.js");

var _NPMUtil2 = _interopRequireDefault(_NPMUtil);

var _npmlog = require("npmlog");

var _npmlog2 = _interopRequireDefault(_npmlog);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

_npmlog2.default.heading = "ESDoc2";
_npmlog2.default.info("using", "node@%s", process.version);
_npmlog2.default.info("using", "esdoc2@%s", _NPMUtil2.default.findPackage().version);
/**
 * Command Line Interface for esdoc2.
 *
 * @example
 * let cli = new ESDocCLI(process.argv);
 * cli.exec();
 */

var ESDocCLI = function () {
  /**
   * Create instance.
   * @param {Object} argv - this is node.js argv(``process.argv``)
   */
  function ESDocCLI(argv) {
    _classCallCheck(this, ESDocCLI);

    /** @type {ESDocCLIArgv} */
    this._argv = (0, _minimist2.default)(argv.slice(2));

    if (this._argv.h || this._argv.help) {
      this._showHelp();
      process.exit(0);
    }

    if (this._argv.v || this._argv.version) {
      this._showVersion();
      process.exit(0);
    }

    process.on("unhandledRejection", function (reason, p) {
      console.error("Unhandled Rejection at: Promise", p, "reason:", reason);
    });
  }

  /**
   * execute to generate document.
   */


  _createClass(ESDocCLI, [{
    key: "exec",
    value: function exec() {
      var config = void 0;

      var configPath = this._findConfigFilePath();
      _npmlog2.default.info("config", configPath);
      if (configPath) {
        config = this._createConfigFromJSONFile(configPath);
      } else {
        config = this._createConfigFromPackageJSON();
      }

      if (config) {
        _ESDoc2.default.generate(config);
      } else {
        this._showHelp();
        process.exit(1);
      }
    }

    /**
     * show help of esdoc2
     * @private
     */

  }, {
    key: "_showHelp",
    value: function _showHelp() {
      console.log("Usage: esdoc [-c esdoc.json]");
      console.log("");
      console.log("Options:");
      console.log("  -c", "specify config file");
      console.log("  -h", "output usage information");
      console.log("  -v", "output the version number");
      console.log("");
      console.log("esdoc2 finds configuration by the order:");
      console.log("  1. `-c your-esdoc.json`");
      console.log("  2. `.esdoc.json` in current directory");
      console.log("  3. `.esdoc.js` in current directory");
      console.log("  4. `esdoc` property in package.json");
    }

    /**
     * show version of esdoc2
     * @private
     */

  }, {
    key: "_showVersion",
    value: function _showVersion() {
      var packageObj = _NPMUtil2.default.findPackage();
      if (packageObj) {
        console.log(packageObj.version);
      } else {
        console.log("0.0.0");
      }
    }

    /**
     * find esdoc2 config file.
     * @returns {string|null} config file path.
     * @private
     */

  }, {
    key: "_findConfigFilePath",
    value: function _findConfigFilePath() {
      if (this._argv.c) {
        return this._argv.c;
      }

      try {
        var filePath = _path2.default.resolve("./.esdoc.json");
        _fs2.default.readFileSync(filePath);
        return filePath;
      } catch (e) {
        // ignore
      }

      try {
        var _filePath = _path2.default.resolve("./.esdoc.js");
        _fs2.default.readFileSync(_filePath);
        return _filePath;
      } catch (e) {
        // ignore
      }

      return null;
    }

    /**
     * create config object from config file.
     * @param {string} configFilePath - config file path.
     * @return {ESDocConfig} config object.
     * @private
     */

  }, {
    key: "_createConfigFromJSONFile",
    value: function _createConfigFromJSONFile(configFilePath) {
      configFilePath = _path2.default.resolve(configFilePath);
      var ext = _path2.default.extname(configFilePath);
      if (ext === ".js") {
        /* eslint-disable global-require */
        return require(configFilePath);
      } else {
        var configJSON = _fs2.default.readFileSync(configFilePath, { encode: "utf8" });
        var config = JSON.parse(configJSON);
        return config;
      }
    }

    /**
     * create config object from package.json.
     * @return {ESDocConfig|null} config object.
     * @private
     */

  }, {
    key: "_createConfigFromPackageJSON",
    value: function _createConfigFromPackageJSON() {
      try {
        var filePath = _path2.default.resolve("./package.json");
        var packageJSON = _fs2.default.readFileSync(filePath, "utf8").toString();
        var packageObj = JSON.parse(packageJSON);
        return packageObj.esdoc2;
      } catch (e) {
        // ignore
      }

      return null;
    }
  }]);

  return ESDocCLI;
}();

// if this file is directory executed, work as CLI.


exports.default = ESDocCLI;
var executedFilePath = _fs2.default.realpathSync(process.argv[1]);
if (executedFilePath === __filename) {
  var cli = new ESDocCLI(process.argv);
  cli.exec();
}