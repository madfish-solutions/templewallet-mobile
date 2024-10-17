import { RouteProp, useRoute } from '@react-navigation/native';
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

import { Divider } from 'src/components/divider/divider';
import { Label } from 'src/components/label/label';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { StyledTextInput } from 'src/components/styled-text-input/styled-text-input';
import { useTokenType } from 'src/hooks/use-token-type';
import { TokenTypeEnum } from 'src/interfaces/token-type.enum';
import { ScreensEnum, ScreensParamList } from 'src/navigator/enums/screens.enum';
import { copyStringToClipboard } from 'src/utils/clipboard.utils';
import { isDefined } from 'src/utils/is-defined';

import { useTokenInfoStyles } from './token-info.styles';

export const TokenInfo = () => {
  const { token } = useRoute<RouteProp<ScreensParamList, ScreensEnum.TokenInfo>>().params;

  const styles = useTokenInfoStyles();
  const { tokenType, loading } = useTokenType(token.address);

  const symbol = token.symbol;
  const isTezos = token.address === '';

  return (
    <ScreenContainer contentContainerStyle={styles.contentContainerStyle}>
      <Label label="Decimals" description={`Decimals of ${symbol} token.`} />
      <StyledTextInput placeholder={token.decimals.toString()} editable={false} />

      {!isTezos && (
        <>
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
      )}
    </ScreenContainer>
  );
};
