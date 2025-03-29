import * as api from '../../services/api/cars-api.ts';
import type { CarData } from '../../services/api/types.ts';
import { BODY_COLOR_CSSVAR, createCarView } from './utils/create-view.ts';

import { getRandomHexColor, isValidHexColor } from '../../utils/color.ts';
import { getRandomCarName } from '../../utils/misc.ts';
import styles from './car.module.scss';

type RaceStatus = 'finished' | 'interrupted' | 'inprogress';

type OnFinishHandler = ((status: RaceStatus) => void) | null;

const WHEEL_SPIN_ANIM_DURATION_CSSVAR = '--animation-duration';

export class Car {
  public readonly node: HTMLDivElement;
  public onFinish: OnFinishHandler = null;
  private _name: string;
  private _id: number = NaN;
  private _color: string;
  private leftWheel: Element;
  private rightWheel: Element;
  private raceStatus: RaceStatus = 'finished';

  constructor(props?: Omit<CarData, 'id'>) {
    const { color, name } = props ?? {};
    const carColor = color && isValidHexColor(color) ? color : getRandomHexColor();
    const carName = name || getRandomCarName();

    const { container, leftWheel, rightWheel } = createCarView(carColor);

    this.leftWheel = leftWheel;
    this.rightWheel = rightWheel;
    this.node = container;
    this._color = carColor;
    this._name = carName;
  }

  public get id(): number {
    return this._id;
  }

  public get color(): string {
    return this._color;
  }

  public get name(): string {
    return this._name;
  }

  public async drive(): Promise<void> {
    await this.updateCarDataIfNecessay();

    const { velocity, distance } = await api.updateCarEngineStatus(this.id, 'started');
    const durationMs = Math.floor(distance / velocity);
    this.raceStatus = 'inprogress';

    void api.switchCarEngineToDriveMode(this.id).then((result) => {
      this.raceStatus = result ? 'finished' : 'interrupted';
    });

    this.startMotionAnimation(durationMs);
  }

  public async stop(): Promise<void> {
    await this.updateCarDataIfNecessay();
    await api.updateCarEngineStatus(this.id, 'stopped');
  }

  public async updateCarData(data?: Partial<Omit<CarData, 'id'>>): Promise<void> {
    const { name, color } = data ?? {};

    const carData = {
      name: name || this.name,
      color: color && isValidHexColor(color) ? color : this.color,
    };
    this._name = carData.name;
    this.updateColor(carData.color);

    if (Number.isNaN(this.id)) {
      const { id } = await api.createCar(carData);
      this._id = id;
    } else {
      await api.updateCarData(this._id, carData);
    }
  }

  private updateColor(color: string): void {
    this.node.style.setProperty(BODY_COLOR_CSSVAR, color);
    this._color = color;
  }

  private async updateCarDataIfNecessay(): Promise<void> {
    if (Number.isNaN(this.id)) {
      await this.updateCarData();
    }
  }

  private spinWheels(durationMs: number = 0): void {
    const isValidDuration = durationMs > 0;
    this.leftWheel.classList.toggle(styles.spin, isValidDuration);
    this.rightWheel.classList.toggle(styles.spin, isValidDuration);

    if (isValidDuration) {
      const wheelAnimDuration = `${(durationMs / 10).toString()}ms`;
      this.node.style.setProperty(WHEEL_SPIN_ANIM_DURATION_CSSVAR, wheelAnimDuration);
    }
  }

  private startMotionAnimation(durationMs: number): void {
    //const startTime = performance.now();
    this.spinWheels(durationMs);

    console.debug('durationMs=', durationMs);

    const move = (): void => {
      //console.debug('elapsed=', performance.now() - startTime);

      if (this.raceStatus !== 'inprogress') {
        console.debug(this.raceStatus);

        this.spinWheels(0);
        this.onFinish?.(this.raceStatus);

        return;
      }
      requestAnimationFrame(move);
    };

    move();
  }
}
