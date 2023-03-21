import { IconNameEnum } from '../components/icon/icon-name.enum';
export interface TopUpInputInterface {
  name: string;
  code: string;
  network: string;
  networkFullName: string;
  icon: string;
  networkShortName?: string | null;
}

export interface TopUpOutputInterface extends TopUpInputInterface {
  slug: string;
}

export interface PaymentProviderInterface {
  name: string;
  iconName: IconNameEnum;
  kycRequired: boolean;
  isBestPrice: boolean;
  minInputAmount: number;
  maxInputAmount: number;
  inputAmount?: number;
  inputSymbol?: string;
  outputAmount?: number;
  outputSymbol?: string;
}
