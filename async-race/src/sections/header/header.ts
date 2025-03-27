import { Element } from '../../components/base/element.ts';
import { div } from '../../components/base/tags.ts';
import { Logo } from './logo.ts';

import styles from './header.module.scss';

export class HeaderSection extends Element {
  constructor() {
    super({ tag: 'header' });
    this.append(div({ className: styles.wrapper }, new Logo()));
  }
}
