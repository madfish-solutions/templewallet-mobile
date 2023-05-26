import React, { FC } from 'react';
import { StyleProp, Text, ViewStyle } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { formatSize } from '../../styles/format-size';
import { copyStringToClipboard } from '../../utils/clipboard.utils';
import { isDefined } from '../../utils/is-defined';
import { openUrl } from '../../utils/linking.util';
import { getTruncatedProps } from '../../utils/style.util';
import { isValidAddress } from '../../utils/tezos.util';
import { Icon } from '../icon/icon';
import { IconNameEnum } from '../icon/icon-name.enum';
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

  const textProps = getTruncatedProps([styles.container, styles.text], isAddress ? 'middle' : 'tail');

  return (
    <TouchableOpacity onPress={handleLinkPress} onLongPress={handleLongPress} style={[styles.root, style]}>
      <Text {...textProps}>{text}</Text>
      <Icon name={iconName} size={formatSize(24)} style={styles.container} />
    </TouchableOpacity>
  );
};
