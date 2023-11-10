export enum TzktAccountType {
  User = 'user',
  Delegate = 'delegate',
  Contract = 'contract',
  Ghost = 'ghost',
  Rollup = 'rollup',
  SmartRollup = 'smart_rollup',
  Empty = 'empty'
}

interface TzktAccountBase {
  type: TzktAccountType;
  address: string;
  alias: string | nullish;
}

interface TzktAlias {
  alias?: string;
  address: string;
}

interface TzktUserAccount extends TzktAccountBase {
  type: TzktAccountType.User;
  id: number;
  publicKey: string;
  revealed: boolean;
  balance: number;
  rollupBonds: number;
  smartRollupBonds: number;
  counter: number;
  delegate: TzktAlias | nullish;
  delegationLevel: number;
  delegationTime: string | nullish;
  numContracts: number;
  rollupsCount: number;
  smartRollupsCount: number;
  activeTokensCount: number;
  tokenBalancesCount: number;
  tokenTransfersCount: number;
  numActivations: number;
  numDelegations: number;
  numOriginations: number;
  numTransactions: number;
  numReveals: number;
  numRegisterConstants: number;
  numSetDepositsLimits: number;
  numMigrations: number;
  txRollupOriginationCount: number;
  txRollupSubmitBatchCount: number;
  txRollupCommitCount: number;
  txRollupReturnBondCount: number;
  txRollupFinalizeCommitmentCount: number;
  txRollupRemoveCommitmentCount: number;
  txRollupRejectionCount: number;
  txRollupDispatchTicketsCount: number;
  transferTicketCount: number;
  increasePaidStorageCount: number;
  drainDelegateCount: number;
  smartRollupAddMessagesCount: number;
  smartRollupCementCount: number;
  smartRollupExecuteCount: number;
  smartRollupOriginateCount: number;
  smartRollupPublishCount: number;
  smartRollupRecoverBondCount: number;
  smartRollupRefuteCount: number;
  refutationGamesCount: number;
  activeRefutationGamesCount: number;
  firstActivity: number | nullish;
  firstActivityTime: string | nullish;
  lastActivity: number | nullish;
  lastActivityTime: string | nullish;
}

interface TzktDelegateAccount extends TzktAccountBase {
  type: TzktAccountType.Delegate;
  id: number;
  active: boolean;
  publicKey: string | nullish;
  revealed: boolean;
  balance: number;
  rollupBonds: number;
  smartRollupBonds: number;
  frozenDeposit: number;
  frozenDepositLimit: number | nullish;
  counter: number;
  activationLevel: number;
  activationTime: string;
  deactivationLevel: number | nullish;
  deactivationTime: string | nullish;
  stakingBalance: number;
  delegatedBalance: number;
  numContracts: number;
  rollupsCount: number;
  smartRollupsCount: number;
  activeTokensCount: number;
  tokenBalancesCount: number;
  tokenTransfersCount: number;
  numDelegators: number;
  numBlocks: number;
  numEndorsements: number;
  numPreendorsements: number;
  numBallots: number;
  numProposals: number;
  numActivations: number;
  numDoubleBaking: number;
  numDoubleEndorsing: number;
  numDoublePreendorsing: number;
  numNonceRevelations: number;
  vdfRevelationsCount: number;
  numRevelationPenalties: number;
  numEndorsingRewards: number;
  numDelegations: number;
  numOriginations: number;
  numTransactions: number;
  numReveals: number;
  numRegisterConstants: number;
  numSetDepositsLimits: number;
  numMigrations: number;
  txRollupOriginationCount: number;
  txRollupSubmitBatchCount: number;
  txRollupCommitCount: number;
  txRollupReturnBondCount: number;
  txRollupFinalizeCommitmentCount: number;
  txRollupRemoveCommitmentCount: number;
  txRollupRejectionCount: number;
  txRollupDispatchTicketsCount: number;
  transferTicketCount: number;
  increasePaidStorageCount: number;
  updateConsensusKeyCount: number;
  drainDelegateCount: number;
  smartRollupAddMessagesCount: number;
  smartRollupCementCount: number;
  smartRollupExecuteCount: number;
  smartRollupOriginateCount: number;
  smartRollupPublishCount: number;
  smartRollupRecoverBondCount: number;
  smartRollupRefuteCount: number;
  refutationGamesCount: number;
  activeRefutationGamesCount: number;
  firstActivity: number;
  firstActivityTime: string | nullish;
  lastActivity: number;
  lastActivityTime: string | nullish;
  extras: unknown;
  software: { date: string; version: string | nullish };
}

interface TzktContractAccount extends TzktAccountBase {
  type: TzktAccountType.Contract;
  id: number;
  kind: 'delegator_contract' | 'smart_contract' | nullish;
  tzips: string[] | nullish;
  balance: number;
  creator: TzktAlias | nullish;
  manager: TzktAlias | nullish;
  delegate: TzktAlias | nullish;
  delegationLevel: number | nullish;
  delegationTime: string | nullish;
  numContracts: number;
  activeTokensCount: number;
  tokensCount: number;
  tokenBalancesCount: number;
  tokenTransfersCount: number;
  numDelegations: number;
  numOriginations: number;
  numTransactions: number;
  numReveals: number;
  numMigrations: number;
  transferTicketCount: number;
  increasePaidStorageCount: number;
  eventsCount: number;
  firstActivity: number;
  firstActivityTime: string;
  lastActivity: number;
  lastActivityTime: string;
  typeHash: number;
  codeHash: number;
  /** TZIP-16 metadata (with ?legacy=true this field will contain tzkt profile info). */
  metadata: unknown;
  extras: unknown;
  /** Contract storage value. Omitted by default. Use ?includeStorage=true to include it into response. */
  storage: unknown;
}

interface TzktGhostAccount extends TzktAccountBase {
  type: TzktAccountType.Ghost;
  id: number;
  activeTokensCount: number;
  tokenBalancesCount: number;
  tokenTransfersCount: number;
  firstActivity: number;
  firstActivityTime: string;
  lastActivity: number;
  lastActivityTime: string;
  extras: unknown;
}

interface TzktRollupAccount extends TzktAccountBase {
  type: TzktAccountType.Rollup;
  id: number;
  creator: TzktAlias | nullish;
  rollupBonds: number;
  activeTokensCount: number;
  tokenBalancesCount: number;
  tokenTransfersCount: number;
  numTransactions: number;
  txRollupOriginationCount: number;
  txRollupSubmitBatchCount: number;
  txRollupCommitCount: number;
  txRollupReturnBondCount: number;
  txRollupFinalizeCommitmentCount: number;
  txRollupRemoveCommitmentCount: number;
  txRollupRejectionCount: number;
  txRollupDispatchTicketsCount: number;
  transferTicketCount: number;
  firstActivity: number;
  firstActivityTime: string;
  lastActivity: number;
  lastActivityTime: string;
  extras: unknown;
}

interface TzktSmartRollupAccount extends TzktAccountBase {
  type: TzktAccountType.SmartRollup;
  id: number;
  creator: TzktAlias | nullish;
  pvmKind: 'arith' | 'wasm' | nullish;
  genesisCommitment: string | nullish;
  lastCommitment: string | nullish;
  inboxLevel: number;
  totalStakers: number;
  activeStakers: number;
  executedCommitments: number;
  cementedCommitments: number;
  pendingCommitments: number;
  refutedCommitments: number;
  orphanCommitments: number;
  smartRollupBonds: number;
  activeTokensCount: number;
  tokenBalancesCount: number;
  tokenTransfersCount: number;
  numTransactions: number;
  transferTicketCount: number;
  smartRollupCementCount: number;
  smartRollupExecuteCount: number;
  smartRollupOriginateCount: number;
  smartRollupPublishCount: number;
  smartRollupRecoverBondCount: number;
  smartRollupRefuteCount: number;
  refutationGamesCount: number;
  activeRefutationGamesCount: number;
  firstActivity: number;
  firstActivityTime: string;
  lastActivity: number;
  lastActivityTime: string;
  extras: unknown;
}

interface TzktEmptyAccount extends TzktAccountBase {
  type: TzktAccountType.Empty;
  alias: undefined;
  counter: number;
}

export type TzktAccount =
  | TzktUserAccount
  | TzktDelegateAccount
  | TzktContractAccount
  | TzktGhostAccount
  | TzktRollupAccount
  | TzktSmartRollupAccount
  | TzktEmptyAccount;
