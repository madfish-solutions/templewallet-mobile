import { memo } from 'react';
import React, { Text, View } from 'react-native';

import { DropdownValueComponent } from 'src/components/dropdown/dropdown';
import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { PaymentProviderInterface } from 'src/interfaces/payment-provider';
import { formatSize } from 'src/styles/format-size';
import { useColors } from 'src/styles/use-colors';
import { isDefined } from 'src/utils/is-defined';

import { useSelectedPaymentProviderStyles } from './styles';

const SelectedPaymentProvider: DropdownValueComponent<PaymentProviderInterface> = memo(({ value }) => {
  const styles = useSelectedPaymentProviderStyles();
  const colors = useColors();

  return (
    <View style={styles.root}>
      <View style={styles.logoContainer}>
        <Icon name={isDefined(value) ? value.iconName : IconNameEnum.SwapTokenPlaceholderIcon} size={formatSize(32)} />
      </View>
      {isDefined(value) ? (
        <View>
          <Text style={styles.name}>{value.name}</Text>
          <Text style={styles.limitRange}>
            {isDefined(value.minInputAmount) && isDefined(value.maxInputAmount) && isDefined(value.inputSymbol)
              ? `${value.minInputAmount} - ${value.maxInputAmount} ${value.inputSymbol}`
              : '---'}
          </Text>
        </View>
      ) : (
        <Text style={styles.infoPlaceholder}>Select provider</Text>
      )}
      <Icon name={IconNameEnum.TriangleDown} size={formatSize(24)} style={styles.dropdownIcon} color={colors.peach} />
    </View>
  );
});

export const renderSelectedPaymentProvider: DropdownValueComponent<PaymentProviderInterface> = props => (
  <SelectedPaymentProvider {...props} />
);
