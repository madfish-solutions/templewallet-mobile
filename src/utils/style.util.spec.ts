import { hexa } from './style.util';

it('hexa should add opacity to the hex color', () => {
  expect(hexa('#aabbcc', 0.1)).toEqual('#aabbcc10');
});
