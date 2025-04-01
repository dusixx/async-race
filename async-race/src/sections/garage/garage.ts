import { Element } from '../../components/base/element.ts';
import { Track } from '../../components/track/track.ts';
import type { ButtonsMap } from '../../components/track/utils/create-view.ts';
import { EventType } from '../../constants/index.ts';
import * as api from '../../services/api/cars-api.ts';

import { createView } from './utils/create-view.ts';

const TRACKS_PER_PAGE = 7;
const DEFAULT_PAGE_NUMBER = 1;
const CARS_PER_GENERATION = 100;

type GarageStatus = 'race' | 'reset' | 'idle';

export class Garage extends Element {
  public onFinished = null;
  public status: GarageStatus = 'idle';
  private buttons: ButtonsMap;
  private totalCount: number = 0;
  private currentPage: number = DEFAULT_PAGE_NUMBER;
  private tracks: Map<HTMLElement, Track> = new Map();
  private tracksWrapper: Element<HTMLDivElement>;

  constructor() {
    super({ tag: 'section' });

    const { buttonsMap, wrapper, tracksWrapper } = createView();
    this.buttons = buttonsMap;
    this.tracksWrapper = tracksWrapper;

    void this.fetchCarsData();

    this.append(wrapper);
    this.init();
  }

  private areAllTracksReady(): boolean {
    const tracks = Array.from(this.tracks.values());
    return tracks.every((track) => track.isReady);
  }

  private async fetchCarsData(pageNumber?: number): Promise<void> {
    const { items, totalCount } = await api.getAllCars({
      _limit: TRACKS_PER_PAGE,
      _page: pageNumber || DEFAULT_PAGE_NUMBER,
    });
    const tracksArray = items.map((carData) => {
      const track = new Track(carData);
      this.tracks.set(track.node, track);
      return track;
    });
    this.totalCount = totalCount;
    this.tracksWrapper.removeChildren();
    this.tracksWrapper.append(...tracksArray);
  }

  private handleTrackStatusChange = (): void => {
    const { reset } = this.buttons;
    const areAllTracksReady = this.areAllTracksReady();

    if (areAllTracksReady) {
      this.status = 'idle';
    }
    // if not all tracks are ready - only reset is available
    this.disableButtons(!areAllTracksReady, ['reset']);
    // if reset already was pressed, leave it disabled
    if (this.status === 'reset') {
      reset.disabled = true;
    }
  };

  private addTrackStatusChangeListeners(): void {
    this.addListener(EventType.TrackBusy, this.handleTrackStatusChange);
    this.addListener(EventType.TrackReady, this.handleTrackStatusChange);
  }

  private addTrackRaceFinishedListener(): void {
    this.addListener(EventType.TrackRaceFinished, (event) => {
      if (this.status !== 'race') {
        return;
      }
      if (event.target instanceof HTMLElement) {
        const targetTrack = this.tracks.get(event.target);
        if (targetTrack) {
          this.status = 'idle';
          console.debug('WINNER:', targetTrack.car.name);
        }
      }
    });
  }

  private addTrackRemoveListener(): void {
    this.addListener(EventType.TrackRemove, (event) => {
      if (event.target instanceof HTMLElement) {
        const targetTrack = this.tracks.get(event.target);
        if (targetTrack) {
          this.removeChildByRef(targetTrack);
          this.tracks.delete(event.target);
        }
      }
    });
  }

  private addGenerateClickHandler(): void {
    this.buttons.generate.onClick = (): void => {
      this.disableButtons(true);
      api
        .createCars(CARS_PER_GENERATION)
        .then(() => {
          this.totalCount += CARS_PER_GENERATION;
        })
        .catch(console.debug)
        .finally(() => {
          this.disableButtons(false);
        });
    };
  }

  private addResetClickHandler(): void {
    const { reset } = this.buttons;
    reset.onClick = (): void => {
      reset.disabled = true;
      this.status = 'reset';
      this.tracks.forEach((track) => {
        track.reset();
      });
    };
  }

  private addRaceClickHandler(): void {
    const { race } = this.buttons;
    race.onClick = (): void => {
      race.disabled = true;
      this.status = 'race';
      this.tracks.forEach((track) => {
        track.start();
      });
    };
  }

  private disableButtons(flag: boolean, exceptNames: string[] = []): void {
    Object.entries(this.buttons).forEach(([name, button]) => {
      button.disabled = exceptNames.includes(name) ? !flag : flag;
    });
  }

  private init(): void {
    // enable all but reset
    this.disableButtons(false, ['reset']);

    this.addGenerateClickHandler();
    this.addTrackStatusChangeListeners();
    this.addTrackRaceFinishedListener();
    this.addTrackRemoveListener();
    this.addResetClickHandler();
    this.addRaceClickHandler();
  }
}
