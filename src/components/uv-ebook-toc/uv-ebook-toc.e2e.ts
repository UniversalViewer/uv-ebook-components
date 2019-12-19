import {
  newE2EPage,
  E2EPage,
  E2EElement
} from "@stencil/core/testing";

describe("uv-ebook-toc", () => {
  let page: E2EPage;
  let el: E2EElement;

  beforeEach(async () => {
    page = await newE2EPage();
    await page.setContent("<uv-ebook-toc></uv-ebook-toc>");
    el = await page.find("uv-ebook-toc");
  });

  it("should render", async () => {
    expect(el).toHaveClass("hydrated");
  });

  it("should have a toc element", async () => {
    await page.$eval("uv-ebook-toc", async(elm: any) => {
      elm.toc = [{"id":"titlepage.xhtml","href":"titlepage.xhtml","label":"Title Page","subitems":[]},{"id":"chapter_001.xhtml","href":"chapter_001.xhtml","label":"Down The Rabbit-Hole","subitems":[]},{"id":"chapter_002.xhtml","href":"chapter_002.xhtml","label":"The Pool Of Tears","subitems":[]},{"id":"chapter_003.xhtml","href":"chapter_003.xhtml","label":"A Caucus-Race And A Long Tale","subitems":[]},{"id":"chapter_004.xhtml","href":"chapter_004.xhtml","label":"The Rabbit Sends In A Little Bill","subitems":[]},{"id":"chapter_005.xhtml","href":"chapter_005.xhtml","label":"Advice From A Caterpillar","subitems":[]},{"id":"chapter_006.xhtml","href":"chapter_006.xhtml","label":"Pig And Pepper","subitems":[]},{"id":"chapter_007.xhtml","href":"chapter_007.xhtml","label":"A Mad Tea-Party","subitems":[]},{"id":"chapter_008.xhtml","href":"chapter_008.xhtml","label":"The Queen's Croquet Ground","subitems":[]},{"id":"chapter_009.xhtml","href":"chapter_009.xhtml","label":"Who Stole The Tarts?","subitems":[]},{"id":"chapter_010.xhtml","href":"chapter_010.xhtml","label":"Alice's Evidence","subitems":[]}];
    });
    await page.waitForChanges();
    const toc: E2EElement = await page.find("#toc");
    expect(toc).toBeDefined();
  });

});
