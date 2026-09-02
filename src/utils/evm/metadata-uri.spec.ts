import { parseJsonDataUri } from './metadata-uri';

describe('parseJsonDataUri', () => {
  const metadata = { name: 'Uniswap - 0.05%', image: 'data:image/svg+xml;base64,PHN2Zw==' };

  it('parses a base64 json data uri', () => {
    const uri = `data:application/json;base64,${Buffer.from(JSON.stringify(metadata), 'utf8').toString('base64')}`;

    expect(parseJsonDataUri(uri)).toEqual(metadata);
  });

  it('parses a plain uri-encoded json data uri', () => {
    const uri = `data:application/json,${encodeURIComponent(JSON.stringify(metadata))}`;

    expect(parseJsonDataUri(uri)).toEqual(metadata);
  });

  it('returns undefined for http and ipfs uris', () => {
    expect(parseJsonDataUri('https://example.com/meta.json')).toBeUndefined();
    expect(parseJsonDataUri('ipfs://QmHash')).toBeUndefined();
  });

  it('returns undefined for a data uri with malformed json', () => {
    expect(parseJsonDataUri('data:application/json;base64,%%%')).toBeUndefined();
    expect(parseJsonDataUri('data:application/json,{not-json')).toBeUndefined();
  });
});
