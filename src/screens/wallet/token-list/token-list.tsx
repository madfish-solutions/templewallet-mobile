import React, { FC, useEffect, useState } from 'react';
import { Text, View } from 'react-native';

import { Checkbox } from '../../../components/checkbox/checkbox';
import { DataPlaceholder } from '../../../components/data-placeholder/data-placeholder';
import { Divider } from '../../../components/divider/divider';
import { ScreenContainer } from '../../../components/screen-container/screen-container';
import { QUIPU_SLUG } from '../../../config/tokens';
import { VisibilityEnum } from '../../../enums/visibility.enum';
import { useFilteredAssetsList } from '../../../hooks/use-filtered-assets-list.hook';
import { useSortedAssetsList } from '../../../hooks/use-sorted-assets-list.hook';
import { ScreensEnum } from '../../../navigator/enums/screens.enum';
import { useNavigation } from '../../../navigator/hooks/use-navigation.hook';
import { useTezosTokenSelector, useVisibleTokensListSelector } from '../../../store/wallet/wallet-selectors';
import { formatSize } from '../../../styles/format-size';
import { getTokenSlug } from '../../../token/utils/token.utils';
import { filterTezos } from '../../../utils/filter.util';
import { SearchContainer } from './search-container/search-container';
import { QuipuToken } from './token-list-item/quipu-token';
import { TezosToken } from './token-list-item/tezos-token';
import { TokenListItem } from './token-list-item/token-list-item';
import { TokenListSelectors } from './token-list.selectors';
import { useTokenListStyles } from './token-list.styles';

export const TokenList: FC = () => {
  const styles = useTokenListStyles();
  const { navigate } = useNavigation();

  const tezosToken = useTezosTokenSelector();
  const visibleTokensList = useVisibleTokensListSelector();
  const { filteredAssetsList, isHideZeroBalance, setIsHideZeroBalance, searchValue, setSearchValue } =
    useFilteredAssetsList(visibleTokensList);
  const sortedAssetsList = useSortedAssetsList(filteredAssetsList);
  const [isShowTezos, setIsShowTezos] = useState(true);

  const isShowPlaceholder = !isShowTezos && sortedAssetsList.length === 0;

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
            onChange={setIsHideZeroBalance}
          >
            <Divider size={formatSize(4)} />
            <Text style={styles.hideZeroBalanceText}>Hide 0 balance</Text>
          </Checkbox>
        </View>

        <SearchContainer onChange={setSearchValue} />
      </View>

      <ScreenContainer contentContainerStyle={styles.contentContainerStyle} testID={TokenListSelectors.TokenList}>
        {isShowPlaceholder ? (
          <DataPlaceholder text="No records found." />
        ) : (
          <>
            {isShowTezos && <TezosToken />}

            {sortedAssetsList.map(
              token =>
                token.visibility === VisibilityEnum.Visible &&
                (getTokenSlug(token) === QUIPU_SLUG ? (
                  <QuipuToken key={getTokenSlug(token)} token={token} />
                ) : (
                  <TokenListItem
                    key={getTokenSlug(token)}
                    token={token}
                    onPress={() => navigate(ScreensEnum.TokenScreen, { token })}
                  />
                ))
            )}

            <Divider />
          </>
        )}
      </ScreenContainer>
    </>
  );
};
