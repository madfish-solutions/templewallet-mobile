import { hexa } from './style.util';

it('hexa should add opacity to the hex color', () => {
  expect(hexa('#aabbcc', 0.1)).toEqual('#aabbcc1a');
  expect(hexa('#aabbcc', 0.5)).toEqual('#aabbcc80');
  expect(hexa('#aabbcc', 1)).toEqual('#aabbccff');
});
