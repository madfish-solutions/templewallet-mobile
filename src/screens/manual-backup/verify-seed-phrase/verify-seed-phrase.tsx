import { Formik } from 'formik';
import { range, shuffle } from 'lodash-es';
import React, { FC, Fragment, useEffect, useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { object, string } from 'yup';

import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { Divider } from 'src/components/divider/divider';
import { HeaderButton } from 'src/components/header/header-button/header-button';
import { HeaderProgress } from 'src/components/header/header-progress/header-progress';
import { HeaderTitle } from 'src/components/header/header-title/header-title';
import { useNavigationSetOptions } from 'src/components/header/use-navigation-set-options.hook';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { InsetSubstitute } from 'src/components/inset-substitute/inset-substitute';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { OnRampOverlayState } from 'src/enums/on-ramp-overlay-state.enum';
import { useCanUseOnRamp } from 'src/hooks/use-can-use-on-ramp.hook';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { useShelter } from 'src/shelter/use-shelter.hook';
import { madeManualBackupAction, setOnRampOverlayStateAction } from 'src/store/settings/settings-actions';
import { formatSize } from 'src/styles/format-size';
import { showErrorToast, showSuccessToast } from 'src/toast/toast.utils';
import { formatOrdinalNumber } from 'src/utils/number-format.utils';

import { VerifySeedPhraseRow } from './verify-seed-phrase-row/verify-seed-phrase-row';
import { VerifySeedPhraseSelectors } from './verify-seed-phrase.selectors';
import { useVerifySeedPhraseStyles } from './verify-seed-phrase.styles';

interface Props {
  onGoBackPress: EmptyFn;
}

const WORDS_TO_FILL = 2;

export const VerifySeedPhrase: FC<Props> = ({ onGoBackPress }) => {
  const dispatch = useDispatch();
  const styles = useVerifySeedPhraseStyles();
  const { navigate } = useNavigation();
  const { revealSeedPhrase } = useShelter();
  const canUseOnRamp = useCanUseOnRamp();

  const [words, setWords] = useState<string[]>([]);

  useNavigationSetOptions(
    {
      headerLeft: () => <HeaderButton iconName={IconNameEnum.ArrowLeft} onPress={onGoBackPress} />,
      headerRight: () => <HeaderProgress current={2} total={2} />,
      headerTitle: () => <HeaderTitle title="Verify your seed" />
    },
    []
  );
  useEffect(
    () =>
      void revealSeedPhrase({
        successCallback: value => setWords(value.split(' '))
      }),
    []
  );

  const wordsToCheckPositions = useMemo(() => {
    const shuffledPositions = shuffle(range(0, words.length));
    const selectedPositions: number[] = [];
    for (let i = 0; i < words.length; i++) {
      const newPosition = shuffledPositions[i];
      if (
        selectedPositions.every(selectedPosition => {
          const distance = Math.abs(selectedPosition - newPosition);
          if ([selectedPosition, newPosition].some(position => [0, words.length - 1].some(edge => edge === position))) {
            return distance > 2;
          }

          return distance > 1;
        })
      ) {
        selectedPositions.push(newPosition);
      }
      if (selectedPositions.length === WORDS_TO_FILL) {
        break;
      }
    }

    return selectedPositions.sort((a, b) => a - b);
  }, [words]);

  const validationSchema = useMemo(
    () =>
      object().shape(
        wordsToCheckPositions.reduce(
          (shape, index) => ({
            ...shape,
            [`word${index}`]: string().oneOf([words[index]], '').required('')
          }),
          {}
        )
      ),
    [words, wordsToCheckPositions]
  );

  const initialValues = useMemo(
    () =>
      wordsToCheckPositions.reduce(
        (previousValue, index) => ({
          ...previousValue,
          [`word${index}`]: ''
        }),
        {}
      ),
    []
  );

  const handleSubmit = () => {
    navigate(ScreensEnum.Wallet);
    dispatch(madeManualBackupAction());
    showSuccessToast({ description: 'You have successfully verified seed phrase!' });

    canUseOnRamp && dispatch(setOnRampOverlayStateAction(OnRampOverlayState.Start));
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      validateOnMount={true}
      onSubmit={handleSubmit}
    >
      {({ isValid, submitForm }) => (
        <ScreenContainer isFullScreenMode={true}>
          <View style={styles.content}>
            <Text style={styles.title}>
              Fill in the{' '}
              {wordsToCheckPositions
                .slice(0, wordsToCheckPositions.length - 1)
                .map(index => formatOrdinalNumber(index + 1))
                .join(', ')}
              {' and '}
              {formatOrdinalNumber(wordsToCheckPositions[wordsToCheckPositions.length - 1] + 1)} words to verify your
              seed backup
            </Text>
            <Divider />
            {wordsToCheckPositions.map(index => (
              <Fragment key={index}>
                <VerifySeedPhraseRow inputName={`word${index}`} index={index} words={words} />
                {index !== wordsToCheckPositions.length - 1 ? (
                  <Divider size={formatSize(42)} />
                ) : (
                  <Divider size={formatSize(16)} />
                )}
              </Fragment>
            ))}
          </View>
          <View
            onTouchStart={() => void (!isValid && showErrorToast({ description: 'Please check your seed phrase' }))}
          >
            <ButtonLargePrimary
              title="Confirm"
              disabled={!isValid}
              onPress={submitForm}
              testID={VerifySeedPhraseSelectors.nextButton}
            />
          </View>
          <InsetSubstitute type="bottom" />
        </ScreenContainer>
      )}
    </Formik>
  );
};
