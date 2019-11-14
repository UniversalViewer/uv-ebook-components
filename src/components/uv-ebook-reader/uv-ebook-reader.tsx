import { Component, h, Prop } from "@stencil/core";
import ePub, { Book, Rendition } from "epubjs";
import { addCssUnits } from "../../utils/utils";

@Component({
  tag: "uv-ebook-reader",
  styleUrl: "uv-ebook-reader.css",
  shadow: false
})
export class UvEbookReader {
  private _reader: HTMLDivElement;

  @Prop() public url: string;
  @Prop() public width: string = "640";
  @Prop() public height: string = "480";

  public render() {
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
    const book: Book = ePub(this.url);
    const rendition: Rendition = book.renderTo(this._reader, {
      width: this.width,
      height: this.height
    });
    rendition.display();
    // const displayed = rendition.display();
  }

  public componentDidLoad() {
    this._renderBook();
  }

  public componentDidUpdate() {
    this._renderBook();
  }
}
