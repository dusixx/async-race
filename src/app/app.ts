import { EventName } from '@common';
import type { NavSectionName } from '@components';
import { Garage, Header, main as Main, Winners } from '@components';

const header = new Header();
const garage = new Garage();
const winners = new Winners();
const main = Main({}, garage);

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
