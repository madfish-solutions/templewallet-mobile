import { Action } from './action.interface';

export interface RecentActionPayload extends Action {
  id: string;
  timestamp: number;
}
