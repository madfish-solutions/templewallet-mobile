import { BigNumber } from 'bignumber.js';
import React, { FC, useMemo } from 'react';
import { Text } from 'react-native';

import { useSelectedBakerSelector } from 'src/store/baking/baking-selectors';
import { TEZ_TOKEN_SLUG } from 'src/token/data/tokens-metadata';
import { TokenInterface } from 'src/token/interfaces/token.interface';
import { getTokenSlug } from 'src/token/utils/token.utils';
import { getDelegateText } from 'src/utils/get-delegate-text.util';
import { isDefined } from 'src/utils/is-defined';

import { TokenTagContainer } from './components/token-tag-container/token-tag-container';
import { useTokenTagStyles } from './token-tag.styles';

interface Props {
  token: TokenInterface;
  scam?: boolean;
  apy?: number;
}

const DECIMAL_VALUE = 2;

export const TokenTag: FC<Props> = ({ token, scam, apy }) => {
  const styles = useTokenTagStyles();
  const currentBaker = useSelectedBakerSelector();
  const isBakerSelected = Boolean(currentBaker);

  const tokenSlug = getTokenSlug(token);

  const isTezosToken = tokenSlug === TEZ_TOKEN_SLUG;

  const label = getDelegateText(token);

  const apyRateValue = useMemo(
    () => new BigNumber(apy ?? 0).decimalPlaces(DECIMAL_VALUE).toFixed(DECIMAL_VALUE),
    [apy]
  );

  const apyValue = useMemo(() => <Text style={styles.text}>{`${label}: ${apyRateValue}%`}</Text>, [apy]);

  const regularToken = useMemo(() => isDefined(apy) && apy > 0 && apyValue, [apy, apyValue]);

  const tag = useMemo(() => {
    if (scam) {
      return <Text style={styles.text}>Scam</Text>;
    }

    if (!isTezosToken) {
      return regularToken;
    }

    if (isBakerSelected) {
      return apyValue;
    }

    return <Text style={styles.text}>Not Delegated</Text>;
  }, [isBakerSelected, isTezosToken, regularToken, apyValue, styles.text, scam]);

  return (
    <TokenTagContainer token={token} scam={scam}>
      {tag}
    </TokenTagContainer>
  );
};
