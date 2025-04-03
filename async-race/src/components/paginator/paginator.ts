import type { Button } from '../base/button.ts';
import { Element } from '../base/element.ts';
import { createView } from './utils/create-view.ts';

import styles from './paginator.module.scss';

const START_PAGE_NUMBER = 1;
const MIN_ITEMS_PER_PAGE = 1;
const MIN_TOTAL_ITEMS = 1;

type OnChangeHandler = ((newPage: number) => void) | null;

export class Paginator extends Element<HTMLDivElement> {
  public onChange: OnChangeHandler = null;
  private totalPagesRef: Element<HTMLSpanElement>;
  private currentPageRef: Element<HTMLSpanElement>;
  private next: Button;
  private previous: Button;
  private _currentPage: number = 1;
  private _totalItems: number = 1;
  private _itemsPerPage: number = 1;

  constructor() {
    super({ className: styles.wrapper });

    const { buttonNext, buttonPrevious, currentPage, totalPages, counterWrapper } = createView();

    this.totalPagesRef = totalPages;
    this.currentPageRef = currentPage;
    this.next = buttonNext;
    this.previous = buttonPrevious;

    this.append(buttonPrevious, counterWrapper, buttonNext);
    this.init();
  }

  public get totalPages(): number {
    return Math.ceil(this._totalItems / this._itemsPerPage);
  }

  public get currentPage(): number {
    return this._currentPage;
  }

  public set currentPage(value: number) {
    value = Math.ceil(Math.max(value, START_PAGE_NUMBER));
    this._currentPage = Math.min(value, this.totalPages);
    this.update();
  }

  public set itemsPerPage(value: number) {
    value = Math.ceil(Math.max(value, MIN_ITEMS_PER_PAGE));
    this._itemsPerPage = value;

    this._currentPage = Math.min(this._currentPage, this.totalPages);
    this.update();
  }

  public set totalItems(value: number) {
    value = Math.ceil(Math.max(value, MIN_TOTAL_ITEMS));

    this._totalItems = value;
    this.totalPagesRef.text = this.totalPages.toString();

    this._currentPage = Math.min(this._currentPage, this.totalPages);
    this.update();
  }

  public set disabled(flag: boolean) {
    if (flag) {
      this.next.disabled = flag;
      this.previous.disabled = flag;
    } else {
      this.update();
    }
  }

  private updateCurrentPageView(): void {
    const currentPageNumber = this.currentPageRef.text;
    const newPageNumber = this._currentPage.toString();

    if (currentPageNumber !== newPageNumber) {
      this.currentPageRef.text = this._currentPage.toString();
      this.onChange?.(Number(newPageNumber));
    }
  }

  private update(): void {
    const { next, previous } = this;
    previous.disabled = this._currentPage === START_PAGE_NUMBER;
    next.disabled = this._currentPage === this.totalPages;
    this.updateCurrentPageView();
  }

  private addNextClickHandler(): void {
    const { next } = this;
    next.onClick = (): void => {
      this._currentPage = Math.min(this._currentPage + 1, this.totalPages);
      this.update();
    };
  }

  private addPrevClickHandler(): void {
    const { previous } = this;
    previous.onClick = (): void => {
      this._currentPage = Math.max(this._currentPage - 1, START_PAGE_NUMBER);
      this.update();
    };
  }

  private init(): void {
    this.addNextClickHandler();
    this.addPrevClickHandler();
  }
}
