export interface Collection {
  name: string;
  logo: string;
  creator: string;
  contract: string;
}

export interface CollectionsRootState {
  collections: CollectionState;
}

export interface CollectionState {
  created: Record<string, Collection[]>;
}

export const collectionsInitialState: CollectionState = { created: {} };
