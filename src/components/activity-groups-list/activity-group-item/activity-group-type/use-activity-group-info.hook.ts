import { useMemo } from 'react';

import { ActivityTypeEnum } from 'src/enums/activity-type.enum';
import { ActivityGroup, emptyActivity } from 'src/interfaces/activity.interface';
import { useBakersListSelector } from 'src/store/baking/baking-selectors';
import { useSelectedAccountSelector } from 'src/store/wallet/wallet-selectors';
import { useColors } from 'src/styles/use-colors';
import { truncateLongAddress } from 'src/utils/exolix.util';
import { isString } from 'src/utils/is-string';

interface ActivityInfo {
  transactionType: string;
  transactionSubtype: string;
  transactionHash: string;
  seed: string;
  destination: {
    label: string;
    value: string;
    address: string | undefined;
    bakerLogo?: string;
  };
}

export const BAKING_REWARDS_TEXT = 'Baking rewards';
export const DELEGATION_TEXT = 'Delegation';
export const UNDELEGATION_TEXT = 'Undelegation';

const getReceiveTransactionType = (alias: string | undefined): string => {
  if (Boolean(alias?.toLowerCase().includes('payouts'))) {
    return BAKING_REWARDS_TEXT;
  }

  return 'Receive';
};

export const useActivityGroupInfo = (group: ActivityGroup) => {
  const colors = useColors();
  const bakers = useBakersListSelector();
  const { publicKeyHash } = useSelectedAccountSelector();

  return useMemo<ActivityInfo>(() => {
    const firstActivity = group[0] ?? emptyActivity;

    if (group.length > 1) {
      return {
        transactionType: 'Interaction',
        transactionSubtype: 'Sent:',
        transactionHash: firstActivity.hash,
        destination: {
          label: 'To:',
          value: truncateLongAddress(firstActivity.destination.address),
          address: firstActivity.destination.address
        },
        seed: firstActivity.destination.address
      };
    }

    switch (firstActivity.type) {
      case ActivityTypeEnum.Transaction:
        if (firstActivity.source.address !== publicKeyHash) {
          return {
            transactionType: getReceiveTransactionType(firstActivity.source.alias),
            transactionSubtype: 'Received:',
            transactionHash: firstActivity.hash,
            destination: {
              label: 'From:',
              value: truncateLongAddress(firstActivity.source.address),
              address: firstActivity.source.address
            },
            seed: firstActivity.source.address
          };
        }

        return {
          transactionType: isString(firstActivity.entrypoint) ? `Called ${firstActivity.entrypoint}` : 'Send',
          transactionSubtype: 'Sent:',
          transactionHash: firstActivity.hash,
          destination: {
            label: 'To:',
            value: truncateLongAddress(firstActivity.reciever?.address ?? ''),
            address: firstActivity.reciever?.address
          },
          seed: firstActivity.reciever?.address ?? ''
        };

      case ActivityTypeEnum.Delegation:
        const alias = firstActivity.destination.alias;
        const postfix = isString(alias) ? alias : truncateLongAddress(firstActivity.destination.address);

        return {
          transactionType: isString(firstActivity.destination.address) ? DELEGATION_TEXT : UNDELEGATION_TEXT,
          transactionSubtype: 'Sent:',
          transactionHash: firstActivity.hash,
          destination: {
            label: 'To:',
            value: postfix,
            address: firstActivity.destination.address,
            bakerLogo: bakers.find(baker => baker.address === firstActivity.destination.address)?.logo
          },
          seed: firstActivity.destination.address
        };

      default:
        return {
          transactionType: 'Undelegation',
          transactionSubtype: 'Sent:',
          transactionHash: firstActivity.hash,
          destination: {
            label: 'Received:',
            value: truncateLongAddress(firstActivity.reciever?.address ?? ''),
            address: firstActivity.reciever?.address,
            bakerLogo: bakers.find(baker => baker.address === firstActivity.destination.address)?.logo
          },
          seed: firstActivity.reciever?.address ?? ''
        };
    }
  }, [group, publicKeyHash, colors]);
};
