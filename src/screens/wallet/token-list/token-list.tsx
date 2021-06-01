import { TouchableOpacity } from '@gorhom/bottom-sheet';
import React, { FC, useEffect, useState } from 'react';
import { Text, View } from 'react-native';

import { DataPlaceholder } from '../../../components/data-placeholder/data-placeholder';
import { Divider } from '../../../components/divider/divider';
import { Icon } from '../../../components/icon/icon';
import { IconNameEnum } from '../../../components/icon/icon-name.enum';
import { ScreenContainer } from '../../../components/screen-container/screen-container';
import { StyledCheckbox } from '../../../components/styled-checkbox/styled-checkbox';
import { useFilteredTokenList } from '../../../hooks/use-filtered-token-list.hook';
import { ModalsEnum } from '../../../navigator/modals.enum';
import { ScreensEnum } from '../../../navigator/screens.enum';
import { useNavigation } from '../../../navigator/use-navigation.hook';
import { formatSize } from '../../../styles/format-size';
import { XTZ_TOKEN_METADATA } from '../../../token/data/tokens-metadata';
import { filterTezos } from '../../../utils/filter.util';
import { SearchContainer } from './search-container/search-container';
import { TokenListItem } from './token-list-item/token-list-item';
import { useTokenListStyles } from './token-list.styles';

interface Props {
  tezosBalance: string;
}

export const TokenList: FC<Props> = ({ tezosBalance }) => {
  const styles = useTokenListStyles();
  const { navigate } = useNavigation();

  const { filteredTokensList, isHideZeroBalance, setIsHideZeroBalance, searchValue, setSearchValue } =
    useFilteredTokenList();
  const [isShowTezos, setIsShowTezos] = useState(true);

  const isShowPlaceholder = !isShowTezos && filteredTokensList.length === 0;

  useEffect(
    () => setIsShowTezos(filterTezos(tezosBalance, isHideZeroBalance, searchValue)),
    [isHideZeroBalance, searchValue, tezosBalance]
  );

  return (
    <>
      <View style={styles.headerContainer}>
        <View style={styles.hideZeroBalanceContainer}>
          <StyledCheckbox value={isHideZeroBalance} size={formatSize(16)} onValueChange={setIsHideZeroBalance} />
          <Divider size={formatSize(2)} />
          <Text style={styles.hideZeroBalanceText}>Hide 0 balance</Text>
        </View>

        <SearchContainer onChange={setSearchValue} />
      </View>

      <ScreenContainer>
        {isShowPlaceholder ? (
          <DataPlaceholder text="No records found." />
        ) : (
          <>
            {isShowTezos && (
              <TokenListItem
                symbol={XTZ_TOKEN_METADATA.symbol}
                name={XTZ_TOKEN_METADATA.name}
                balance={tezosBalance}
                apy={8}
                iconName={XTZ_TOKEN_METADATA.iconName}
                onPress={() => navigate(ScreensEnum.TezosTokenScreen)}
              />
            )}

            {filteredTokensList.map(token => (
              <TokenListItem
                key={token.address}
                symbol={token.symbol}
                name={token.name}
                balance={token.balance}
                iconName={token.iconName}
                onPress={() => navigate(ScreensEnum.TokenScreen, { token })}
              />
            ))}

            <Divider />
          </>
        )}

        <TouchableOpacity style={styles.addTokenButton} onPress={() => navigate(ModalsEnum.AddToken)}>
          <Icon name={IconNameEnum.PlusCircle} />
          <Text style={styles.addTokenText}>ADD TOKEN</Text>
        </TouchableOpacity>

        <Divider />
      </ScreenContainer>
    </>
  );
};
