import assert from "assert";
import { find } from "../../util";

describe("test/Access/Method:", () => {
  it("Is public", () => {
    const doc = find("longname", "src/Access/Method.js~TestAccessMethod#methodPublic");
    assert.equal(doc.access, "public");
  });

  it("Is protected", () => {
    const doc = find("longname", "src/Access/Method.js~TestAccessMethod#methodProtected");
    assert.equal(doc.access, "protected");
  });

  it("Is private", () => {
    const doc = find("longname", "src/Access/Method.js~TestAccessMethod#methodPrivate");
    assert.equal(doc.access, "private");
  });
});
