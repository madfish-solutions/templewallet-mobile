import React, { FC } from 'react';

import { BakingHistoryEntry } from '../../interfaces/baking-history-entry';

import { Endorsements } from './details/endorsements';
import { MissedEndorsements } from './details/missed-endorsements';
import { MissedOwnBlocks } from './details/missed-own-blocks';
import { OwnBlocks } from './details/own-blocks';

export const BakerRewardItemDetails: FC<{ item: BakingHistoryEntry }> = ({ item }) => {
  const {
    blockRewards,
    attestationRewards,
    blocks,
    attestations,
    blockFees,
    missedAttestationRewards,
    missedBlockFees,
    missedBlockRewards,
    missedBlocks,
    missedAttestations
  } = item;

  return (
    <>
      {blocks > 0 && <OwnBlocks blocks={blocks} blockFees={blockFees} blockRewards={blockRewards} />}

      {attestations > 0 && <Endorsements attestations={attestations} attestationRewards={attestationRewards} />}

      {missedBlocks > 0 && (
        <MissedOwnBlocks
          missedBlocks={missedBlocks}
          missedBlockRewards={missedBlockRewards}
          missedBlockFees={missedBlockFees}
        />
      )}

      {missedAttestations > 0 && (
        <MissedEndorsements
          missedAttestations={missedAttestations}
          missedAttestationRewards={missedAttestationRewards}
        />
      )}
    </>
  );
};
