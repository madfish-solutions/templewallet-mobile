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
    disabled: false
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

export const DISCLAIMER_TEXT =
  'Please note that our Text to NFT service allows you to generate maximum 100 art variations per day, which will be saved in the History section. Kindly ensure that you have a minimum balance of 10 TEZ before utilizing this service.';
