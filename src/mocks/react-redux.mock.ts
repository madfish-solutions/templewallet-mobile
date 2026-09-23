import { mockRootState } from '../store/root-state.mock';

const mockUseDispatch = jest.fn();

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn().mockImplementation(() => mockUseDispatch),
  useSelector: jest.fn(selector => selector(mockRootState))
}));
