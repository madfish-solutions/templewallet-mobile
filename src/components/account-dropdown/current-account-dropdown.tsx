import React, { FC } from 'react';
import { View } from 'react-native';

import { isAndroid } from '../../config/system';
import { AccountBaseInterface } from '../../interfaces/account.interface';
import { DropdownValueComponent, DropdownValueProps } from '../dropdown/dropdown';
import { IconNameEnum } from '../icon/icon-name.enum';
import { AccountDropdownBase } from './account-dropdown-base';
import { AccountDropdownItem, renderAccountListItem } from './account-dropdown-item/account-dropdown-item';
import { CurrentAccountDropdownStyles } from './current-account-dropdown.styles';

const renderAccountValue: DropdownValueComponent<AccountBaseInterface> = ({ value }) => (
  <AccountDropdownItem
    account={value}
    showFullData={false}
    actionIconName={IconNameEnum.TriangleDown}
    isPublicKeyHashTextDisabled={isAndroid}
  />
);

export const CurrentAccountDropdown: FC<DropdownValueProps<AccountBaseInterface>> = ({
  value,
  list,
  onValueChange,
  testID,
  testIDProperties
}) => (
  <View style={CurrentAccountDropdownStyles.root}>
    <AccountDropdownBase
      value={value}
      list={list}
      renderValue={renderAccountValue}
      renderAccountListItem={renderAccountListItem}
      onValueChange={onValueChange}
      testID={testID}
      testIDProperties={testIDProperties}
    />
  </View>
);
