import { ViewStyle } from 'react-native';

import { EmptyFn } from '../../config/general';
import { IconGlyphEnum } from '../icon/icon-glyph.enum';

type MarginProps = Pick<ViewStyle, 'marginTop' | 'marginRight' | 'marginBottom' | 'marginLeft'>;

export interface ButtonSharedProps extends MarginProps {
  title?: string;
  iconGlyph?: IconGlyphEnum;
  disabled?: boolean;
  onPress: EmptyFn;
}
