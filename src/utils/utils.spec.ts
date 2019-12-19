import { addCssUnits, normaliseHref } from "./utils";

describe("utils", () => {
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

  test("should normalise hrefs", () => {
    const href: string = "../xhtml/asdf.html#123";
    const normalised: string = normaliseHref(href);
    expect(normalised).toBe("xhtml/asdf.html");
  });
});
