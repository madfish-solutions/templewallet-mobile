import { ABTestGroup } from '../../apis/temple-wallet';

export interface ABTestingState {
  groupName: ABTestGroup;
}

export const abTestingInitialState: ABTestingState = {
  groupName: ABTestGroup.Unknown
};
