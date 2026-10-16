import { Abi, decodeFunctionData, parseAbi } from 'viem';

const transferAbis = parseAbi([
  'function transfer(address recipient, uint256 amount)',
  'function transferFrom(address sender, address recipient, uint256 amount)',
  'function safeTransferFrom(address from, address to, uint256 tokenId)',
  'function safeTransferFrom(address from, address to, uint256 id, bytes data)',
  'function safeTransferFrom(address from, address to, uint256 id, uint256 value, bytes data)',
  'function safeBatchTransferFrom(address from, address to, uint256[] ids, uint256[] values, bytes data)'
]);

const deployContractAbis = parseAbi([
  'function createClone(string name, string symbol, bytes32 salt) returns (address)',
  'function createToken(string _name, string _symbol, string baseURI, string contractURI, address[] operators, uint256 salt)'
]);

const approveAbis = parseAbi([
  'function approve(address spender, uint256 amount)',
  'function increaseAllowance(address spender, uint256 addedValue)'
]);

const approvalForAllAbis = parseAbi(['function setApprovalForAll(address operator, bool approved)']);

// Marketplace factory mints (Rarible/Seaport) are not recognized - no such contracts on Etherlink;
// those transactions classify as Other, which only costs an extra enrichment request
const mintAbis = parseAbi([
  'function mint(address account, uint256 value)',
  'function mint(address to, string uri)',
  'function mint(address to, uint256 id, uint256 value, bytes data)',
  'function mintBatch(address to, uint256[] ids, uint256[] values, bytes data)',
  'function safeMint(address to, string uri)',
  'function safeMint(address to, string uri, bytes data)'
]);

export enum EvmOperationKind {
  DeployContract = 'DeployContract',
  Mint = 'Mint',
  Send = 'Send',
  Approval = 'Approval',
  ApprovalForAll = 'ApprovalForAll',
  Other = 'Other'
}

const abiDetectionEntries: Array<[EvmOperationKind, Abi]> = [
  [EvmOperationKind.Send, transferAbis],
  [EvmOperationKind.DeployContract, deployContractAbis],
  [EvmOperationKind.Mint, mintAbis],
  [EvmOperationKind.Approval, approveAbis],
  [EvmOperationKind.ApprovalForAll, approvalForAllAbis]
];

const dataMatchesAbis = (data: HexString, abi: Abi) => {
  try {
    decodeFunctionData({ abi, data });

    return true;
  } catch {
    return false;
  }
};

interface EvmOperationKindInput {
  data: HexString;
  to: string | undefined;
  value: bigint;
}

export const getEvmOperationKind = ({ data, to, value }: EvmOperationKindInput) => {
  if (to == null) {
    return EvmOperationKind.DeployContract;
  }

  if (data === '0x') {
    return value > 0n ? EvmOperationKind.Send : EvmOperationKind.Other;
  }

  for (const [kind, abi] of abiDetectionEntries) {
    if (dataMatchesAbis(data, abi)) {
      return kind;
    }
  }

  return EvmOperationKind.Other;
};
