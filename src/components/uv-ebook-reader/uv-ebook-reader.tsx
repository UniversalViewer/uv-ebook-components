import { Component, Element, h, Prop, Method, State } from "@stencil/core";
import ePub, { Rendition } from "@edsilv/epubjs";
// import { addCssUnits } from "../../utils/utils";
import Book from "@edsilv/epubjs/types/book";
import { Direction } from "./Direction";
import classNames from "classnames";

@Component({
  tag: "uv-ebook-reader",
  styleUrls: ["normalize.css", "uv-ebook-reader.css"],
  assetsDirs: ["assets"],
  shadow: false
})
export class UvEbookReader {
  private _book: Book;
  private _rendition: Rendition;
  private _viewer: HTMLDivElement;

  @State() private _bookPath: string | null;
  @State() private _bookReady: boolean = false;
  @State() private _prevEnabled: boolean = true;
  @State() private _nextEnabled: boolean = true;
  @State() private _showDivider: boolean = false;

  @Prop() public width: string = "100%";
  @Prop() public height: string = "100%";

  @Element() el: HTMLElement;

  @Method()
  public async load(url: string): Promise<void> {
    this._bookPath = url;
  }

  @Method()
  public async resize(): Promise<void> {
    this._rendition.resize(this.el.clientWidth, this.el.clientHeight);
  }

  private _prev(): void {
    if (!this._bookReady) { return; }
    if (this._book.package.metadata.direction === Direction.RTL) {
      this._rendition.next();
    } else {
      this._rendition.prev();
    }
  }

  private _next(): void {
    if (!this._bookReady) { return; }
    if (this._book.package.metadata.direction === Direction.RTL) {
      this._rendition.prev();
    } else {
      this._rendition.next();
    }
  }

  private _prevButtonClickedHandler(e: MouseEvent): void {
    this._prev();
    e.preventDefault();
  }

  private _nextButtonClickedHandler(e: MouseEvent): void {
    this._next();
    e.preventDefault();
  }

  public render(): void {

    const dividerClasses: string = classNames({
      show: this._showDivider
    });

    const prevClasses: string = classNames({
      arrow: true,
      disabled: !this._prevEnabled && !this._bookReady
    });

    const nextClasses: string = classNames({
      arrow: true,
      disabled: !this._nextEnabled && !this._bookReady
    });

    return (
      <div id="main">
        <div id="titlebar"></div>
        <div id="divider" class={dividerClasses}></div>
        <div
          id="prev"
          class={prevClasses}
          onClick={e => this._prevButtonClickedHandler(e)}
        >
          &lt;
        </div>
        <div
          id="viewer"
          ref={el => (this._viewer = el as HTMLDivElement)}
        ></div>
        {
          this._nextEnabled ? (
            <div
              id="next"
              class={nextClasses}
              onClick={e => this._nextButtonClickedHandler(e)}
            >
              &gt;
            </div>
          ) : null
        }
      </div>
    );
  }

  private _renderBook(): void {
    if (this._bookPath && !this._rendition) {
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

      this._rendition.on("layout", (props) => {
        if(props.spread === true) {
          this._showDivider = true;
        } else {
          this._showDivider = false;
        }
      });

      this._rendition.on("relocated", (location) => {
        this._prevEnabled = !location.atStart;
        this._nextEnabled = !location.atEnd;
      });

      this._book.ready.then(() => {
        this._bookReady = true;
      });
    }
  }

  public componentDidUpdate(): void {
    this._renderBook();
  }
}
