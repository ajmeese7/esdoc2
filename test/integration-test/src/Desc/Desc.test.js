import assert from "assert";
import { find } from "../../util";

describe("test/Desc/Desc:", () => {
  it("Has class description", () => {
    const doc = find("longname", "src/Desc/Desc.js~TestDescClass");
    assert.equal(doc.description, "this is TestDescClass.");
  });

  it("Has constructor description", () => {
    const doc = find("longname", "src/Desc/Desc.js~TestDescClass#constructor");
    assert.equal(doc.description, "this is constructor.");
  });

  it("Has member description", () => {
    const doc = find("longname", "src/Desc/Desc.js~TestDescClass#memberDesc");
    assert.equal(doc.description, "this is memberDesc.");
  });

  it("Has method description", () => {
    const doc = find("longname", "src/Desc/Desc.js~TestDescClass#methodDesc");
    assert.equal(doc.description, "this is methodDesc.");
  });

  it("Has getter description", () => {
    const doc = find("longname", "src/Desc/Desc.js~TestDescClass#getterDesc");
    assert.equal(doc.description, "this is getterDesc.");
  });

  it("Has setter description", () => {
    const doc = find("longname", "src/Desc/Desc.js~TestDescClass#setterDesc");
    assert.equal(doc.description, "this is setterDesc.");
  });

  it("Has function description", () => {
    const doc = find("longname", "src/Desc/Desc.js~testDescFunction");
    assert.equal(doc.description, "this is testDescFunction.");
  });

  it("Has variable description", () => {
    const doc = find("longname", "src/Desc/Desc.js~testDescVariable");
    assert.equal(doc.description, "this is testDescVariable.");
  });

  it("Has typedef description", () => {
    const doc = find("longname", "src/Desc/Desc.js~TestDescTypedef");
    assert.equal(doc.description, "this is TestDescTypedef.");
  });

  it("Has external description", () => {
    const doc = find("longname", "src/Desc/Desc.js~TestDescExternal");
    assert.equal(doc.description, "this is TestDescExternal.");
  });
});
