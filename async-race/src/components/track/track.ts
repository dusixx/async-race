import { EventType } from '../../constants/index.ts';
import * as api from '../../services/api/cars-api.ts';
import type { CarData } from '../../services/api/types.ts';
import { Element } from '../base/element.ts';
import { Car } from '../car/car.ts';

import styles from './track.module.scss';
import type { ButtonsMap } from './utils/create-view.ts';
import { createView } from './utils/create-view.ts';

const CAR_LEFT_CSSVAR = '--car-left';
const CAR_LEFT_PX = 20;

export class Track extends Element<HTMLDivElement> {
  public car: Car;
  private carName: Element<HTMLSpanElement>;
  private buttons: ButtonsMap;

  constructor(carData: CarData) {
    super({ className: styles.track });

    this.car = new Car(carData);

    const { buttonsMap, carName, headerWrapper } = createView();
    this.carName = carName;
    this.carName.text = carData.name;
    this.buttons = buttonsMap;

    this.init();

    // relative to the track
    this.car.wrapper.toggleClass(styles.carPosition);
    this.append(headerWrapper, this.car.wrapper);
  }

  public get isReady(): boolean {
    return !this.buttons.start.disabled;
  }

  public reset(): void {
    this.buttons.stop.node.click();
  }

  public start(): void {
    if (this.isReady) {
      this.buttons.start.node.click();
    }
  }

  private getTrackWidthPx(): number {
    return parseFloat(getComputedStyle(this.node).width);
  }

  private disableButtons(flag: boolean, exceptNames: string[] = []): void {
    Object.entries(this.buttons).forEach(([name, button]) => {
      button.disabled = exceptNames.includes(name) ? !flag : flag;
    });
  }

  private addRemoveClickHandler(): void {
    const { remove } = this.buttons;
    remove.onClick = (): void => {
      this.disableButtons(true);
      api
        .deleteCarById(this.car.id)
        .then(() => {
          this.dispatch(EventType.TrackRemove);
        })
        .catch(console.debug);
    };
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

  private addCarStartingHandler(): void {
    const { stop } = this.buttons;
    this.car.onStarting = (): void => {
      stop.disabled = false;
      this.dispatch(EventType.TrackBusy);
    };
  }

  private addCarStoppedHandler(): void {
    this.car.onStopped = (): void => {
      this.disableButtons(false, ['stop']);
      this.dispatch(EventType.TrackReady);
    };
  }

  private addCarFinishedHandler(): void {
    this.car.onFinished = (): void => {
      this.dispatch(EventType.TrackRaceFinished);
    };
  }

  private init(): void {
    // enable all but stop
    this.disableButtons(false, ['stop']);
    this.node.style.setProperty(CAR_LEFT_CSSVAR, `${CAR_LEFT_PX.toString()}px`);

    this.addStartClickHandler();
    this.addCarStartingHandler();
    this.addStopClickHandler();
    this.addCarStoppedHandler();
    this.addRemoveClickHandler();
    this.addCarFinishedHandler();
  }
}
