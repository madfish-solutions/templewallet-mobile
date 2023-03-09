import React, { FC } from 'react';

import { Icon } from '../../../../../components/icon/icon';
import { IconNameEnum } from '../../../../../components/icon/icon-name.enum';
import { TokenIcon } from '../../../../../components/token-icon/token-icon';
import { useTokenMetadataSelector } from '../../../../../store/tokens-metadata/tokens-metadata-selectors';
import { formatSize } from '../../../../../styles/format-size';
import { isDefined } from '../../../../../utils/is-defined';

interface SwapRouteTokenIconProps {
  tokenSlug: string;
  size?: number;
}

const SwapRouteTokenIcon: FC<SwapRouteTokenIconProps> = ({ tokenSlug, size = 24 }) => {
  const tokenMetadata = useTokenMetadataSelector(tokenSlug);

  return (
    <TokenIcon iconName={tokenMetadata.iconName} thumbnailUri={tokenMetadata.thumbnailUri} size={formatSize(size)} />
  );
};

interface SwapRouteItemIconProps {
  tokenSlug?: string;
}

export const SwapRouteItemIcon: FC<SwapRouteItemIconProps> = ({ tokenSlug }) =>
  isDefined(tokenSlug) ? (
    <SwapRouteTokenIcon tokenSlug={tokenSlug} size={20} />
  ) : (
    <Icon name={IconNameEnum.NoNameToken} size={formatSize(20)} />
  );
