import type { div, Paginator, SortableColumn, span } from '@components';
import type { CarViewType } from '@components/car/create-view/create-view.types.ts';
import type { CarData } from '@services/api/garage/garage-api.types.ts';
import type { WinnerData } from '@services/api/winners/winners-api.types.ts';

export type WinnersTableView = {
  winsColumn: SortableColumn;
  timeColumn: SortableColumn;
  tableContentWrapper: ReturnType<typeof div>;
  tableWrapper: ReturnType<typeof div>;
};

export type WinnersView = Omit<WinnersTableView, 'tableWrapper'> & {
  wrapper: ReturnType<typeof div>;
  paginator: Paginator;
  winnersCounter: ReturnType<typeof span>;
};

export type WinnerTableRowData = WinnerData & CarData & { type?: CarViewType };
