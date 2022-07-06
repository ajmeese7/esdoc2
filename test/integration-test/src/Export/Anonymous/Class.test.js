import assert from "assert";
import { find } from "../../../util";

describe("test/Export/Anonymous/class:", () => {
  it("Is exported", () => {
    const doc = find("longname", "src/Export/Anonymous/Class.js~Class");
    assert.equal(doc.export, true);
  });
});
