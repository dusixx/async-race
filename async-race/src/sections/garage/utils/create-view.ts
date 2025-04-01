import { Button } from '../../../components/base/button.ts';
import { div } from '../../../components/base/index.ts';
import { Icon } from '../../../constants/index.ts';

import styles from '../garage.module.scss';

// TODO: refactor!
const buttonsData = {
  race: `${Icon.Rocket} race`,
  reset: 'reset',
  generate: 'generate',
  add: 'add',
  nextPage: '🡢',
  prevPage: '🡠',
};

type ButtonsMap = Record<string, Button>;

const createButtons = (): ButtonsMap => {
  const buttonsMap: ButtonsMap = {};

  Object.entries(buttonsData).map(([name, text]) => {
    const button = new Button({ className: styles.button, title: name, text });
    if (text === buttonsData.race) {
      button.toggleClass(styles.race);
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
} => {
  const wrapper = div({ className: styles.wrapper });
  const buttonsMap = createButtons();
  const tracksWrapper = div({ className: styles.tracks });
  const header = div({ className: styles.header });
  const leftControls = div({ className: styles.leftControls });
  const rightControls = div({ className: styles.rightControls });

  leftControls.append(buttonsMap.reset, buttonsMap.race);
  rightControls.append(buttonsMap.add, buttonsMap.generate);

  header.append(leftControls, rightControls);

  wrapper.append(header, tracksWrapper);

  return { buttonsMap, wrapper, tracksWrapper };
};
