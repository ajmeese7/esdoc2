import assert from "assert";
import { find } from "../../../util";

describe("test/Export/IndirectDefault/Class:", () => {
  it("Is exported", () => {
    const doc = find("longname", "src/Export/IndirectDefault/Class.js~TestExportIndirectDefaultClass");
    assert.equal(doc.export, true);
  });
});
