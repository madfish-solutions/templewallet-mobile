import { TouchableOpacity } from '@gorhom/bottom-sheet';
import React, { FC } from 'react';
import { Text } from 'react-native';

import { Divider } from '../../../components/divider/divider';
import { Icon } from '../../../components/icon/icon';
import { IconNameEnum } from '../../../components/icon/icon-name.enum';
import { ScreenContainer } from '../../../components/screen-container/screen-container';
import { ModalsEnum } from '../../../navigator/modals.enum';
import { ScreensEnum } from '../../../navigator/screens.enum';
import { useNavigation } from '../../../navigator/use-navigation.hook';
import { useTokensListSelector } from '../../../store/wallet/wallet-selectors';
import { XTZ_TOKEN_METADATA } from '../../../token/data/tokens-metadata';
import { tokenMetadataSlug } from '../../../token/utils/token.utils';
import { TokenListItem } from './token-list-item/token-list-item';
import { useTokenListStyles } from './token-list.styles';

interface Props {
  tezosBalance: string;
}

export const TokenList: FC<Props> = ({ tezosBalance }) => {
  const styles = useTokenListStyles();
  const { navigate } = useNavigation();

  const tokensList = useTokensListSelector();

  return (
    <>
      <ScreenContainer>
        <TokenListItem
          symbol={XTZ_TOKEN_METADATA.symbol}
          name={XTZ_TOKEN_METADATA.name}
          balance={tezosBalance}
          apy={8}
          iconName={XTZ_TOKEN_METADATA.iconName}
          onPress={() => navigate(ScreensEnum.TezosTokenScreen)}
        />

        {tokensList.map(token => (
          <TokenListItem
            key={token.address}
            symbol={token.symbol}
            name={token.name}
            balance={token.balance}
            iconName={token.iconName}
            onPress={() => navigate(ScreensEnum.TokenScreen, { slug: tokenMetadataSlug(token) })}
          />
        ))}

        <Divider />

        <TouchableOpacity style={styles.addTokenButton} onPress={() => navigate(ModalsEnum.AddToken)}>
          <Icon name={IconNameEnum.PlusCircle} />
          <Text style={styles.addTokenText}>ADD TOKEN</Text>
        </TouchableOpacity>

        <Divider />
      </ScreenContainer>
    </>
  );
};
