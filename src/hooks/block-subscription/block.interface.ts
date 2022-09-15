import { BlockResponse, BlockFullHeader } from '@taquito/rpc';

export interface BlockInterface extends Pick<BlockResponse, 'protocol' | 'chain_id' | 'hash'> {
  header: Pick<BlockFullHeader, 'level' | 'timestamp'>;
}

export const EMPTY_BLOCK: BlockInterface = {
  protocol: '',
  chain_id: '',
  hash: '',
  header: {
    level: 0,
    timestamp: ''
  }
};
