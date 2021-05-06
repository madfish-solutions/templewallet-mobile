import { FunctionComponent } from 'react';
import { SvgProps } from 'react-native-svg';

import ArrowDownIcon from './assets/arrow-down.svg';
import ArrowUpIcon from './assets/arrow-up.svg';
import DownloadIcon from './assets/download.svg';
import PlusSquareIcon from './assets/plus-square.svg';
import { IconGlyphEnum } from './icon-glyph.enum';

export const iconGlyphMap: Record<IconGlyphEnum, FunctionComponent<SvgProps>> = {
  [IconGlyphEnum.ArrowUp]: ArrowUpIcon,
  [IconGlyphEnum.ArrowDown]: ArrowDownIcon,
  [IconGlyphEnum.Download]: DownloadIcon,
  [IconGlyphEnum.PlusSquare]: PlusSquareIcon
};
