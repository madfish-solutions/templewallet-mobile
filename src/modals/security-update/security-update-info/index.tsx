import React, { memo } from 'react';
import { Text, View } from 'react-native';

import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { ButtonsContainer } from 'src/components/button/buttons-container/buttons-container';
import { Disclaimer } from 'src/components/disclaimer/disclaimer';
import { Divider } from 'src/components/divider/divider';
import { useNavigationSetOptions } from 'src/components/header/use-navigation-set-options.hook';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { InsetSubstitute } from 'src/components/inset-substitute/inset-substitute';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { formatSize } from 'src/styles/format-size';

import { SecurityUpdateInfoSelectors } from './selectors';
import { useSecurityUpdateInfoStyles } from './styles';
import UpdateComp from './update-comp.svg';

interface Props {
  onNextClick: EmptyFn;
}

export const SecurityUpdateInfo = memo(({ onNextClick }: Props) => {
  const styles = useSecurityUpdateInfoStyles();
  useNavigationSetOptions({ headerLeft: () => null }, []);

  return (
    <ScreenContainer isFullScreenMode={true}>
      <Divider size={formatSize(8)} />
      <UpdateComp width={formatSize(375)} style={styles.illustration} />
      <Divider size={formatSize(24)} />
      <View style={styles.mainContent}>
        <Text style={styles.header}>Important Security Update</Text>
        <Divider size={formatSize(16)} />
        <Text style={styles.description}>
          To avoid data corruption following your device's security update, we will migrate your data from the device's
          security chip.
        </Text>
        <Divider size={formatSize(8)} />
      </View>
      <Divider size={formatSize(16)} />
      <Disclaimer iconName={IconNameEnum.AlertMonochrome}>
        <Text style={styles.disclaimerDescriptionText}>
          Please ensure you back up your seed phrase at the next step, to prevent the loss of your funds.
        </Text>
        <Divider size={formatSize(4)} />
      </Disclaimer>
      <Divider size={formatSize(16)} />
      <View>
        <ButtonsContainer>
          <ButtonLargePrimary title="Next" onPress={onNextClick} testID={SecurityUpdateInfoSelectors.nextButton} />
        </ButtonsContainer>
        <InsetSubstitute type="bottom" />
      </View>
    </ScreenContainer>
  );
});
