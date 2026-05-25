# Phase 2: Account Model, Selection, And Facades

## Agent Scope

Introduce chain-aware public account types, wallet specs, `selectedAccountId`, and facade helpers.

Do not implement Shelter EVM storage, runtime migration, or import UI in this phase. This phase prepares public types/selectors so later phases can use them.

## Read First

- [Implementation overview](../evm-address-derivation-implementation-plan.md)
- [Phase 1 handoff](./phase-1-shared-derivation-helpers.md)
- Extension account facade:
  - `/Users/lendi/Desktop/Work/templewallet-extension/src/temple/accounts.ts`
  - `/Users/lendi/Desktop/Work/templewallet-extension/src/temple/types.ts`
  - `/Users/lendi/Desktop/Work/templewallet-extension/src/lib/temple/types.ts`

## Previous Phases Contract

Phase 1 should provide:

- Tezos/EVM derivation path helpers.
- Tezos/EVM credential helpers.
- EVM derivation tests.

If Phase 1 did not create `TempleChainKind`, create it in this phase.

## Current Mobile Context

Files to inspect:

- `src/interfaces/account.interface.ts`
- `src/enums/account-type.enum.ts`
- `src/store/wallet/wallet-state.ts`
- `src/store/wallet/wallet-actions.ts`
- `src/store/wallet/wallet-reducers.ts`
- `src/store/wallet/wallet-selectors.ts`
- `src/utils/wallet.utils.ts`
- mocks that construct accounts/wallet state

Current state is Tezos-keyed:

- `selectedAccountPublicKeyHash` is the selected-account id.
- `accountsStateRecord` is keyed by Tezos address.
- Many selectors and epics assume `publicKeyHash` exists on every account.

## Required Public Shape

Extend account types toward:

```ts
interface AccountBaseInterface {
  id: string;
  name: string;
  type: AccountTypeEnum;
}

interface HdAccountInterface extends AccountBaseInterface {
  type: AccountTypeEnum.HD_ACCOUNT;
  walletId: string;
  hdIndex: number;
  tezosAddress: string;
  evmAddress: HexString;

  /** @deprecated Tezos compatibility alias. Use getAccountAddressForTezos(account). */
  publicKeyHash: string;
  /** @deprecated Tezos compatibility alias. Use Shelter public-key reveal APIs. */
  publicKey: string;
}

interface ImportedAccountInterface extends AccountBaseInterface {
  type: AccountTypeEnum.IMPORTED_ACCOUNT;
  chain: TempleChainKind;
  address: string;

  /** @deprecated Tezos compatibility alias. Present for Tezos imported accounts only. */
  publicKeyHash?: string;
  /** @deprecated Tezos compatibility alias. Present for Tezos imported accounts only. */
  publicKey?: string;
}
```

Add wallet specs state:

```ts
interface WalletSpecsInterface {
  id: string;
  name: string;
  createdAt: number;
}
```

The store should include:

- `selectedAccountId`
- deprecated `selectedAccountPublicKeyHash`
- `walletsSpecsRecord`
- existing Tezos-keyed `accountsStateRecord`

Do not re-key Tezos balances/assets in this phase.

## Selection Rules

`selectedAccountId` is canonical.

`selectedAccountPublicKeyHash` remains as a deprecated compatibility field and should update only when the selected account has a Tezos address.

Migration and fallback rules:

- Existing persisted `selectedAccountPublicKeyHash` maps to the matching account id.
- If no account matches, select the first visible HD account by id.
- Keep old selectors available initially, but mark Tezos-first selectors with `/** @deprecated */` comments where appropriate.

## Account Facade Helpers

Create a mobile equivalent of extension `src/temple/accounts.ts`, for example:

- `src/utils/account.utils.ts`

Add:

```ts
export interface AccountForChain<C extends TempleChainKind = TempleChainKind> {
  id: string;
  chain: C;
  address: string;
  type: AccountTypeEnum;
  name: string;
}

export const getAccountAddressForTezos = (account: AccountInterface) =>
  account.type === AccountTypeEnum.HD_ACCOUNT
    ? account.tezosAddress ?? account.publicKeyHash
    : account.chain === TempleChainKind.Tezos
      ? account.address ?? account.publicKeyHash
      : undefined;

export const getAccountAddressForEvm = (account: AccountInterface) =>
  account.type === AccountTypeEnum.HD_ACCOUNT
    ? account.evmAddress
    : account.chain === TempleChainKind.EVM
      ? account.address
      : undefined;

export const getAccountAddressForChain = (account: AccountInterface, chain: TempleChainKind) =>
  chain === TempleChainKind.Tezos
    ? getAccountAddressForTezos(account)
    : getAccountAddressForEvm(account);

export const getAccountForChain = <C extends TempleChainKind>(
  account: AccountInterface,
  chain: C
): AccountForChain<C> | null => {
  const address = getAccountAddressForChain(account, chain);

  return address
    ? { id: account.id, chain, address, type: account.type, name: account.name }
    : null;
};

export const canUseAccountForChain = (account: AccountInterface, chain: TempleChainKind) =>
  getAccountAddressForChain(account, chain) !== undefined;
```

Add selectors:

- `useSelectedAccountIdSelector`
- `useSelectedAccountSelector`
- `useCurrentAccountTezosAddressSelector`
- `useCurrentAccountEvmAddressSelector`
- `useCurrentAccountForChainSelector(chain)`

## UI Guard Contract

EVM imported accounts are visible in all account lists and selectable by `selectedAccountId`.

Tezos-first actions must check `canUseAccountForChain(account, TempleChainKind.Tezos)` before enabling:

- send
- swap
- buy/on-ramp
- delegation
- Sapling
- reveal Tezos private key
- Tezos balance refresh

This phase may add helpers/selectors for disabled states, but later phases can wire individual screens.

## Tests

Add focused tests for:

- HD account Tezos/EVM address helpers.
- Tezos imported account helper behavior.
- EVM imported account helper behavior.
- `selectedAccountId` reducer/selectors.
- Deprecated `selectedAccountPublicKeyHash` remains Tezos-compatible.
- Mocks include HD, Tezos imported, and EVM imported accounts.

## Handoff To Phase 3

Phase 3 expects:

- chain enum
- account ids
- `walletId`
- `hdIndex`
- wallet specs state
- selected-account selectors
- address facade helpers

Phase 3 will start using these fields for new wallets and new HD accounts.
