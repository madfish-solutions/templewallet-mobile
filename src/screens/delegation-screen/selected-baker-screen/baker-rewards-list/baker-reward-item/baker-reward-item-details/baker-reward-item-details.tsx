import React, { FC } from 'react';

import { BakerRewardInterface } from '../../../../../../interfaces/baker-reward.interface';

import { Endorsements } from './details/endorsements';
import { MissedEndorsements } from './details/missed-endorsements';
import { MissedOwnBlocks } from './details/missed-own-blocks';
import { OwnBlocks } from './details/own-blocks';

interface Props {
  reward: BakerRewardInterface;
}

export const BakerRewardItemDetails: FC<Props> = ({ reward }) => {
  const {
    blockRewardsDelegated,
    blockRewardsStakedShared,
    blockRewardsStakedOwn,
    blockRewardsStakedEdge,
    attestationRewardsDelegated,
    attestationRewardsStakedShared,
    attestationRewardsStakedOwn,
    attestationRewardsStakedEdge,
    blocks,
    attestations,
    blockFees,
    missedAttestationRewards,
    missedBlockFees,
    missedBlockRewards,
    missedBlocks,
    missedAttestations
  } = reward.bakerRewards;

  return (
    <>
      {blocks > 0 && (
        <OwnBlocks
          blocks={blocks}
          blockFees={blockFees}
          blockRewardsDelegated={blockRewardsDelegated}
          blockRewardsStakedEdge={blockRewardsStakedEdge}
          blockRewardsStakedOwn={blockRewardsStakedOwn}
          blockRewardsStakedShared={blockRewardsStakedShared}
        />
      )}

      {attestations > 0 && (
        <Endorsements
          attestations={attestations}
          attestationRewardsDelegated={attestationRewardsDelegated}
          attestationRewardsStakedEdge={attestationRewardsStakedEdge}
          attestationRewardsStakedOwn={attestationRewardsStakedOwn}
          attestationRewardsStakedShared={attestationRewardsStakedShared}
        />
      )}

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
