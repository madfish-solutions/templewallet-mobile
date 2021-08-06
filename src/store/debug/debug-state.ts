import { RecentActionPayload } from '../../interfaces/recent-action-payload.interface';

export interface DebugState {
  recentActions: RecentActionPayload[];
}

export const debugInitialState: DebugState = {
  recentActions: []
};

export interface DebugRootState {
  debug: DebugState;
}
