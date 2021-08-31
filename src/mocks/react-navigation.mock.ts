export const mockNavigate = jest.fn();
export const mockGoBack = jest.fn();

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: jest.fn().mockReturnValue({ navigate: mockNavigate, goBack: mockGoBack })
}));
