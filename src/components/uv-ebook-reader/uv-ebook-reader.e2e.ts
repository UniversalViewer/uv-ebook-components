import {
  newE2EPage,
  E2EPage,
  E2EElement,
  EventSpy
} from "@stencil/core/testing";

describe("uv-ebook-reader", () => {
  let page: E2EPage;
  let el: E2EElement;
  const bookPath: string =
    "https://ebook-test-manifests.netlify.com/collection/childrens-media-query/childrens-media-query.epub";

  beforeEach(async () => {
    page = await newE2EPage();
    await page.setContent("<uv-ebook-reader></uv-ebook-reader>");
    el = await page.find("uv-ebook-reader");
  });

  it("should render", async () => {
    expect(el).toHaveClass("hydrated");
    const spinner: E2EElement = await page.find("#spinner");
    expect(spinner).toBeDefined();
  });

  it("should emit a bookReady event", async () => {
    const bookReady: EventSpy = await page.spyOnEvent("bookReady");
    await el.callMethod("load", bookPath);
    await page.waitForEvent("bookReady");
    expect(bookReady).toHaveReceivedEventDetail(bookPath);
  });
});
