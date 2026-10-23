import { BigNumber } from 'bignumber.js';
import React from 'react';
import { StyleProp, Text, View, ViewStyle } from 'react-native';

import { TEZ_TOKEN_DECIMALS, TEZ_TOKEN_SYMBOL } from 'src/token/data/tokens-metadata';
import { BridgeDirection } from 'src/utils/etherlink-bridge/types';
import { formatAssetAmount } from 'src/utils/number.util';
import { fractionToPercentage } from 'src/utils/percentage.utils';
import { mutezToTz } from 'src/utils/tezos.util';

import { useBridgeNotesStyles } from './bridge-notes.styles';

interface NotesParams {
  direction: BridgeDirection;
  amountMutez?: BigNumber.Value;
  receiveMutez?: BigNumber.Value;
  feeRate?: BigNumber.Value;
}

interface Props extends NotesParams {
  style?: StyleProp<ViewStyle>;
}

const WITHDRAW_ARRIVAL_NOTE =
  'Usually arrives within a minute. If no provider picks it up, it arrives in about 14 days.';

const getNotes = ({ direction, amountMutez, receiveMutez, feeRate }: NotesParams) => {
  if (direction === 'deposit') {
    return ['Arrives in about 1 minute'];
  }

  if (amountMutez === undefined || receiveMutez === undefined || feeRate === undefined) {
    return [WITHDRAW_ARRIVAL_NOTE];
  }

  const feeTez = mutezToTz(new BigNumber(amountMutez).minus(receiveMutez), TEZ_TOKEN_DECIMALS);

  return [
    `Fast withdrawal fee ${fractionToPercentage(feeRate).toFixed()}% (${formatAssetAmount(
      feeTez
    )} ${TEZ_TOKEN_SYMBOL})`,
    WITHDRAW_ARRIVAL_NOTE
  ];
};

export const BridgeNotes = ({ style, ...params }: Props) => {
  const styles = useBridgeNotesStyles();

  return (
    <View style={[styles.container, style]}>
      {getNotes(params).map(note => (
        <Text key={note} style={styles.text}>
          {note}
        </Text>
      ))}
    </View>
  );
};
