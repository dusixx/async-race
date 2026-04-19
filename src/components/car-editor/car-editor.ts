import { getRandomCarName, isError, isHTMLInputElement, isHTMLSelectElement } from '@common';
import type { Button, Element } from '@components';
import { Car, Modal } from '@components';
import { isCarViewType } from '@components/car/create-view/create-view.utils.ts';
import { createRandomCar } from './car-editor.utils.ts';
import { createView } from './create-view/create-view.ts';

const UPDATE_HEADING = 'Update car';
const CREATE_HEADING = 'Add new car';

type OnCreateHandler = (() => void) | null;
type OnUpdateHandler = ((updatedCar: Car) => void) | null;

export class CarEditor extends Modal {
  public onCreate: OnCreateHandler = null;
  public onUpdate: OnUpdateHandler = null;
  private carColor: Element<HTMLInputElement>;
  private carName: Element<HTMLInputElement>;
  private carType: Element<HTMLSelectElement>;
  private carView: Element<HTMLDivElement>;
  private heading: Element<HTMLSpanElement>;
  private randomName: Button;
  private currentCar: Car | null = null;

  constructor() {
    const { wrapper, colorInput, nameInput, carView, heading, typeSelect, randomName } =
      createView();
    super({ content: wrapper, showCancelButton: true });

    this.carColor = colorInput;
    this.carName = nameInput;
    this.carType = typeSelect;
    this.carView = carView;
    this.heading = heading;
    this.randomName = randomName;

    this.init();
  }

  public showUpdateDialog(car: Car): void {
    this.heading.text = car.id ? `${UPDATE_HEADING} #${car.id.toString()}` : UPDATE_HEADING;
    const carCopy = new Car(car);
    this.updateCarView(carCopy);
    this.open();
  }

  public showCreateDialog(): void {
    this.heading.text = CREATE_HEADING;
    this.updateCarView(createRandomCar());
    this.open();
  }

  private updateCarView(car: Car): void {
    this.currentCar = car;

    this.carColor.node.value = car.color;
    this.carName.node.value = car.name;
    this.carType.node.value = car.type;

    this.carView.removeChildren();
    this.carView.append(car.wrapper);
  }

  private updateCarData(): void {
    if (this.currentCar) {
      this.currentCar.name = this.carName.node.value;

      this.currentCar
        .updateCarData()
        .then((status) => {
          if (status === 'created') {
            this.onCreate?.();
          } else {
            if (this.currentCar) {
              this.onUpdate?.(this.currentCar);
            }
          }
        })
        .catch((error: unknown) => {
          if (isError(error)) {
            console.debug(`updateCarData: ${error.message}`);
          }
        });
    }
  }

  private addOnCloseHandler(): void {
    this.onClose = (result): void => {
      this.carView.removeChildren();
      if (result === 'confirmed') {
        this.updateCarData();
      }
    };
  }

  private addCarNameFocusHandler(): void {
    this.carName.addListener('focus', () => {
      this.carName.node.select();
    });
  }

  private addCarTypeChangeHandler(): void {
    this.carType.addListener('change', ({ target }: Event) => {
      if (!isHTMLSelectElement(target)) {
        return;
      }
      const { value } = target;
      const { id, type: currentType } = this.currentCar ?? {};

      const newType = isCarViewType(value) ? value : currentType;
      const color = this.carColor.node.value;
      const name = this.carName.node.value || this.currentCar?.name;

      if (newType !== currentType) {
        const newCarView = new Car({ id, color, name, type: newType });
        this.updateCarView(newCarView);
      }
    });
  }

  private addRandomNameClickHandler(): void {
    this.randomName.onClick = (): void => {
      this.carName.node.value = getRandomCarName();
    };
  }

  private addColorChangeHandler(): void {
    this.carColor.addListener('input', ({ target }: Event) => {
      if (this.currentCar && isHTMLInputElement(target)) {
        this.currentCar.color = target.value;
      }
    });
  }

  private addOnBeforeConfirmHandler(): void {
    this.onBeforeConfirm = (): boolean => {
      return this.carName.node.reportValidity();
    };
  }

  private init(): void {
    this.addOnBeforeConfirmHandler();
    this.addColorChangeHandler();
    this.addOnCloseHandler();
    this.addCarNameFocusHandler();
    this.addCarTypeChangeHandler();
    this.addRandomNameClickHandler();
  }
}
