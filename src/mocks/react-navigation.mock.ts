export const mockNavigate = jest.fn();
export const mockNavigationDispatch = jest.fn();

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useIsFocused: jest.fn().mockReturnValue(true),
  useNavigation: jest.fn().mockReturnValue({ navigate: mockNavigate, dispatch: mockNavigationDispatch })
}));
