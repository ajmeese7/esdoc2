import fs from "fs-extra";
import path from "path";
import assert from "assert";
import ASTUtil from "./Util/ASTUtil.js";
import ESParser from "./Parser/ESParser";
import PathResolver from "./Util/PathResolver.js";
import DocFactory from "./Factory/DocFactory.js";
import InvalidCodeLogger from "./Util/InvalidCodeLogger.js";
import Plugin from "./Plugin/Plugin.js";
import { Transform } from "stream";
import json from "big-json";
import mkdirp from "mkdirp";
import log from "npmlog";

/**
 * API Documentation Generator.
 *
 * @example
 * let config = {source: "./src", destination: "./esdoc2"};
 * esdoc2.generate(config, (results, config)=>{
 *   console.log(results);
 * });
 */
export default class ESDoc {
  /**
   * Generate documentation.
   * @param {ESDocConfig} config - config for generation.
   */
  static generate(config) {
    return new Promise((resolve) => {
      assert(config.source);
      assert(config.destination);

      this._checkOldConfig(config);

      Plugin.init(config.plugins);
      Plugin.onStart();
      config = Plugin.onHandleConfig(config);

      this._setDefaultConfig(config);

      const includes = config.includes.map((v) => new RegExp(v));
      const excludes = config.excludes.map((v) => new RegExp(v));

      let packageName = null;
      let mainFilePath = null;
      if (config.package) {
        try {
          const packageJSON = fs.readFileSync(config.package, {encode: "utf8"});
          const packageConfig = JSON.parse(packageJSON);
          packageName = packageConfig.name;
          mainFilePath = packageConfig.main;
        } catch (e) {
          // ignore
        }
      }

      let results = [];
      const sourceDirPath = path.resolve(config.source);
      const onWriteFinish = () => {
        log.info("esdoc2", "finished generating files");

        // publish
        this._publish(config);

        Plugin.onComplete();

        this._memUsage();
        resolve(true);
      };

      const fatalError = err => {
        log.error(err);
        process.exit(1);
      };

      const stringifyWriteTransform = new Transform({
        writableObjectMode: true,
        readableObjectMode: true,
        transform: function(chunk, encoding, transformCallback) {
          const fullPath = path.resolve(config.destination, `ast/${chunk.filePath}.json`);
          mkdirp(fullPath.split("/").slice(0, -1).join("/")).catch((err) => {
            if (err) fatalError(err);
            log.verbose("transform", fullPath);
            const fileWriteStream = fs.createWriteStream(fullPath);
            fileWriteStream.on("error", fatalError);
            fileWriteStream.on("finish", () => log.verbose("write", fullPath));
            fileWriteStream.on("finish", transformCallback);

            const stringifyStream = json.createStringifyStream({body: chunk.ast});
            stringifyStream.on("error", fatalError);
            stringifyStream.on("end", fileWriteStream.end);
            stringifyStream.on("end", () => log.verbose("stringified", fullPath));
            stringifyStream.pipe(fileWriteStream);
          });
        }
      });

      stringifyWriteTransform.on("finish", onWriteFinish);
      stringifyWriteTransform.on("error", fatalError);

      this._walk(config.source, (filePath) => {
        const relativeFilePath = path.relative(sourceDirPath, filePath);
        let match = false;
        for (const reg of includes) {
          if (relativeFilePath.match(reg)) {
            match = true;
            break;
          }
        }
        if (!match) return;

        for (const reg of excludes) {
          if (relativeFilePath.match(reg)) return;
        }

        log.info("parse", filePath);
        const temp = this._traverse(config.source, filePath, packageName, mainFilePath);
        if (!temp) return;
        results.push(...temp.results);
        stringifyWriteTransform.write({
          filePath: `source${path.sep}${relativeFilePath}`,
          ast: temp.ast
        });
      });

      stringifyWriteTransform.end();

      // config.index
      if (config.index) {
        results.push(this._generateForIndex(config));
      }

      // config.package
      if (config.package) {
        results.push(this._generateForPackageJSON(config));
      }

      results = this._resolveDuplication(results);

      results = Plugin.onHandleDocs(results);

      // index.json
      {
        const dumpPath = path.resolve(config.destination, "index.json");
        fs.outputFileSync(dumpPath, JSON.stringify(results, null, 2));
      }
    });
  }

  /**
   * Check esdoc2 config, exiting with warning message if it is old.
   * @param {ESDocConfig} config - check config
   * @private
   */
  static _checkOldConfig(config) {
    let exit = false;

    const keys = [
      ["access", "esdoc2-standard-plugin"],
      ["autoPrivate", "esdoc2-standard-plugin"],
      ["unexportIdentifier", "esdoc2-standard-plugin"],
      ["undocumentIdentifier", "esdoc2-standard-plugin"],
      ["builtinExternal", "esdoc2-standard-plugin"],
      ["coverage", "esdoc2-standard-plugin"],
      ["test", "esdoc2-standard-plugin"],
      ["title", "esdoc2-standard-plugin"],
      ["manual", "esdoc2-standard-plugin"],
      ["lint", "esdoc2-standard-plugin"],
      ["includeSource", "esdoc2-exclude-source-plugin"],
      ["styles", "esdoc2-inject-style-plugin"],
      ["scripts", "esdoc2-inject-script-plugin"],
      ["experimentalProposal", "esdoc2-ecmascript-proposal-plugin"]
    ];

    for (const [key, plugin] of keys) {
      if (key in config) {
        console.error(`[31merror: config.${key} is invalid. Please use ${plugin}. For info on how to migrate, see: https://esdoc2.org/manual/migration.html[0m`);
        exit = true;
      }
    }

    if (exit) process.exit(1);
  }

  /**
   * Set default config to specified config.
   * @param {ESDocConfig} config - specified config.
   * @private
   */
  static _setDefaultConfig(config) {
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
  static _walk(dirPath, callback) {
    const entries = fs.readdirSync(dirPath);

    for (const entry of entries) {
      const entryPath = path.resolve(dirPath, entry);
      const stat = fs.statSync(entryPath);

      if (stat.isFile()) {
        callback(entryPath);
      } else if (stat.isDirectory()) {
        this._walk(entryPath, callback);
      }
    }
  }

  /**
   * Get DocFactory for Javascript file.
   * @param {string} inDirPath - root directory path.
   * @param {string} filePath - target JavaScript file path.
   * @param {string} [packageName] - npm package name of target.
   * @param {string} [mainFilePath] - npm main file path of target.
   * @returns {Object} - return document that is traversed.
   * @property {DocObject[]} results - this is contained JavaScript file.
   * @property {AST} ast - this is AST of JavaScript file.
   * @private
   */
  static _getFactory(inDirPath, filePath, packageName, mainFilePath) {
    log.verbose(`parsing: ${filePath}`);
    let ast;
    try {
      ast = ESParser.parse(filePath);
    } catch (e) {
      InvalidCodeLogger.showFile(filePath, e);
      return {factory: null, ast: null};
    }

    const pathResolver = new PathResolver(inDirPath, filePath, packageName, mainFilePath);
    return {
      factory: new DocFactory(ast, pathResolver, (filePath) => this._getFactory(inDirPath, filePath, packageName, mainFilePath)),
      ast: ast
    };
  }

  /**
   * Traverse doc comment in JavaScript file.
   * @param {string} inDirPath - root directory path.
   * @param {string} filePath - target JavaScript file path.
   * @param {string} [packageName] - npm package name of target.
   * @param {string} [mainFilePath] - npm main file path of target.
   * @returns {Object} - return document that is traversed.
   * @property {DocObject[]} results - this is contained JavaScript file.
   * @property {AST} ast - this is AST of JavaScript file.
   * @private
   */
  static _traverse(inDirPath, filePath, packageName, mainFilePath) {
    const { factory, ast } = this._getFactory(inDirPath, filePath, packageName, mainFilePath);
    if (!factory) return null;

    ASTUtil.traverse(ast, (node, parent) => {
      try {
        factory.push(node, parent);
      } catch (e) {
        InvalidCodeLogger.show(filePath, node);
        throw e;
      }
    });

    return { results: factory.results, ast: ast };
  }

  /**
   * Generate index doc
   * @param {ESDocConfig} config
   * @returns {Tag}
   * @private
   */
  static _generateForIndex(config) {
    const indexContent = fs.readFileSync(config.index, {encode: "utf8"}).toString();
    const tag = {
      kind: "index",
      content: indexContent,
      longname: path.resolve(config.index),
      name: config.index,
      static: true,
      access: "public"
    };

    return tag;
  }

  /**
   * Generate package doc
   * @param {ESDocConfig} config
   * @returns {Tag}
   * @private
   */
  static _generateForPackageJSON(config) {
    let packageJSON = "";
    let packagePath = "";
    try {
      packageJSON = fs.readFileSync(config.package, {encoding: "utf-8"});
      packagePath = path.resolve(config.package);
    } catch (e) {
      // ignore
    }

    const tag = {
      kind: "packageJSON",
      content: packageJSON,
      longname: packagePath,
      name: path.basename(packagePath),
      static: true,
      access: "public"
    };

    return tag;
  }

  /**
   * Resolves duplication docs
   * @param {Tag[]} docs
   * @returns {Tag[]}
   * @private
   */
  static _resolveDuplication(docs) {
    const memberDocs = docs.filter((doc) => doc.kind === "member");
    const removeIds = [];

    for (const memberDoc of memberDocs) {
      // member duplicate with getter/setter/method.
      // when it, remove member.
      // getter/setter/method are high priority.
      const sameLongnameDoc = docs.find((doc) => doc.longname === memberDoc.longname && doc.kind !== "member");
      if (sameLongnameDoc) {
        removeIds.push(memberDoc.__docId__);
        continue;
      }

      const dup = docs.filter((doc) => doc.longname === memberDoc.longname && doc.kind === "member");
      if (dup.length > 1) {
        const ids = dup.map(v => v.__docId__);
        ids.sort((a, b) => {
          return a < b ? -1 : 1;
        });
        ids.shift();
        removeIds.push(...ids);
      }
    }

    return docs.filter((doc) => !removeIds.includes(doc.__docId__));
  }

  /**
   * Publish content
   * @param {ESDocConfig} config
   * @private
   */
  static _publish(config) {
    try {
      const write = (filePath, content, option) => {
        const _filePath = path.resolve(config.destination, filePath);
        content = Plugin.onHandleContent(content, _filePath);

        log.info("write", _filePath);
        fs.outputFileSync(_filePath, content, option);
      };

      const copy = (srcPath, destPath) => {
        const _destPath = path.resolve(config.destination, destPath);
        log.info("copy", _destPath);
        fs.copySync(srcPath, _destPath);
      };

      const read = (filePath) => {
        const _filePath = path.resolve(config.destination, filePath);
        return fs.readFileSync(_filePath).toString();
      };

      Plugin.onPublish(write, copy, read);
    } catch (e) {
      InvalidCodeLogger.showError(e);
      process.exit(1);
    }
  }

  /**
   * Show memory usage statistics.
   * @private
   */
  static _memUsage() {
    const used = process.memoryUsage();
    Object.keys(used).forEach(key => {
      log.verbose(`${key} ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`);
    });
  }
}
