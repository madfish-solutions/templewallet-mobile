import { filterByStringProperty } from './array.utils';

describe('filterByStringProperty', () => {
  const TEST_ARRAY = [{ myKey: 'a' }, { myKey: 'b' }, { myKey: 'b' }, { myKey: 'c' }];

  it('should work', () => {
    const filtered = filterByStringProperty(TEST_ARRAY, 'myKey');

    expect(filtered.length).toEqual(3);

    expect(filtered[0].myKey).toEqual('a');
    expect(filtered[1].myKey).toEqual('b');
    expect(filtered[2].myKey).toEqual('c');
  });
});
