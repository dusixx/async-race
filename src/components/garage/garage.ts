import type { ButtonsMap } from '@common';
import { EventName, isError, isHTMLElement, toggleButtons } from '@common';
import type { Paginator } from '@components';
import { CarEditor, Element, Modal, Track } from '@components';
import * as api from '@services/api';
import type { CarData } from '@services/api/garage/garage-api.types.ts';
import {
  createView,
  createWinnerModalView,
  getWinnerInfoDetailsMarkup,
} from './create-view/create-view.ts';
import { showWinnerStatus, updateScore } from './garage.utils.ts';

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
  private carEditor: CarEditor = new CarEditor();
  private winnerInfo: Element<HTMLDivElement>;
  private paginator: Paginator;
  private modal: Modal;

  constructor() {
    super({ tag: 'section' });

    const { buttonsMap, wrapper, tracksWrapper, paginator, totalCarsCounter } = createView();
    this.buttons = buttonsMap;
    this.tracksWrapper = tracksWrapper;
    this.totalCounter = totalCarsCounter;

    this.paginator = paginator;
    paginator.itemsPerPage = TRACKS_PER_PAGE;

    const { winnerInfo, winnerInfoWrapper } = createWinnerModalView();
    this.modal = new Modal({
      showCancelButton: false,
      // NOTE: using .node to prevent call removeChildByRef until the BaseElement is fixed
      parent: this.node,
      content: winnerInfoWrapper,
    });
    this.winnerInfo = winnerInfo;

    this.append(wrapper);
    this.init();

    void this.fetchCarsData();
  }

  private showWinnerModal(targetTrack: Track): void {
    const { winnerInfo } = this;
    const details = getWinnerInfoDetailsMarkup(targetTrack);

    winnerInfo.node.innerHTML = '';
    winnerInfo.node.insertAdjacentHTML('beforeend', details);

    this.modal.open();
  }

  private async waitUntilAllCarsReadyToGo(): Promise<void> {
    const onStarted = [...this.tracksMap.values()].map((track) => {
      return new Promise((resolve) => {
        track.onStarted = (): void => {
          resolve(null);
        };
        // if stopped before 'started'
        track.onStopped = (): void => {
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

    try {
      const { items, totalCount } = await api.getAllCars({
        _limit: TRACKS_PER_PAGE,
        _page: pageNumber,
      });
      this.updateCurrentTracks(items);
      this.totalCounter.text = totalCount.toString();
      this.paginator.totalItems = totalCount;
      this.paginator.currentPage = pageNumber;
      toggleButtons(this.buttons, false, ['reset']);
    } catch (error) {
      if (isError(error)) {
        console.debug(`fetchCarsData: ${error.message}`);
      }
    }
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
    toggleButtons(this.buttons, !areAllTracksReady, ['reset']);
    this.paginator.disabled = !areAllTracksReady;

    // if reset already was pressed, leave reset disabled
    if (this.status === 'resetting') {
      reset.disabled = true;
    }
  };

  private addTrackStatusChangeListeners(): void {
    this.addListener(EventName.TrackStarting, this.handleTrackStatusChange);
    this.addListener(EventName.TrackStopped, this.handleTrackStatusChange);
  }

  private addTrackFinishedListener(): void {
    this.addListener(EventName.TrackFinished, ({ target }) => {
      if (this.status !== 'race') {
        return;
      }
      if (!isHTMLElement(target)) {
        return;
      }
      const targetTrack = this.tracksMap.get(target);
      if (targetTrack) {
        this.status = 'needReset';

        void updateScore(targetTrack);
        showWinnerStatus(targetTrack);
        this.showWinnerModal(targetTrack);
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
    this.addListener(EventName.TrackRemove, ({ target }) => {
      if (isHTMLElement(target)) {
        this.removeTrackByNode(target);
      }
    });
  }

  private async generateCarsAndRefetch(): Promise<void> {
    try {
      await api.createCars(CARS_PER_GENERATION);
      await this.fetchCarsData(this.paginator.currentPage);
    } catch (error) {
      if (isError(error)) {
        console.debug(`generateCarsAndRefetch: ${error.message}`);
      }
    }
  }

  private addGenerateClickHandler(): void {
    this.buttons.generate.onClick = (): void => {
      toggleButtons(this.buttons, true);
      this.generateCarsAndRefetch()
        .catch((error: unknown) => {
          if (isError(error)) {
            console.debug(error.message);
          }
        })
        .finally(() => {
          toggleButtons(this.buttons, false, ['reset']);
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

      const delayBeforeStart = this.waitUntilAllCarsReadyToGo();
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

  private addBeforeNavigateGarageHandler(): void {
    document.addEventListener(EventName.BeforeNavigateGarage, () => {
      if (!this.tracksMap.size) {
        void this.fetchCarsData(this.paginator.currentPage);
      }
    });
  }

  private init(): void {
    // enable all but reset
    toggleButtons(this.buttons, false, ['reset']);

    this.addGenerateClickHandler();
    this.addTrackStatusChangeListeners();
    this.addTrackFinishedListener();
    this.addTrackRemoveListener();
    this.addResetClickHandler();
    this.addRaceClickHandler();
    this.addPaginatorChangeHandler();
    this.addAddClickHandler();
    this.addBeforeNavigateGarageHandler();
  }
}
