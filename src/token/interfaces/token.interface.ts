import { AccountTokenInterface } from './account-token.interface';
import { TokenMetadataInterface } from './token-metadata.interface';

export type TokenInterface = Omit<AccountTokenInterface, 'slug'> & TokenMetadataInterface;
