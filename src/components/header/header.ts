import { Element } from '@components';
import { createView } from './create-view/create-view.ts';
import styles from './header.module.scss';

export type NavSectionName = 'garage' | 'winners';

export class Header extends Element {
  public onNavigate: ((sectionName: NavSectionName) => void) | null = null;
  private garageInput: Element<HTMLInputElement>;
  private winnersInput: Element<HTMLInputElement>;

  constructor() {
    super({ tag: 'header', className: styles.header });

    const { wrapper, garageRadio, winnersRadio } = createView();
    this.garageInput = garageRadio;
    this.winnersInput = winnersRadio;

    this.append(wrapper);
    this.addInputChangeHandlers();
  }

  private addInputChangeHandlers(): void {
    this.garageInput.addListener('change', () => {
      this.onNavigate?.('garage');
    });
    this.winnersInput.addListener('change', () => {
      this.onNavigate?.('winners');
    });
  }
}
