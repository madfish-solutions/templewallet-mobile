import { BigNumber } from 'bignumber.js';

import { ActivityStatusEnum } from '../enums/activity-status.enum';
import { ActivityTypeEnum } from '../enums/activity-type.enum';
import { ActivityInterface } from '../interfaces/activity.interface';
import { MemberInterface } from '../interfaces/member.interface';
import { TransferInterface } from '../interfaces/transfer.interface';
import { emptyTokenMetadataInterface, TokenMetadataInterface } from '../token/interfaces/token-metadata.interface';
import { tokenMetadataSlug } from '../token/utils/token.utils';
import { isDefined } from './is-defined';
import { mutezToTz } from './tezos.util';

export const mapTransfersToActivities = (
  address: string,
  transfers: TransferInterface[],
  tokensMetadata: Record<string, TokenMetadataInterface>
) => {
  const activities: ActivityInterface[] = [];

  for (const transfer of transfers) {
    const { contract, token_id, status, amount, hash, timestamp, from, to, alias } = transfer;

    if (status === ActivityStatusEnum.Applied) {
      const tokenSlug = tokenMetadataSlug({ address: contract, id: token_id });
      const tokenMetadata = tokensMetadata[tokenSlug] ?? emptyTokenMetadataInterface;

      const source: MemberInterface = { address: from };
      const destination: MemberInterface = { address: to };

      if (from === '') {
        source.address = contract;
        isDefined(alias) && (source.alias = alias);
      }

      let parsedAmount = mutezToTz(new BigNumber(amount), tokenMetadata.decimals);
      if (source.address === address) {
        parsedAmount = parsedAmount.multipliedBy(-1);
      }

      activities.push({
        hash,
        source,
        status,
        tokenSlug,
        destination,
        amount: parsedAmount,
        tokenSymbol: tokenMetadata.symbol,
        tokenName: tokenMetadata.name,
        type: ActivityTypeEnum.Transaction,
        timestamp: new Date(timestamp).getTime()
      });
    }
  }

  return activities;
};
