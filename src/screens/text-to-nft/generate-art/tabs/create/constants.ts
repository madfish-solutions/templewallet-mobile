interface ArtStyleItem {
  id: number;
  title: string;
}

export const ART_STYLE_ITEMS: ArtStyleItem[] = [
  {
    id: 1,
    title: 'Pop Art'
  },
  {
    id: 2,
    title: 'Cubism'
  },
  {
    id: 3,
    title: 'Impressionism'
  },
  {
    id: 4,
    title: 'Surrealism'
  }
];

export const INSUFFICIENT_TEZOS_BALANCE_ERROR =
  'Your TEZ balance not enough to generate art. Please top up minimum 10 TEZ and try again!';

export const DAILY_GENERATION_LIMIT_REACHED_ERROR =
  'Your daily limit for 100 generated art variations has been reached.';
