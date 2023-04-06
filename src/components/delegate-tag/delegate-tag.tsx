import React, { FC, useMemo } from 'react';
import { Text } from 'react-native';

import { useSelectedBakerSelector } from '../../store/baking/baking-selectors';
import { TEZ_TOKEN_SLUG } from '../../token/data/tokens-metadata';
import { TokenInterface } from '../../token/interfaces/token.interface';
import { getTokenSlug } from '../../token/utils/token.utils';
import { isDefined } from '../../utils/is-defined';
import ABContainer from '../ab-container/ab-container';
import { DelegateTagA } from './components/delegate-ab-components/delegate-tag-a/delegate-tag-a';
import { DelegateTagB } from './components/delegate-ab-components/delegate-tag-b/delegate-tag-b';
import { DelegateTagContainer } from './components/delegate-tag-container/delegate-tag-container';
import { useDelegateTagStyles } from './delegate-tag.styles';

interface Props {
  token: TokenInterface;
  apy?: number;
}

export const DelegateTag: FC<Props> = ({ apy, token }) => {
  const styles = useDelegateTagStyles();
  const [, isBakerSelected] = useSelectedBakerSelector();

  const tokenSlug = useMemo(() => getTokenSlug(token), [token]);

  const isTezosToken = useMemo(() => tokenSlug === TEZ_TOKEN_SLUG, [tokenSlug]);

  const apyValue = useMemo(() => <Text style={styles.text}>APY: {apy}%</Text>, [apy]);

  const regularToken = useMemo(() => isDefined(apy) && apy > 0 && apyValue, [apy, apyValue]);

  const tag = useMemo(() => {
    if (!isTezosToken) {
      return regularToken;
    }

    if (isBakerSelected) {
      return apyValue;
    }

    return (
      <ABContainer
        groupAComponent={<DelegateTagA style={styles.text} />}
        groupBComponent={<DelegateTagB style={styles.text} />}
      />
    );
  }, [isBakerSelected, isTezosToken, regularToken, apyValue]);

  return <DelegateTagContainer token={token}>{tag}</DelegateTagContainer>;
};
