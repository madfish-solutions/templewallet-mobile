export const mockAccountCredentials = {
  seedPhrase: 'Lorem ipsum dolor sit amet consectetur adipiscing elit etiam ultricies velit quis',
  derivationPath: "m/44'/1729'/1'/0'",
  privateKey: 'edsk3EQSnshHTNi2ABCETq58F7P4fsaPhb7yR9kTh5tW4rmqMeU53B',
  privateKeyWithoutDerivationPath: 'edsk3FZiaY865vx1fG11XhHmGCFa1xgvgdQ4KCjmszEGLnCJuWtrSU',
  publicKey: 'edpkuv28oLEsFEbRreYPBikjNp6u9CfXjG3ArGCfnPbQfa4UWPRQN6',
  publicKeyHash: 'tz1W311ULA4p9EcEvNyufJgSBNSxg8tPdyei',
  seed: 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about'
};

export const mockHDAccountCredentials = {
  mockAccountIndex: 77,
  privateKey: 'edsk4PnmkH1gzBCAWKAagyBG83JeTKRKRZrRejbjunyhdcAqgPiHsL',
  seedPhrase: mockAccountCredentials.seedPhrase,
  publicKey: mockAccountCredentials.publicKey,
  publicKeyHash: mockAccountCredentials.publicKeyHash
};
