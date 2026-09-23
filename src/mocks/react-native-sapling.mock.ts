jest.mock('react-native-sapling', () => ({
  getExtendedSpendingKey: jest.fn().mockResolvedValue(Buffer.from(new Uint8Array(169)).toString('base64')),
  getExtendedFullViewingKeyFromSpendingKey: jest
    .fn()
    .mockResolvedValue(Buffer.from(new Uint8Array(169)).toString('base64')),
  getPaymentAddress: jest.fn().mockResolvedValue(Buffer.from(new Uint8Array(54)).toString('base64'))
}));
