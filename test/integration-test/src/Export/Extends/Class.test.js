import assert from "assert";
import { find } from "../../../util";

describe("test/Export/Extends/class", () => {
  it("Is not exported that inner class", () => {
    const doc = find("longname", "src/Export/Extends/Class.js~TestExportExtendsClassInner");
    assert.equal(doc.export, false);
  });

  it("Is exported that outer class", () => {
    const doc = find("longname", "src/Export/Extends/Class.js~TestExportExtendsClass");
    assert.equal(doc.export, true);
  });
});
