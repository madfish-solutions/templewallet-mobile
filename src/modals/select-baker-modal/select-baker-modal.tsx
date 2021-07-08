import { OpKind } from '@taquito/taquito';
import { debounce } from 'lodash-es';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { Text, FlatList, View, ListRenderItemInfo } from 'react-native';

import { ButtonLargePrimary } from '../../components/button/button-large/button-large-primary/button-large-primary';
import { ButtonLargeSecondary } from '../../components/button/button-large/button-large-secondary/button-large-secondary';
import { DataPlaceholder } from '../../components/data-placeholder/data-placeholder';
import { Divider } from '../../components/divider/divider';
import { Dropdown } from '../../components/dropdown/dropdown';
import { Icon } from '../../components/icon/icon';
import { IconNameEnum } from '../../components/icon/icon-name.enum';
import { Label } from '../../components/label/label';
import { ModalButtonsContainer } from '../../components/modal-buttons-container/modal-buttons-container';
import { ModalStatusBar } from '../../components/modal-status-bar/modal-status-bar';
import { SearchInput } from '../../components/search-input/search-input';
import { BakersSortFieldEnum } from '../../enums/bakers-sort-field.enum';
import { BakerInterface } from '../../interfaces/baker.interface';
import { ConfirmationTypeEnum } from '../../interfaces/confirm-payload/confirmation-type.enum';
import { ModalsEnum } from '../../navigator/enums/modals.enum';
import { useNavigation } from '../../navigator/hooks/use-navigation.hook';
import { useBakersListSelector } from '../../store/baking/baking-selectors';
import { formatSize } from '../../styles/format-size';
import { isDefined } from '../../utils/is-defined';
import { isString } from '../../utils/is-string';
import { SelectBakerItem } from './select-baker-item/select-baker-item';
import { useSelectBakerModalStyles } from './select-baker-modal.styles';

// TODO: replace with translations
const bakersSortFieldsLabels: Record<BakersSortFieldEnum, string> = {
  [BakersSortFieldEnum.Fee]: 'Fee',
  [BakersSortFieldEnum.Rank]: 'Rank',
  [BakersSortFieldEnum.Space]: 'Space'
};
const bakersSortFieldsOptions = [BakersSortFieldEnum.Space, BakersSortFieldEnum.Fee, BakersSortFieldEnum.Rank];

export const SelectBakerModal: FC = () => {
  const { goBack, navigate } = useNavigation();
  const styles = useSelectBakerModalStyles();

  const bakersList = useBakersListSelector();

  const [filteredBakersList, setFilteredBakersList] = useState(bakersList);
  const [sortValue, setSortValue] = useState(BakersSortFieldEnum.Rank);
  const [searchValue, setSearchValue] = useState<string>();
  const [selectedBaker, setSelectedBaker] = useState<BakerInterface>();

  const debouncedSetSearchValue = debounce(setSearchValue);

  const handleNextPress = () => {
    isDefined(selectedBaker) &&
      navigate(ModalsEnum.Confirmation, {
        type: ConfirmationTypeEnum.InternalOperations,
        opParams: [{ kind: OpKind.DELEGATION, delegate: selectedBaker.address }]
      });
  };

  const BakerListItem = useCallback(
    ({ item }: ListRenderItemInfo<BakerInterface>) => (
      <>
        <SelectBakerItem
          baker={item}
          selected={item.address === selectedBaker?.address}
          onPress={() => setSelectedBaker(item)}
        />
        <Divider size={formatSize(16)} />
      </>
    ),
    [selectedBaker]
  );

  useEffect(() => {
    let unsortedBakersList = bakersList;
    if (isString(searchValue)) {
      const lowerCaseSearchValue = searchValue.toLowerCase();
      const result: BakerInterface[] = [];

      for (const baker of bakersList) {
        const { name, address } = baker;

        if (name.toLowerCase().includes(lowerCaseSearchValue) || address.toLowerCase().includes(lowerCaseSearchValue)) {
          result.push(baker);
        }
      }

      unsortedBakersList = result;
    }
    setFilteredBakersList(
      sortValue === BakersSortFieldEnum.Rank
        ? [...unsortedBakersList]
        : [...unsortedBakersList].sort((a, b) => {
            if (sortValue === BakersSortFieldEnum.Fee) {
              return b.fee - a.fee;
            }

            return b.freeSpace - a.freeSpace;
          })
    );
  }, [searchValue, bakersList, sortValue]);

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
          <View style={styles.sortSelector}>
            <Text style={styles.sortByLabel}>Sort by</Text>
            <Dropdown<BakersSortFieldEnum>
              title="Sort bakers by:"
              list={bakersSortFieldsOptions}
              equalityFn={(a, b) => a === b}
              renderValue={({ value }) => (
                <View style={styles.selectedBakerWrapper}>
                  <Text style={styles.selectedBakerSortField}>
                    {bakersSortFieldsLabels[value ?? BakersSortFieldEnum.Rank]}
                  </Text>
                  <Icon size={formatSize(24)} name={IconNameEnum.TriangleDown} />
                </View>
              )}
              renderListItem={({ item }) => (
                <Text style={styles.bakersSortListItem}>
                  {bakersSortFieldsLabels[item ?? BakersSortFieldEnum.Rank]}
                </Text>
              )}
              onValueChange={value => setSortValue(value ?? BakersSortFieldEnum.Rank)}
              style="nativeLike"
              contentHeight={formatSize(216)}
              value={sortValue}
            />
          </View>
        </View>

        {filteredBakersList.length === 0 && (
          <DataPlaceholder text={'Bakers do not match filter criteria.\n Please type something else.'} />
        )}
      </View>

      <FlatList
        data={filteredBakersList}
        renderItem={BakerListItem}
        keyExtractor={item => item.address}
        style={styles.flatList}
        windowSize={10}
      />

      <ModalButtonsContainer>
        <ButtonLargeSecondary title="Close" onPress={goBack} />
        <Divider size={formatSize(16)} />
        <ButtonLargePrimary title="Next" disabled={!isDefined(selectedBaker)} onPress={handleNextPress} />
      </ModalButtonsContainer>
    </>
  );
};
