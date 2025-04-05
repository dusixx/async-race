import { Element } from '../../components/base/element.ts';
import { CarEditor } from '../../components/car-editor/car-editor.ts';
import type { Paginator } from '../../components/paginator/paginator.ts';
import { Track } from '../../components/track/track.ts';
import type { ButtonsMap } from '../../components/track/utils/create-view.ts';
import { EventType, Icon } from '../../constants/index.ts';
import * as api from '../../services/api/index.ts';
import type { CarData } from '../../services/api/types.ts';

import { createView } from './utils/create-view.ts';
import { getFinishingTimeSecs, showWinner } from './utils/misc.ts';

const TRACKS_PER_PAGE = 7;
const DEFAULT_PAGE_NUMBER = 1;
const CARS_PER_GENERATION = 100;

type GarageStatus = 'race' | 'resetting' | 'ready' | 'needReset';

export class Garage extends Element {
  public status: GarageStatus = 'ready';
  private buttons: ButtonsMap;
  private tracksMap: Map<HTMLElement, Track> = new Map();
  private tracksWrapper: Element<HTMLDivElement>;
  private totalCounter: Element<HTMLSpanElement>;
  private paginator: Paginator;
  private carEditor: CarEditor = new CarEditor();

  constructor() {
    super({ tag: 'section' });

    const { buttonsMap, wrapper, tracksWrapper, paginator, totalCarsCounter } = createView();

    this.buttons = buttonsMap;
    this.tracksWrapper = tracksWrapper;
    this.totalCounter = totalCarsCounter;

    this.paginator = paginator;
    paginator.itemsPerPage = TRACKS_PER_PAGE;

    this.append(wrapper);
    this.init();

    void this.fetchCarsData();
  }

  private async waitUntilEveryoneIsReadyToGo(): Promise<void> {
    const onStarted = [...this.tracksMap.values()].map((track) => {
      return new Promise((resolve) => {
        track.onStarted = (): void => {
          resolve(null);
        };
      });
    });
    await Promise.all(onStarted);
  }

  private areAllTracksReady(): boolean {
    const tracks = Array.from(this.tracksMap.values());
    return tracks.every((track) => track.isReady);
  }

  private async fetchCarsData(pageNumber?: number): Promise<void> {
    pageNumber = pageNumber || DEFAULT_PAGE_NUMBER;

    const { items, totalCount } = await api.getAllCars({
      _limit: TRACKS_PER_PAGE,
      _page: pageNumber,
    });
    this.updateCurrentTracks(items);
    this.totalCounter.text = totalCount.toString();
    this.paginator.totalItems = totalCount;
    this.paginator.currentPage = pageNumber;
  }

  private updateCurrentTracks(carsData: CarData[]): void {
    this.tracksMap.clear();

    const tracksArray = carsData.map((carData) => {
      const track = new Track(carData);
      this.tracksMap.set(track.node, track);

      return track;
    });
    this.tracksWrapper.removeChildren();
    this.tracksWrapper.append(...tracksArray);
  }

  private addPaginatorChangeHandler(): void {
    this.paginator.onChange = (newPage): void => {
      void this.fetchCarsData(newPage);
    };
  }

  private handleTrackStatusChange = (): void => {
    const { reset } = this.buttons;
    const areAllTracksReady = this.areAllTracksReady();

    if (areAllTracksReady) {
      this.status = 'ready';
    }
    // if not all tracks are ready - only reset is available
    this.disableButtons(!areAllTracksReady, ['reset']);
    this.paginator.disabled = !areAllTracksReady;

    // if reset already was pressed, leave it disabled
    if (this.status === 'resetting') {
      reset.disabled = true;
    }
  };

  private addTrackStatusChangeListeners(): void {
    this.addListener(EventType.TrackRaceStarting, this.handleTrackStatusChange);
    this.addListener(EventType.TrackReady, this.handleTrackStatusChange);
  }

  private addTrackRaceFinishedListener(): void {
    this.addListener(EventType.TrackRaceFinished, ({ target }) => {
      if (this.status !== 'race') {
        return;
      }
      if (target instanceof HTMLElement) {
        const targetTrack = this.tracksMap.get(target);
        if (targetTrack) {
          this.status = 'needReset';
          const time = getFinishingTimeSecs(targetTrack.car.stats).toString();
          targetTrack.showStatus({
            message: `won in ${time}`,
            success: true,
            icon: Icon.Reward,
          });
          showWinner(targetTrack, this);
        }
      }
    });
  }

  private removeTrackByNode(node: HTMLElement): void {
    const targetTrack = this.tracksMap.get(node);
    if (targetTrack) {
      this.removeChildByRef(targetTrack);
      this.tracksMap.delete(node);
    }
    void this.fetchCarsData(this.paginator.currentPage);
  }

  private addTrackRemoveListener(): void {
    this.addListener(EventType.TrackRemove, ({ target }) => {
      if (target instanceof HTMLElement) {
        this.removeTrackByNode(target);
      }
    });
  }

  private async generateCarsAndRefetch(): Promise<void> {
    await api.createCars(CARS_PER_GENERATION);
    await this.fetchCarsData(this.paginator.currentPage);
  }

  private addGenerateClickHandler(): void {
    this.buttons.generate.onClick = (): void => {
      this.disableButtons(true);
      this.generateCarsAndRefetch()
        .catch(console.debug)
        .finally(() => {
          this.disableButtons(false, ['reset']);
        });
    };
  }

  private addResetClickHandler(): void {
    const { reset } = this.buttons;
    reset.onClick = (): void => {
      this.status = 'resetting';
      reset.disabled = true;

      this.tracksMap.forEach((track) => {
        track.reset();
      });
    };
  }

  private addRaceClickHandler(): void {
    const { race } = this.buttons;
    race.onClick = (): void => {
      this.status = 'race';
      race.disabled = true;

      const delayBeforeStart = this.waitUntilEveryoneIsReadyToGo();
      this.tracksMap.forEach((track) => {
        track.start(delayBeforeStart);
      });
    };
  }

  private addAddClickHandler(): void {
    const { add } = this.buttons;
    add.onClick = (): void => {
      this.carEditor.showCreateDialog();
    };
    // refetch cars data
    this.carEditor.onCreate = (): void => {
      void this.fetchCarsData(this.paginator.currentPage);
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
    this.addPaginatorChangeHandler();
    this.addAddClickHandler();
  }
}
