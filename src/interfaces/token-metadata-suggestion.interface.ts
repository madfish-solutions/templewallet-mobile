import { TokenMetadata } from '@taquito/tzip12';

export interface TokenMetadataSuggestionInterface extends TokenMetadata {
  thumbnailUri?: string;
  logo?: string;
  icon?: string;
  iconUri?: string;
  iconUrl?: string;
}
