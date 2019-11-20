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
  private _book: any;
  private _rendition: Rendition;
  private _viewer: HTMLDivElement;

  @State() private _bookPath: string | null;

  @Prop() public width: string = "640";
  @Prop() public height: string = "480";

  @Method()
  public async load(url: string): Promise<void> {
    console.log("load");
    this._bookPath = url;
  }

  private _prevButtonClickedHandler() {
    if(this._book.package.metadata.direction === "rtl") {
			this._rendition.next();
		} else {
			this._rendition.prev();
		}
  }

  private _nextButtonClickedHandler() {
		if(this._book.package.metadata.direction === "rtl") {
			this._rendition.prev();
		} else {
			this._rendition.next();
		}
	}

  public render() {
    console.log("render");
    return (
      <div id="main">
        {/* <div id="titlebar"></div> */}
        <div id="prev" class="arrow" onClick={() => this._prevButtonClickedHandler()}>&lt;</div>
        <div
          id="viewer"
          ref={el => (this._viewer = el as HTMLDivElement)}
          style={{
            width: addCssUnits(this.width),
            height: addCssUnits(this.height)
          }}
        ></div>
        <div id="next" class="arrow" onClick={() => this._nextButtonClickedHandler()}>&gt;</div>
      </div>
    );
  }

  private _renderBook() {
    if (this._bookPath) {
      // const book: Book = ePub(this._url, {
      //   openAs: "epub",
      //   encoding: "base64"
      // });
      this._book = ePub(this._bookPath);
      this._rendition = this._book.renderTo(this._viewer, {
        flow: "auto",
        width: this.width,
        height: this.height
      });
      this._rendition.display();
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
