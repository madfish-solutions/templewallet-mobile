import { debounce } from 'lodash-es';
import React, { FC, useEffect, useState } from 'react';
import { Text, FlatList, View } from 'react-native';

import { ButtonLargePrimary } from '../../components/button/button-large/button-large-primary/button-large-primary';
import { ButtonLargeSecondary } from '../../components/button/button-large/button-large-secondary/button-large-secondary';
import { ButtonsContainer } from '../../components/button/buttons-container/buttons-container';
import { DataPlaceholder } from '../../components/data-placeholder/data-placeholder';
import { Divider } from '../../components/divider/divider';
import { InsetSubstitute } from '../../components/inset-substitute/inset-substitute';
import { Label } from '../../components/label/label';
import { SearchInput } from '../../components/search-input/search-input';
import { BakerInterface } from '../../interfaces/baker.interface';
import { useNavigation } from '../../navigator/use-navigation.hook';
import { useBakersListSelector } from '../../store/baking/baking-selectors';
import { formatSize } from '../../styles/format-size';
import { isString } from '../../utils/is-string';
import { SelectBakerItem } from './select-baker-item/select-baker-item';
import { useSelectBakerModalStyles } from './select-baker-modal.styles';

export const SelectBakerModal: FC = () => {
  const { goBack } = useNavigation();
  const styles = useSelectBakerModalStyles();

  const bakersList = useBakersListSelector();

  const [filteredBakersList, setFilteredBakersList] = useState(bakersList);
  const [searchValue, setSearchValue] = useState<string>();
  const [selectedBaker, setSelectedBaker] = useState<BakerInterface>();

  const debouncedSetSearchValue = debounce(setSearchValue);

  useEffect(() => {
    if (isString(searchValue)) {
      const lowerCaseSearchValue = searchValue.toLowerCase();
      const result: BakerInterface[] = [];

      for (let i = 0; i < bakersList.length; i++) {
        const baker = bakersList[i];
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
      <View style={styles.upperContainer}>
        <Label
          label="Delegate to Recommended Bakers"
          description="Click on the Baker you want to delegate funds to. This list is powered by Baking Bad."
        />
        <SearchInput placeholder="Search baker" onChangeText={debouncedSetSearchValue} />

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

      <View style={styles.buttonsContainer}>
        <ButtonsContainer>
          <ButtonLargeSecondary title="Close" onPress={goBack} />
          <Divider size={formatSize(16)} />
          <ButtonLargePrimary title="Next" disabled={true} onPress={() => null} />
        </ButtonsContainer>

        <InsetSubstitute type="bottom" />
      </View>
    </>
  );
};
