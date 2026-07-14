import { FC, useMemo } from 'react';
import { SvgProps } from 'react-native-svg';

import { TestIdProps } from 'src/interfaces/test-id.props';
import { formatSize } from 'src/styles/format-size';

import { CryptoLogoNameEnum } from './logo-name.enum';
import { CryptoLogoNameMap } from './logo-name.map';

interface CryptoLogoProps extends TestIdProps, Omit<SvgProps, 'width' | 'height'> {
  name: CryptoLogoNameEnum;
  size?: number;
  internalSize?: number;
}

const defaultInternalSizeByRatioIcons = new Set([
  CryptoLogoNameEnum.Etherlink,
  CryptoLogoNameEnum.ShieldedTezos,
  CryptoLogoNameEnum.Tezos
]);

export const CryptoLogo: FC<CryptoLogoProps> = ({
  name,
  size = formatSize(24),
  internalSize = defaultInternalSizeByRatioIcons.has(name) ? (size * 10) / 12 : size - formatSize(4),
  style: styleFromProps,
  ...restProps
}) => {
  const Svg = CryptoLogoNameMap[name];

  const style = useMemo(
    () => [{ margin: formatSize(size - internalSize) / 2 }, styleFromProps],
    [styleFromProps, internalSize, size]
  );

  return <Svg {...restProps} style={style} width={internalSize} height={internalSize} />;
};
