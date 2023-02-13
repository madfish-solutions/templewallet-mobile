import React, { FC } from 'react';

import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { TokenIcon } from 'src/components/token-icon/token-icon';
import { formatSize } from 'src/styles/format-size';
import { isDefined } from 'src/utils/is-defined';
import { useTokenMetadata } from 'src/utils/token-metadata.utils';

interface SwapRouteTokenIconProps {
  tokenSlug: string;
}

const SwapRouteTokenIcon: FC<SwapRouteTokenIconProps> = ({ tokenSlug }) => {
  const tokenMetadata = useTokenMetadata(tokenSlug);

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
