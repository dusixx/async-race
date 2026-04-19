import { Car, div, li, Paginator, SortableColumn, span, ul } from '@components';
import styles from '../winners.module.scss';
import { HeaderColumnText, TOTAL_WINNERS_TEXT } from './create-view.constants.ts';
import type { WinnersTableView, WinnersView, WinnerTableRowData } from './create-view.types.ts';

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

const createWinnersTableView = (): WinnersTableView => {
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

export const createView = (): WinnersView => {
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
