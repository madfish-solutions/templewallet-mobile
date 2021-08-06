import { RecentActionPayload } from '../../interfaces/action-arrival-payload.interface';

export interface DebugState {
  recentActions: RecentActionPayload[];
}

export const debugInitialState: DebugState = {
  recentActions: []
};

export interface DebugRootState {
  debug: DebugState;
}
