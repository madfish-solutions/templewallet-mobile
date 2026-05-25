# EVM Address Derivation Implementation Plan

## Goal

Lay the mobile foundation for future EVM network support by making wallet accounts able to carry an EVM address derived from the same seed phrase as the existing Tezos HD account.

This work is intentionally scoped to account identity, derivation, secure storage, migration, and account-import UI changes. It does not implement EVM balances, transactions, signing confirmations, dApp provider support, or network switching yet.

## How To Use These Docs

This plan is structured for phase-by-phase implementation by separate agents.

Each agent should read:

1. This overview.
2. Its own phase file in `docs/evm/phases/`.
3. The short "Previous Phases Contract" section inside its own phase file.

Agents should not need detailed future-phase context. Future-phase docs are intentionally written as handoff contracts, not required reading for earlier phases.

## Phase Files

1. [Phase 1: Shared Derivation Helpers](./phases/phase-1-shared-derivation-helpers.md)
2. [Phase 2: Account Model, Selection, And Facades](./phases/phase-2-account-model-selection-facades.md)
3. [Phase 3: HD Wallet Creation And Secure Storage](./phases/phase-3-hd-wallet-creation-secure-storage.md)
4. [Phase 4: Legacy Account Migration](./phases/phase-4-legacy-account-migration.md)
5. [Phase 5: Imported Account Flows](./phases/phase-5-imported-account-flows.md)
6. [Phase 6: Cleanup And Guardrails](./phases/phase-6-cleanup-guardrails.md)

## Source Of Truth From Extension

Use the browser extension model as the compatibility target.

Extension files worth mirroring:

- `/Users/lendi/Desktop/Work/templewallet-extension/src/lib/temple/back/vault/misc.ts`
- `/Users/lendi/Desktop/Work/templewallet-extension/src/lib/temple/accounts-helpers.ts`
- `/Users/lendi/Desktop/Work/templewallet-extension/src/lib/temple/back/vault/index.ts`
- `/Users/lendi/Desktop/Work/templewallet-extension/src/lib/temple/back/vault/migrations.ts`
- `/Users/lendi/Desktop/Work/templewallet-extension/src/lib/temple/back/vault/storage-keys.ts`
- `/Users/lendi/Desktop/Work/templewallet-extension/src/lib/temple/types.ts`
- `/Users/lendi/Desktop/Work/templewallet-extension/src/temple/accounts.ts`
- `/Users/lendi/Desktop/Work/templewallet-extension/src/temple/types.ts`

Extension behavior to copy:

- One HD account is a multi-chain account, not two separate visible accounts.
- HD account 0 has Tezos index 0 and EVM address index 0.
- HD account N has Tezos index N and EVM address index N.
- Tezos HD path is `m/44'/1729'/{index}'/0'`.
- EVM HD path for normal HD accounts is `m/44'/60'/0'/0/{index}`.
- Extension derives normal EVM HD accounts through `viem/accounts` `mnemonicToAccount(mnemonic, { addressIndex: hdIndex })`.
- Extension supports custom `m/44'/60'...` mnemonic-import paths through `mnemonicToPrivateKey`.
- Imported private-key and imported seed accounts are chain-specific.
- Legacy Tezos-only imported/watch-only/ledger accounts are migrated as Tezos-chain accounts.
- Duplicate handling should copy extension behavior:
  - importing an account rejects same-chain duplicate addresses;
  - automatic HD creation skips indexes whose Tezos or EVM address collides with an existing non-HD account;
  - explicit HD-index creation throws on same-chain collisions.

Important correction:

- For extension HD account creation, the actual EVM path is `m/44'/60'/0'/0/{index}`, not `m/44'/60'/{index}'/0/0`.
- The extension only uses custom `m/44'/60'...` paths in the generic mnemonic import helper, not for standard HD account creation.

## Product And Architecture Decisions

1. Implement as one grand PR, but work through phases in order.
2. Introduce `walletId`, wallet specs, and `selectedAccountId` now.
3. Keep one mnemonic / one HD wallet group for this task, but model wallet specs explicitly for future multiple-wallet support.
4. Public account records stay address-focused. Do not add canonical `tezosPublicKey` or `evmPublicKey` fields to Redux account records.
5. Public keys and private keys live in Shelter and are revealed by address.
6. New credential keys are address-keyed:
   - `account_private_key_${address}`
   - `account_public_key_${address}`
7. Keep legacy secret entries readable indefinitely for now:
   - `seedPhrase`
   - `{tezosPublicKeyHash}: tezosPrivateKey`
   - `sapling_sk_${tezosPublicKeyHash}`
8. Mark old Tezos-first fields and aliases with `/** @deprecated */` comments once replacement helpers exist.
9. EVM imported accounts are visible in all account lists, selectable by `selectedAccountId`, and shown with Tezos-only actions disabled.
10. Runtime EVM account migration blocks full wallet entry behind a migration-progress modal after unlock.
11. Seed phrase reveal shows only the current seed phrase, not derivation paths.
12. Imported seed-phrase EVM flow should copy extension behavior and support custom valid `m/44'/60'...` paths.

## Current Mobile Constraints

Current mobile account identity is Tezos-only:

- `src/interfaces/account.interface.ts`
  - `AccountInterface` has `name`, `type`, `publicKey`, `publicKeyHash`.
  - `publicKeyHash` means Tezos address.
- `src/store/wallet/wallet-state.ts`
  - `selectedAccountPublicKeyHash` is the selected-account id.
  - `accountsStateRecord` is keyed by Tezos `publicKeyHash`.
- `src/shelter/shelter.ts`
  - HD wallet import stores the mnemonic under `seedPhrase`.
  - Tezos private keys are stored under the Tezos `publicKeyHash`.
  - `createHdAccount$` derives only Tezos.
  - `createImportedAccount$` accepts only Tezos private keys.
- `src/utils/keys.util.ts`
  - derives only Tezos Ed25519 keys.
- `src/modals/import-account/import-account-seed/`
  - supports Tezos derivation paths only.
- `src/modals/import-account/import-account-private-key/`
  - imports a private key as Tezos only.

Useful existing dependency:

- `viem` is already installed in mobile, so EVM derivation and private-key validation can reuse extension logic without adding a core dependency.

## Target Account Shape

The exact naming can be adjusted to existing mobile conventions, but the important final shape is:

```ts
export enum TempleChainKind {
  Tezos = 'tezos',
  EVM = 'evm'
}

interface WalletSpecsInterface {
  id: string;
  name: string;
  createdAt: number;
}

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

During migration, use an explicit legacy/partial account type for records that have not completed runtime EVM derivation yet. The final HD account type should require `evmAddress`, `hdIndex`, and `walletId`; only migration code should handle those fields as optional.

## Shared Validation Checklist

Each phase should run the narrowest useful checks. By the end of the grand PR, validate:

- `yarn ts`
- focused unit tests for changed modules
- `yarn lint`

End-state checklist:

- HD EVM addresses match extension for known mnemonic/index.
- Custom EVM derivation paths match extension `mnemonicToPrivateKey` behavior.
- Tezos derivation output is unchanged.
- New wallet stores Tezos and EVM private/public keys.
- Legacy Tezos private-key reveal still works.
- EVM private-key reveal works through address-keyed Shelter APIs.
- Existing Sapling spending keys remain readable by Tezos address.
- Missing HD Sapling spending keys are restored with the same array-position `hdIndex` used for EVM derivation.
- Migration is retryable and idempotent.
- Existing selected account is preserved by `selectedAccountId`.
- Existing balances/tokens remain under the same Tezos key.
- EVM imported accounts do not trigger Tezos balance loading.
- EVM-only selected accounts render in all account lists with Tezos-only actions disabled.
- Unlock shows a blocking migration modal until EVM account migration completes.
