import { Icon, Visibility } from '../../constants/index.ts';
import type { BaseElementProps } from '../base/create-element.ts';
import { Element } from '../base/element.ts';
import { span } from '../base/tags.ts';

export type SortOrder = 'asc' | 'desc';

type Props = Omit<BaseElementProps<HTMLLIElement>, 'tag'>;

type OnChangeHandler = ((order: SortOrder) => void) | null;

export class SortableColumn extends Element<HTMLLIElement> {
  public onChange: OnChangeHandler = null;
  private _sortOrder: SortOrder = 'asc';
  private marker: ReturnType<typeof span>;

  constructor(props?: Props, ...children: (Element | null)[]) {
    super({ tag: 'li', ...props }, ...children);

    this.marker = span({ text: Icon.ArrowDown });
    this.append(this.marker);

    this.init();
  }

  public get sortOrder(): SortOrder {
    return this._sortOrder;
  }

  private get isMarkerVisible(): boolean {
    return this.marker.node.style.visibility !== Visibility.Hidden.toString();
  }

  public set sortOrder(order: SortOrder) {
    this._sortOrder = order;
    this.marker.text = order === 'asc' ? Icon.ArrowDown : Icon.ArrowUp;
    this.onChange?.(order);
  }

  public hideMarker(): void {
    this.showMarker(false);
  }

  private showMarker(flag: boolean): void {
    this.marker.node.style.visibility = flag ? '' : Visibility.Hidden;
  }

  private init(): void {
    this.addListener('click', () => {
      // reveal on click
      if (!this.isMarkerVisible) {
        this.showMarker(true);
        this.onChange?.(this.sortOrder);
      }
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    });
  }
}
