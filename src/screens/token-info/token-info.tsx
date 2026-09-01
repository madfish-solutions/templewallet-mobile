import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

import { Divider } from 'src/components/divider/divider';
import { Label } from 'src/components/label/label';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { StyledTextInput } from 'src/components/styled-text-input/styled-text-input';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { useMultichainDisplayedTokens } from 'src/hooks/evm/use-multichain-displayed-tokens.hook';
import { useTokenStandard } from 'src/hooks/use-token-standard';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useScreenParams } from 'src/navigator/hooks/use-navigation.hook';
import { findDisplayedToken } from 'src/screens/token-screen/token-screen-descriptor';
import { useNetworkLabel } from 'src/screens/token-screen/use-token-page-titles.hook';
import { TEZ_TOKEN_SLUG } from 'src/token/data/tokens-metadata';
import { EVM_TOKEN_SLUG, TezosTokenStandardsEnum } from 'src/token/interfaces/token-metadata.interface';
import type { TokenInterface } from 'src/token/interfaces/token.interface';
import { copyStringToClipboard } from 'src/utils/clipboard.utils';
import { isDefined } from 'src/utils/is-defined';
import { isString } from 'src/utils/is-string';

import { useTokenInfoStyles } from './token-info.styles';

export const TokenInfo = () => {
  const { descriptor } = useScreenParams<ScreensEnum.TokenInfo>();
  const displayedTokens = useMultichainDisplayedTokens();
  const token = findDisplayedToken(displayedTokens, descriptor);
  const styles = useTokenInfoStyles();

  const symbol = token?.symbol ?? '';
  const decimals = token?.decimals;
  const isTezosKind = descriptor.chainKind === TempleChainKind.Tezos;
  const isNativeToken = isTezosKind ? descriptor.slug === TEZ_TOKEN_SLUG : descriptor.slug === EVM_TOKEN_SLUG;
  const networkLabel = useNetworkLabel(descriptor);
  const original = token?.original;

  const tezosContractToken =
    isTezosKind && !isNativeToken && isDefined(original) && isString(original.address) ? original : undefined;
  const showEvmContract = !isTezosKind && !isNativeToken;

  return (
    <ScreenContainer contentContainerStyle={styles.contentContainerStyle}>
      <Label label="Network" description="Network the token belongs to." />
      <StyledTextInput placeholder={networkLabel} editable={false} />

      {isNativeToken && (
        <>
          <Divider />
          <Label label="Contract" description={describeContract(symbol)} />
          <StyledTextInput placeholder="Gas Token" editable={false} />
        </>
      )}

      {isDefined(tezosContractToken) && (
        <>
          <Divider />
          <Label label="Contract" description={describeContract(symbol)} />
          <TouchableOpacity
            style={styles.addressContainer}
            onPress={() => copyStringToClipboard(tezosContractToken.address)}
          >
            <Text style={styles.addressText}>{tezosContractToken.address}</Text>
          </TouchableOpacity>
        </>
      )}

      {showEvmContract && (
        <>
          <Divider />
          <Label label="Contract" description={describeContract(symbol)} />
          <TouchableOpacity style={styles.addressContainer} onPress={() => copyStringToClipboard(descriptor.slug)}>
            <Text style={styles.addressText}>{descriptor.slug}</Text>
          </TouchableOpacity>
        </>
      )}

      {isDefined(decimals) && (
        <>
          <Divider />
          <Label label="Decimals" description={`Decimals of ${symbol} token.`} />
          <StyledTextInput placeholder={decimals.toString()} editable={false} />
        </>
      )}

      {isDefined(tezosContractToken) && <TezosTokenIdSection token={tezosContractToken} symbol={symbol} />}

      {isDefined(token) && (
        <>
          <Divider />
          <Label label="Symbol" description="Symbol of the token." />
          <StyledTextInput placeholder={symbol} editable={false} />
        </>
      )}
    </ScreenContainer>
  );
};

const describeContract = (symbol: string) =>
  symbol === '' ? 'Address of the token contract.' : `Address of a ${symbol} token contract.`;

interface TezosTokenIdSectionProps {
  token: TokenInterface;
  symbol: string;
}

const TezosTokenIdSection = ({ token, symbol }: TezosTokenIdSectionProps) => {
  const { tokenStandard, loading } = useTokenStandard(token.address);

  if (loading || !isDefined(token.id) || tokenStandard !== TezosTokenStandardsEnum.Fa2) {
    return null;
  }

  return (
    <>
      <Divider />
      <Label label="Token ID" description={`Token Id of a ${symbol} token contract.`} />
      <StyledTextInput placeholder={token.id.toString()} editable={false} />
    </>
  );
};
