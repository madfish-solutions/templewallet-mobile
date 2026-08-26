import { parseAbi } from 'viem';

export const erc1155Abi = parseAbi([
  'error ERC1155InsufficientBalance(address sender, uint256 balance, uint256 needed, uint256 tokenId)',
  'error ERC1155InvalidApprover(address approver)',
  'error ERC1155InvalidArrayLength(uint256 idsLength, uint256 valuesLength)',
  'error ERC1155InvalidOperator(address operator)',
  'error ERC1155InvalidReceiver(address receiver)',
  'error ERC1155InvalidSender(address sender)',
  'error ERC1155MissingApprovalForAll(address operator, address owner)',
  'function balanceOf(address account, uint256 id) external view returns (uint256)',
  'function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes data) external',
  'function uri(uint256 id) external view returns (string)',
  'function name() external view returns (string)',
  'function symbol() external view returns (string)'
]);
