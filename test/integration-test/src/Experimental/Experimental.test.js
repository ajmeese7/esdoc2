import assert from "assert";
import { find } from "../../util";

describe("test/Experimental/Experimental:", () => {
  it("Has experimental with description", () => {
    const doc = find("longname", "src/Experimental/Experimental.js~TestExperimental");
    assert.equal(doc.experimental, "this is experimental");
  });

  it("Has experimental without description", () => {
    const doc = find("longname", "src/Experimental/Experimental.js~TestExperimental#methodExperimental");
    assert.equal(doc.experimental, true);
  });
});
