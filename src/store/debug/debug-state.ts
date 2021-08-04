import { ActionArrivalPayload } from '../../interfaces/action-arrival-payload.interface';

export interface DebugState {
  recentActions: ActionArrivalPayload[];
}

export const debugInitialState: DebugState = {
  recentActions: []
};

export interface DebugRootState {
  debug: DebugState;
}
