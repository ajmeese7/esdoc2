import assert from "assert";
import {find} from "../../util";

describe("test/Access/Function:", () => {
  it("Is public", () => {
    const doc = find("longname", "src/Access/Function.js~testAccessFunctionPublic");
    assert.equal(doc.access, "public");
  });

  it("Is protected", () => {
    const doc = find("longname", "src/Access/Function.js~testAccessFunctionProtected");
    assert.equal(doc.access, "protected");
  });

  it("Is private", () => {
    const doc = find("longname", "src/Access/Function.js~testAccessFunctionPrivate");
    assert.equal(doc.access, "private");
  });
});
