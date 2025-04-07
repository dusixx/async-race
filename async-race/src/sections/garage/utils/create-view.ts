import { Button } from '../../../components/base/button.ts';
import { div, img, span } from '../../../components/base/index.ts';
import { Paginator } from '../../../components/paginator/paginator.ts';
import type { Track } from '../../../components/track/track.ts';
import { Icon } from '../../../constants/index.ts';

import styles from '../garage.module.scss';
import { getFinishingTimeSecs } from './misc.ts';

const REWARD_IMG_SRC = './reward.png';
const TOTAL_CARS_TEXT = 'cars total:';
const REWARD_IMG_ALT = 'reward picture';

const buttonsData = {
  race: `${Icon.Rocket} race`,
  reset: 'reset',
  generate: 'generate',
  add: 'add ',
};

export type ButtonsMap = Record<string, Button>;

export const getWinnerInfoDetailsMarkup = (targetTrack: Track): string => {
  const { car } = targetTrack;
  const time = getFinishingTimeSecs(car.stats).toFixed(3);
  return `
    <div class="${styles.winnerInfo}">
      <p class="${styles.winnerName}">${car.name}</p>
      <div class="${styles.winnerDetails}">
        <span>${time}s</span>
        <span>(${car.type})</span>
      </div>
    </div>
  `;
};

export const createWinnerModalView = (): {
  winnerInfoWrapper: ReturnType<typeof div>;
  winnerInfo: ReturnType<typeof div>;
} => {
  const winnerInfoWrapper = div({ className: styles.winnerInfoWrapper });
  const image = img({
    className: styles.winnerImage,
    src: REWARD_IMG_SRC,
    alt: REWARD_IMG_ALT,
  });
  const winnerInfo = div({ className: styles.winnerInfo });

  winnerInfoWrapper.append(image, winnerInfo);

  return { winnerInfoWrapper, winnerInfo };
};

const createButtonsMap = (): ButtonsMap => {
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

  const totalCarsCounter = span({ className: styles.carsCounter });
  const totalCarsWrapper = div(
    { className: styles.totalCarsWrapper },
    span({ text: TOTAL_CARS_TEXT }),
    totalCarsCounter
  );

  const buttonsMap = createButtonsMap();
  const paginator = new Paginator();

  rightControls.append(buttonsMap.add, buttonsMap.generate, paginator);
  leftControls.append(buttonsMap.race, buttonsMap.reset, totalCarsWrapper);

  header.append(leftControls, rightControls);
  wrapper.append(header, tracksWrapper);

  return { buttonsMap, wrapper, tracksWrapper, paginator, totalCarsCounter };
};
