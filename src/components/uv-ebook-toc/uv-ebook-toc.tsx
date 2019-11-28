import { Component, Element, Event, EventEmitter, h, Prop } from "@stencil/core";
import { ITOCItem } from "./ITOCItem";

@Component({
  tag: "uv-ebook-toc",
  styleUrls: ["uv-ebook-toc.css"],
  assetsDirs: ["assets"],
  shadow: false
})
export class UvEbookToc {

  @Prop() public toc: ITOCItem[] = [];

  @Element() el: HTMLElement;

  @Event() public itemClicked: EventEmitter;

  private _itemClickedHandler(e: MouseEvent): void {
    const href: string = (e.currentTarget as HTMLElement).getAttribute("href");
    this.itemClicked.emit(href);
    e.preventDefault();
  }

  public render(): void {
    return (
      <div id="tocView" class="view">
        <ul>
          {
            this.toc.map((item: ITOCItem) => {
              return <li id={item.id} class="list_item">
                <a href={item.href} class="toc_link" onClick={e => this._itemClickedHandler(e)}>{item.label}</a>
              </li>;
            })
          }
        </ul>
      </div>
    );
  }
}
