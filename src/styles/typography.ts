import { step } from '../config/styles';
import { fonts } from './fonts';

export type Typography = {
  [key in keyof typeof typography]: Base;
};

interface Base {
  fontFamily: string;
  fontWeight: string;
  fontSize: number;
  letterSpacing: number;
}

export const typography = {
  numbersMedium34: {
    fontFamily: fonts.rubik,
    fontWeight: '500',
    fontSize: step * 8.5,
    letterSpacing: step * 0.1025
  },
  numbersMedium28: {
    fontFamily: fonts.rubik,
    fontWeight: '500',
    fontSize: step * 7,
    letterSpacing: 0.085
  },
  numbersRegular22: {
    fontFamily: fonts.rubik,
    fontWeight: '400',
    fontSize: step * 5.5,
    letterSpacing: step * 0.0875
  },
  numbersRegular20: {
    fontFamily: fonts.rubik,
    fontWeight: '400',
    fontSize: step * 5,
    letterSpacing: step * 0.095
  },
  numbersRegular17: {
    fontFamily: fonts.rubik,
    fontWeight: '400',
    fontSize: step * 4.25,
    letterSpacing: step * -0.1025
  },
  numbersRegular15: {
    fontFamily: fonts.rubik,
    fontWeight: '500',
    fontSize: step * 3.75,
    letterSpacing: step * -0.06
  },
  numbersRegular13: {
    fontFamily: fonts.rubik,
    fontWeight: '400',
    fontSize: step * 3.25,
    letterSpacing: step * -0.02
  },
  numbersRegular11: {
    fontFamily: fonts.rubik,
    fontWeight: '400',
    fontSize: step * 2.75,
    letterSpacing: step * 0.0175
  },
  numbersMedium22: {
    fontFamily: fonts.rubik,
    fontWeight: '500',
    fontSize: step * 5.5,
    letterSpacing: step * 0.0875
  },
  numbersMedium20: {
    fontFamily: fonts.rubik,
    fontWeight: '500',
    fontSize: step * 5,
    letterSpacing: step * 0.095
  },
  numbersMedium17: {
    fontFamily: fonts.rubik,
    fontWeight: '500',
    fontSize: step * 4.25,
    letterSpacing: step * -0.1025
  },
  numbersMedium15: {
    fontFamily: fonts.rubik,
    fontWeight: '500',
    fontSize: step * 3.75,
    letterSpacing: step * -0.06
  },
  numbersMedium13: {
    fontFamily: fonts.rubik,
    fontWeight: '500',
    fontSize: step * 3.25,
    letterSpacing: step * -0.02
  },
  numbersMedium11: {
    fontFamily: fonts.rubik,
    fontWeight: '500',
    fontSize: step * 4.25,
    letterSpacing: step * -0.1025
  },
  headline1Bold40: {
    fontFamily: fonts.inter,
    fontWeight: '700',
    fontSize: step * 10,
    letterSpacing: step * 0.1025
  },
  headline2Bold34: {
    fontFamily: fonts.inter,
    fontWeight: '700',
    fontSize: step * 8.5,
    letterSpacing: step * 0.1025
  },
  headline3Bold28: {
    fontFamily: fonts.inter,
    fontWeight: '700',
    fontSize: step * 28,
    letterSpacing: step * 0.085
  },
  headline4Bold22: {
    fontFamily: fonts.inter,
    fontWeight: '700',
    fontSize: step * 5.5,
    letterSpacing: step * 0.0875
  },
  headline4Regular22: {
    fontFamily: fonts.inter,
    fontWeight: '400',
    fontSize: step * 5.5,
    letterSpacing: step * 0.0875
  },
  body20Bold: {
    fontFamily: fonts.inter,
    fontWeight: '700',
    fontSize: step * 5,
    letterSpacing: step * 0.095
  },
  body20Regular: {
    fontFamily: fonts.inter,
    fontWeight: '400',
    fontSize: step * 5,
    letterSpacing: step * 0.095
  },
  body17Semibold: {
    fontFamily: fonts.inter,
    fontWeight: '600',
    fontSize: step * 4.25,
    letterSpacing: step * -0.1025
  },
  body17Regular: {
    fontFamily: fonts.inter,
    fontWeight: '400',
    fontSize: step * 4.25,
    letterSpacing: step * -0.1025
  },
  body15Semibold: {
    fontFamily: fonts.inter,
    fontWeight: '600',
    fontSize: step * 3,
    letterSpacing: step * -0.06
  },
  body15Regular: {
    fontFamily: fonts.inter,
    fontWeight: '400',
    fontSize: step * 3,
    letterSpacing: step * -0.06
  },
  caption13Regular: {
    fontFamily: fonts.inter,
    fontWeight: '400',
    fontSize: step * 3.25,
    letterSpacing: step * -0.02
  },
  tagline13Tag: {
    fontFamily: fonts.inter,
    fontWeight: '600',
    fontSize: step * 3.25,
    letterSpacing: step * -0.02
  },
  caption11Regular: {
    fontFamily: fonts.inter,
    fontWeight: '400',
    fontSize: step * 2.75,
    letterSpacing: step * 0.0175
  },
  tagline11Tag: {
    fontFamily: fonts.inter,
    fontWeight: '600',
    fontSize: step * 2.75,
    letterSpacing: step * 0.0175
  }
};
