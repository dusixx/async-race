import { EventName, isError } from '@common';
import type { Paginator, SortableColumn } from '@components';
import { Element } from '@components';
import type { SortOrder } from '@components/sortable-column/sortable-column.types.ts';
import * as api from '@services/api';
import type { WinnerData } from '@services/api/winners/winners-api.types.ts';
import { createView, createWinnersTableContent } from './create-view/create-view.ts';
import type { WinnerTableRowData } from './create-view/create-view.types.ts';

const WINNERS_PER_PAGE = 10;
const DEFAULT_PAGE_NUMBER = 1;
const INITIAL_SORT_ORDER = 'asc';
const INITIAL_SORT_COLUMN = 'wins';

export class Winners extends Element {
  private paginator: Paginator;
  private winnersCounter: Element<HTMLSpanElement>;
  private winsColumn: SortableColumn;
  private timeColumn: SortableColumn;
  private tableContentWrapper: Element<HTMLDivElement>;
  private sortOrder: SortOrder = INITIAL_SORT_ORDER;
  private sortColumn: 'wins' | 'time' = INITIAL_SORT_COLUMN;

  constructor() {
    super({ tag: 'section' });

    const { wrapper, paginator, winnersCounter, winsColumn, timeColumn, tableContentWrapper } =
      createView();

    this.paginator = paginator;
    paginator.itemsPerPage = WINNERS_PER_PAGE;

    this.winnersCounter = winnersCounter;
    this.winsColumn = winsColumn;
    this.timeColumn = timeColumn;
    this.tableContentWrapper = tableContentWrapper;

    this.append(wrapper);
    this.init();

    void this.fetchWinnersData();
  }

  private async fetchWinnersData(pageNumber?: number): Promise<void> {
    pageNumber = pageNumber || DEFAULT_PAGE_NUMBER;

    try {
      const { items, totalCount } = await api.getAllWinners({
        _limit: WINNERS_PER_PAGE,
        _page: pageNumber,
        _sort: this.sortColumn,
        _order: this.sortOrder,
      });
      this.winnersCounter.text = totalCount.toString();
      this.paginator.totalItems = totalCount;
      this.paginator.currentPage = pageNumber;
      void this.updateTableContent(items);
    } catch (error) {
      if (isError(error)) {
        console.debug(`fetchWinnersData: ${error.message}`);
      }
    }
  }

  private async updateTableContent(items: WinnerData[]): Promise<void> {
    const rowsData: WinnerTableRowData[] = [];
    const carData = await Promise.all(items.map(({ id }) => api.getCar(id)));

    items.forEach((winnerData, index) => {
      if (carData[index]) {
        rowsData.push({ ...winnerData, ...carData[index] });
      }
    });
    const content = createWinnersTableContent(rowsData);
    this.tableContentWrapper.removeChildren();
    this.tableContentWrapper.append(content);
  }

  private sortWinners = (order: SortOrder): void => {
    this.sortOrder = order;
    void this.fetchWinnersData(this.paginator.currentPage);
  };

  private addWinsColumnChangeHandler(): void {
    this.winsColumn.onChange = (order: SortOrder): void => {
      this.sortColumn = 'wins';
      this.timeColumn.hideMarker();
      this.sortWinners(order);
    };
  }

  private addTimeColumnChangeHandler(): void {
    this.timeColumn.onChange = (order: SortOrder): void => {
      this.sortColumn = 'time';
      this.winsColumn.hideMarker();
      this.sortWinners(order);
    };
  }

  private addBeforeNavigateWinnersHandler(): void {
    document.addEventListener(EventName.BeforeNavigateWinners, () => {
      void this.fetchWinnersData(this.paginator.currentPage);
    });
  }

  private addPaginatorChangeHandler(): void {
    this.paginator.onChange = (newPage): void => {
      void this.fetchWinnersData(newPage);
    };
  }

  private init(): void {
    this.winsColumn.sortOrder = INITIAL_SORT_ORDER;
    this.timeColumn.hideMarker();

    this.addTimeColumnChangeHandler();
    this.addWinsColumnChangeHandler();
    this.addBeforeNavigateWinnersHandler();
    this.addPaginatorChangeHandler();
  }
}
