import { TokenMetadataInterface } from '../interfaces/token-metadata.interface';

export const tokenMetadataSlug = ({ address, id }: TokenMetadataInterface) => `${address}_${id ?? 0}`;
