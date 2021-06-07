import { ActivityStatusEnum } from '../enums/activity-status.enum';
import { ActivityTypeEnum } from '../enums/activity-type.enum';
import { ActivityInterface } from '../interfaces/activity.interface';
import { MemberInterface } from '../interfaces/member.interface';
import { TransferInterface } from '../interfaces/transfer.interface';
import { tokenMetadataSlug } from '../token/utils/token.utils';
import { isDefined } from './is-defined';

export const mapTransfersToActivities = (address: string, transfers: TransferInterface[]) => {
  const activities: ActivityInterface[] = [];

  for (const transfer of transfers) {
    const { contract, token_id, status, amount, hash, timestamp, from, to, alias } = transfer;

    if (status === ActivityStatusEnum.Applied) {
      const tokenSlug = tokenMetadataSlug({ address: contract, id: token_id });

      const source: MemberInterface = { address: from };
      const destination: MemberInterface = { address: to };

      if (from === '') {
        source.address = contract;
        isDefined(alias) && (source.alias = alias);
      }

      activities.push({
        hash,
        source,
        status,
        tokenSlug,
        destination,
        type: ActivityTypeEnum.Transaction,
        amount: source.address === address ? `-${amount}` : amount,
        timestamp: new Date(timestamp).getTime()
      });
    }
  }

  return activities;
};
