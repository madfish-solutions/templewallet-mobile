import { TokenMetadataInterface } from '../interfaces/token-metadata.interface';

export const tokenToTokenSlug = ({ address, id }: TokenMetadataInterface) => `${address}_${id ?? 0}`;
