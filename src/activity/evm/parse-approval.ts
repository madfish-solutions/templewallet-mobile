import { ActivityOperKindEnum, EvmOperation } from '../types';

/** `keccak256('Approval(address, address, uint256)')` - shared by the ERC-20 and the ERC-721 single-token event */
const ERC20_APPROVAL_EVENT_TOPIC = '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925';

const MAX_EVM_ALLOWANCE = 2n ** 256n - 1n;

const ERC20_APPROVAL_METHOD_CALL_REGEX =
  /Approval\(address indexed [A-z_]+, address indexed [A-z_]+, uint256 [A-z_]+\)/;
const ERC721_APPROVAL_METHOD_CALL_REGEX =
  /Approval\(address indexed [A-z_]+, address indexed [A-z_]+, uint256 indexed [A-z_]+\)/;

export interface ApprovalLog {
  topics: HexString[];
  logIndex: number;
  data: HexString;
  address: string;
}

const hexToBigInt = (hex: HexString) => (/^0x[0-9a-fA-F]+$/.test(hex) ? BigInt(hex) : 0n);

const hexToStringInteger = (hex: HexString) => hexToBigInt(hex).toString();

const topicToAddress = (topic: HexString) => `0x${topic.slice(26)}`;

export const isApprovalLog = ({ decoded, topics }: { decoded: { method_call: string } | null; topics: HexString[] }) =>
  topics.at(0) === ERC20_APPROVAL_EVENT_TOPIC ||
  [ERC20_APPROVAL_METHOD_CALL_REGEX, ERC721_APPROVAL_METHOD_CALL_REGEX].some(regex =>
    regex.test(decoded?.method_call ?? '')
  );

export const getApprovalLogOwnerAddress = (topics: HexString[]) => {
  const ownerTopic = topics.at(1);

  return ownerTopic === undefined ? undefined : topicToAddress(ownerTopic);
};

export const parseApprovalLog = ({ topics, logIndex, data, address }: ApprovalLog): EvmOperation => {
  const spenderTopic = topics.at(2);

  if (spenderTopic === undefined) {
    return { kind: ActivityOperKindEnum.interaction, withAddress: address, logIndex };
  }

  const spenderAddress = topicToAddress(spenderTopic);

  if (topics.at(0) !== ERC20_APPROVAL_EVENT_TOPIC) {
    // Not `Approval` but `ApprovalForAll`; its `data` holds the `approved` flag
    if (data.endsWith('0')) {
      return { kind: ActivityOperKindEnum.interaction, withAddress: address, logIndex };
    }

    return {
      kind: ActivityOperKindEnum.approve,
      spenderAddress,
      asset: { contract: address, amountSigned: null, nft: true },
      logIndex
    };
  }

  const erc721TokenId = topics.at(3);

  return {
    kind: ActivityOperKindEnum.approve,
    spenderAddress,
    asset: {
      contract: address,
      tokenId: erc721TokenId === undefined ? undefined : hexToStringInteger(erc721TokenId),
      amountSigned:
        erc721TokenId === undefined ? (hexToBigInt(data) === MAX_EVM_ALLOWANCE ? null : hexToStringInteger(data)) : '1',
      nft: erc721TokenId === undefined ? undefined : true
    },
    logIndex
  };
};
