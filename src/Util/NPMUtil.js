"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _path = require("path");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Node Package Manager(npm) util class.
 */
var NPMUtil = function () {
  function NPMUtil() {
    _classCallCheck(this, NPMUtil);
  }

  _createClass(NPMUtil, null, [{
    key: "findPackage",

    /**
     * find esdoc2 package.json object.
     * @returns {Object} package.json object.
     */
    value: function findPackage() {
      var packageObj = null;
      try {
        var packageFilePath = (0, _path.resolve)(__dirname, "../../package.json");
        packageObj = require(packageFilePath);
      } catch (e) {
        var _packageFilePath = (0, _path.resolve)(__dirname, "../../../package.json");
        packageObj = require(_packageFilePath);
      }

      return packageObj;
    }
  }]);

  return NPMUtil;
}();

exports.default = NPMUtil;