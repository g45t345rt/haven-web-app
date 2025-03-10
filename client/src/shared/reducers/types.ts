type XFetchingStats = {
  isFetching: boolean;
  failed: boolean;
  error: object | null | string;
};

export enum BalanceTypes {
  locked = "locked",
  unLocked = "unLocked",
  balance = "balance",
}

export enum Ticker {
  XHV = "XHV",
  xUSD = "XUSD",
  xBTC = "XBTC",
  XAU="XAU",
  XAG="XAG",
  xEUR="XEUR",
  xCNY="XCNY",
  xGBP="XGBP",
  xJPY="XJPY",
  xAUD="XAUD",
  xCHF="XCHF"
}

export type XFetchingItem = Partial<{ [key in Ticker]?: XFetchingStats }>;
export type XFetching = { [key in Ticker]?: XFetchingStats };
const INITAL_FETCH_STATS: XFetchingStats = {
  isFetching: false,
  failed: false,
  error: null,
};

export const INITAL_FETCHING_STATE: { [key in Ticker]?: XFetchingStats } = {
  [Ticker.xUSD]: INITAL_FETCH_STATS,
  [Ticker.XHV]: INITAL_FETCH_STATS,
};
