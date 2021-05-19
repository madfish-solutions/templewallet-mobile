import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { Divider } from '../../../components/divider/divider';
import { Label } from '../../../components/label/label';
import { StyledTextInput } from '../../../components/styled-text-input/styled-text-input';
import { TokenInterface } from '../../../token/interfaces/token.interface';
import { isDefined } from '../../../utils/is-defined';
import { useTokenInfoStyles } from './token-info.styles';

interface Props {
  token: TokenInterface;
}

export const TokenInfo: FC<Props> = ({ token }) => {
  const styles = useTokenInfoStyles();

  const symbol = token.symbol;

  return (
    <>
      <Label label="Contract" description={`Address of a ${symbol} token contract.`} />
      <View style={styles.addressContainer}>
        <Text style={styles.addressText}>{token.address}</Text>
      </View>
      <Divider />

      {isDefined(token.id) && (
        <>
          <Label label="Token ID" description={`Token Id of a ${symbol} token contract.`} />
          <StyledTextInput placeholder={token.id.toString()} editable={false} />
          <Divider />
        </>
      )}

      <Label label="Decimals" description={`Decimals of ${symbol} token.`} />
      <StyledTextInput placeholder={token.decimals.toString()} editable={false} />
    </>
  );
};
