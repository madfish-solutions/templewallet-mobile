import { useIsFocused } from '@react-navigation/native';
import React, { FC, useEffect } from 'react';
import { Image, Text, View } from 'react-native';
import { useDispatch } from 'react-redux';

import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { ButtonsFloatingContainer } from 'src/components/button/buttons-floating-container/buttons-floating-container';
import { InsetSubstitute } from 'src/components/inset-substitute/inset-substitute';
import { ModalStatusBar } from 'src/components/modal-status-bar/modal-status-bar';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { setHasSeenAnnouncementAction } from 'src/store/sapling/sapling-actions';

import { useShieldedAnnouncementStyles } from './shielded-announcement-modal.styles';

export const ShieldedAnnouncementModal: FC = () => {
  const dispatch = useDispatch();
  const { goBack } = useNavigation();
  const styles = useShieldedAnnouncementStyles();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      dispatch(setHasSeenAnnouncementAction());
    }
  }, [dispatch, isFocused]);

  return (
    <>
      <ScreenContainer isFullScreenMode={false}>
        <ModalStatusBar />
        <View style={styles.container}>
          <Image
            source={require('./assets/shielded-composition.png')}
            style={styles.compositionImage}
            resizeMode="contain"
          />

          <Text style={styles.title}>Private transactions</Text>

          <Text style={styles.description}>
            Shielded Tezos transfers are now live in Temple Wallet. Send TEZ incognito, keeping your details
            confidential.
          </Text>

          <Text style={styles.description}>
            Enjoy a seamless experience with more privacy. Your shielded address is ready to use on the Receive page
            next to your public one.
          </Text>
        </View>
      </ScreenContainer>

      <ButtonsFloatingContainer>
        <ButtonLargePrimary title="Got it" onPress={goBack} />
        <InsetSubstitute type="bottom" />
      </ButtonsFloatingContainer>
    </>
  );
};
