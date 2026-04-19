export type WinnerData = {
  id: number;
  wins: number;
  time: number;
};

export type AllWinnersData = {
  items: WinnerData[];
  totalCount: number;
};
