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
    ownBlockRewards,
    endorsementRewards,
    ownBlocks,
    endorsements,
    ownBlockFees,
    missedEndorsementRewards,
    missedOwnBlockFees,
    missedOwnBlockRewards,
    missedOwnBlocks,
    missedEndorsements
  } = reward;

  return (
    <>
      {ownBlocks > 0 && (
        <OwnBlocks ownBlocks={ownBlocks} ownBlockRewards={ownBlockRewards} ownBlockFees={ownBlockFees} />
      )}

      {endorsements > 0 && <Endorsements endorsements={endorsements} endorsementRewards={endorsementRewards} />}

      {missedOwnBlocks > 0 && (
        <MissedOwnBlocks
          missedOwnBlocks={missedOwnBlocks}
          missedOwnBlockRewards={missedOwnBlockRewards}
          missedOwnBlockFees={missedOwnBlockFees}
        />
      )}

      {missedEndorsements > 0 && (
        <MissedEndorsements
          missedEndorsements={missedEndorsements}
          missedEndorsementRewards={missedEndorsementRewards}
        />
      )}
    </>
  );
};
