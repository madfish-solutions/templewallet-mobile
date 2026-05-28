import { LoadableEntityState } from 'src/store/types.ts';
import { AccountTokenInterface } from 'src/token/interfaces/account-token.interface.ts';

import { ActivityGroup } from './activity.interface.ts';

export interface LegacyAccountInterface {
  /** @deprecated */
  publicKeyHash?: string;
  /** @deprecated */
  publicKey?: string;
  /** @deprecated */
  isVisible?: boolean;
  /** @deprecated */
  tezosBalance?: string;
  /** @deprecated */
  tokensList?: AccountTokenInterface[];
  /** @deprecated */
  removedTokensList?: string[];
  /** @deprecated */
  activityGroups?: LoadableEntityState<ActivityGroup[]>;
  /** @deprecated */
  pendingActivities?: ActivityGroup[];
}
