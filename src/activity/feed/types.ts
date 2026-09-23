import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';

import type { EtherlinkActivitiesPageParams } from '../evm/fetch';
import type { TezosActivityOlderThan } from '../tezos/types';
import type { Activity } from '../types';

export type TezosSourceCursor = TezosActivityOlderThan;
export type EvmSourceCursor = EtherlinkActivitiesPageParams;
export type SourceCursor = TezosSourceCursor | EvmSourceCursor;

export const UNKNOWN_SCANNED_DOWN_TO = Number.POSITIVE_INFINITY;

export interface ActivityFeedPage<C extends SourceCursor> {
  activities: Activity[];
  nextCursor: C | null;
  scannedDownTo: number;
}

export interface ActivityFeedSource<C extends SourceCursor> {
  readonly chain: TempleChainKind;
  fetch(cursor: C | undefined, signal: AbortSignal): Promise<ActivityFeedPage<C>>;
}

export type ActivityFeedAssetFilter =
  | { chainKind: TempleChainKind.Tezos; assetSlug: string }
  | { chainKind: TempleChainKind.EVM; contract: string };
