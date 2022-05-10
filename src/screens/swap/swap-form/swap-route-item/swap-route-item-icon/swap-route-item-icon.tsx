import React, { FC } from 'react';

import { Icon } from '../../../../../components/icon/icon';
import { IconNameEnum } from '../../../../../components/icon/icon-name.enum';
import { TokenIcon } from '../../../../../components/token-icon/token-icon';
import { useTokenMetadataGetter } from '../../../../../hooks/use-token-metadata-getter.hook';
import { formatSize } from '../../../../../styles/format-size';
import { isDefined } from '../../../../../utils/is-defined';

interface SwapRouteTokenIconProps {
  tokenSlug: string;
}

const SwapRouteTokenIcon: FC<SwapRouteTokenIconProps> = ({ tokenSlug }) => {
  const getTokenMetadata = useTokenMetadataGetter();

  const tokenMetadata = getTokenMetadata(tokenSlug);

  return <TokenIcon token={tokenMetadata} size={formatSize(24)} />;
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
