import { TopUpProviderEnum } from 'src/enums/top-up-providers.enum';

import { IconNameEnum } from '../components/icon/icon-name.enum';

export interface TopUpItemNetwork {
  code: string;
  fullName: string;
  shortName?: string;
}

export interface TopUpInterfaceBase {
  name: string;
  code: string;
  codeToDisplay?: string;
  network?: TopUpItemNetwork;
  icon: string;
  minAmount?: number;
  maxAmount?: number;
  precision?: number;
}

export interface TopUpWithNetworkInterface extends TopUpInterfaceBase {
  network: TopUpItemNetwork;
}

export type TopUpInputInterface = TopUpInterfaceBase;

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

export interface TopUpProviderPairLimits {
  min: number;
  max: number;
}
