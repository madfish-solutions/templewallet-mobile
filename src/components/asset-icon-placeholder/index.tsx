import React, { FC } from 'react';

import { CryptoLogo } from '../crypto-logo';
import { CryptoLogoNameEnum } from '../crypto-logo/logo-name.enum.ts';

interface Props {
  size: number;
  isCollectible?: boolean;
}

export const AssetIconPlaceholder: FC<Props> = ({ size, isCollectible }) => (
  <CryptoLogo
    name={isCollectible ? CryptoLogoNameEnum.CollectiblePlaceholder : CryptoLogoNameEnum.TokenPlaceholder}
    size={size}
  />
);
