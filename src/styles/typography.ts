import { step } from '../config/styles';
import { FontsEnum } from './fonts-enum';

export const typography = {
  numbersRegular22: {
    fontFamily: FontsEnum.rubikRegular,
    fontSize: step * 5.5
  },
  numbersRegular20: {
    fontFamily: FontsEnum.rubikRegular,
    fontSize: step * 5
  },
  numbersRegular17: {
    fontFamily: FontsEnum.rubikRegular,
    fontSize: step * 4.25
  },
  numbersRegular15: {
    fontFamily: FontsEnum.rubikMedium,
    fontSize: step * 3.75
  },
  numbersRegular13: {
    fontFamily: FontsEnum.rubikRegular,
    fontSize: step * 3.25
  },
  numbersRegular11: {
    fontFamily: FontsEnum.rubikRegular,
    fontSize: step * 2.75
  },
  numbersMedium34: {
    fontFamily: FontsEnum.rubikMedium,
    fontSize: step * 8.5
  },
  numbersMedium28: {
    fontFamily: FontsEnum.rubikMedium,
    fontSize: step * 7
  },
  numbersMedium22: {
    fontFamily: FontsEnum.rubikMedium,
    fontSize: step * 5.5
  },
  numbersMedium20: {
    fontFamily: FontsEnum.rubikMedium,
    fontSize: step * 5
  },
  numbersMedium17: {
    fontFamily: FontsEnum.rubikMedium,
    fontSize: step * 4.25
  },
  numbersMedium15: {
    fontFamily: FontsEnum.rubikMedium,
    fontSize: step * 3.75
  },
  numbersMedium13: {
    fontFamily: FontsEnum.rubikMedium,
    fontSize: step * 3.25
  },
  numbersMedium11: {
    fontFamily: FontsEnum.rubikMedium,
    fontSize: step * 4.25
  },
  numberStatus8: {
    fontFamily: FontsEnum.rubikSemiBold,
    fontSize: step * 2
  },
  headline1Bold40: {
    fontFamily: FontsEnum.interBold,
    fontSize: step * 10
  },
  headline2Bold34: {
    fontFamily: FontsEnum.interBold,
    fontSize: step * 8.5
  },
  headline3Bold28: {
    fontFamily: FontsEnum.interBold,
    fontSize: step * 28
  },
  headline4Bold22: {
    fontFamily: FontsEnum.interBold,
    fontSize: step * 5.5
  },
  headline4Regular22: {
    fontFamily: FontsEnum.interRegular,
    fontSize: step * 5.5
  },
  body20Bold: {
    fontFamily: FontsEnum.interBold,
    fontSize: step * 5
  },
  body20Regular: {
    fontFamily: FontsEnum.interRegular,
    fontSize: step * 5
  },
  body17Semibold: {
    fontFamily: FontsEnum.interSemiBold,
    fontSize: step * 4.25
  },
  body17Regular: {
    fontFamily: FontsEnum.interRegular,
    fontSize: step * 4.25
  },
  body15Semibold: {
    fontFamily: FontsEnum.interSemiBold,
    fontSize: step * 3
  },
  body15Regular: {
    fontFamily: FontsEnum.interRegular,
    fontSize: step * 3
  },
  caption13Regular: {
    fontFamily: FontsEnum.interRegular,
    fontSize: step * 3.25
  },
  tagline13Tag: {
    fontFamily: FontsEnum.interSemiBold,
    fontSize: step * 3.25
  },
  caption11Regular: {
    fontFamily: FontsEnum.interRegular,
    fontSize: step * 2.75
  },
  tagline11Tag: {
    fontFamily: FontsEnum.interSemiBold,
    fontSize: step * 2.75
  }
};

interface FontStyles {
  fontFamily: string;
  fontSize: number;
}

export type Typography = Record<keyof typeof typography, FontStyles>;
