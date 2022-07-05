import assert from "assert";
import {find} from "../../util";

describe("test/Access/Member:", () => {
  it("Is public", () => {
    const doc = find("longname", "src/Access/Member.js~TestAccessMember#mPublic");
    assert.equal(doc.access, "public");
  });

  it("Is protected", () => {
    const doc = find("longname", "src/Access/Member.js~TestAccessMember#mProtected");
    assert.equal(doc.access, "protected");
  });

  it("Is private", () => {
    const doc = find("longname", "src/Access/Member.js~TestAccessMember#mPrivate");
    assert.equal(doc.access, "private");
  });
});
