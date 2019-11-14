import { addCssUnits } from "./Utils";

describe("css units", () => {
  test("should return a default width in pixels", () => {
    const width: string = "640";
    const formatted: string = addCssUnits(width);
    expect(formatted).toBe("640px");
  });

  test("should return the same percentage width", () => {
    const width: string = "100%";
    const formatted: string = addCssUnits(width);
    expect(formatted).toBe("100%");
  });
});
