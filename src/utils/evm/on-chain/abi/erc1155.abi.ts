import { parseAbi } from 'viem';

export const erc1155Abi = parseAbi([
  'function balanceOf(address account, uint256 id) external view returns (uint256)',
  'function uri(uint256 id) external view returns (string)',
  'function name() external view returns (string)',
  'function symbol() external view returns (string)'
]);
