import React, { FC } from 'react';

import { AccountCard, AccountSummary } from 'src/components/account-card';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { SendReceiver } from 'src/interfaces/send-receiver.interface';

interface Props {
  receiver: SendReceiver;
  chainKind: TempleChainKind;
  isShieldedTez: boolean;
  showDropdownDown?: boolean;
  withCard?: boolean;
}

export const ReceiverRow: FC<Props> = ({
  receiver,
  chainKind,
  isShieldedTez,
  showDropdownDown = false,
  withCard = false
}) => {
  const accountProps =
    receiver.kind === 'account'
      ? {
          account: receiver.account,
          chainKind,
          isShieldedTez,
          showDropdownDown
        }
      : {
          variant: 'contact' as const,
          name: receiver.name,
          address: receiver.address,
          avatarSeed: receiver.address,
          showBalance: false,
          chainKind,
          isShieldedTez,
          showDropdownDown
        };

  return withCard ? <AccountCard {...accountProps} /> : <AccountSummary {...accountProps} />;
};
