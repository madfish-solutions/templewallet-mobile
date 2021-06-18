import { WalletParamsWithKind } from '@taquito/taquito';

import { ConfirmationTypeEnum } from '../../interfaces/confirm-payload/confirmation-type.enum';
import { WalletAccountInterface } from '../../interfaces/wallet-account.interface';

export interface ConfirmationModalParams {
  type: ConfirmationTypeEnum;
  sender: WalletAccountInterface;
  opParams: WalletParamsWithKind[];
}
