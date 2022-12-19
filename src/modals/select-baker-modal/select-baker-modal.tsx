import { OpKind } from '@taquito/taquito';
import { debounce } from 'lodash-es';
import React, { FC, useEffect, useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

import { ButtonLargePrimary } from '../../components/button/button-large/button-large-primary/button-large-primary';
import { ButtonLargeSecondary } from '../../components/button/button-large/button-large-secondary/button-large-secondary';
import { DataPlaceholder } from '../../components/data-placeholder/data-placeholder';
import { Divider } from '../../components/divider/divider';
import { Label } from '../../components/label/label';
import { ModalButtonsContainer } from '../../components/modal-buttons-container/modal-buttons-container';
import { ModalStatusBar } from '../../components/modal-status-bar/modal-status-bar';
import { SearchInput } from '../../components/search-input/search-input';
import { Sorter } from '../../components/sorter/sorter';
import { BakersSortFieldEnum } from '../../enums/bakers-sort-field.enum';
import { BakerInterface } from '../../interfaces/baker.interface';
import { ConfirmationTypeEnum } from '../../interfaces/confirm-payload/confirmation-type.enum';
import { ModalsEnum } from '../../navigator/enums/modals.enum';
import { useNavigation } from '../../navigator/hooks/use-navigation.hook';
import { useBakersListSelector, useSelectedBakerSelector } from '../../store/baking/baking-selectors';
import { useSelectedAccountSelector } from '../../store/wallet/wallet-selectors';
import { formatSize } from '../../styles/format-size';
import { showErrorToast } from '../../toast/toast.utils';
import { AnalyticsEventCategory } from '../../utils/analytics/analytics-event.enum';
import { useAnalytics, usePageAnalytic } from '../../utils/analytics/use-analytics.hook';
import { isDefined } from '../../utils/is-defined';
import { isString } from '../../utils/is-string';
import { BakerListItem } from './baker-list-item/baker-list-item';
import { useSelectBakerModalStyles } from './select-baker-modal.styles';

export const RECOMMENDED_BAKER_ADDRESS = 'tz1aRoaRhSpRYvFdyvgWLL6TGyRoGF51wDjM';

const bakersSortFieldsLabels: Record<BakersSortFieldEnum, string> = {
  [BakersSortFieldEnum.Fee]: 'Fee',
  [BakersSortFieldEnum.Rank]: 'Rank',
  [BakersSortFieldEnum.Space]: 'Space',
  [BakersSortFieldEnum.Staking]: 'Staking'
};
const bakersSortFieldsOptions = [
  BakersSortFieldEnum.Space,
  BakersSortFieldEnum.Fee,
  BakersSortFieldEnum.Rank,
  BakersSortFieldEnum.Staking
];

export const SelectBakerModal: FC = () => {
  const { goBack, navigate } = useNavigation();
  const styles = useSelectBakerModalStyles();
  const [currentBaker] = useSelectedBakerSelector();

  const { trackEvent } = useAnalytics();

  const bakersList = useBakersListSelector();
  const selectedAccount = useSelectedAccountSelector();

  const [allBakers, setFilteredBakersList] = useState(bakersList);
  const [sortValue, setSortValue] = useState(BakersSortFieldEnum.Rank);
  const [searchValue, setSearchValue] = useState<string>();
  const [selectedBaker, setSelectedBaker] = useState<BakerInterface>();

  const recommendedBakers = useMemo(
    () => allBakers.filter(baker => baker.address === RECOMMENDED_BAKER_ADDRESS),
    [allBakers]
  );

  const filteredBakersList = useMemo(
    () => allBakers.filter(baker => baker.address !== RECOMMENDED_BAKER_ADDRESS),
    [allBakers]
  );

  const debouncedSetSearchValue = debounce(setSearchValue);

  usePageAnalytic(ModalsEnum.SelectBaker);

  const handleNextPress = () => {
    if (isDefined(selectedBaker)) {
      const isRecommendedBakerSelected = selectedBaker.address === RECOMMENDED_BAKER_ADDRESS;

      if (isRecommendedBakerSelected) {
        trackEvent('RECOMMENDED_BAKER_SELECTED', AnalyticsEventCategory.ButtonPress);
      }

      if (currentBaker.address === selectedBaker.address) {
        showErrorToast({
          title: 'Re-delegation is not possible',
          description: 'Already delegated funds to this baker.'
        });
      } else {
        navigate(ModalsEnum.Confirmation, {
          type: ConfirmationTypeEnum.InternalOperations,
          opParams: [
            { kind: OpKind.DELEGATION, delegate: selectedBaker.address, source: selectedAccount.publicKeyHash }
          ],
          ...(isRecommendedBakerSelected && { testID: 'RECOMMENDED_BAKER_DELEGATION' })
        });
      }
    }
  };

  const handleSortValueChange = (value: BakersSortFieldEnum) => setSortValue(value);

  useEffect(() => {
    if (isString(searchValue)) {
      const lowerCaseSearchValue = searchValue.toLowerCase();
      const result: BakerInterface[] = [];

      for (const baker of bakersList) {
        const { name, address } = baker;

        if (name.toLowerCase().includes(lowerCaseSearchValue) || address.toLowerCase().includes(lowerCaseSearchValue)) {
          result.push(baker);
        }
      }

      setFilteredBakersList(result);
    } else {
      setFilteredBakersList(bakersList);
    }
  }, [searchValue, bakersList]);

  const sortedBakersList = useMemo(() => {
    switch (sortValue) {
      case BakersSortFieldEnum.Rank:
        return filteredBakersList;
      case BakersSortFieldEnum.Fee:
        return [...filteredBakersList].sort((a, b) => a.fee - b.fee);
      case BakersSortFieldEnum.Staking:
        return [...filteredBakersList].sort((a, b) => b.stakingBalance - a.stakingBalance);
      default:
        return [...filteredBakersList].sort((a, b) => b.freeSpace - a.freeSpace);
    }
  }, [filteredBakersList, sortValue]);

  const finalBakersList = useMemo(
    () => recommendedBakers.concat(sortedBakersList),
    [recommendedBakers, sortedBakersList]
  );

  return (
    <>
      <ModalStatusBar />
      <View style={styles.background}>
        <Divider size={formatSize(16)} />
        <View style={styles.upperContainer}>
          <Label
            label="Delegate to Recommended Bakers"
            description="Click on the Baker you want to delegate funds to. This list is powered by Baking Bad."
          />
        </View>
        <View style={styles.searchContainer}>
          <SearchInput placeholder="Search baker" onChangeText={debouncedSetSearchValue} />
        </View>
        <View style={styles.upperContainer}>
          <Text style={styles.infoText}>The higher the better</Text>

          <Sorter
            sortValue={sortValue}
            description="Sort bakers by:"
            sortFieldsOptions={bakersSortFieldsOptions}
            sortFieldsLabels={bakersSortFieldsLabels}
            onSetSortValue={handleSortValueChange}
          />
        </View>
      </View>

      <FlatList
        data={finalBakersList}
        renderItem={({ item }) => (
          <BakerListItem item={item} selected={item.address === selectedBaker?.address} onPress={setSelectedBaker} />
        )}
        keyExtractor={item => item.address}
        style={styles.flatList}
        windowSize={10}
        ListEmptyComponent={
          <DataPlaceholder text={'Bakers do not match filter criteria.\n Please type something else.'} />
        }
      />

      <ModalButtonsContainer>
        <ButtonLargeSecondary title="Close" onPress={goBack} />
        <Divider size={formatSize(16)} />
        <ButtonLargePrimary title="Next" disabled={!isDefined(selectedBaker)} onPress={handleNextPress} />
      </ModalButtonsContainer>
    </>
  );
};
