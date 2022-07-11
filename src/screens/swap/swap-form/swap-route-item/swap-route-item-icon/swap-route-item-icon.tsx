import React, { FC } from 'react';

import { Icon } from '../../../../../components/icon/icon';
import { IconNameEnum } from '../../../../../components/icon/icon-name.enum';
import { TokenIcon } from '../../../../../components/token-icon/token-icon';
import { useTokenMetadataSelector } from '../../../../../store/tokens-metadata/tokens-metadata-selectors';
import { formatSize } from '../../../../../styles/format-size';
import { isDefined } from '../../../../../utils/is-defined';

interface SwapRouteTokenIconProps {
  tokenSlug: string;
}

const SwapRouteTokenIcon: FC<SwapRouteTokenIconProps> = ({ tokenSlug }) => {
  const tokenMetadata = useTokenMetadataSelector(tokenSlug);

  return (
    <TokenIcon iconName={tokenMetadata.iconName} thumbnailUri={tokenMetadata.thumbnailUri} size={formatSize(24)} />
  );
};

interface SwapRouteItemIconProps {
  tokenSlug?: string;
}

export const SwapRouteItemIcon: FC<SwapRouteItemIconProps> = ({ tokenSlug }) =>
  isDefined(tokenSlug) ? (
    <SwapRouteTokenIcon tokenSlug={tokenSlug} />
  ) : (
    <Icon name={IconNameEnum.NoNameToken} size={formatSize(24)} />
  );
