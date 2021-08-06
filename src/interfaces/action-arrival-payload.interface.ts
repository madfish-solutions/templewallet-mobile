export interface RecentActionPayload {
  id: string;
  timestamp: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any;
  type: string;
}
