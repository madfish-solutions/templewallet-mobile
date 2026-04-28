jest.mock('react-native-sapling', () => ({
  getExtendedSpendingKey: jest.fn().mockResolvedValue(Buffer.from(new Uint8Array(169)).toString('base64'))
}));
