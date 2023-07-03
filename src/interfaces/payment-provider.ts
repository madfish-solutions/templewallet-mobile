import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { TopUpProviderEnum } from 'src/enums/top-up-providers.enum';

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
