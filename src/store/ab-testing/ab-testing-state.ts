import { ABTestGroup } from 'src/apis/temple-wallet';

export interface ABTestingState {
  groupName: ABTestGroup;
}

export const abTestingInitialState: ABTestingState = {
  groupName: ABTestGroup.Unknown
};
