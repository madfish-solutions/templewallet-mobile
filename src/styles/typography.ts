import { FontsEnum } from './fonts-enum';
import { formatSize } from './format-size';

export const typography = {
  numbersRegular22: {
    fontFamily: FontsEnum.rubikRegular,
    fontSize: formatSize(22)
  },
  numbersRegular20: {
    fontFamily: FontsEnum.rubikRegular,
    fontSize: formatSize(20)
  },
  numbersRegular17: {
    fontFamily: FontsEnum.rubikRegular,
    fontSize: formatSize(17)
  },
  numbersRegular15: {
    fontFamily: FontsEnum.rubikRegular,
    fontSize: formatSize(15)
  },
  numbersRegular13: {
    fontFamily: FontsEnum.rubikRegular,
    fontSize: formatSize(13)
  },
  numbersRegular11: {
    fontFamily: FontsEnum.rubikRegular,
    fontSize: formatSize(11)
  },
  numbersMedium34: {
    fontFamily: FontsEnum.rubikMedium,
    fontSize: formatSize(34)
  },
  numbersMedium28: {
    fontFamily: FontsEnum.rubikMedium,
    fontSize: formatSize(28)
  },
  numbersMedium22: {
    fontFamily: FontsEnum.rubikMedium,
    fontSize: formatSize(22)
  },
  numbersMedium20: {
    fontFamily: FontsEnum.rubikMedium,
    fontSize: formatSize(20)
  },
  numbersMedium17: {
    fontFamily: FontsEnum.rubikMedium,
    fontSize: formatSize(17)
  },
  numbersMedium15: {
    fontFamily: FontsEnum.rubikMedium,
    fontSize: formatSize(15)
  },
  numbersMedium13: {
    fontFamily: FontsEnum.rubikMedium,
    fontSize: formatSize(13)
  },
  numbersMedium11: {
    fontFamily: FontsEnum.rubikMedium,
    fontSize: formatSize(11)
  },
  numbersStatus8: {
    fontFamily: FontsEnum.rubikSemiBold,
    fontSize: formatSize(8)
  },
  headline1Bold40: {
    fontFamily: FontsEnum.interBold,
    fontSize: formatSize(40)
  },
  headline2Bold34: {
    fontFamily: FontsEnum.interBold,
    fontSize: formatSize(34)
  },
  headline3Bold28: {
    fontFamily: FontsEnum.interBold,
    fontSize: formatSize(28)
  },
  headline4Bold22: {
    fontFamily: FontsEnum.interBold,
    fontSize: formatSize(22)
  },
  headline4Regular22: {
    fontFamily: FontsEnum.interRegular,
    fontSize: formatSize(22)
  },
  body20Bold: {
    fontFamily: FontsEnum.interBold,
    fontSize: formatSize(20),
    textTransform: 'uppercase'
  },
  body20Regular: {
    fontFamily: FontsEnum.interRegular,
    fontSize: formatSize(20)
  },
  body17Semibold: {
    fontFamily: FontsEnum.interSemiBold,
    fontSize: formatSize(17)
  },
  body17Regular: {
    fontFamily: FontsEnum.interRegular,
    fontSize: formatSize(17)
  },
  body15Semibold: {
    fontFamily: FontsEnum.interSemiBold,
    fontSize: formatSize(15)
  },
  body15Regular: {
    fontFamily: FontsEnum.interRegular,
    fontSize: formatSize(15)
  },
  caption13Regular: {
    fontFamily: FontsEnum.interRegular,
    fontSize: formatSize(13)
  },
  caption13Semibold: {
    fontFamily: FontsEnum.interSemiBold,
    fontSize: formatSize(13)
  },
  tagline13Tag: {
    textTransform: 'uppercase',
    fontFamily: FontsEnum.interSemiBold,
    fontSize: formatSize(13)
  },
  caption11Regular: {
    fontFamily: FontsEnum.interRegular,
    fontSize: formatSize(11)
  },
  caption10Regular: {
    fontFamily: FontsEnum.interRegular,
    fontSize: formatSize(10)
  },
  caption11Semibold: {
    fontFamily: FontsEnum.interSemiBold,
    fontSize: formatSize(11)
  },
  tagline11Tag: {
    fontFamily: FontsEnum.interSemiBold,
    fontSize: formatSize(11)
  },
  tagline11TagUppercase: {
    textTransform: 'uppercase',
    fontFamily: FontsEnum.interSemiBold,
    fontSize: formatSize(11)
  }
};

interface FontStyles {
  fontFamily: string;
  fontSize: number;
}

export type Typography = Record<keyof typeof typography, FontStyles>;
