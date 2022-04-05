import { AppCheckInterface } from '../../interfaces/app-check.interface';
import { createEntity } from '../create-entity';
import { LoadableEntityState } from '../types';

export interface AppCheckState {
  checkInfo: LoadableEntityState<AppCheckInterface>;
}

export const appCheckInitialState: AppCheckState = {
  checkInfo: createEntity({ isForceUpdateNeeded: false })
};

export interface AppCheckRootState {
  appCheck: AppCheckState;
}
