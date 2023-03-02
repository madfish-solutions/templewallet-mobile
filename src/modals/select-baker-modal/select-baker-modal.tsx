import { OpKind } from '@taquito/taquito';
import { debounce } from 'lodash-es';
import React, { FC, useEffect, useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

import { BakerInterface } from 'src/apis/baking-bad';
import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { ButtonLargeSecondary } from 'src/components/button/button-large/button-large-secondary/button-large-secondary';
import { DataPlaceholder } from 'src/components/data-placeholder/data-placeholder';
import { Divider } from 'src/components/divider/divider';
import { Label } from 'src/components/label/label';
import { ModalButtonsContainer } from 'src/components/modal-buttons-container/modal-buttons-container';
import { ModalStatusBar } from 'src/components/modal-status-bar/modal-status-bar';
import { SearchInput } from 'src/components/search-input/search-input';
import { Sorter } from 'src/components/sorter/sorter';
import { BakersSortFieldEnum } from 'src/enums/bakers-sort-field.enum';
import { ConfirmationTypeEnum } from 'src/interfaces/confirm-payload/confirmation-type.enum';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { useBakersListSelector, useSelectedBakerSelector } from 'src/store/baking/baking-selectors';
import { useSelectedAccountSelector } from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';
import { showErrorToast } from 'src/toast/toast.utils';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics, usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';
import { isDefined } from 'src/utils/is-defined';
import { isString } from 'src/utils/is-string';

import { BakerListItem } from './baker-list-item/baker-list-item';
import { SelectBakerModalSelectors } from './select-baker-modal.selectors';
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

  const selectedAccount = useSelectedAccountSelector();

  const bakersList = useBakersListSelector();
  const activeBakers = useMemo(() => bakersList.filter(baker => baker.serviceHealth === 'active'), [bakersList]);

  const [allBakers, setFilteredBakersList] = useState(activeBakers);
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

      for (const baker of activeBakers) {
        const { name, address } = baker;

        if (name.toLowerCase().includes(lowerCaseSearchValue) || address.toLowerCase().includes(lowerCaseSearchValue)) {
          result.push(baker);
        }
      }

      setFilteredBakersList(result);
    } else {
      setFilteredBakersList(activeBakers);
    }
  }, [searchValue, activeBakers]);

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
          <SearchInput
            placeholder="Search baker"
            onChangeText={debouncedSetSearchValue}
            testID={SelectBakerModalSelectors.searchBakerInput}
          />
        </View>
        <View style={styles.upperContainer}>
          <Text style={styles.infoText}>The higher the better</Text>

          <Sorter
            sortValue={sortValue}
            description="Sort bakers by:"
            sortFieldsOptions={bakersSortFieldsOptions}
            sortFieldsLabels={bakersSortFieldsLabels}
            onSetSortValue={handleSortValueChange}
            testID={SelectBakerModalSelectors.sortByDropDownButton}
          />
        </View>
      </View>

      <FlatList
        data={finalBakersList}
        renderItem={({ item }) => (
          <BakerListItem
            item={item}
            selected={item.address === selectedBaker?.address}
            onPress={setSelectedBaker}
            testID={SelectBakerModalSelectors.bakerItem}
          />
        )}
        keyExtractor={item => item.address}
        style={styles.flatList}
        windowSize={10}
        ListEmptyComponent={
          <DataPlaceholder text={'Bakers do not match filter criteria.\n Please type something else.'} />
        }
      />

      <ModalButtonsContainer>
        <ButtonLargeSecondary title="Close" onPress={goBack} testID={SelectBakerModalSelectors.closeButton} />
        <Divider size={formatSize(16)} />
        <ButtonLargePrimary
          title="Next"
          disabled={!isDefined(selectedBaker)}
          onPress={handleNextPress}
          testID={SelectBakerModalSelectors.nextButton}
        />
      </ModalButtonsContainer>
    </>
  );
};
