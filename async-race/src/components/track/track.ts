import { Element } from '../base/element.ts';
import type { Car } from '../car/car.ts';

import styles from './track.module.scss';
import type { ButtonsMap } from './utils/create-view.ts';
import { createView } from './utils/create-view.ts';

const CAR_LEFT_CSSVAR = '--car-left';
const CAR_LEFT_PX = 20;

export class Track extends Element<HTMLDivElement> {
  private carName: Element<HTMLSpanElement>;
  private buttons: ButtonsMap;

  constructor(public car: Car) {
    super({ className: styles.track });

    const { buttonsMap, carName, headerWrapper } = createView();
    this.carName = carName;
    this.carName.text = car.name;
    this.buttons = buttonsMap;

    this.init();

    // relative to the track
    car.wrapper.toggleClass(styles.carPosition);
    this.append(headerWrapper, car.wrapper);
  }

  private getTrackWidthPx(): number {
    return parseFloat(getComputedStyle(this.node).width);
  }

  private disableButtons(flag: boolean, exceptNames: string[] = []): void {
    Object.entries(this.buttons).forEach(([name, button]) => {
      button.disabled = exceptNames.includes(name) ? !flag : flag;
    });
  }

  private addStopClickHandler(): void {
    const { stop } = this.buttons;
    stop.onClick = (): void => {
      this.disableButtons(true);
      void this.car.stop();
    };
  }

  private addStartClickHandler(): void {
    const { start } = this.buttons;
    start.onClick = (): void => {
      this.disableButtons(true);
      const trackDistancePx = this.getTrackWidthPx() - CAR_LEFT_PX;
      void this.car.drive(trackDistancePx);
    };
  }

  private addCarStartedHandler(): void {
    const { stop } = this.buttons;
    this.car.onStarted = (): void => {
      stop.disabled = false;
    };
  }

  private addCarStoppedHandler(): void {
    this.car.onStopped = (): void => {
      this.disableButtons(false, ['stop']);
    };
  }

  private init(): void {
    // enable all but stop
    this.disableButtons(false, ['stop']);
    this.node.style.setProperty(CAR_LEFT_CSSVAR, `${CAR_LEFT_PX.toString()}px`);

    this.addStartClickHandler();
    this.addCarStartedHandler();
    this.addStopClickHandler();
    this.addCarStoppedHandler();
  }
}
