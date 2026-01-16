import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Dimensions, ScaledSize } from 'react-native';

import { FontsEnum } from './fonts-enum';
import { formatTextSize } from './format-size';
import { Typography } from './typography.types';

const TypographyContext = createContext<Typography>({} as Typography);

export const TypographyProvider: FCWithChildren = ({ children }) => {
  const [fontScale, setFontScale] = useState(Dimensions.get('window').fontScale);

  useEffect(() => {
    const listener = (e: { window: ScaledSize }) => {
      setFontScale(e.window.fontScale);
    };

    const subscription = Dimensions.addEventListener('change', listener);

    return () => subscription.remove();
  }, []);

  const value = useMemo<Typography>(
    () => ({
      numbersRegular22: {
        fontFamily: FontsEnum.rubikRegular,
        fontSize: formatTextSize(22)
      },
      numbersRegular20: {
        fontFamily: FontsEnum.rubikRegular,
        fontSize: formatTextSize(20)
      },
      numbersRegular17: {
        fontFamily: FontsEnum.rubikRegular,
        fontSize: formatTextSize(17)
      },
      numbersRegular15: {
        fontFamily: FontsEnum.rubikRegular,
        fontSize: formatTextSize(15)
      },
      numbersRegular13: {
        fontFamily: FontsEnum.rubikRegular,
        fontSize: formatTextSize(13)
      },
      numbersRegular11: {
        fontFamily: FontsEnum.rubikRegular,
        fontSize: formatTextSize(11)
      },
      numbersMedium34: {
        fontFamily: FontsEnum.rubikMedium,
        fontSize: formatTextSize(34)
      },
      numbersMedium28: {
        fontFamily: FontsEnum.rubikMedium,
        fontSize: formatTextSize(28)
      },
      numbersMedium22: {
        fontFamily: FontsEnum.rubikMedium,
        fontSize: formatTextSize(22)
      },
      numbersMedium20: {
        fontFamily: FontsEnum.rubikMedium,
        fontSize: formatTextSize(20)
      },
      numbersMedium17: {
        fontFamily: FontsEnum.rubikMedium,
        fontSize: formatTextSize(17)
      },
      numbersMedium15: {
        fontFamily: FontsEnum.rubikMedium,
        fontSize: formatTextSize(15)
      },
      numbersMedium13: {
        fontFamily: FontsEnum.rubikMedium,
        fontSize: formatTextSize(13)
      },
      numbersMedium11: {
        fontFamily: FontsEnum.rubikMedium,
        fontSize: formatTextSize(11)
      },
      numbersStatus8: {
        fontFamily: FontsEnum.rubikSemiBold,
        fontSize: formatTextSize(8)
      },
      headline1Bold40: {
        fontFamily: FontsEnum.interBold,
        fontSize: formatTextSize(40)
      },
      headline2Bold34: {
        fontFamily: FontsEnum.interBold,
        fontSize: formatTextSize(34)
      },
      headline3Bold28: {
        fontFamily: FontsEnum.interBold,
        fontSize: formatTextSize(28)
      },
      headline4Bold22: {
        fontFamily: FontsEnum.interBold,
        fontSize: formatTextSize(22)
      },
      headline4Regular22: {
        fontFamily: FontsEnum.interRegular,
        fontSize: formatTextSize(22)
      },
      body20Bold: {
        fontFamily: FontsEnum.interBold,
        fontSize: formatTextSize(20),
        textTransform: 'uppercase'
      },
      body20Regular: {
        fontFamily: FontsEnum.interRegular,
        fontSize: formatTextSize(20)
      },
      body17Semibold: {
        fontFamily: FontsEnum.interSemiBold,
        fontSize: formatTextSize(17)
      },
      body17Regular: {
        fontFamily: FontsEnum.interRegular,
        fontSize: formatTextSize(17)
      },
      body15Semibold: {
        fontFamily: FontsEnum.interSemiBold,
        fontSize: formatTextSize(15)
      },
      body15Regular: {
        fontFamily: FontsEnum.interRegular,
        fontSize: formatTextSize(15)
      },
      caption13Regular: {
        fontFamily: FontsEnum.interRegular,
        fontSize: formatTextSize(13)
      },
      caption13Semibold: {
        fontFamily: FontsEnum.interSemiBold,
        fontSize: formatTextSize(13)
      },
      tagline13Tag: {
        textTransform: 'uppercase',
        fontFamily: FontsEnum.interSemiBold,
        fontSize: formatTextSize(13)
      },
      caption10Regular: {
        fontFamily: FontsEnum.interRegular,
        fontSize: formatTextSize(10)
      },
      caption11Regular: {
        fontFamily: FontsEnum.interRegular,
        fontSize: formatTextSize(11)
      },
      caption11Semibold: {
        fontFamily: FontsEnum.interSemiBold,
        fontSize: formatTextSize(11)
      },
      tagline11Tag: {
        fontFamily: FontsEnum.interSemiBold,
        fontSize: formatTextSize(11)
      },
      tagline11TagUppercase: {
        textTransform: 'uppercase',
        fontFamily: FontsEnum.interSemiBold,
        fontSize: formatTextSize(11)
      }
    }),
    [fontScale]
  );

  return <TypographyContext.Provider value={value}>{children}</TypographyContext.Provider>;
};

export const useTypography = () => useContext(TypographyContext);
