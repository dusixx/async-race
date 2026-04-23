import { EventName } from '@common';
import type { NavSectionName } from '@components';
import { Garage, HeaderSection, main as MainSection, Winners } from '@components';

const header = new HeaderSection();
const garage = new Garage();
const winners = new Winners();
const main = MainSection({}, garage);

header.onNavigate = (sectionName: NavSectionName): void => {
  main.dispatch(EventName.BeforeContentChange);

  if (sectionName === 'garage') {
    main.dispatch(EventName.BeforeNavigateGarage);
    main.node.replaceChildren(garage.node);
  } else {
    main.dispatch(EventName.BeforeNavigateWinners);
    main.node.replaceChildren(winners.node);
  }
};

document.body.append(header.node, main.node);
