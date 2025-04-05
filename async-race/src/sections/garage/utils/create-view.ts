import { Button } from '../../../components/base/button.ts';
import { div, span } from '../../../components/base/index.ts';
import { Paginator } from '../../../components/paginator/paginator.ts';
import { Icon } from '../../../constants/index.ts';

import styles from '../garage.module.scss';

// TODO: refactor!
const buttonsData = {
  race: `${Icon.Rocket} race`,
  reset: 'reset',
  generate: 'generate',
  add: 'add ',
};

const TOTAL_CARS_TEXT = 'cars total:';

type ButtonsMap = Record<string, Button>;

const createButtons = (): ButtonsMap => {
  const buttonsMap: ButtonsMap = {};

  Object.entries(buttonsData).map(([name, text]) => {
    const button = new Button({ className: styles.button, title: name, text });
    if (text === buttonsData.race) {
      button.toggleClass(styles.race);
    } else if (text === buttonsData.reset) {
      button.toggleClass(styles.reset);
    } else if (text === buttonsData.add) {
      button.toggleClass(styles.add);
    }
    buttonsMap[name] = button;

    return button;
  });

  return buttonsMap;
};

export const createView = (): {
  buttonsMap: ButtonsMap;
  wrapper: ReturnType<typeof div>;
  tracksWrapper: ReturnType<typeof div>;
  paginator: Paginator;
  totalCarsCounter: ReturnType<typeof span>;
} => {
  const wrapper = div({ className: styles.wrapper });
  const tracksWrapper = div({ className: styles.tracks });
  const header = div({ className: styles.header });
  const leftControls = div({ className: styles.leftControls });
  const rightControls = div({ className: styles.rightControls });

  const totalCarsCounter = span();
  const totalCarsWrapper = div(
    { className: styles.totalCarsWrapper },
    span({ text: TOTAL_CARS_TEXT }),
    totalCarsCounter
  );

  const buttonsMap = createButtons();
  const paginator = new Paginator();

  rightControls.append(buttonsMap.add, buttonsMap.generate, paginator);
  leftControls.append(buttonsMap.race, buttonsMap.reset, totalCarsWrapper);

  header.append(leftControls, rightControls);
  wrapper.append(header, tracksWrapper);

  return { buttonsMap, wrapper, tracksWrapper, paginator, totalCarsCounter };
};
