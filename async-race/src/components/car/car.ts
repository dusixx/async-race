import * as api from '../../services/api/cars-api.ts';
import type { CarData } from '../../services/api/types.ts';
import { createView, CssVariableColor } from './utils/create-view.ts';

import { getRandomHexColor, isValidHexColor } from '../../utils/color.ts';
import { getRandomCarName } from '../../utils/misc.ts';
import { easeOutQuint } from '../../utils/timing-funcs.ts';
import type { div } from '../base/index.ts';

import type {
  CarStatus,
  OnBrokenHandler,
  OnFinishedHandler,
  OnStartedHandler,
  OnStoppedHandler,
  UpdateCarData,
} from './types.ts';

const MAX_WHEEL_TURNING_ANGEL = 360 * 10;
const ANIMATION_PROGRESS_THRESHOLD = 0.98;

export class Car {
  public readonly wrapper: ReturnType<typeof div>;
  public onStopped: OnStoppedHandler = null; // only when stopped explicity
  public onStarted: OnStartedHandler = null;
  public onFinished: OnFinishedHandler = null;
  public onBroken: OnBrokenHandler = null;
  public status: CarStatus = 'stopped';
  private _name: string;
  private _id: number = NaN;
  private _color: string;
  private leftWheel: HTMLElement;
  private rightWheel: HTMLElement;
  private abortController: AbortController | null = null;

  constructor(props?: Omit<CarData, 'id'>) {
    const { color, name } = props ?? {};
    const carColor = color && isValidHexColor(color) ? color : getRandomHexColor();
    const carName = name || getRandomCarName();

    const { wrapper, leftWheel, rightWheel } = createView(carColor);

    this.leftWheel = leftWheel;
    this.rightWheel = rightWheel;
    this.wrapper = wrapper;
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

  public async drive(distancePx: number): Promise<void> {
    await this.updateCarDataIfNecessary();

    const durationMs = await this.start();

    this.abortController = new AbortController();
    void api.switchCarEngineToDriveMode(this.id, this.abortController.signal).then((result) => {
      if (result === null) {
        console.debug('aborted');
        return;
      }
      this.status = result;
      if (result === 'finished') {
        this.onFinished?.();
      } else {
        this.onBroken?.();
      }
    });

    this.startAnimation(durationMs, distancePx);
  }

  public async stop(): Promise<void> {
    // abort drive mode
    this.abortController?.abort();
    this.status = 'stopped';

    await this.updateCarDataIfNecessary();
    await api.updateCarEngineStatus(this.id, 'stopped');

    this.wrapper.node.style.transform = '';
    this.onStopped?.();
  }

  public async updateCarData(data?: UpdateCarData): Promise<void> {
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

  private async start(): Promise<number> {
    this.status = 'started';

    const { velocity, distance } = await api.updateCarEngineStatus(this.id, 'started');
    const durationMs = distance / velocity;

    this.onStarted?.();

    return durationMs;
  }

  private setCssProperty(name: string, value: string): void {
    this.wrapper.node.style.setProperty(name, value);
  }

  private updateColor(color: string): void {
    this.setCssProperty(CssVariableColor.Body, color);
    this._color = color;
  }

  private async updateCarDataIfNecessary(): Promise<void> {
    if (Number.isNaN(this.id)) {
      await this.updateCarData();
    }
  }

  private getCarWidthPx(): number {
    return parseFloat(getComputedStyle(this.wrapper.node).width);
  }

  private startAnimation(durationMs: number, distancePx: number): void {
    const startTime = performance.now();
    const effectiveDistancePx = distancePx - this.getCarWidthPx();

    const frame = (): void => {
      const elapsed = performance.now() - startTime;
      const easedProgress = easeOutQuint(elapsed / durationMs);

      const step = effectiveDistancePx * easedProgress;
      const angle = MAX_WHEEL_TURNING_ANGEL * easedProgress;

      if (easedProgress >= ANIMATION_PROGRESS_THRESHOLD) {
        this.status = 'finished';
        this.onFinished?.();
      }
      if (this.status !== 'started') {
        console.debug(this.id, this.status);
        return;
      }
      this.wrapper.node.style.transform = `translate(${step.toString()}px)`;
      this.leftWheel.style.transform = `rotate(${angle.toString()}deg)`;
      this.rightWheel.style.transform = `rotate(${angle.toString()}deg)`;

      requestAnimationFrame(frame);
    };

    frame();
  }
}
