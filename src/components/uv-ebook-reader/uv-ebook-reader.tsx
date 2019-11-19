import { Component, h, Prop, Method, State } from "@stencil/core";
import ePub, { Book, Rendition } from "@edsilv/epubjs";
// import ePub, { Book, Rendition } from "../../epub.js";
// import "../../../node_modules/jszip/lib/";
import { addCssUnits } from "../../utils/utils";

@Component({
  tag: "uv-ebook-reader",
  styleUrl: "uv-ebook-reader.css",
  shadow: false
})
export class UvEbookReader {
  private _reader: HTMLDivElement;

  @State() private _url: string | null;

  @Prop() public width: string = "640";
  @Prop() public height: string = "480";

  @Method()
  public async load(url: string): Promise<void> {
    console.log("load");
    this._url = url;
  }

  public render() {
    console.log("render");
    return (
      <div
        id="reader"
        ref={el => (this._reader = el as HTMLDivElement)}
        style={{
          width: addCssUnits(this.width),
          height: addCssUnits(this.height)
        }}
      ></div>
    );
  }

  private _renderBook() {
    if (this._url) {
      // const book: Book = ePub(this._url, {
      //   openAs: "epub",
      //   encoding: "base64"
      // });
      const book: Book = ePub(this._url);
      const rendition: Rendition = book.renderTo(this._reader, {
        width: this.width,
        height: this.height
      });
      rendition.display();
      // const displayed = rendition.display();
    }
  }

  public componentDidLoad() {
    this._renderBook();
  }

  public componentDidUpdate() {
    this._renderBook();
  }
}
