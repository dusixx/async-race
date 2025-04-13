import * as api from '../../services/api/garage-api.ts';
import type { CarData } from '../../services/api/types.ts';
import { getRandomHexColor, isValidHexColor } from '../../utils/color.ts';
import { getRandomCarName } from '../../utils/misc.ts';
import { timingFunction } from '../../utils/timing-funcs.ts';
import type { div } from '../base/index.ts';
import type { CarStats, CarStatus, OnStatusChangeHandler, UpdateStatus } from './types.ts';
import { ColorCSSVariableName, createView } from './utils/create-view.ts';
import type { CarViewType } from './utils/misc.ts';

const FULL_ANGLE = 360;
const ANIMATION_PROGRESS_THRESHOLD = 0.98;
const WHEEL_MAX_TURNS_COUNT = 10;

export class Car {
  public readonly wrapper: ReturnType<typeof div>;
  public onChangeStatus: OnStatusChangeHandler = null;
  public status: CarStatus = 'stopped';
  private _stats: CarStats = {};
  private _name: string;
  private _id: number;
  private _color: string;
  private _type: CarViewType;
  private leftWheel: HTMLElement;
  private rightWheel: HTMLElement;
  private abortController: AbortController | null = null;

  constructor(props?: Partial<CarData>) {
    const { color, name, id, type } = props ?? {};

    const carColor = color && isValidHexColor(color) ? color : getRandomHexColor();
    const carName = name || getRandomCarName();
    this._color = carColor;
    this._name = carName;
    this._id = id ?? NaN;

    const { wrapper, leftWheel, rightWheel, type: carType } = createView(carColor, type);
    this._type = carType;
    this.leftWheel = leftWheel;
    this.rightWheel = rightWheel;
    this.wrapper = wrapper;
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

  public get stats(): CarStats {
    return this._stats;
  }

  public get type(): CarViewType {
    return this._type;
  }

  public get isExists(): boolean {
    return !Number.isNaN(this._id);
  }

  public set color(value: string) {
    this.updateColor(value);
  }

  public set name(value: string) {
    if (value) {
      this._name = value;
    }
  }

  public async drive(distancePx: number, delayBeforeStart?: Promise<void>): Promise<void> {
    await this.updateCarDataIfNecessary();

    const durationMs = await this.start();
    if (durationMs == null) {
      return;
    }
    if (delayBeforeStart) {
      await delayBeforeStart;
    }
    this._drive();

    this.startAnimation(durationMs, distancePx);
  }

  public async stop(): Promise<void> {
    // abort current request (started or drive)
    this.abortController?.abort();
    this.updateStatus('stopping');

    await this.updateCarDataIfNecessary();
    await api.updateCarEngineStatus(this.id, 'stopped');

    this.wrapper.node.style.transform = '';
    this.updateStatus('stopped');
  }

  public async updateCarData(): Promise<UpdateStatus | null> {
    const { name, color, type } = this;
    const carData = { name, color, type };

    if (!this.isExists) {
      const data = await api.createCar(carData);
      if (!data) {
        return null;
      }
      this._id = data.id;
      return 'created';
    } else {
      await api.updateCar(this._id, carData);
      return 'updated';
    }
  }

  private updateStatus(status: CarStatus, fireEvent: boolean = true): void {
    if (status === 'starting') {
      // init stats
      this._stats = { starting: performance.now() };
    } else {
      this._stats[status] = performance.now();
    }
    this.status = status;
    if (fireEvent) {
      this.onChangeStatus?.(status, this.stats);
    }
  }

  private _drive(): void {
    this.abortController = new AbortController();
    const { signal } = this.abortController;

    void api.switchCarEngineToDriveMode(this.id, signal).then((result) => {
      if (result === null || this.status === 'stopped') {
        return;
      }
      this.status = result;
      // probably we will never get the "finished" status here -
      // the "eased" animation will end faster
      if (result === 'finished') {
        this.updateStatus('finished');
      } else {
        // might break before the animation starts
        this.updateStatus('broken');
      }
    });
  }

  private async start(): Promise<number | null> {
    this.updateStatus('starting');

    this.abortController = new AbortController();
    const { signal } = this.abortController;

    const result = await api.updateCarEngineStatus(this.id, 'started', signal);
    if (result == null) {
      return null;
    }
    const durationMs = result.distance / result.velocity;
    this.updateStatus('started');

    return durationMs;
  }

  private updateColor(color: string): void {
    if (!isValidHexColor(color)) {
      return;
    }
    this.wrapper.node.style.setProperty(ColorCSSVariableName.Body, color);
    this._color = color;
  }

  private async updateCarDataIfNecessary(): Promise<void> {
    if (!this.isExists) {
      await this.updateCarData();
    }
  }

  private getCarWidthPx(): number {
    return parseFloat(getComputedStyle(this.wrapper.node).width);
  }

  private updateStyle(step: number, angle: number): void {
    const { wrapper, leftWheel, rightWheel } = this;

    wrapper.node.style.transform = `translate(${step.toString()}px)`;
    leftWheel.style.transform = `rotate(${angle.toString()}deg)`;
    rightWheel.style.transform = `rotate(${angle.toString()}deg)`;
  }

  private startAnimation(durationMs: number, distancePx: number): void {
    const startTime = performance.now();
    const effectiveDistancePx = distancePx - this.getCarWidthPx();
    const wheelSpinTotalAngle = (FULL_ANGLE * effectiveDistancePx * WHEEL_MAX_TURNS_COUNT) / 1000;

    const move = (): void => {
      const elapsed = performance.now() - startTime;
      const progress = timingFunction.easeOutQuint(elapsed / durationMs);
      const step = effectiveDistancePx * progress;
      const angle = wheelSpinTotalAngle * progress;

      if (progress >= ANIMATION_PROGRESS_THRESHOLD) {
        // abort drive mode
        this.abortController?.abort();
        this.updateStatus('finished');
      }
      if (this.status !== 'started') {
        return;
      }
      this.updateStyle(step, angle);

      requestAnimationFrame(move);
    };

    move();
  }
}
