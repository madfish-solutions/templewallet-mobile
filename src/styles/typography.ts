import { step } from '../config/styles';
import { fonts } from './fonts';

export const typography = {
  numbersRegular22: {
    fontFamily: fonts.rubikRegular,
    fontSize: step * 5.5
  },
  numbersRegular20: {
    fontFamily: fonts.rubikRegular,
    fontSize: step * 5
  },
  numbersRegular17: {
    fontFamily: fonts.rubikRegular,
    fontSize: step * 4.25
  },
  numbersRegular15: {
    fontFamily: fonts.rubikMedium,
    fontSize: step * 3.75
  },
  numbersRegular13: {
    fontFamily: fonts.rubikRegular,
    fontSize: step * 3.25
  },
  numbersRegular11: {
    fontFamily: fonts.rubikRegular,
    fontSize: step * 2.75
  },
  numbersMedium34: {
    fontFamily: fonts.rubikMedium,
    fontSize: step * 8.5
  },
  numbersMedium28: {
    fontFamily: fonts.rubikMedium,
    fontSize: step * 7
  },
  numbersMedium22: {
    fontFamily: fonts.rubikMedium,
    fontSize: step * 5.5
  },
  numbersMedium20: {
    fontFamily: fonts.rubikMedium,
    fontSize: step * 5
  },
  numbersMedium17: {
    fontFamily: fonts.rubikMedium,
    fontSize: step * 4.25
  },
  numbersMedium15: {
    fontFamily: fonts.rubikMedium,
    fontSize: step * 3.75
  },
  numbersMedium13: {
    fontFamily: fonts.rubikMedium,
    fontSize: step * 3.25
  },
  numbersMedium11: {
    fontFamily: fonts.rubikMedium,
    fontSize: step * 4.25
  },
  numberStatus8: {
    fontFamily: fonts.rubikSemiBold,
    fontSize: step * 2
  },
  headline1Bold40: {
    fontFamily: fonts.interBold,
    fontSize: step * 10
  },
  headline2Bold34: {
    fontFamily: fonts.interBold,
    fontSize: step * 8.5
  },
  headline3Bold28: {
    fontFamily: fonts.interBold,
    fontSize: step * 28
  },
  headline4Bold22: {
    fontFamily: fonts.interBold,
    fontSize: step * 5.5
  },
  headline4Regular22: {
    fontFamily: fonts.interRegular,
    fontSize: step * 5.5
  },
  body20Bold: {
    fontFamily: fonts.interBold,
    fontSize: step * 5
  },
  body20Regular: {
    fontFamily: fonts.interRegular,
    fontSize: step * 5
  },
  body17Semibold: {
    fontFamily: fonts.interSemiBold,
    fontSize: step * 4.25
  },
  body17Regular: {
    fontFamily: fonts.interRegular,
    fontSize: step * 4.25
  },
  body15Semibold: {
    fontFamily: fonts.interSemiBold,
    fontSize: step * 3
  },
  body15Regular: {
    fontFamily: fonts.interRegular,
    fontSize: step * 3
  },
  caption13Regular: {
    fontFamily: fonts.interRegular,
    fontSize: step * 3.25
  },
  tagline13Tag: {
    fontFamily: fonts.interSemiBold,
    fontSize: step * 3.25
  },
  caption11Regular: {
    fontFamily: fonts.interRegular,
    fontSize: step * 2.75
  },
  tagline11Tag: {
    fontFamily: fonts.interSemiBold,
    fontSize: step * 2.75
  }
};

export type Typography = {
  [key in keyof typeof typography]: Base;
};

interface Base {
  fontFamily: string;
  fontSize: number;
}
