import { CryptoLogoNameEnum } from 'src/components/crypto-logo/logo-name.enum';

export interface AddressCardProps {
  title: string;
  address: string;
  cryptoLogoName: CryptoLogoNameEnum;
  warningText: string;
  showWarningOnCard?: boolean;
}
