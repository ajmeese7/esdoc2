"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fsExtra = require("fs-extra");

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _assert = require("assert");

var _assert2 = _interopRequireDefault(_assert);

var _ASTUtil = require("./Util/ASTUtil.js");

var _ASTUtil2 = _interopRequireDefault(_ASTUtil);

var _ESParser = require("./Parser/ESParser");

var _ESParser2 = _interopRequireDefault(_ESParser);

var _PathResolver = require("./Util/PathResolver.js");

var _PathResolver2 = _interopRequireDefault(_PathResolver);

var _DocFactory = require("./Factory/DocFactory.js");

var _DocFactory2 = _interopRequireDefault(_DocFactory);

var _InvalidCodeLogger = require("./Util/InvalidCodeLogger.js");

var _InvalidCodeLogger2 = _interopRequireDefault(_InvalidCodeLogger);

var _Plugin = require("./Plugin/Plugin.js");

var _Plugin2 = _interopRequireDefault(_Plugin);

var _stream = require("stream");

var _bigJson = require("big-json");

var _bigJson2 = _interopRequireDefault(_bigJson);

var _mkdirp = require("mkdirp");

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _npmlog = require("npmlog");

var _npmlog2 = _interopRequireDefault(_npmlog);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * API Documentation Generator.
 *
 * @example
 * let config = {source: "./src", destination: "./esdoc2"};
 * esdoc2.generate(config, (results, config)=>{
 *   console.log(results);
 * });
 */
var ESDoc = function () {
  function ESDoc() {
    _classCallCheck(this, ESDoc);
  }

  _createClass(ESDoc, null, [{
    key: "generate",

    /**
     * Generate documentation.
     * @param {ESDocConfig} config - config for generation.
     */
    value: function generate(config) {
      var _this = this;

      return new Promise(function (resolve) {
        (0, _assert2.default)(config.source);
        (0, _assert2.default)(config.destination);

        _this._checkOldConfig(config);

        _Plugin2.default.init(config.plugins);
        _Plugin2.default.onStart();
        config = _Plugin2.default.onHandleConfig(config);

        _this._setDefaultConfig(config);

        var includes = config.includes.map(function (v) {
          return new RegExp(v);
        });
        var excludes = config.excludes.map(function (v) {
          return new RegExp(v);
        });

        var packageName = null;
        var mainFilePath = null;
        if (config.package) {
          try {
            var packageJSON = _fsExtra2.default.readFileSync(config.package, { encode: "utf8" });
            var packageConfig = JSON.parse(packageJSON);
            packageName = packageConfig.name;
            mainFilePath = packageConfig.main;
          } catch (e) {
            // ignore
          }
        }

        var results = [];
        var sourceDirPath = _path2.default.resolve(config.source);
        var onWriteFinish = function onWriteFinish() {
          _npmlog2.default.info("esdoc2", "finished generating files");

          // publish
          _this._publish(config);

          _Plugin2.default.onComplete();

          _this._memUsage();
          resolve(true);
        };

        var fatalError = function fatalError(err) {
          _npmlog2.default.error(err);
          process.exit(1);
        };

        var stringifyWriteTransform = new _stream.Transform({
          writableObjectMode: true,
          readableObjectMode: true,
          transform: function transform(chunk, encoding, transformCallback) {
            var fullPath = _path2.default.resolve(config.destination, "ast/" + chunk.filePath + ".json");
            (0, _mkdirp2.default)(fullPath.split("/").slice(0, -1).join("/")).catch(function (err) {
              if (err) fatalError(err);
              _npmlog2.default.verbose("transform", fullPath);
              var fileWriteStream = _fsExtra2.default.createWriteStream(fullPath);
              fileWriteStream.on("error", fatalError);
              fileWriteStream.on("finish", function () {
                return _npmlog2.default.verbose("write", fullPath);
              });
              fileWriteStream.on("finish", transformCallback);

              var stringifyStream = _bigJson2.default.createStringifyStream({ body: chunk.ast });
              stringifyStream.on("error", fatalError);
              stringifyStream.on("end", fileWriteStream.end);
              stringifyStream.on("end", function () {
                return _npmlog2.default.verbose("stringified", fullPath);
              });
              stringifyStream.pipe(fileWriteStream);
            });
          }
        });

        stringifyWriteTransform.on("finish", onWriteFinish);
        stringifyWriteTransform.on("error", fatalError);

        _this._walk(config.source, function (filePath) {
          var _results;

          var relativeFilePath = _path2.default.relative(sourceDirPath, filePath);
          var match = false;
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = includes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var reg = _step.value;

              if (relativeFilePath.match(reg)) {
                match = true;
                break;
              }
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

          if (!match) return;

          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = excludes[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var _reg = _step2.value;

              if (relativeFilePath.match(_reg)) return;
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }

          _npmlog2.default.info("parse", filePath);
          var temp = _this._traverse(config.source, filePath, packageName, mainFilePath);
          if (!temp) return;
          (_results = results).push.apply(_results, _toConsumableArray(temp.results));
          stringifyWriteTransform.write({ filePath: "source" + _path2.default.sep + relativeFilePath, ast: temp.ast });
        });

        stringifyWriteTransform.end();

        // config.index
        if (config.index) {
          results.push(_this._generateForIndex(config));
        }

        // config.package
        if (config.package) {
          results.push(_this._generateForPackageJSON(config));
        }

        results = _this._resolveDuplication(results);

        results = _Plugin2.default.onHandleDocs(results);

        // index.json
        {
          var dumpPath = _path2.default.resolve(config.destination, "index.json");
          _fsExtra2.default.outputFileSync(dumpPath, JSON.stringify(results, null, 2));
        }
      });
    }

    /**
     * check esdoc2 config. and if it is old, exit with warning message.
     * @param {ESDocConfig} config - check config
     * @private
     */

  }, {
    key: "_checkOldConfig",
    value: function _checkOldConfig(config) {
      var exit = false;

      var keys = [["access", "esdoc2-standard-plugin"], ["autoPrivate", "esdoc2-standard-plugin"], ["unexportIdentifier", "esdoc2-standard-plugin"], ["undocumentIdentifier", "esdoc2-standard-plugin"], ["builtinExternal", "esdoc2-standard-plugin"], ["coverage", "esdoc2-standard-plugin"], ["test", "esdoc2-standard-plugin"], ["title", "esdoc2-standard-plugin"], ["manual", "esdoc2-standard-plugin"], ["lint", "esdoc2-standard-plugin"], ["includeSource", "esdoc2-exclude-source-plugin"], ["styles", "esdoc2-inject-style-plugin"], ["scripts", "esdoc2-inject-script-plugin"], ["experimentalProposal", "esdoc2-ecmascript-proposal-plugin"]];

      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = keys[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var _step3$value = _slicedToArray(_step3.value, 2),
              key = _step3$value[0],
              plugin = _step3$value[1];

          if (key in config) {
            console.error("\x1B[31merror: config." + key + " is invalid. Please use " + plugin + ". how to migration: https://esdoc2.org/manual/migration.html\x1B[0m");
            exit = true;
          }
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      if (exit) process.exit(1);
    }

    /**
     * set default config to specified config.
     * @param {ESDocConfig} config - specified config.
     * @private
     */

  }, {
    key: "_setDefaultConfig",
    value: function _setDefaultConfig(config) {
      if (!config.includes) config.includes = ["\\.js$"];

      if (!config.excludes) config.excludes = ["\\.config\\.js$", "\\.test\\.js$"];

      if (!config.index) config.index = "./README.md";

      if (!config.package) config.package = "./package.json";
    }

    /**
     * walk recursive in directory.
     * @param {string} dirPath - target directory path.
     * @param {function(entryPath: string)} callback - callback for find file.
     * @private
     */

  }, {
    key: "_walk",
    value: function _walk(dirPath, callback) {
      var entries = _fsExtra2.default.readdirSync(dirPath);

      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = entries[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var entry = _step4.value;

          var entryPath = _path2.default.resolve(dirPath, entry);
          var stat = _fsExtra2.default.statSync(entryPath);

          if (stat.isFile()) {
            callback(entryPath);
          } else if (stat.isDirectory()) {
            this._walk(entryPath, callback);
          }
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4.return) {
            _iterator4.return();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }
    }

    /**
     * traverse doc comment in JavaScript file.
     * @param {string} inDirPath - root directory path.
     * @param {string} filePath - target JavaScript file path.
     * @param {string} [packageName] - npm package name of target.
     * @param {string} [mainFilePath] - npm main file path of target.
     * @returns {Object} - return document that is traversed.
     * @property {DocObject[]} results - this is contained JavaScript file.
     * @property {AST} ast - this is AST of JavaScript file.
     * @private
     */

  }, {
    key: "_traverse",
    value: function _traverse(inDirPath, filePath, packageName, mainFilePath) {
      _npmlog2.default.verbose("parsing: " + filePath);
      var ast = void 0;
      try {
        ast = _ESParser2.default.parse(filePath);
      } catch (e) {
        _InvalidCodeLogger2.default.showFile(filePath, e);
        return null;
      }

      var pathResolver = new _PathResolver2.default(inDirPath, filePath, packageName, mainFilePath);
      var factory = new _DocFactory2.default(ast, pathResolver);

      _ASTUtil2.default.traverse(ast, function (node, parent) {
        try {
          factory.push(node, parent);
        } catch (e) {
          _InvalidCodeLogger2.default.show(filePath, node);
          throw e;
        }
      });

      return { results: factory.results, ast: ast };
    }

    /**
     * generate index doc
     * @param {ESDocConfig} config
     * @returns {Tag}
     * @private
     */

  }, {
    key: "_generateForIndex",
    value: function _generateForIndex(config) {
      var indexContent = _fsExtra2.default.readFileSync(config.index, { encode: "utf8" }).toString();
      var tag = {
        kind: "index",
        content: indexContent,
        longname: _path2.default.resolve(config.index),
        name: config.index,
        static: true,
        access: "public"
      };

      return tag;
    }

    /**
     * generate package doc
     * @param {ESDocConfig} config
     * @returns {Tag}
     * @private
     */

  }, {
    key: "_generateForPackageJSON",
    value: function _generateForPackageJSON(config) {
      var packageJSON = "";
      var packagePath = "";
      try {
        packageJSON = _fsExtra2.default.readFileSync(config.package, { encoding: "utf-8" });
        packagePath = _path2.default.resolve(config.package);
      } catch (e) {
        // ignore
      }

      var tag = {
        kind: "packageJSON",
        content: packageJSON,
        longname: packagePath,
        name: _path2.default.basename(packagePath),
        static: true,
        access: "public"
      };

      return tag;
    }

    /**
     * resolve duplication docs
     * @param {Tag[]} docs
     * @returns {Tag[]}
     * @private
     */

  }, {
    key: "_resolveDuplication",
    value: function _resolveDuplication(docs) {
      var memberDocs = docs.filter(function (doc) {
        return doc.kind === "member";
      });
      var removeIds = [];

      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        var _loop = function _loop() {
          var memberDoc = _step5.value;

          // member duplicate with getter/setter/method.
          // when it, remove member.
          // getter/setter/method are high priority.
          var sameLongnameDoc = docs.find(function (doc) {
            return doc.longname === memberDoc.longname && doc.kind !== "member";
          });
          if (sameLongnameDoc) {
            removeIds.push(memberDoc.__docId__);
            return "continue";
          }

          var dup = docs.filter(function (doc) {
            return doc.longname === memberDoc.longname && doc.kind === "member";
          });
          if (dup.length > 1) {
            var ids = dup.map(function (v) {
              return v.__docId__;
            });
            ids.sort(function (a, b) {
              return a < b ? -1 : 1;
            });
            ids.shift();
            removeIds.push.apply(removeIds, _toConsumableArray(ids));
          }
        };

        for (var _iterator5 = memberDocs[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          var _ret = _loop();

          if (_ret === "continue") continue;
        }
      } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion5 && _iterator5.return) {
            _iterator5.return();
          }
        } finally {
          if (_didIteratorError5) {
            throw _iteratorError5;
          }
        }
      }

      return docs.filter(function (doc) {
        return !removeIds.includes(doc.__docId__);
      });
    }

    /**
     * publish content
     * @param {ESDocConfig} config
     * @private
     */

  }, {
    key: "_publish",
    value: function _publish(config) {
      try {
        var write = function write(filePath, content, option) {
          var _filePath = _path2.default.resolve(config.destination, filePath);
          content = _Plugin2.default.onHandleContent(content, _filePath);

          _npmlog2.default.info("write", _filePath);
          _fsExtra2.default.outputFileSync(_filePath, content, option);
        };

        var copy = function copy(srcPath, destPath) {
          var _destPath = _path2.default.resolve(config.destination, destPath);
          _npmlog2.default.info("copy", _destPath);
          _fsExtra2.default.copySync(srcPath, _destPath);
        };

        var read = function read(filePath) {
          var _filePath = _path2.default.resolve(config.destination, filePath);
          return _fsExtra2.default.readFileSync(_filePath).toString();
        };

        _Plugin2.default.onPublish(write, copy, read);
      } catch (e) {
        _InvalidCodeLogger2.default.showError(e);
        process.exit(1);
      }
    }

    /**
     * show memory usage stat
     * @return {undefined} no return
     */

  }, {
    key: "_memUsage",
    value: function _memUsage() {
      var used = process.memoryUsage();
      Object.keys(used).forEach(function (key) {
        _npmlog2.default.verbose(key + " " + Math.round(used[key] / 1024 / 1024 * 100) / 100 + " MB");
      });
    }
  }]);

  return ESDoc;
}();

exports.default = ESDoc;