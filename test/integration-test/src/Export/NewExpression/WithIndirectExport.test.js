import assert from "assert";
import {find} from "../../../util";

describe("test/Export/NewExpression/WithIndirectExport", () => {
  it("Is exported", () => {
    const doc = find("longname", "src/Export/NewExpression/WithIndirectExport.js~testExportNewExpressionIndirect");
    assert.equal(doc.export, true);
  });
});
