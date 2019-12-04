import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Prop,
  Method,
  State
} from "@stencil/core";
import ePub, { Rendition } from "@edsilv/epubjs";
import Book from "@edsilv/epubjs/types/book";
import { Direction } from "./Direction";
import classNames from "classnames";

@Component({
  tag: "uv-ebook-reader",
  styleUrls: ["uv-ebook-reader.css"],
  assetsDirs: ["assets"],
  shadow: false
})
export class UvEbookReader {
  private _book: Book | null = null;
  private _rendition: Rendition | null = null;
  private _viewer: HTMLDivElement;

  @State() private _bookPath: string | null;
  @State() private _bookReady: boolean = false;
  @State() private _prevEnabled: boolean = true;
  @State() private _nextEnabled: boolean = true;
  @State() private _showDivider: boolean = false;

  @Prop() public width: string = "100%";
  @Prop() public height: string = "100%";
  @Prop() public minSpreadWidth: number = 700;

  @Element() el: HTMLElement;

  @Method()
  public async load(url: string): Promise<void> {
    if (this._book) {
      this._book.destroy();
      this._book = null;
      this._rendition = null;
      this._bookReady = false;
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
    this._rendition.display(href);
  }

  @Event() public bookReady: EventEmitter;
  @Event() public loadedBookMetadata: EventEmitter;
  @Event() public loadedNavigation: EventEmitter;
  @Event() public relocated: EventEmitter;
  @Event() public renditionAttached: EventEmitter;

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
    const dividerClasses: string = classNames({
      show: this._bookReady && this._showDivider
    });

    const prevClasses: string = classNames({
      arrow: true,
      disabled: !this._prevEnabled && !this._bookReady
    });

    const viewerClasses: string = classNames({
      twoup: this._showDivider
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
          class={viewerClasses}
          ref={el => (this._viewer = el as HTMLDivElement)}
        ></div>
        {this._nextEnabled ? (
          <div
            id="next"
            class={nextClasses}
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

  private _renderBook(): void {
    if (this._bookPath && !this._rendition) {
      this._book = ePub(this._bookPath);

      this._rendition = this._book.renderTo(this._viewer, {
        flow: "auto",
        width: this.width,
        height: this.height,
        minSpreadWidth: this.minSpreadWidth
      });

      this._rendition.themes.register("custom", {
        "*": {
          "font-family": "'Stix', serif !important",
          "font-variant-numeric": "oldstyle-nums !important"
        }
      });
      this._rendition.themes.select("custom");
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
      });

      this._rendition.on("relocated", location => {
        this._prevEnabled = !location.atStart;
        this._nextEnabled = !location.atEnd;
        this.relocated.emit(location);
      });

      this._book.ready.then(() => {
        this._bookReady = true;
        this.bookReady.emit();
      });

      this._book.loaded.metadata.then(metadata => {
        this.loadedBookMetadata.emit(metadata);
      });

      this._book.loaded.navigation.then(navigation => {
        this.loadedNavigation.emit(navigation);
      });
    }
  }

  public componentDidUpdate(): void {
    this._renderBook();
  }
}
