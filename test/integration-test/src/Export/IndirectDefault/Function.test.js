import assert from "assert";
import {find} from "../../../util";

describe("test/Export/IndirectDefault/Function:", () => {
  it("Is exported", () => {
    const doc = find("longname", "src/Export/IndirectDefault/Function.js~testExportIndirectDefaultFunction");
    assert.equal(doc.export, true);
  });
});
