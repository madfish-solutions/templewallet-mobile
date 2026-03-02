type TypographyKey =
  | 'numbersRegular22'
  | 'numbersRegular20'
  | 'numbersRegular17'
  | 'numbersRegular15'
  | 'numbersRegular13'
  | 'numbersRegular11'
  | 'numbersMedium34'
  | 'numbersMedium28'
  | 'numbersMedium22'
  | 'numbersMedium20'
  | 'numbersMedium17'
  | 'numbersMedium15'
  | 'numbersMedium13'
  | 'numbersMedium11'
  | 'numbersStatus8'
  | 'body18Semibold'
  | 'headline1Bold40'
  | 'headline2Bold34'
  | 'headline3Bold28'
  | 'headline4Bold22'
  | 'headline4Regular22'
  | 'body20Bold'
  | 'body20Regular'
  | 'body17Semibold'
  | 'body17Regular'
  | 'body15Semibold'
  | 'body15Regular'
  | 'caption13Regular'
  | 'caption13Semibold'
  | 'tagline13Tag'
  | 'caption10Regular'
  | 'caption11Regular'
  | 'caption11Semibold'
  | 'tagline11Tag'
  | 'tagline11TagUppercase';

interface FontStyles {
  fontFamily: string;
  fontSize: number;
}

export type Typography = Record<TypographyKey, FontStyles>;
