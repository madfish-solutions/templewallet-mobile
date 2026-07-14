import { FC } from 'react';
import { SvgProps } from 'react-native-svg';

import AlarmTriangleIcon from './assets/alarm-triangle.svg';
import ArrowLeftIcon from './assets/arrow-left.svg';
import ChevronRightIcon from './assets/chevron-right.svg';
import CopyIcon from './assets/copy.svg';
import InfoIcon from './assets/info.svg';
import PlusBigIcon from './assets/plus-big.svg';
import QrIcon from './assets/qr.svg';
import XBigIcon from './assets/x-big.svg';
import { IconNameV2Enum } from './icon-name.enum';

export const IconNameV2Map: Record<IconNameV2Enum, FC<SvgProps>> = {
  [IconNameV2Enum.Copy]: CopyIcon,
  [IconNameV2Enum.Qr]: QrIcon,
  [IconNameV2Enum.XBig]: XBigIcon,
  [IconNameV2Enum.AlarmTriangle]: AlarmTriangleIcon,
  [IconNameV2Enum.Info]: InfoIcon,
  [IconNameV2Enum.ArrowLeft]: ArrowLeftIcon,
  [IconNameV2Enum.PlusBig]: PlusBigIcon,
  [IconNameV2Enum.ChevronRight]: ChevronRightIcon
};
