import { newE2EPage, E2EPage, E2EElement } from "@stencil/core/testing";

describe("uv-ebook-reader", () => {
  it("renders", async () => {
    const page: E2EPage = await newE2EPage();

    await page.setContent("<uv-ebook-reader></uv-ebook-reader>");
    const element: E2EElement = await page.find("uv-ebook-reader");
    expect(element).toHaveClass("hydrated");
  });

  it("renders an ebook", async () => {
    const page: E2EPage = await newE2EPage();

    await page.setContent("<uv-ebook-reader></uv-ebook-reader>");
    const component: E2EElement = await page.find("uv-ebook-reader");
    const element: E2EElement = await page.find("uv-ebook-reader >>> div");

    component.setProperty("url", "https://s3.amazonaws.com/epubjs/books/alice/OPS/package.opf");
    await page.waitForChanges();
    expect(element.textContent).toEqual(`Hello, World!`);
  });
});
