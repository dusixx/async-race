import { Icon } from '../../../constants/index.ts';
import { Button } from '../../base/button.ts';
import { div, span } from '../../base/index.ts';
import styles from '../paginator.module.scss';

const NEXT_TITLE = 'next page';
const PREVIOUS_TITLE = 'previous page';
const CURRENT_PAGE_INITIAL = '1';
const TOTAL_PAGES_INITIAL = '1';
const SPLITTER = '/';

type CreateViewReturn = {
  buttonNext: Button;
  buttonPrevious: Button;
  currentPage: ReturnType<typeof span>;
  totalPages: ReturnType<typeof span>;
  counterWrapper: ReturnType<typeof div>;
};

export const createView = (): CreateViewReturn => {
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

  const currentPage = span({ className: styles.currentPage, text: CURRENT_PAGE_INITIAL });
  const totalPages = span({ className: styles.totalPages, text: TOTAL_PAGES_INITIAL });
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
