import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Prop,
  Method,
  State,
  Listen
} from "@stencil/core";
import ePub, { Rendition } from "@universalviewer/epubjs";
import Book from "@universalviewer/epubjs/types/book";
import { Direction } from "./Direction";
import { waitFor } from "../../utils/utils";

@Component({
  tag: "uv-ebook-reader",
  styleUrl: "uv-ebook-reader.css",
  assetsDir: "assets",
  shadow: false
})
export class UvEbookReader {
  private _book: Book | null = null;
  private _rendition: Rendition | null = null;
  private _viewer: HTMLDivElement;
  private _href: string | null = null;

  @State() private _bookPath: string | null;
  @State() private _bookReady: boolean = false;
  @State() private _prevEnabled: boolean = true;
  @State() private _mobile: boolean = false;
  @State() private _nextEnabled: boolean = true;
  @State() private _showDivider: boolean = false;

  @Prop() public width: string = "100%";
  @Prop() public height: string = "100%";
  @Prop() public mobileWidth: number = 300;
  @Prop() public minSpreadWidth: number = 800;

  @Element() el: HTMLElement;

  @Method()
  public async load(url: string): Promise<void> {
    if (this._book) {
      this._book.destroy();
      this._book = null;
      this._rendition = null;
      this._bookReady = false;
      this._href = null;
    }

    this._bookPath = url;
  }

  @Method()
  public async resize(): Promise<void> {
    if (this._bookReady) {
      this._rendition.resize(
        this._viewer.clientWidth,
        this._viewer.clientHeight
      );
    }
  }

  @Method()
  public async display(href: string): Promise<void> {
    if (this._href !== href) {
      waitFor(
        () => {
          return this._bookReady;
        },
        () => {
          this._href = href;
          try {
            this._rendition.display(href);
          } catch (e) {
            console.warn("unable to display", href);
          }
        }
      );
    }
  }

  @Method()
  public async getBook(): Promise<any> {
    if (!this._bookReady) throw "Book is not ready yet.";

    return this._book;
  }

  @Event() public bookReady: EventEmitter;
  @Event() public loadedBookMetadata: EventEmitter;
  @Event() public loadedNavigation: EventEmitter;
  @Event() public relocated: EventEmitter;
  @Event() public renditionAttached: EventEmitter;

  @Listen("keydown", { target: "window" })
  handleKeyDown(ev: KeyboardEvent): void {
    switch (ev.key) {
      case "ArrowLeft":
        this._prev();
        break;
      case "ArrowRight":
        this._next();
        break;
    }
  }

  private _prev(): void {
    if (!this._bookReady) {
      return;
    }
    if (this._book.package.metadata.direction === Direction.RTL) {
      this._rendition.next();
    } else {
      this._rendition.prev();
    }
  }

  private _next(): void {
    if (!this._bookReady) {
      return;
    }
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
    return (
      <div id="main">
        <div id="titlebar"></div>
        <div
          id="divider"
          class={{
            show: this._bookReady && this._showDivider
          }}
        ></div>
        <div
          id="prev"
          class={{
            arrow: true,
            disabled: !this._prevEnabled && !this._bookReady,
            small: this._mobile
          }}
          onClick={e => this._prevButtonClickedHandler(e)}
        >
          &lt;
        </div>
        <div
          id="viewer"
          class={{
            twoup: this._showDivider
          }}
          ref={el => (this._viewer = el as HTMLDivElement)}
        ></div>
        {this._nextEnabled ? (
          <div
            id="next"
            class={{
              arrow: true,
              disabled: !this._nextEnabled && !this._bookReady,
              small: this._mobile
            }}
            onClick={e => this._nextButtonClickedHandler(e)}
          >
            &gt;
          </div>
        ) : null}
        {!this._bookReady && (
          <div id="spinner">
            <div class="square" />
          </div>
        )}
      </div>
    );
  }

  public componentDidUpdate(): void {
    if (this._bookPath && !this._rendition) {
      this._book = ePub(this._bookPath);

      this._rendition = this._book.renderTo("viewer", {
        width: this.width,
        height: this.height,
        minSpreadWidth: this.minSpreadWidth
      });

      this._rendition.display();

      this._rendition.on("attached", () => {
        this.renditionAttached.emit();
      });

      this._rendition.on("layout", () => {
        if (this._viewer.clientWidth >= this.minSpreadWidth) {
          this._showDivider = true;
        } else {
          this._showDivider = false;
        }
        this._mobile = this._viewer.clientWidth <= this.mobileWidth;
      });

      this._rendition.on("relocated", location => {
        this._prevEnabled = !location.atStart;
        this._nextEnabled = !location.atEnd;
        this.relocated.emit(location);
      });

      this._book.ready.then(() => {
        this._bookReady = true;
        this.bookReady.emit(this._bookPath);
      });

      this._book.loaded.metadata.then(metadata => {
        this.loadedBookMetadata.emit(metadata);
      });

      this._book.loaded.navigation.then(navigation => {
        this.loadedNavigation.emit(navigation);
      });
    }
  }
}
