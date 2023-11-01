import React, { FC } from 'react';
import { Text, TouchableOpacity } from 'react-native';

import { Divider } from '../../../components/divider/divider';
import { Label } from '../../../components/label/label';
import { StyledTextInput } from '../../../components/styled-text-input/styled-text-input';
import { useTokenType } from '../../../hooks/use-token-type';
import { TokenTypeEnum } from '../../../interfaces/token-type.enum';
import { TokenInterface } from '../../../token/interfaces/token.interface';
import { copyStringToClipboard } from '../../../utils/clipboard.utils';
import { isDefined } from '../../../utils/is-defined';

import { useTokenInfoStyles } from './token-info.styles';

interface Props {
  token: TokenInterface;
}

export const TokenInfo: FC<Props> = ({ token }) => {
  const styles = useTokenInfoStyles();
  const { tokenType, loading } = useTokenType(token.address);

  const symbol = token.symbol;

  return (
    <>
      <Label label="Decimals" description={`Decimals of ${symbol} token.`} />
      <StyledTextInput placeholder={token.decimals.toString()} editable={false} />
      <Divider />

      <Label label="Contract" description={`Address of a ${symbol} token contract.`} />
      <TouchableOpacity style={styles.addressContainer} onPress={() => copyStringToClipboard(token.address)}>
        <Text style={styles.addressText}>{token.address}</Text>
      </TouchableOpacity>
      <Divider />

      {isDefined(token.id) && !loading && tokenType === TokenTypeEnum.FA_2 && (
        <>
          <Label label="Token ID" description={`Token Id of a ${symbol} token contract.`} />
          <StyledTextInput placeholder={token.id.toString()} editable={false} />
        </>
      )}
    </>
  );
};
