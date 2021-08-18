import { EmptyFn } from '../config/general';

jest.mock('mem', () => (fn: EmptyFn) => fn);
