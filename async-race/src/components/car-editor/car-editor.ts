import { Icon } from '../../constants/index.ts';
import type { CarData } from '../../services/api/types.ts';
import { getRandomHexColor } from '../../utils/color.ts';
import { getRandomCarName } from '../../utils/misc.ts';
import type { Element } from '../base/element.ts';
import { Car } from '../car/car.ts';
import { Modal } from '../modal/modal.ts';
import { createView } from './utils/create-view.ts';

const UPDATE_HEADING = 'Update car';
const CREATE_HEADING = 'Add new car';

const NOTE_TEXT = `${Icon.PointingUp} NOTE: we can only store the color and name on the server. 
  So the car type and driver will be different after adding.
  Only the color and name will be the same.
`;

type OnCreateHnadler = (() => void) | null;

type OnUpdateHandler = ((carData: Omit<CarData, 'id'>) => void) | null;

export class CarEditor extends Modal {
  public onCreate: OnCreateHnadler = null;
  public onUpdate: OnUpdateHandler = null;
  private carColor: Element<HTMLInputElement>;
  private carName: Element<HTMLInputElement>;
  private carView: Element<HTMLDivElement>;
  private heading: Element<HTMLSpanElement>;
  private note: Element<HTMLParagraphElement>;
  private currentCar: Car | null = null;

  constructor() {
    const { wrapper, carColor, carName, carView, heading, note } = createView();
    super({ content: wrapper, showCancelButton: true });

    this.carColor = carColor;
    this.carName = carName;
    this.carView = carView;
    this.heading = heading;
    this.note = note;

    this.init();
  }

  public update(car: Car): void {
    this.heading.text = UPDATE_HEADING;

    const { type, id, color, name } = car;
    const carCopy = new Car({ id, name, color }, type);

    this.currentCar = carCopy;
    this.carView.append(carCopy.wrapper);
    this.carName.node.value = name;
    this.carColor.node.value = color;

    this.open();
  }

  public create(): void {
    this.heading.text = CREATE_HEADING;

    const color = getRandomHexColor();
    const name = getRandomCarName();
    this.carColor.node.value = color;
    this.carName.node.value = name;
    this.note.text = NOTE_TEXT;

    const carCopy = new Car({ name, color });
    this.currentCar = carCopy;
    this.carView.append(carCopy.wrapper);

    this.open();
  }

  private addColorChangeHandler(): void {
    this.carColor.addListener('input', ({ target }: Event) => {
      if (this.currentCar && target instanceof HTMLInputElement) {
        this.currentCar.color = target.value;
      }
    });
  }

  private addOnBeforeConfirmHandler(): void {
    this.onBeforeConfirm = (): boolean => {
      return this.carName.node.reportValidity();
    };
  }

  private updateCar(): void {
    if (this.currentCar) {
      this.currentCar.name = this.carName.node.value;

      const carData = {
        color: this.currentCar.color,
        name: this.currentCar.name,
      };
      this.currentCar
        .updateCarData()
        .then((status) => {
          if (status === 'created') {
            this.onCreate?.();
          } else {
            this.onUpdate?.(carData);
          }
        })
        .catch(console.debug);
    }
  }

  private addOnCloseHandler(): void {
    this.onClose = (result): void => {
      this.carView.removeChildren();
      this.note.text = '';
      if (result === 'confirmed') {
        this.updateCar();
      }
    };
  }

  private addCarNameFocusHandler(): void {
    this.carName.addListener('focus', () => {
      this.carName.node.select();
    });
  }

  private init(): void {
    this.addOnBeforeConfirmHandler();
    this.addColorChangeHandler();
    this.addOnCloseHandler();
    this.addCarNameFocusHandler();
  }
}
