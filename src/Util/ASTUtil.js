import babelTraverse from "babel-traverse";
import { name } from "../Factory/DocFactory";

/**
 * Utility for AST.
 */
export default class ASTUtil {
  /**
   * Sanitize node.
   * Change node type to `Identifier` and empty comment.
   * @param {ASTNode} node - target node.
   */
  static sanitize(node) {
    if (!node) return;
    node.type = "Identifier";
    node.name = "_";
    node.leadingComments = [];
    node.trailingComments = [];
  }

  /**
   * Traverse AST nodes.
   * @param {AST} ast - target AST.
   * @param {function(node: Object, parent: Object, path: Object)} callback - this is called with each node.
   */
  static traverse(ast, callback) {
    babelTraverse(ast, {
      noScope: true,
      enter: function(path) {
        callback(path.node, path.parent, path);
      }
    });
  }

  /**
   * Find file path in import declaration by name.
   * e.g. can find `./foo/bar.js` from `import Bar from "./foo/bar.js"` by `Bar`.
   * @param {AST} ast - target AST.
   * @param {string} name - identifier name.
   * @returns {string|null} file path.
   */
  static findPathInImportDeclaration(ast, name) {
    let path = null;

    babelTraverse(ast, {
      noScope: true,
      enter: function(_path) {
        const node = _path.node;
        if (node.type !== "ImportDeclaration") return;

        for (const spec of node.specifiers) {
          const localName = spec.local.name;
          if (localName === name) {
            path = node.source.value;
            _path.stop();
          }
        }
      }
    });

    return path;
  }

  /**
   * Find VariableDeclaration node which has NewExpression.
   * @param {string} name - variable name.
   * @param {AST} ast - find in this ast.
   * @returns {ASTNode|null} found ast node.
   */
  static findVariableDeclarationAndNewExpressionNode(name, ast) {
    if (!name) return null;

    for (const node of ast.program.body) {
      if (node.type === "VariableDeclaration" &&
        node.declarations[0].init &&
        node.declarations[0].init.type === "NewExpression" &&
        node.declarations[0].id.name === name) {
        return node;
      }
    }

    return null;
  }

  /**
   * Find ClassDeclaration node.
   * @param {string} name - class name.
   * @param {AST} ast - find in this ast.
   * @returns {{classNode: ASTNode|null, exported: boolean|null}} found ast node.
   */
  static findClassDeclarationNode(name, ast) {
    if (!name) return { classNode: null, exported: null };

    for (const node of ast.program.body) {
      if (
        node.type === "ClassDeclaration" &&
        node.id.name === name
      ) return { classNode: node, exported: false };

      if (
        node.type === "ExportDefaultDeclaration" ||
        node.type === "ExportNamedDeclaration"
      ) {
        if (
          node.declaration &&
          node.declaration.type === "ClassDeclaration" &&
          node.declaration.id &&
          node.declaration.id.name === name
        ) return { classNode: node, exported: true };
      }
    }

    return {classNode: null, exported: null};
  }

  /**
   * Find FunctionDeclaration node.
   * @param {string} name - function name.
   * @param {AST} ast - find in this ast.
   * @returns {ASTNode|null} found ast node.
   */
  static findFunctionDeclarationNode(name, ast) {
    if (!name) return null;

    for (const node of ast.program.body) {
      if (node.type === "FunctionDeclaration" && node.id.name === name) return node;
    }

    return null;
  }

  /**
   * Find VariableDeclaration node.
   * @param {string} name - variable name.
   * @param {AST} ast - find in this ast.
   * @returns {ASTNode|null} found ast node.
   */
  static findVariableDeclarationNode(name, ast) {
    if (!name) return null;

    for (const node of ast.program.body) {
      if (node.type === "VariableDeclaration" && node.declarations[0].id.name === name) return node;
    }

    return null;
  }

  /**
   * Find ImportDeclaration node.
   * @param {string} name - variable name.
   * @param {AST} ast - find in this ast.
   * @returns {ASTNode|null} found ast node.
   */
   static findImportDeclarationNode(name, ast) {
    if (!name) return null;

    for (const node of ast.program.body) {
      if (node.type === "ImportDeclaration" && node.specifiers.some(spec => spec.local.name === name)) return node;
    }

    return null;
  }

  static findExportInAst(n, ast) {
    for (const exportNode of ast.program.body) {
      if (exportNode.type === "ExportNamedDeclaration" && exportNode.declaration && exportNode.declaration[name] === n) {
        return exportNode;
      } else if (exportNode.type === "ExportDefaultDeclaration" && n === "default") {
        return exportNode;
      }
    }
    return null;
  }

  /**
   * Create VariableDeclaration node which has NewExpression.
   * @param {string} name - variable name.
   * @param {string} className - class name.
   * @param {Object} loc - location.
   * @returns {ASTNode} created node.
   */
  static createVariableDeclarationAndNewExpressionNode(name, className, loc) {
    return {
      type: "VariableDeclaration",
      kind: "let",
      loc: loc,
      declarations: [
        {
          type: "VariableDeclarator",
          id: {type: "Identifier", name: name},
          init: {type: "NewExpression", callee: {type: "Identifier", name: className}}
        }
      ]
    };
  }

  // /**
  //  * flatten name of MemberExpression.
  //  * @param {ASTNode} memberExpression - MemberExpression Node.
  //  * @returns {string} flatten node name.
  //  */
  // static flattenMemberExpression(memberExpression) {
  //   const names = [];
  //   let object = memberExpression;
  //   while (object) {
  //     if (object.name) {
  //       names.push(object.name);
  //       break;
  //     } else {
  //       names.push(object.property.name);
  //       object = object.object;
  //     }
  //   }
  //   return names.reverse().join(".");
  // }
}
