import assert from "assert";
import {find} from "../../util";

describe("test/Async/Async:", () => {
  it("Is an async method", () => {
    const doc = find("longname", "src/Async/Async.js~TestAsync#methodAsync");
    assert.equal(doc.async, true);
  });

  it("Is an async function", () => {
    const doc = find("longname", "src/Async/Async.js~testAsyncFunction");
    assert.equal(doc.async, true);
  });
});
