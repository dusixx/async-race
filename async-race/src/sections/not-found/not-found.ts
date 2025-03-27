import { Pathname } from '../../app/routes.ts';
import { Button } from '../../components/base/button.ts';
import { Element } from '../../components/base/element.ts';
import { div, paragraph } from '../../components/base/tags.ts';
import { Icon } from '../../constants/index.ts';
import { type Router } from '../../router/router.ts';

import styles from './not-found.module.scss';

const BUTTON_TEXT = `${Icon.House} go to list`;
const NOT_FOUND_TEXT = 'page was not found :(';

export class NotFoundSection extends Element {
  private button: Button;
  private notFoundText: ReturnType<typeof paragraph>;

  constructor(private router: Router) {
    super({ tag: 'section' });

    this.notFoundText = paragraph({
      text: NOT_FOUND_TEXT,
      className: styles.para,
    });

    this.button = new Button({ text: BUTTON_TEXT, className: styles.btn });

    const wrapper = div({ className: styles.wrapper }, this.notFoundText, this.button);

    this.button.onClick = (): void => {
      this.router.navigate(Pathname.OptionList, true);
    };

    this.append(wrapper);
  }
}
