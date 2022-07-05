"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PluginEvent = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Plugin system for your plugin.
 */
var Plugin = function () {
  /**
   * create instance.
   */
  function Plugin() {
    _classCallCheck(this, Plugin);

    this._plugins = null;
  }

  /**
   * initialize with plugin property.
   * @param {Array<{name: string, option: object}>} plugins - expect config.plugins property.
   */


  _createClass(Plugin, [{
    key: "init",
    value: function init() {
      var plugins = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      this.onHandlePlugins(plugins);
    }

    /**
     * exec plugin handler.
     * @param {string} handlerName - handler name(e.g. onHandleCode)
     * @param {PluginEvent} ev - plugin event object.
     * @private
     */

  }, {
    key: "_execHandler",
    value: function _execHandler(handlerName, ev) {
      /* eslint-disable global-require */
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this._plugins[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var item = _step.value;

          var plugin = void 0;
          if (item.plugin) {
            plugin = item.plugin;
          } else if (item.name.match(/^[.\/]/)) {
            var pluginPath = _path2.default.resolve(item.name);
            plugin = require(pluginPath);
          } else {
            module.paths.push("./node_modules");
            plugin = require(item.name);
            module.paths.pop();
          }

          if (!plugin[handlerName]) continue;

          ev.data.option = item.option;
          plugin[handlerName](ev);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }, {
    key: "onHandlePlugins",
    value: function onHandlePlugins(plugins) {
      this._plugins = plugins;
      var ev = new PluginEvent({ plugins: plugins });
      this._execHandler("onHandlePlugins", ev);
      this._plugins = ev.data.plugins;
    }

    /**
     * handle start.
     */

  }, {
    key: "onStart",
    value: function onStart() {
      var ev = new PluginEvent();
      this._execHandler("onStart", ev);
    }

    /**
     * handle config.
     * @param {ESDocConfig} config - original esdoc2 config.
     * @returns {ESDocConfig} handled config.
     */

  }, {
    key: "onHandleConfig",
    value: function onHandleConfig(config) {
      var ev = new PluginEvent({ config: config });
      this._execHandler("onHandleConfig", ev);
      return ev.data.config;
    }

    /**
     * handle code.
     * @param {string} code - original code.
     * @param {string} filePath - source code file path.
     * @returns {string} handled code.
     */

  }, {
    key: "onHandleCode",
    value: function onHandleCode(code, filePath) {
      var ev = new PluginEvent({ code: code });
      ev.data.filePath = filePath;
      this._execHandler("onHandleCode", ev);
      return ev.data.code;
    }

    /**
     * handle code parser.
     * @param {function(code: string)} parser - original js parser.
     * @param {object} parserOption - default babylon options.
     * @param {string} filePath - source code file path.
     * @param {string} code - original code.
     * @returns {{parser: function(code: string), parserOption: Object}} handled parser.
     */

  }, {
    key: "onHandleCodeParser",
    value: function onHandleCodeParser(parser, parserOption, filePath, code) {
      var ev = new PluginEvent();
      ev.data = { parser: parser, parserOption: parserOption, filePath: filePath, code: code };
      this._execHandler("onHandleCodeParser", ev);
      return { parser: ev.data.parser, parserOption: ev.data.parserOption };
    }

    /**
     * handle AST.
     * @param {AST} ast - original ast.
     * @param {string} filePath - source code file path.
     * @param {string} code - original code.
     * @returns {AST} handled AST.
     */

  }, {
    key: "onHandleAST",
    value: function onHandleAST(ast, filePath, code) {
      var ev = new PluginEvent({ ast: ast });
      ev.data.filePath = filePath;
      ev.data.code = code;
      this._execHandler("onHandleAST", ev);
      return ev.data.ast;
    }

    /**
     * handle docs.
     * @param {Object[]} docs - docs.
     * @returns {Object[]} handled docs.
     */

  }, {
    key: "onHandleDocs",
    value: function onHandleDocs(docs) {
      var ev = new PluginEvent({ docs: docs });
      this._execHandler("onHandleDocs", ev);
      return ev.data.docs;
    }

    /**
     * handle publish
     * @param {function(filePath: string, content: string)} writeFile - write content.
     * @param {function(srcPath: string, destPath: string)} copyDir - copy directory.
     * @param {function(filePath: string):string} readFile - read content.
     */

  }, {
    key: "onPublish",
    value: function onPublish(writeFile, copyDir, readFile) {
      var ev = new PluginEvent({});

      // hack: fixme
      ev.data.writeFile = writeFile;
      ev.data.copyFile = copyDir;
      ev.data.copyDir = copyDir;
      ev.data.readFile = readFile;

      this._execHandler("onPublish", ev);
    }

    /**
     * handle content.
     * @param {string} content - original content.
     * @param {string} fileName - the fileName of the HTML file.
     * @returns {string} handled HTML.
     */

  }, {
    key: "onHandleContent",
    value: function onHandleContent(content, fileName) {
      var ev = new PluginEvent({ content: content, fileName: fileName });
      this._execHandler("onHandleContent", ev);
      return ev.data.content;
    }

    /**
     * handle complete
     */

  }, {
    key: "onComplete",
    value: function onComplete() {
      var ev = new PluginEvent();
      this._execHandler("onComplete", ev);
    }
  }]);

  return Plugin;
}();

/**
 * Plugin Event class.
 */


var PluginEvent =
/**
 * create instance.
 * @param {Object} data - event content.
 */
exports.PluginEvent = function PluginEvent() {
  var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  _classCallCheck(this, PluginEvent);

  this.data = copy(data);
};

function copy(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Instance of Plugin class.
 */
exports.default = new Plugin();