import { Formik } from 'formik';
import { range, shuffle } from 'lodash-es';
import React, { FC, Fragment, useMemo } from 'react';
import { Text, View } from 'react-native';
import { object, string, StringSchema } from 'yup';

import { ButtonLargePrimary } from '../../../components/button/button-large/button-large-primary/button-large-primary';
import { Divider } from '../../../components/divider/divider';
import { HeaderButton } from '../../../components/header/header-button/header-button';
import { HeaderTitle } from '../../../components/header/header-title/header-title';
import { useNavigationSetOptions } from '../../../components/header/use-navigation-set-options.hook';
import { IconNameEnum } from '../../../components/icon/icon-name.enum';
import { ScreenContainer } from '../../../components/screen-container/screen-container';
import { formatSize } from '../../../styles/format-size';
import { showErrorToast } from '../../../toast/toast.utils';
import { formatOrdinalNumber } from '../../../utils/i18n.utils';
import { VerifySeedPhraseRow } from './verify-seed-phrase-row/verify-seed-phrase-row';
import { useVerifySeedPhraseStyles } from './verify-seed-phrase.styles';

type VerifySeedPhraseProps = {
  seedPhrase: string;
  onVerify: () => void;
  onGoBackPress: () => void;
};

const WORDS_TO_FILL = 2;

export const VerifySeedPhrase: FC<VerifySeedPhraseProps> = ({ seedPhrase, onVerify, onGoBackPress }) => {
  const styles = useVerifySeedPhraseStyles();

  useNavigationSetOptions(
    {
      headerLeft: () => <HeaderButton iconName={IconNameEnum.ArrowLeft} onPress={onGoBackPress} />,
      headerTitle: () => <HeaderTitle title="Create a new Wallet" />
    },
    []
  );

  const words = useMemo(() => seedPhrase.split(' '), [seedPhrase]);
  const wordsToCheckPositions = useMemo(() => {
    const shuffledPositions = shuffle(range(0, words.length));
    const selectedPositions: number[] = [];
    for (let i = 0; i < words.length; i++) {
      const newPosition = shuffledPositions[i];
      if (
        selectedPositions.every(selectedPosition => {
          if (selectedPosition === 0) {
            return newPosition > 2;
          }
          if (selectedPosition === words.length - 1) {
            return newPosition < words.length - 3;
          }
          if (newPosition === 0) {
            return selectedPosition > 2;
          }
          if (newPosition === words.length - 1) {
            return selectedPosition < words.length - 3;
          }

          return Math.abs(selectedPosition - newPosition) > 1;
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
        wordsToCheckPositions.reduce<Record<string, StringSchema>>(
          (shape, wordPosition, index) => ({
            ...shape,
            [`word${index}`]: string().oneOf([words[wordPosition]], '').required('')
          }),
          {}
        )
      ),
    [words, wordsToCheckPositions]
  );

  const initialValues = useMemo(
    () =>
      wordsToCheckPositions.reduce<Record<string, string>>(
        (previousValue, _, index) => ({
          ...previousValue,
          [`word${index}`]: ''
        }),
        {}
      ),
    []
  );

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onVerify}
      validateOnMount={true}>
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
            {wordsToCheckPositions.map((wordPosition, index) => (
              <Fragment key={index}>
                <VerifySeedPhraseRow index={index} wordPosition={wordPosition} words={words} />
                {index !== wordsToCheckPositions.length - 1 ? (
                  <Divider size={formatSize(42)} />
                ) : (
                  <Divider size={formatSize(16)} />
                )}
              </Fragment>
            ))}
          </View>
          <View onTouchStart={() => void (!isValid && showErrorToast('Please check your seed phrase'))}>
            <ButtonLargePrimary title="Next" disabled={!isValid} onPress={submitForm} />
          </View>
        </ScreenContainer>
      )}
    </Formik>
  );
};
