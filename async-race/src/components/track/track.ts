import { EventType, Icon } from '../../constants/index.ts';
import { getFinishingTimeSecs } from '../../sections/garage/utils/misc.ts';
import * as api from '../../services/api/garage-api.ts';
import type { CarData } from '../../services/api/types.ts';
import { Element } from '../base/element.ts';
import { CarEditor } from '../car-editor/car-editor.ts';
import { Car } from '../car/car.ts';

import styles from './track.module.scss';
import type { ButtonsMap } from './utils/create-view.ts';
import { createView } from './utils/create-view.ts';

const CAR_LEFT_CSSVAR = '--car-left';
const CAR_LEFT_PX = 20;
const STATUS_SUCCESS_COLOR = 'var(--color-btn-bg-sec)';
const STATUS_ERROR_COLOR = 'var(--color-accent)';
const BROKEN_STATUS_TEXT = 'connection lost';

type ShowStatusProps = {
  message: string;
  success?: boolean;
  icon?: string;
};

export class Track extends Element<HTMLDivElement> {
  public car: Car;
  private carName: Element<HTMLSpanElement>;
  private buttons: ButtonsMap;
  private carEditor: CarEditor = new CarEditor();
  private statusInfo: Element<HTMLSpanElement>;
  private overlay: Element<HTMLDivElement>;

  constructor(carData: CarData) {
    super({ className: styles.track });

    this.car = new Car(carData);

    const { buttonsMap, carName, headerWrapper, overlay, statusInfo } = createView();
    this.carName = carName;
    this.carName.text = carData.name;
    this.buttons = buttonsMap;

    this.statusInfo = statusInfo;
    this.overlay = overlay;
    this.hideStatus();

    // relative to the track
    this.car.wrapper.toggleClass(styles.carPosition);
    this.append(overlay, headerWrapper, this.car.wrapper);

    this.init();
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

  public showStatus({ message, success, icon }: ShowStatusProps): void {
    const { style } = this.statusInfo.node;
    icon = icon || (success ? Icon.CheckMark : Icon.CrossMark);
    const color = success ? STATUS_SUCCESS_COLOR : STATUS_ERROR_COLOR;

    this.statusInfo.text = `${icon} ${message}`;
    style.borderColor = color;
    this.overlay.toggleClass(styles.active, true);
  }

  private hideStatus(): void {
    this.overlay.toggleClass(styles.active, false);
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
        .deleteCar(this.car.id)
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

  private addCarChangeStatusHandler(): void {
    const { stop } = this.buttons;

    this.car.onChangeStatus = (status): void => {
      switch (status) {
        case 'broken': {
          this.showStatus({ message: BROKEN_STATUS_TEXT });
          break;
        }
        case 'starting': {
          stop.disabled = false;
          this.dispatch(EventType.TrackRaceStarting);
          break;
        }
        case 'stopped': {
          this.hideStatus();
          this.disableButtons(false, ['stop']);
          this.dispatch(EventType.TrackReady);
          break;
        }
        case 'finished': {
          const time = getFinishingTimeSecs(this.car.stats).toString();
          this.showStatus({ message: `finished in ${time}`, success: true });
          this.dispatch(EventType.TrackRaceFinished);
        }
      }
    };
  }

  private replaceCar(newCar: Car): void {
    const { wrapper, name } = newCar;
    wrapper.toggleClass(styles.carPosition);

    this.removeChildByRef(this.car.wrapper);
    this.append(newCar.wrapper);

    this.car = newCar;
    this.carName.text = name;
    // update handler for new instance
    this.addCarChangeStatusHandler();
  }

  private addUpdateClickHandler(): void {
    const { update } = this.buttons;

    update.onClick = (): void => {
      this.carEditor.showUpdateDialog(this.car);
    };
    this.carEditor.onUpdate = (updatedCar): void => {
      this.replaceCar(updatedCar);
    };
  }

  private init(): void {
    // enable all but stop
    this.disableButtons(false, ['stop']);
    this.node.style.setProperty(CAR_LEFT_CSSVAR, `${CAR_LEFT_PX.toString()}px`);

    this.addCarChangeStatusHandler();
    this.addStartClickHandler();
    this.addStopClickHandler();
    this.addRemoveClickHandler();
    this.addUpdateClickHandler();
  }
}
