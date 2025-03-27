import { HeaderSection, MainSection } from '../sections/index.ts';

document.body.append(new HeaderSection().node, new MainSection().node);
