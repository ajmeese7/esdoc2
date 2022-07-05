import assert from "assert";
import {find} from "../../util";

describe("test/Export/Variable:", () => {
  it("Is exported that default export", () => {
    const doc = find("longname", "src/Export/Variable.js~testExportVariable1");
    assert.equal(doc.export, true);
  });

  it("Is exported that named export", () => {
    const doc = find("longname", "src/Export/Variable.js~testExportVariable2");
    assert.equal(doc.export, true);
  });

  it("Is not exported that non export", () => {
    const doc = find("longname", "src/Export/Variable.js~testExportVariable3");
    assert.equal(doc.export, false);
  });

  it("Is exported that indirect named export", () => {
    const doc = find("longname", "src/Export/Variable.js~testExportVariable4");
    assert.equal(doc.export, true);
  });

  it("Is exported that multiple named export", () => {
    const [doc1, doc2] = find("longname",
      "src/Export/Variable.js~testExportVariable5",
      "src/Export/Variable.js~testExportVariable6"
    );

    assert.equal(doc1.export, true);
    assert.equal(doc2.export, true);
  });

  describe("array destructuring name export", () => {
    it("Is export that first", () => {
      const doc = find("longname", "src/Export/Variable.js~testExportVariable7");
      assert.equal(doc.export, true);
    });

    xit("Is export that second", () => {
      // const doc = find("longname", "src/Export/Variable.js~testExportVariable8");
      // assert.equal(doc.export, true);
    });
  });

  describe("object destructuring name export", () => {
    it("Is export that first", () => {
      const doc = find("longname", "src/Export/Variable.js~testExportVariable9");
      assert.equal(doc.export, true);
    });

    xit("Is export that second", () => {
      // const doc = find("longname", "src/Export/Variable.js~testExportVariable10");
      // assert.equal(doc.export, true);
    });
  });
});
