import { BigNumber } from 'bignumber.js';
import React, { FC, useState } from 'react';
import { TextInput } from 'react-native';

import { FarmVersionEnum } from 'src/apis/quipuswap/types';
import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { Divider } from 'src/components/divider/divider';
import { Label } from 'src/components/label/label';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { useNumericInput } from 'src/hooks/use-numeric-input.hook';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { formatSize } from 'src/styles/format-size';
import { useColors } from 'src/styles/use-colors';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';
import { isDefined } from 'src/utils/is-defined';

import { useEarnScreenStubStyles } from './styles';

export const Earn: FC = () => {
  const colors = useColors();
  const [farmId, setFarmId] = useState<BigNumber>();
  const { navigate } = useNavigation();
  const styles = useEarnScreenStubStyles();
  const { stringValue, handleBlur, handleFocus, handleChange } = useNumericInput(farmId, 0, 0, undefined, setFarmId);

  usePageAnalytic(ScreensEnum.Earn);

  return (
    <ScreenContainer>
      <Label label="V3 farm ID" />
      <TextInput
        value={stringValue}
        placeholder="0"
        style={styles.numericInput}
        placeholderTextColor={colors.gray3}
        selectionColor={colors.orange}
        editable
        autoCapitalize="words"
        keyboardType="numeric"
        onBlur={handleBlur}
        onFocus={handleFocus}
        onChangeText={handleChange}
      />
      <Divider size={formatSize(8)} />
      <ButtonLargePrimary
        disabled={!isDefined(farmId)}
        title="Select"
        onPress={() =>
          navigate(ModalsEnum.ManageFarmingPool, { id: farmId?.toFixed() ?? '0', version: FarmVersionEnum.V3 })
        }
      />
    </ScreenContainer>
  );
};
