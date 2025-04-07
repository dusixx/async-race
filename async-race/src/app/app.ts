import { main as MainSection } from '../components/base/index.ts';
import { EventType } from '../constants/index.ts';
import { Garage } from '../sections/garage/garage.ts';
import type { NavSectionName } from '../sections/index.ts';
import { HeaderSection } from '../sections/index.ts';
import { Winners } from '../sections/winners/winners.ts';

const header = new HeaderSection();
const garage = new Garage();
const winners = new Winners();
const main = MainSection({}, garage);

header.onNavigate = (sectionName: NavSectionName): void => {
  main.dispatch(EventType.BeforeContentChange);

  if (sectionName === 'garage') {
    main.node.replaceChildren(garage.node);
  } else {
    main.dispatch(EventType.BeforeNavigateWinners);
    main.node.replaceChildren(winners.node);
  }
};

document.body.append(header.node, main.node);
