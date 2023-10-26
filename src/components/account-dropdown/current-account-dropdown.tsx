import React, { FC } from 'react';
import { View } from 'react-native';

import { TestIdProps } from 'src/interfaces/test-id.props';

import { isAndroid } from '../../config/system';
import { AccountBaseInterface } from '../../interfaces/account.interface';
import { DropdownValueComponent, DropdownValueProps } from '../dropdown/dropdown';
import { IconNameEnum } from '../icon/icon-name.enum';

import { AccountDropdownBase } from './account-dropdown-base';
import { AccountDropdownItem, renderAccountListItem } from './account-dropdown-item/account-dropdown-item';
import { CurrentAccountDropdownStyles } from './current-account-dropdown.styles';

const renderAccountValue: DropdownValueComponent<AccountBaseInterface> = ({ value, isCollectibleScreen }) => (
  <AccountDropdownItem
    account={value}
    showFullData={false}
    actionIconName={IconNameEnum.TriangleDown}
    isPublicKeyHashTextDisabled={isAndroid}
    isCollectibleScreen={isCollectibleScreen}
  />
);

export const CurrentAccountDropdown: FC<DropdownValueProps<AccountBaseInterface> & TestIdProps> = ({
  value,
  list,
  onValueChange,
  testID,
  testIDProperties,
  isCollectibleScreen
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
      isCollectibleScreen={isCollectibleScreen}
    />
  </View>
);
