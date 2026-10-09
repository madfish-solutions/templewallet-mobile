export class ObjktCollectiblesBySlugsError extends Error {
  readonly slugs: string[];
  readonly originalError: unknown;

  constructor(slugs: string[], originalError?: unknown) {
    const message =
      originalError instanceof Error ? originalError.message : 'Failed to fetch Objkt collectibles by slugs';

    super(message);
    this.name = 'ObjktCollectiblesBySlugsError';
    this.slugs = slugs;
    this.originalError = originalError;
  }
}
