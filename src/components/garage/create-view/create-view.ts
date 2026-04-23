/* eslint-disable @typescript-eslint/consistent-type-assertions */
import type { Track } from '@components';
import { Button, div, img, Paginator, span } from '@components';
import styles from '../garage.module.scss';
import { getFinishingTimeSecs } from '../garage.utils.ts';
import {
  ButtonText,
  REWARD_IMG_ALT,
  REWARD_IMG_SRC,
  TOTAL_CARS_TEXT,
} from './create-view.constants.ts';
import type { ButtonMap, GarageView } from './create-view.types.ts';

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

const createButtonsMap = (): ButtonMap => {
  const buttonsMap: Record<string, Button> = {};

  Object.entries(ButtonText).map(([name, text]) => {
    const button = new Button({ className: styles.button, title: name, text });

    if (text === ButtonText.race) {
      button.toggleClass(styles.race);
    } else if (text === ButtonText.reset) {
      button.toggleClass(styles.reset);
    } else if (text === ButtonText.add) {
      button.toggleClass(styles.add);
    }
    buttonsMap[name] = button;

    return button;
  });

  return buttonsMap as ButtonMap;
};

export const createView = (): GarageView => {
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

  return {
    buttonsMap,
    wrapper,
    tracksWrapper,
    paginator,
    totalCarsCounter,
  };
};
