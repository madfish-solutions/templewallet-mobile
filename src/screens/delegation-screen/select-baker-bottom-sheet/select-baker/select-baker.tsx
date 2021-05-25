import React, { FC, Fragment } from 'react';
import { FlatList, View } from 'react-native';

import { ButtonLargePrimary } from '../../../../components/button/button-large/button-large-primary/button-large-primary';
import { ButtonLargeSecondary } from '../../../../components/button/button-large/button-large-secondary/button-large-secondary';
import { ButtonsContainer } from '../../../../components/button/buttons-container/buttons-container';
import { Divider } from '../../../../components/divider/divider';
import { Label } from '../../../../components/label/label';
import { EmptyFn } from '../../../../config/general';
import { useBakersListSelector } from '../../../../store/baking/baking-selectors';
import { formatSize } from '../../../../styles/format-size';
import { SelectBakerItem } from './select-baker-item/select-baker-item';

interface Props {
  onFormSubmitted: EmptyFn;
  onCloseButtonPress: EmptyFn;
  onNextButtonPress: EmptyFn;
}

export const SelectBaker: FC<Props> = ({ onFormSubmitted, onCloseButtonPress, onNextButtonPress }) => {
  const bakersList = useBakersListSelector();
  console.log(bakersList.length);

  return (
    <>
      <Label
        label="Delegate to Recommended Bakers"
        description="Click on the Baker you want to delegate funds to. This list is powered by Baking Bad."
      />
      <View style={{ flex: 1, backgroundColor: 'red' }}>
        <FlatList
          data={bakersList}
          renderItem={({ item }) => (
            <>
              <SelectBakerItem baker={item} />
              <Divider size={formatSize(16)} />
            </>
          )}
          keyExtractor={item => item.address}
          windowSize={10}
        />
      </View>

      <Divider size={formatSize(16)} />

      <ButtonsContainer>
        <ButtonLargeSecondary title="Close" onPress={onCloseButtonPress} />
        <Divider size={formatSize(16)} />
        <ButtonLargePrimary title="Next" disabled={false} onPress={onNextButtonPress} />
      </ButtonsContainer>
    </>
  );
};
