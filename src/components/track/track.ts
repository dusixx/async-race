import { EventName, Icon, toggleButtons } from '@common';
import { Car, CarEditor, Element } from '@components';
import { getFinishingTimeSecs } from '@components/garage/garage.utils.ts';
import * as api from '@services/api';
import type { CarData } from '@services/api/garage/garage-api.types.ts';
import { createView } from './create-view/create-view.ts';
import type { ButtonMap } from './create-view/create-view.types.ts';
import {
  BROKEN_STATUS_TEXT,
  CAR_LEFT_CSS_VAR,
  CAR_LEFT_PX,
  StatusColor,
} from './track.constants.ts';
import styles from './track.module.scss';

type ShowStatusProps = {
  message: string;
  success?: boolean;
  icon?: string;
  color?: string;
};

export class Track extends Element<HTMLDivElement> {
  public car: Car;
  public onStarted: (() => void) | null = null;
  public onStopped: (() => void) | null = null;
  private carName: Element<HTMLSpanElement>;
  private buttons: ButtonMap;
  private carEditor: CarEditor = new CarEditor();
  private statusInfo: Element<HTMLSpanElement>;
  private overlay: Element<HTMLDivElement>;
  private delayBeforeStart: Promise<void> | undefined;

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

    this.car.wrapper.toggleClass(styles.carPosition);
    this.append(overlay, headerWrapper, this.car.wrapper);

    this.init();
  }

  public get isReady(): boolean {
    return this.car.status === 'stopped';
  }

  private get isRaceOn(): boolean {
    return Boolean(this.delayBeforeStart);
  }

  public reset(): void {
    if (this.car.status !== 'stopped') {
      this.handleStopClick();
    }
  }

  public start(delayBeforeStart?: Promise<void>): void {
    if (this.isReady) {
      this.delayBeforeStart = delayBeforeStart;
      this.handleStartClick();
    }
  }

  public showStatus({ message, success, icon, color }: ShowStatusProps): void {
    const [statusIcon, statusText] = this.statusInfo.children;

    icon = icon || (success ? Icon.CheckMark2 : Icon.CrossMark2);
    const bgColor = color || (success ? StatusColor.SuccessBg : StatusColor.ErrorBg);

    statusText.text = message;
    statusIcon.text = icon;
    statusIcon.node.style.backgroundColor = bgColor;

    this.overlay.toggleClass(styles.active, true);
  }

  private hideStatus(): void {
    this.overlay.toggleClass(styles.active, false);
    this.statusInfo.node.style.backgroundColor = '';
  }

  private getTrackWidthPx(): number {
    return parseFloat(getComputedStyle(this.node).width);
  }

  private addRemoveClickHandler(): void {
    const { remove } = this.buttons;
    remove.onClick = (): void => {
      toggleButtons(this.buttons, true);
      api
        .deleteCar(this.car.id)
        .then(() => {
          api
            .deleteWinner(this.car.id)
            .then(() => {
              this.dispatch(EventName.TrackRemove);
            })
            .catch(console.debug);
        })
        .catch(console.debug);
    };
  }

  private handleStopClick = (): void => {
    toggleButtons(this.buttons, true);
    void this.car.stop();
  };

  private addStopClickHandler(): void {
    const { stop } = this.buttons;
    stop.onClick = this.handleStopClick;
  }

  private handleStartClick = (): void => {
    toggleButtons(this.buttons, true);
    const trackDistancePx = this.getTrackWidthPx() - CAR_LEFT_PX;
    void this.car.drive(trackDistancePx, this.delayBeforeStart);
  };

  private addStartClickHandler(): void {
    const { start } = this.buttons;
    start.onClick = this.handleStartClick;
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
          stop.disabled = this.isRaceOn;
          this.dispatch(EventName.TrackStarting);
          break;
        }
        case 'started': {
          this.hideStatus();
          this.onStarted?.();
          break;
        }
        case 'stopped': {
          this.hideStatus();
          this.delayBeforeStart = undefined;
          toggleButtons(this.buttons, false, ['stop']);
          this.dispatch(EventName.TrackStopped);
          this.onStopped?.();
          break;
        }
        case 'finished': {
          const time = getFinishingTimeSecs(this.car.stats).toString();
          this.showStatus({ message: `finished in ${time}`, success: true });
          this.dispatch(EventName.TrackFinished);
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
    toggleButtons(this.buttons, false, ['stop']);
    this.node.style.setProperty(CAR_LEFT_CSS_VAR, `${CAR_LEFT_PX.toString()}px`);

    this.addCarChangeStatusHandler();
    this.addStartClickHandler();
    this.addStopClickHandler();
    this.addRemoveClickHandler();
    this.addUpdateClickHandler();
  }
}
