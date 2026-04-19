import { Icon } from '@common';
import { Button, div, span } from '@components';
import styles from '../paginator.module.scss';
import {
  CURRENT_PAGE_INITIAL,
  NEXT_TITLE,
  PREVIOUS_TITLE,
  SPLITTER,
  TOTAL_PAGES_INITIAL,
} from './create-view.constants.ts';

type PaginatorView = {
  buttonNext: Button;
  buttonPrevious: Button;
  currentPage: ReturnType<typeof span>;
  totalPages: ReturnType<typeof span>;
  counterWrapper: ReturnType<typeof div>;
};

export const createView = (): PaginatorView => {
  const buttonNext = new Button({
    className: styles.button,
    text: Icon.Next,
    title: NEXT_TITLE,
  });
  const buttonPrevious = new Button({
    className: styles.button,
    text: Icon.Previous,
    title: PREVIOUS_TITLE,
  });

  const currentPage = span({
    className: styles.currentPage,
    text: CURRENT_PAGE_INITIAL.toString(),
  });
  const totalPages = span({ className: styles.totalPages, text: TOTAL_PAGES_INITIAL.toString() });
  const splitter = span({ text: SPLITTER });

  const counterWrapper = div(
    { className: styles.counterWrapper },
    currentPage,
    splitter,
    totalPages
  );

  return {
    buttonNext,
    buttonPrevious,
    currentPage,
    totalPages,
    counterWrapper,
  };
};
