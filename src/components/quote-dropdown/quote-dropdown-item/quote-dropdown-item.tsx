import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { formatSize } from '../../../styles/format-size';
import { isDefined } from '../../../utils/is-defined';
import { getTruncatedProps } from '../../../utils/style.util';
import { Divider } from '../../divider/divider';
import { DropdownListItemComponent } from '../../dropdown/dropdown';
import { Icon } from '../../icon/icon';
import { IconNameEnum } from '../../icon/icon-name.enum';
import { quoteEqualityFn } from '../quote-equality-fn';
import { useQuoteDropdownItemStyles } from './quote-dropdown-item.styles';

interface Props {
  quote?: string;
  actionIconName?: IconNameEnum;
}

export const QuoteDropdownItem: FC<Props> = ({ quote = '', actionIconName }) => {
  const styles = useQuoteDropdownItemStyles();

  if (quoteEqualityFn(quote)) {
    return (
      <View style={styles.container}>
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.name}>Select</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.name}>Quote</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Text {...getTruncatedProps(styles.symbol)}>{quote.toUpperCase()}</Text>
          <View style={styles.rightContainer}>
            <Divider size={formatSize(4)} />
            {isDefined(actionIconName) && <Icon name={actionIconName} size={formatSize(24)} />}
          </View>
        </View>
      </View>
    </View>
  );
};

export const renderQuoteListItem: DropdownListItemComponent<string> = ({ item, isSelected }) => (
  <QuoteDropdownItem quote={item} {...(isSelected && { actionIconName: IconNameEnum.Check })} />
);
