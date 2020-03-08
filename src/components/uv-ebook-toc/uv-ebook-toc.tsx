import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Prop
} from "@stencil/core";
import { ITOCItem } from "./ITOCItem";
import { normaliseHref } from "../../utils/utils";

@Component({
  tag: "uv-ebook-toc",
  styleUrl: "uv-ebook-toc.css",
  assetsDir: "assets",
  shadow: false
})
export class UvEbookToc {
  @Prop() public toc: ITOCItem[] = [];
  @Prop({ mutable: true }) public selected: string | null = null;
  @Prop() public disabled: boolean = false;

  @Element() el: HTMLElement;

  @Event() public itemClicked: EventEmitter;

  private _itemClickedHandler(e: MouseEvent): void {
    const link: HTMLLinkElement = e.currentTarget as HTMLLinkElement;
    const href: string = link.getAttribute("href");
    this.selected = link.parentElement.id;
    this.itemClicked.emit(href);
    e.preventDefault();
  }

  public render(): void {
    return (
      <div id="toc" class={{
          disabled: this.disabled
        }}>
        <ul>
          {this.toc.map((item: ITOCItem) => {
            return (
              <li
                id={item.id}
                class={{
                  selected:
                    this.selected === item.href ||
                    (this.selected &&
                      this.selected.indexOf(normaliseHref(item.href)) !== -1)
                }}
              >
                <a href={item.href} onClick={e => this._itemClickedHandler(e)}>
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}
