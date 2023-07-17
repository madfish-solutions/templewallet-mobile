import { useMemo } from 'react';

import { ActivityTypeEnum } from 'src/enums/activity-type.enum';
import { ActivityGroup, emptyActivity } from 'src/interfaces/activity.interface';
import { useSelectedAccountSelector } from 'src/store/wallet/wallet-selectors';
import { useColors } from 'src/styles/use-colors';
import { truncateLongAddress } from 'src/utils/exolix.util';
import { isString } from 'src/utils/is-string';

interface ReturnType {
  transactionType: string;
  transactionSubtype: string;
  transactionHash: string;
  destination: [string, string, string];
}

export const useActivityGroupInfo = (group: ActivityGroup) => {
  const colors = useColors();
  const { publicKeyHash } = useSelectedAccountSelector();

  return useMemo<ReturnType>(() => {
    const firstActivity = group[0] ?? emptyActivity;

    if (group.length > 1) {
      return {
        transactionType: 'Interaction',
        transactionSubtype: 'Sent',
        transactionHash: firstActivity.hash,
        destination: ['To:', truncateLongAddress(firstActivity.destination.address), firstActivity.destination.address]
      };
    }

    switch (firstActivity.type) {
      case ActivityTypeEnum.Transaction:
        if (firstActivity.source.address !== publicKeyHash) {
          return {
            transactionType: firstActivity.source.alias ?? 'Receive',
            transactionSubtype: 'Received',
            transactionHash: firstActivity.hash,
            destination: ['From:', truncateLongAddress(firstActivity.source.address), firstActivity.source.address]
          };
        }

        return {
          transactionType: isString(firstActivity.entrypoint) ? `Called ${firstActivity.entrypoint}` : 'Send',
          transactionSubtype: 'Sent',
          transactionHash: firstActivity.hash,
          destination: ['To:', truncateLongAddress(firstActivity.reciever.address), firstActivity.reciever.address]
        };

      case ActivityTypeEnum.Delegation:
        const alias = firstActivity.destination.alias;
        const postfix = isString(alias) ? alias : truncateLongAddress(firstActivity.destination.address);

        return {
          transactionType: isString(firstActivity.destination.address) ? 'Delegation' : 'Undelegation',
          transactionSubtype: 'Sent',
          transactionHash: firstActivity.hash,
          destination: ['To:', postfix, firstActivity.destination.address]
        };

      default:
        return {
          transactionType: 'Undelegation',
          transactionSubtype: 'Sent',
          transactionHash: firstActivity.hash,
          destination: [
            'Received:',
            truncateLongAddress(firstActivity.reciever.address),
            firstActivity.reciever.address
          ]
        };
    }
  }, [group, publicKeyHash, colors]);
};
