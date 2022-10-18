import { mockComponent } from './component.mock';

jest.mock('react-native-snap-carousel', () => ({
  ...mockComponent('reactNativeSnapCarousel')
}));
