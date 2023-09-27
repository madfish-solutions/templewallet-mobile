import React, { FC } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { formatSize } from 'src/styles/format-size';
import { copyStringToClipboard } from 'src/utils/clipboard.utils';
import { isDefined } from 'src/utils/is-defined';
import { openUrl } from 'src/utils/linking';
import { isValidAddress } from 'src/utils/tezos.util';

import { Icon } from '../icon/icon';
import { IconNameEnum } from '../icon/icon-name.enum';
import { TruncatedText } from '../truncated-text';
import { useLinkWithIconStyles } from './link-with-icon.styles';

interface Props {
  text: string;
  iconName?: IconNameEnum;
  link: string;
  valueToClipboard?: string;
  style?: StyleProp<ViewStyle>;
}

export const LinkWithIcon: FC<Props> = ({
  text,
  iconName = IconNameEnum.ExternalLinkTag,
  link,
  valueToClipboard,
  style
}) => {
  const styles = useLinkWithIconStyles();

  const isAddress = isValidAddress(text);

  const handleLinkPress = () => openUrl(link);

  const handleLongPress = () =>
    isDefined(valueToClipboard) ? copyStringToClipboard(valueToClipboard) : copyStringToClipboard(link);

  return (
    <TouchableOpacity onPress={handleLinkPress} onLongPress={handleLongPress} style={[styles.root, style]}>
      <TruncatedText style={[styles.container, styles.text]} ellipsizeMode={isAddress ? 'middle' : 'tail'}>
        {text}
      </TruncatedText>
      <Icon name={iconName} size={formatSize(24)} style={styles.container} />
    </TouchableOpacity>
  );
};
