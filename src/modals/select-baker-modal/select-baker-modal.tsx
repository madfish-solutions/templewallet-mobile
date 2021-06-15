import { OpKind } from '@taquito/taquito';
import { debounce } from 'lodash-es';
import React, { FC, useEffect, useState } from 'react';
import { Text, FlatList, View } from 'react-native';

import { ButtonLargePrimary } from '../../components/button/button-large/button-large-primary/button-large-primary';
import { ButtonLargeSecondary } from '../../components/button/button-large/button-large-secondary/button-large-secondary';
import { DataPlaceholder } from '../../components/data-placeholder/data-placeholder';
import { Divider } from '../../components/divider/divider';
import { Label } from '../../components/label/label';
import { ModalButtonsContainer } from '../../components/modal-buttons-container/modal-buttons-container';
import { SearchInput } from '../../components/search-input/search-input';
import { BakerInterface } from '../../interfaces/baker.interface';
import { ConfirmationTypeEnum } from '../../interfaces/confirm-payload/confirmation-type.enum';
import { ModalsEnum } from '../../navigator/enums/modals.enum';
import { useNavigation } from '../../navigator/hooks/use-navigation.hook';
import { useBakersListSelector } from '../../store/baking/baking-selectors';
import { useSelectedAccountSelector } from '../../store/wallet/wallet-selectors';
import { formatSize } from '../../styles/format-size';
import { isDefined } from '../../utils/is-defined';
import { isString } from '../../utils/is-string';
import { SelectBakerItem } from './select-baker-item/select-baker-item';
import { useSelectBakerModalStyles } from './select-baker-modal.styles';

export const SelectBakerModal: FC = () => {
  const { goBack, navigate } = useNavigation();
  const styles = useSelectBakerModalStyles();

  const bakersList = useBakersListSelector();
  const selectedAccount = useSelectedAccountSelector();

  const [filteredBakersList, setFilteredBakersList] = useState(bakersList);
  const [searchValue, setSearchValue] = useState<string>();
  const [selectedBaker, setSelectedBaker] = useState<BakerInterface>();

  const debouncedSetSearchValue = debounce(setSearchValue);

  const handleNextPress = () => {
    isDefined(selectedBaker) &&
      navigate(ModalsEnum.Confirmation, {
        type: ConfirmationTypeEnum.InternalOperations,
        sender: selectedAccount,
        opParams: [{ kind: OpKind.DELEGATION, delegate: selectedBaker.address }]
      });
  };

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

  return (
    <>
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
      </View>

      {filteredBakersList.length === 0 && (
        <DataPlaceholder text={'Bakers do not match filter criteria.\n Please type something else.'} />
      )}

      <FlatList
        data={filteredBakersList}
        renderItem={({ item }) => (
          <>
            <SelectBakerItem
              baker={item}
              selected={item.address === selectedBaker?.address}
              onPress={() => setSelectedBaker(item)}
            />
            <Divider size={formatSize(16)} />
          </>
        )}
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
