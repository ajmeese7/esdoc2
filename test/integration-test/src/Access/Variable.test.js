import assert from "assert";
import { find } from "../../util";

describe("test/Access/Variable:", () => {
  it("Is public", () => {
    const doc = find("longname", "src/Access/Variable.js~testAccessVariablePublic");
    assert.equal(doc.access, "public");
  });

  it("Is protected", () => {
    const doc = find("longname", "src/Access/Variable.js~testAccessVariableProtected");
    assert.equal(doc.access, "protected");
  });

  it("Is private", () => {
    const doc = find("longname", "src/Access/Variable.js~testAccessVariablePrivate");
    assert.equal(doc.access, "private");
  });
});
