interface ArtStyleItem {
  id: number;
  title: string;
  disabled: boolean;
}

export const ART_STYLE_ITEMS: ArtStyleItem[] = [
  {
    id: 1,
    title: 'Pop Art',
    disabled: false
  },
  {
    id: 2,
    title: 'Cubism',
    disabled: true
  },
  {
    id: 3,
    title: 'Impressionism',
    disabled: true
  },
  {
    id: 4,
    title: 'Surrealism',
    disabled: true
  }
];

export const INSUFFICIENT_TEZOS_BALANCE_ERROR =
  'Your TEZ balance not enough to generate art. Please top up minimum 10 TEZ and try again!';
