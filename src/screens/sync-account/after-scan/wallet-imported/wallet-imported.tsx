import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { AttentionMessage } from '../../../../components/attention-message/attention-message';
import { ButtonLargePrimary } from '../../../../components/button/button-large/button-large-primary/button-large-primary';
import { Divider } from '../../../../components/divider/divider';
import { HeaderButton } from '../../../../components/header/header-button/header-button';
import { HeaderTitle } from '../../../../components/header/header-title/header-title';
import { useNavigationSetOptions } from '../../../../components/header/use-navigation-set-options.hook';
import { Icon } from '../../../../components/icon/icon';
import { IconNameEnum } from '../../../../components/icon/icon-name.enum';
import { InsetSubstitute } from '../../../../components/inset-substitute/inset-substitute';
import { ScreenContainer } from '../../../../components/screen-container/screen-container';
import { useShelter } from '../../../../shelter/use-shelter.hook';
import { formatSize } from '../../../../styles/format-size';
import { useWalletImportedStyles } from './wallet-imported.styles';

interface WalletImportedProps {
  seedPhrase: string;
  password: string;
  useBiometry?: boolean;
  onGoBackPress: () => void;
}

export const WalletImported: FC<WalletImportedProps> = ({ seedPhrase, password, useBiometry, onGoBackPress }) => {
  const styles = useWalletImportedStyles();
  const { importWallet } = useShelter();

  useNavigationSetOptions(
    {
      headerLeft: () => <HeaderButton iconName={IconNameEnum.ArrowLeft} onPress={onGoBackPress} />,
      headerTitle: () => <HeaderTitle title="" />
    },
    []
  );

  const handlePress = () => {
    importWallet(seedPhrase, password, useBiometry);
  };

  return (
    <ScreenContainer isFullScreenMode={true}>
      <View style={styles.imageView}>
        <InsetSubstitute />
        <Icon name={IconNameEnum.TempleLogoWithText} width={formatSize(208)} height={formatSize(64)} />
      </View>
      <Divider />
      <View>
        <Text style={styles.title}>Done! Wallet imported.</Text>
        <Divider />
        <Text style={styles.description}>
          Just remember, Temple Wallet cannot recover your Seed Phrase should you lose it.
        </Text>
      </View>
      <Divider />
      <View>
        <AttentionMessage>
          <View>
            <Text style={styles.alertDescription}>
              The password to unlock your mobile temple wallet is the same you set for the extension.
            </Text>
          </View>
        </AttentionMessage>
        <Divider />
        <ButtonLargePrimary title="Done" onPress={handlePress} />
        <Divider size={formatSize(43)} />
        <InsetSubstitute type="bottom" />
      </View>
    </ScreenContainer>
  );
};
