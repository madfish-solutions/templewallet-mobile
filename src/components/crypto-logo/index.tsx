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

export const CryptoLogo: FC<CryptoLogoProps> = ({
  name,
  size = formatSize(24),
  internalSize = (size * 5) / 6,
  style: styleFromProps,
  ...restProps
}) => {
  const Svg = CryptoLogoNameMap[name];

  const style = useMemo(
    () => [{ margin: (size - internalSize) / 2 }, styleFromProps],
    [styleFromProps, internalSize, size]
  );

  return <Svg {...restProps} style={style} width={internalSize} height={internalSize} />;
};
