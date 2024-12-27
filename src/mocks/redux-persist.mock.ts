export {};

jest.mock('redux-persist', () => {
  const real = jest.requireActual('redux-persist');

  return {
    ...real,
    persistReducer: jest.fn().mockImplementation((_config, reducers) => reducers)
  };
});
