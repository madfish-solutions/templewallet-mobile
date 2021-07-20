import React, { FC, useEffect, useState } from 'react';
import { Text, View } from 'react-native';

import { Checkbox } from '../../../components/checkbox/checkbox';
import { DataPlaceholder } from '../../../components/data-placeholder/data-placeholder';
import { Divider } from '../../../components/divider/divider';
import { PlusCircleButton } from '../../../components/plus-circle-button/plus-circle-button';
import { ScreenContainer } from '../../../components/screen-container/screen-container';
import { delegationApy } from '../../../config/general';
import { useFilteredTokenList } from '../../../hooks/use-filtered-token-list.hook';
import { ModalsEnum } from '../../../navigator/enums/modals.enum';
import { ScreensEnum } from '../../../navigator/enums/screens.enum';
import { useNavigation } from '../../../navigator/hooks/use-navigation.hook';
import { useTezosTokenSelector, useVisibleTokensListSelector } from '../../../store/wallet/wallet-selectors';
import { formatSize } from '../../../styles/format-size';
import { filterTezos } from '../../../utils/filter.util';
import { SearchContainer } from './search-container/search-container';
import { TokenListItem } from './token-list-item/token-list-item';
import { useTokenListStyles } from './token-list.styles';

export const TokenList: FC = () => {
  const styles = useTokenListStyles();
  const { navigate } = useNavigation();

  const tezosToken = useTezosTokenSelector();
  const visibleTokensList = useVisibleTokensListSelector();
  const { filteredTokensList, isHideZeroBalance, setIsHideZeroBalance, searchValue, setSearchValue } =
    useFilteredTokenList(visibleTokensList);
  const [isShowTezos, setIsShowTezos] = useState(true);

  const isShowPlaceholder = !isShowTezos && filteredTokensList.length === 0;

  useEffect(
    () => setIsShowTezos(filterTezos(tezosToken.balance, isHideZeroBalance, searchValue)),
    [isHideZeroBalance, searchValue, tezosToken.balance]
  );

  return (
    <>
      <View style={styles.headerContainer}>
        <View style={styles.hideZeroBalanceContainer}>
          <Checkbox
            value={isHideZeroBalance}
            size={formatSize(16)}
            strokeWidth={formatSize(2)}
            onChange={setIsHideZeroBalance}>
            <Divider size={formatSize(4)} />
            <Text style={styles.hideZeroBalanceText}>Hide 0 balance</Text>
          </Checkbox>
        </View>

        <SearchContainer onChange={setSearchValue} />
      </View>

      <ScreenContainer contentContainerStyle={styles.contentContainerStyle}>
        {isShowPlaceholder ? (
          <DataPlaceholder text="No records found." />
        ) : (
          <>
            {isShowTezos && (
              <TokenListItem
                token={tezosToken}
                apy={delegationApy}
                onPress={() => navigate(ScreensEnum.TezosTokenScreen)}
              />
            )}

            {filteredTokensList.map(
              token =>
                token.isVisible && (
                  <TokenListItem
                    key={token.address}
                    token={token}
                    onPress={() => navigate(ScreensEnum.TokenScreen, { token })}
                  />
                )
            )}

            <Divider />
          </>
        )}

        <PlusCircleButton text="ADD TOKEN" onPress={() => navigate(ModalsEnum.AddToken)} />
        <Divider />
      </ScreenContainer>
    </>
  );
};
