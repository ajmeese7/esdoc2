import assert from "assert";
import { find } from "../../util";

describe("test/Export/Function:", () => {
  it("Is exported that default export", () => {
    const doc = find("longname", "src/Export/Function.js~testExportFunction1");
    assert.equal(doc.export, true);
  });

  it("Is exported that named export", () => {
    const doc = find("longname", "src/Export/Function.js~testExportFunction2");
    assert.equal(doc.export, true);
  });

  it("Is exported that named export with expression", () => {
    const doc = find("longname", "src/Export/Function.js~testExportFunction3");
    assert.equal(doc.export, true);
  });

  it("Is not exported that non export", () => {
    const doc = find("longname", "src/Export/Function.js~testExportFunction4");
    assert.equal(doc.export, false);
  });

  it("Is not exported that non export with expression", () => {
    const doc = find("longname", "src/Export/Function.js~testExportFunction5");
    assert.equal(doc.export, false);
  });

  it("Is exported that indirect named export", () => {
    const doc = find("longname", "src/Export/Function.js~testExportFunction6");
    assert.equal(doc.export, true);
  });

  it("Is exported that multiple named export", () => {
    const [doc1, doc2] = find("longname",
      "src/Export/Function.js~testExportFunction7",
      "src/Export/Function.js~testExportFunction8"
    );

    assert.equal(doc1.export, true);
    assert.equal(doc2.export, true);
  });
});
