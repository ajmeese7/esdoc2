import assert from "assert";
import { find } from "../../util";

describe("test/Access/Class:", () => {
  it("Is public", () => {
    const doc = find("longname", "src/Access/Class.js~TestAccessClassPublic");
    assert.equal(doc.access, "public");
  });

  it("Is protected", () => {
    const doc = find("longname", "src/Access/Class.js~TestAccessClassProtected");
    assert.equal(doc.access, "protected");
  });

  it("Is private", () => {
    const doc = find("longname", "src/Access/Class.js~TestAccessClassPrivate");
    assert.equal(doc.access, "private");
  });
});
