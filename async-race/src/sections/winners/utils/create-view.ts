import { div, li, span, ul } from '../../../components/base/tags.ts';
import { Car } from '../../../components/car/car.ts';
import type { CarViewType } from '../../../components/car/utils/misc.ts';
import { Paginator } from '../../../components/paginator/paginator.ts';
import { SortableColumn } from '../../../components/sortable-column/sortable-column.ts';
import type { CarData, WinnerData } from '../../../services/api/types.ts';
import styles from '../winners.module.scss';

const TOTAL_WINNERS_TEXT = 'winners total:';

enum HeaderColumnText {
  Index = '#',
  Car = 'car',
  Name = 'name',
  Wins = 'wins',
  BestTime = 'best time',
}

type TableViewReturnType = {
  winsColumn: SortableColumn;
  timeColumn: SortableColumn;
  tableContentWrapper: ReturnType<typeof div>;
  tableWrapper: ReturnType<typeof div>;
};

type CreateViewReturnType = Omit<TableViewReturnType, 'tableWrapper'> & {
  wrapper: ReturnType<typeof div>;
  paginator: Paginator;
  winnersCounter: ReturnType<typeof span>;
};

export type WinnerTableRowData = WinnerData & CarData & { type?: CarViewType };

export const createWinnersTableContent = (data: WinnerTableRowData[]): ReturnType<typeof ul> => {
  const rows = data.map(({ wins, time, name, color, type }, index) => {
    const car = new Car({ name, color, type });

    const indexColumn = li({
      className: styles.tableColumn,
      text: (index + 1).toString(),
    });
    indexColumn.toggleClass(styles.indexColumn);

    const carColumn = li({ className: styles.tableColumn }, car.wrapper);

    const nameColumn = li({ className: styles.tableColumn, text: name });
    nameColumn.toggleClass(styles.nameColumn);

    const timeColumn = li({ className: styles.tableColumn, text: time.toFixed(3) });

    const winsColumn = li({ className: styles.tableColumn, text: wins.toString() });

    return ul(
      { className: styles.tableRow },
      indexColumn,
      carColumn,
      nameColumn,
      winsColumn,
      timeColumn
    );
  });

  const content = ul({ className: styles.tableContent }, ...rows);

  return content;
};

const createWinnersTableView = (): TableViewReturnType => {
  const indexColumn = li({ className: styles.tableColumn, text: HeaderColumnText.Index });
  indexColumn.toggleClass(styles.indexColumn);

  const carColumn = li({ className: styles.tableColumn, text: HeaderColumnText.Car });

  const nameColumn = li({ className: styles.tableColumn, text: HeaderColumnText.Name });
  nameColumn.toggleClass(styles.nameColumn);

  const winsColumn = new SortableColumn(
    { className: styles.sortableColumn },
    span({ text: HeaderColumnText.Wins })
  );
  winsColumn.toggleClass(styles.tableColumn);

  const timeColumn = new SortableColumn(
    { className: styles.sortableColumn },
    span({ text: HeaderColumnText.BestTime })
  );
  timeColumn.toggleClass(styles.tableColumn);

  const headerRow = ul(
    { className: styles.headerRow },
    indexColumn,
    carColumn,
    nameColumn,
    winsColumn,
    timeColumn
  );

  const tableContentWrapper = div();
  const tableWrapper = div({ className: styles.table }, headerRow, tableContentWrapper);

  return { winsColumn, timeColumn, tableContentWrapper, tableWrapper };
};

export const createView = (): CreateViewReturnType => {
  const wrapper = div({ className: styles.wrapper });
  const header = div({ className: styles.header });

  const winnersCounter = span({ className: styles.winnersCounter });
  const winnersCounterWrapper = div(
    { className: styles.winnersCounterWrapper },
    span({ text: TOTAL_WINNERS_TEXT }),
    winnersCounter
  );

  const paginator = new Paginator();
  header.append(winnersCounterWrapper, paginator);

  const { winsColumn, timeColumn, tableContentWrapper, tableWrapper } = createWinnersTableView();
  wrapper.append(header, tableWrapper);

  return {
    wrapper,
    paginator,
    winnersCounter,
    winsColumn,
    timeColumn,
    tableContentWrapper,
  };
};
