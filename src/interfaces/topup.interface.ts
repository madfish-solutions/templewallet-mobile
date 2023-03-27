import { TopUpInputTypeEnum } from 'src/enums/top-up-input-type.enum';
import { TopUpProviderEnum } from 'src/enums/top-up-providers.enum';

import { IconNameEnum } from '../components/icon/icon-name.enum';

export interface TopUpInputInterface {
  name: string;
  code: string;
  network: string;
  networkFullName: string;
  icon: string;
  type: TopUpInputTypeEnum;
  networkShortName?: string | null;
  minAmount?: number;
  maxAmount?: number;
}

export interface TopUpOutputInterface extends TopUpInputInterface {
  slug: string;
}

export interface PaymentProviderInterface {
  name: string;
  id: TopUpProviderEnum;
  iconName: IconNameEnum;
  kycRequired: boolean;
  isBestPrice: boolean;
  minInputAmount?: number;
  maxInputAmount?: number;
  inputAmount?: number;
  inputSymbol?: string;
  outputAmount?: number;
  outputSymbol?: string;
}
