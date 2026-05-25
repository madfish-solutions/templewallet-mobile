# EVM Address Derivation Implementation Plan

## Goal

Lay the mobile foundation for future EVM network support by making wallet accounts able to carry an EVM address derived from the same seed phrase as the existing Tezos HD account.

This plan is intentionally scoped to account identity, derivation, secure storage, migration, and account-import UI changes. It does not implement EVM balances, transactions, signing confirmations, dApp provider support, or network switching yet, but it should leave clean extension-compatible seams for those features.

## Source Of Truth From Extension

Use the browser extension model as the compatibility target.

Extension files worth mirroring:

- `/Users/lendi/Desktop/Work/templewallet-extension/src/lib/temple/back/vault/misc.ts`
- `/Users/lendi/Desktop/Work/templewallet-extension/src/lib/temple/accounts-helpers.ts`
- `/Users/lendi/Desktop/Work/templewallet-extension/src/lib/temple/back/vault/index.ts`
- `/Users/lendi/Desktop/Work/templewallet-extension/src/lib/temple/back/vault/migrations.ts`
- `/Users/lendi/Desktop/Work/templewallet-extension/src/lib/temple/types.ts`
- `/Users/lendi/Desktop/Work/templewallet-extension/src/temple/accounts.ts`

Extension behavior to copy:

- One HD account is a multi-chain account, not two separate visible accounts.
- HD account 0 has Tezos index 0 and EVM address index 0.
- HD account N has Tezos index N and EVM address index N.
- Tezos HD path is `m/44'/1729'/{index}'/0'`.
- EVM HD path for normal HD accounts is effectively `m/44'/60'/0'/0/{index}`.
- Extension derives normal EVM HD accounts through `viem/accounts` `mnemonicToAccount(mnemonic, { addressIndex: hdIndex })`.
- Imported private-key and imported seed accounts are chain-specific in the extension.
- Legacy Tezos-only imported/watch-only/ledger accounts are migrated as Tezos chain accounts.

Important correction to earlier notes:

- For extension HD account creation, the actual EVM path is `m/44'/60'/0'/0/{index}`, not `m/44'/60'/{index}'/0/0`.
- The extension only uses custom `m/44'/60'...` paths in the generic mnemonic import helper, not for standard HD account creation.

## Mobile Today

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

## Target Account Model

Add explicit chain-aware fields while preserving legacy fields during the transition.

Product decision:

- Mobile should introduce `walletId` for forward compatibility, but keep one mnemonic / one HD wallet group for this task.
- Do not build extension-style multiple HD wallet groups yet.

Recommended types:

```ts
export enum TempleChainKind {
  Tezos = 'tezos',
  EVM = 'evm'
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
  tezosPublicKey: string;
  evmAddress: HexString;
  evmPublicKey: HexString;

  /** Temporary Tezos compatibility alias. */
  publicKey: string;
  /** Temporary Tezos compatibility alias. */
  publicKeyHash: string;
}

interface ImportedAccountInterface extends AccountBaseInterface {
  type: AccountTypeEnum.IMPORTED_ACCOUNT;
  chain: TempleChainKind;
  address: string;
  publicKey: string;

  /** Present for legacy Tezos compatibility while the app is Tezos-first. */
  publicKeyHash?: string;
}
```

The exact naming can be adjusted to existing mobile conventions, but the important shape is:

- HD accounts have both `tezosAddress` and `evmAddress`.
- HD accounts have one `hdIndex`.
- HD accounts belong to one `walletId`.
- Imported accounts are chain-specific.
- `publicKey` and `publicKeyHash` remain as Tezos aliases until the Tezos UI is migrated to chain-aware helpers.

### Why Keep `publicKeyHash` For Now

Do not re-key the whole wallet state in the first EVM foundation task.

Keep:

- `wallet.selectedAccountPublicKeyHash`
- `wallet.accountsStateRecord[tezosAddress]`
- Tezos balances/assets keyed by Tezos address

Add:

- `getAccountAddressForTezos(account)`
- `getAccountAddressForEvm(account)`
- `getAccountAddressForChain(account, chain)`
- `useCurrentAccountTezosAddressSelector()`
- `useCurrentAccountEvmAddressSelector()`

This lets future EVM slices key EVM balances by `evmAddress` without destabilizing all existing Tezos code.

Imported EVM account visibility decision:

- EVM imported accounts should be visible in the existing account list as normal accounts.
- No feature flag is required for account visibility.
- EVM balance/action surfaces can still render empty or chain-limited states until EVM asset features are implemented.

## Derivation Utilities

Extend `src/utils/keys.util.ts` or split into `src/utils/account-keys.util.ts` if the file becomes too broad.

Add:

```ts
export interface AccountCreds {
  address: string;
  publicKey: string;
  privateKey: string;
}

export const getTezosDerivationPath = (accountIndex: number) =>
  `m/44'/1729'/${accountIndex}'/0'`;

export const getEvmDerivationPath = (accountIndex: number) =>
  `m/44'/60'/0'/0/${accountIndex}`;

export const isEvmDerivationPath = (path: string) =>
  path.startsWith("m/44'/60'");
```

Keep `getDerivationPath` as a temporary alias for `getTezosDerivationPath` to avoid a noisy first PR.

Add Tezos helpers:

- `mnemonicToTezosAccountCreds(mnemonic, hdIndex, password?)`
- `privateKeyToTezosAccountCreds(privateKey, encPassword?)`
- Use existing `seedToPrivateKey` and `getPublicKeyAndHash$` behavior.

Add EVM helpers, copied from extension:

- `mnemonicToEvmAccountCreds(mnemonic, hdIndex)`
  - `const account = mnemonicToAccount(mnemonic, { addressIndex: hdIndex })`
  - `address = account.address`
  - `publicKey = account.publicKey`
  - `privateKey = toHex(account.getHdKey().privateKey!)`
- `privateKeyToEvmAccountCreds(privateKey)`
  - validate with `isHex`
  - derive via `privateKeyToAccount`
- `mnemonicToPrivateKey(mnemonic, password?, derivationPath?)`
  - if path starts with `m/44'/60'`, use `HDKey.fromMasterSeed` and `hdKeyToAccount`
  - otherwise use existing Ed25519 derivation
  - return `{ chain, privateKey }`

Test vector from current mobile mnemonic fixture:

- Mnemonic: `alter fruit table habit match oval blame bar top kitten test web`
- EVM index 0 address: `0xfDc237eff648793c9F3B976c702493f0EE056489`
- EVM index 0 private key: `0x3925ef64b24414526bd9d28826c642a34d4d8fbb292b467a33f5376126632d3d`

## Secure Storage Plan

Current mobile stores secrets directly by public address keys:

- `seedPhrase`
- `{tezosPublicKeyHash}: tezosPrivateKey`
- `sapling_sk_{tezosPublicKeyHash}: saplingSpendingKey`
- `app-password`

For this foundation task, use namespaced secret keys for new EVM data and keep legacy Tezos keys readable:

```ts
const LEGACY_SEED_PHRASE_KEY = 'seedPhrase';
const walletMnemonicKey = (walletId: string) => `wallet_mnemonic_${walletId}`;
const accountPrivateKeyKey = (chain: TempleChainKind, address: string) =>
  `${chain}_private_key_${address}`;
const accountPublicKeyKey = (chain: TempleChainKind, address: string) =>
  `${chain}_public_key_${address}`;
```

Storage migration should:

- Keep existing Tezos private keys under `publicKeyHash` for compatibility.
- Also write Tezos private/public keys under namespaced keys for new code.
- Write EVM private/public keys under namespaced keys.
- Move, or duplicate initially, the legacy `seedPhrase` into `wallet_mnemonic_${walletId}`.
- Keep `revealSeedPhrase$` working by reading wallet mnemonic first, then falling back to legacy `seedPhrase`.

Recommended Shelter API additions:

- `saveAccountCreds$(chain, creds, passwordHash?)`
- `revealAccountPrivateKey$(chain, address, passwordHash?)`
- `revealAccountPublicKey$(chain, address, passwordHash?)`
- `revealWalletMnemonic$(walletId?, passwordHash?)`
- `saveWalletMnemonic$(walletId, mnemonic, passwordHash?)`
- `getTezosSigner$(tezosAddress)`
- future: `getEvmAccount$(evmAddress)` returning a Viem local account

## Migration Strategy

This migration has two different data stores:

- Redux-persist stores public account records.
- Keychain/Shelter stores seed phrases and private keys.
- Sapling spending keys are also in Keychain, keyed by the Tezos address.

Do not try to derive EVM private keys inside a Redux-persist migration. Redux migrations cannot safely access the unlocked password hash or Keychain secrets.

Use a coordinated runtime migration after the app is unlocked and Redux is rehydrated.

### Migration State

Add an AsyncStorage marker, for example:

```ts
const EVM_ACCOUNTS_MIGRATION_VERSION_KEY = 'evmAccountsMigrationVersion';
const TARGET_EVM_ACCOUNTS_MIGRATION_VERSION = 1;
```

Run the migration when:

- Redux rehydration is complete.
- Shelter is unlocked.
- `wallet.accounts` contains legacy accounts or HD accounts missing `evmAddress`.
- The marker is less than target.

The migration should block EVM entry points until complete. Existing Tezos app usage can remain available if the migration is not required for current Tezos-only screens, but the safest first implementation is to reuse the existing migration loader and finish before entering the wallet.

### Redux Public-Data Migration

Add root persist version `9` in `src/store/root-state.reducers.ts`.

In `src/store/migrations.ts`, normalize public records only:

- Ensure each account has `id`.
- For HD accounts:
  - set `tezosAddress = publicKeyHash`
  - set `tezosPublicKey = publicKey`
  - preserve `publicKey` and `publicKeyHash`
  - add provisional `walletId` if missing
  - leave `evmAddress` absent if it cannot be derived yet
- For imported accounts:
  - set `chain = TempleChainKind.Tezos`
  - set `address = publicKeyHash`
  - preserve `publicKey` and `publicKeyHash`
- Leave `selectedAccountPublicKeyHash` and `accountsStateRecord` unchanged.

Use `nanoid` from `@reduxjs/toolkit`, already available in the app, for `id` and `walletId`.

### Runtime Secret/Public Completion Migration

Add a migration service, for example:

- `src/shelter/utils/migrate-evm-accounts.util.ts`
- or `src/store/wallet/wallet-migrations.ts` if it needs dispatch/state coordination.

Inputs:

- current `wallet.accounts`
- current `wallet.selectedAccountPublicKeyHash`
- dispatch
- current Shelter password hash through Shelter APIs, not exposed as a raw string outside Shelter

Steps:

1. Detect whether any HD account is missing `evmAddress`, `evmPublicKey`, `hdIndex`, or `walletId`.
2. Read the mnemonic:
   - Prefer `revealWalletMnemonic$(walletId)`.
   - Fall back to legacy `revealSeedPhrase$()`.
3. Resolve `walletId`:
   - If no wallet id exists, create one id for all existing mobile HD accounts.
   - Mobile currently appears to support one HD seed phrase, so one wallet group is enough for the first migration.
4. Resolve each HD account `hdIndex`.
   - The extension migration can directly use `account.hdIndex`, because legacy extension HD accounts already stored it.
   - Mobile legacy HD accounts do not currently store `hdIndex`.
   - Use the same rule mobile already uses for Sapling: the account's position among HD accounts is its `hdIndex`.
   - Do not scan/derive Tezos addresses over a bounded range to infer a different index.
   - Persist that resolved array-position `hdIndex` during migration so future EVM and Sapling logic no longer depends on recomputing it.
5. For each HD account:
   - preserve the existing Tezos `publicKeyHash` as `tezosAddress`
   - derive Tezos creds via `mnemonicToTezosAccountCreds(mnemonic, hdIndex)` only if needed to backfill namespaced Tezos secret storage
   - derive EVM creds via `mnemonicToEvmAccountCreds(mnemonic, hdIndex)`
   - save Tezos creds under namespaced keys
   - keep legacy Tezos private key key intact
   - save EVM private/public keys under namespaced keys
   - save/update the public account record with `id`, `walletId`, `hdIndex`, `tezosAddress`, `tezosPublicKey`, `evmAddress`, `evmPublicKey`, and compatibility aliases
6. For imported accounts:
   - mark as `{ chain: TempleChainKind.Tezos, address: publicKeyHash }`
   - keep Tezos secret under legacy key
   - optionally duplicate into namespaced Tezos key on first reveal/import
7. Save `wallet_mnemonic_${walletId}`.
8. Dispatch a single wallet action such as `replaceAccountsAction(migratedAccounts)` or `completeEvmAccountsMigrationAction`.
9. Set `EVM_ACCOUNTS_MIGRATION_VERSION_KEY` only after all Keychain writes and Redux update succeed.

Failure handling:

- If EVM private-key storage fails, do not update public accounts to include `evmAddress`.
- If public Redux update fails, keep the marker unset so the migration retries.
- Show the existing migration-failed UI, because this affects private-key availability.

### Sapling Migration Considerations

Sapling is Tezos-only and should stay attached to the Tezos address side of an account.

Current mobile behavior:

- Sapling spending keys are stored under `sapling_sk_${publicKeyHash}`.
- Sapling Redux state is keyed by `publicKeyHash` in `sapling.accountsRecord`.
- HD wallet import and new HD account creation derive the Sapling spending key from the wallet mnemonic and `getSaplingDerivationPath(hdIndex)`.
- For legacy HD accounts that did not store `hdIndex`, runtime Sapling logic computes `hdIndex` as the account's position among HD accounts.
- Imported private-key accounts derive Sapling from a deterministic fake mnemonic generated from the Tezos secret key.
- Imported seed-phrase accounts derive Sapling from the imported seed phrase and the Tezos derivation path index when one can be extracted.

Important compatibility detail:

- `getSaplingDerivationPath(0)` currently returns `undefined`, so index-0 HD accounts use the Sapling library default path `m/`.
- Indexes greater than zero use `m/44'/1729'/{index}'/0'`.
- Migration must preserve this exact behavior. Do not change the helper to return `m/44'/1729'/0'/0'` for index 0 as part of the EVM task, because that would derive a different Sapling spending key/address for existing first accounts.

Migration rules:

- Keep existing `sapling_sk_${tezosAddress}` entries as-is.
- Keep `sapling.accountsRecord[tezosAddress]` keyed by the same Tezos address; no Redux Sapling re-keying is needed while `publicKeyHash` remains the Tezos address.
- When an old HD account is missing a stored Sapling key, restore it using the same array-position `hdIndex` used for EVM derivation.
- After migration, `withSelectedAccountHdIndex` should prefer persisted `account.hdIndex`; falling back to array position should be legacy-only.
- Imported Tezos accounts should continue using `restoreImportedAccountSaplingSpendingKey$`.
- EVM imported accounts must not derive or store Sapling credentials.

Recommended helper for migration:

```ts
const deriveSaplingForHdAccount = (mnemonic: string, hdIndex: number) =>
  InMemorySpendingKey.deriveSaskFromMnemonic(mnemonic, getSaplingDerivationPath(hdIndex));
```

Using the existing helper preserves the index-0 default-path behavior.

### Migration Tests

Unit tests should cover:

- Legacy one-account HD wallet gets an EVM address matching the test vector.
- Multiple HD accounts preserve names, Tezos addresses, and selected account.
- Existing `accountsStateRecord` remains keyed by Tezos address.
- Existing `sapling.accountsRecord` remains keyed by Tezos address.
- Existing `sapling_sk_${tezosAddress}` entries remain readable.
- Missing HD Sapling keys are restored with the array-position `hdIndex`, preserving the index-0 default `m/` behavior.
- Imported account becomes chain-specific Tezos and does not get an EVM address.
- EVM imported accounts do not derive Sapling credentials.
- Migration marker is only written after all writes succeed.
- Failed EVM Keychain save does not partially mark migration complete.

## Account Creation Changes

### New Wallet / Restore Wallet

Files:

- `src/shelter/shelter.ts`
- `src/shelter/utils/import-wallet-subscription.util.ts`
- `src/screens/create-new-wallet/create-new-wallet.form.tsx`
- `src/modals/import-wallet/`
- sync/cloud restore flows that call `importWallet`

Change `Shelter.importHdAccount$`:

- For every `hdAccountIndex`, derive Tezos creds and EVM creds.
- Store:
  - legacy `seedPhrase`
  - wallet-level mnemonic
  - Tezos private key under legacy key and namespaced key
  - EVM private/public keys under namespaced key
  - password check key
  - Sapling key by Tezos address
- Return HD accounts with both chain addresses.

Return object should preserve:

- `publicKey = tezosPublicKey`
- `publicKeyHash = tezosAddress`

### Add New HD Account

Files:

- `src/shelter/shelter.ts`
- `src/shelter/utils/create-hd-account-subscription.util.ts`
- `src/utils/wallet.utils.ts`

Change `Shelter.createHdAccount$`:

- Use `revealWalletMnemonic$(walletId)` when selected account has `walletId`.
- Fall back to `revealSeedPhrase$`.
- Accept `walletId` and `accountIndex`, or compute index from migrated HD metadata.
- Derive and store Tezos and EVM creds.
- Return a dual-chain HD account.

Change HD index lookup:

- Replace `withSelectedAccountHdIndex` array-position logic with `selectedAccount.hdIndex`.
- During transition, fall back to old array-position logic only if `hdIndex` is missing.

Duplicate avoidance:

- Existing mobile skips Tezos duplicates.
- New logic should skip if either derived Tezos address or EVM address collides with an existing account for that chain.

## Imported Account UI Changes

### Add Chain Choice

Files:

- `src/modals/choose-account-import-type/index.tsx`
- `src/modals/import-account/import-account-seed/`
- `src/modals/import-account/import-account-private-key/`
- `src/enums/account-type.enum.ts` or a new chain enum file

Add a compact chain selector to both imported-account flows:

- Tezos
- EVM

Default to Tezos to preserve current behavior.

Do not add explanatory marketing text. Use concise labels and existing form controls.

### Import From Private Key

Current behavior:

- Always validates as a Tezos key through `getPublicKeyAndHash$`.

New behavior:

- Show a chain selector, matching extension behavior:
  - Tezos
  - EVM
- If chain is Tezos:
  - keep current validation and `createImportedAccount$` behavior.
- If chain is EVM:
  - validate hex private key with `privateKeyToEvmAccountCreds`.
  - store the EVM private/public key under namespaced keys.
  - create an imported account with `{ chain: TempleChainKind.EVM, address, publicKey }`.
  - do not derive or store a Sapling key.

Subscription changes:

- `createImportAccountSubscription` must branch by chain.
- Duplicate detection must compare chain + address, not only Tezos public key.
- `loadTezosBalance$` and on-ramp logic should only run for Tezos imported accounts.

### Import From Seed Phrase

Current behavior:

- Uses `ed25519-hd-key` validation only.
- Default path is Tezos account 0.
- Derives Tezos private key and imports as a Tezos imported account.

New behavior:

- Add chain selector.
- If Tezos:
  - default path `m/44'/1729'/0'/0'`
  - validation uses current Ed25519 path validation.
  - derive Sapling key from Tezos hd index when possible.
- If EVM:
  - default path `m/44'/60'/0'/0/0`
  - validation should accept EVM paths starting with `m/44'/60'`.
  - derive with Viem `HDKey.fromMasterSeed` + `hdKeyToAccount`.
  - import as chain-specific EVM account.
  - skip Sapling derivation.

The form can keep one "Default account" option, but the default path must update when the chain changes.

## Public Account Helpers

Create a mobile equivalent of extension `src/temple/accounts.ts`, for example:

- `src/utils/account.utils.ts`

Add:

```ts
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
```

Then add selectors without replacing every old call site immediately:

- `useCurrentAccountTezosAddressSelector`
- `useCurrentAccountEvmAddressSelector`
- `useRawCurrentAccountSelector` remains but callers should avoid assuming `publicKeyHash` is the only address.

First replacement targets:

- HD account creation index logic.
- reveal seed phrase derivation path display.
- account dropdown address display, if EVM address needs to be shown soon.
- duplicate checks in import flows.

## Reveal Secret Adjustments

Files:

- `src/modals/reveal-seed-phrase-modal/`
- `src/modals/reveal-private-key-modal/`
- `src/shelter/utils/reveal-secrets-subscription.util.ts`

Seed phrase:

- For HD accounts, show Tezos and EVM derivation paths if product wants both visible.
- Minimal foundation change: keep existing Tezos path display and ensure it uses `account.hdIndex` instead of array position.

Private key:

- Show a chain selector for HD account private-key reveal, matching the extension.
- Default to Tezos for backward-compatible expectations.
- Allow EVM reveal when the account has `evmAddress` and an EVM private key in Shelter.
- For imported accounts, either lock the selector to the account's chain or omit the selector when there is only one valid chain.

## Implementation Phases

### Phase 1: Shared Derivation Helpers

Files:

- `src/utils/keys.util.ts`
- `src/utils/keys.utils.spec.ts`
- `src/mocks/account-credentials.mock.ts`

Tasks:

- Rename/add explicit Tezos path helper.
- Add EVM path helper.
- Port extension EVM derivation helpers.
- Add Tezos/EVM `AccountCreds`.
- Add tests using the extension-compatible EVM test vector.
- Keep existing Tezos tests passing.

### Phase 2: Account Types And Address Helpers

Files:

- `src/interfaces/account.interface.ts`
- `src/enums/account-type.enum.ts` or new `src/enums/chain-kind.enum.ts`
- `src/utils/account.utils.ts`
- `src/store/wallet/wallet-selectors.ts`
- mocks

Tasks:

- Add chain enum.
- Extend account interfaces.
- Add address helpers.
- Add selectors for Tezos and EVM addresses.
- Update mocks with dual-chain HD account data.

### Phase 3: New HD Wallets Store EVM Credentials

Files:

- `src/shelter/shelter.ts`
- `src/shelter/shelter.spec.ts`
- `src/shelter/utils/import-wallet-subscription.util.ts`
- `src/shelter/utils/create-hd-account-subscription.util.ts`
- `src/utils/wallet.utils.ts`

Tasks:

- Add namespaced secure-storage key helpers.
- Add wallet mnemonic helpers.
- Update `importHdAccount$`.
- Update `createHdAccount$`.
- Update `withSelectedAccountHdIndex`.
- Add tests verifying EVM private/public key storage.

### Phase 4: Legacy Account Migration

Files:

- `src/store/root-state.reducers.ts`
- `src/store/migrations.ts`
- new runtime migration util/hook
- `src/hooks/use-do-migrations.hook.ts` or app bootstrap migration place

Tasks:

- Add Redux migration for public shape only.
- Add runtime unlocked migration for EVM derivation and Keychain writes.
- Add migration marker in AsyncStorage.
- Add a wallet action to replace/complete migrated accounts.
- Add tests for success, retry, and partial-failure behavior.

### Phase 5: Imported Account Flows

Files:

- `src/modals/import-account/import-account-private-key/`
- `src/modals/import-account/import-account-seed/`
- `src/shelter/use-shelter.hook.ts`
- `src/shelter/utils/create-import-account-subscription.util.ts`
- `src/shelter/shelter.ts`

Tasks:

- Add chain selector.
- Branch seed phrase derivation by chain.
- Branch private-key validation by chain.
- Store/import EVM accounts as chain-specific imported accounts.
- Keep Tezos import behavior unchanged.
- Avoid Sapling/on-ramp/Tezos balance side effects for EVM imports.

### Phase 6: Cleanup And Guardrails

Tasks:

- Replace direct `publicKeyHash` use only where chain ambiguity matters.
- Add `@deprecated` comments to raw Tezos aliases once helpers are available.
- Add developer docs for account shape.
- Add test fixtures for HD, Tezos imported, and EVM imported accounts.
- Run `yarn ts`, focused unit tests, and `yarn lint`.

## Validation Checklist

Derivation:

- HD EVM addresses match extension for known mnemonic/index.
- Custom EVM derivation paths match extension `mnemonicToPrivateKey` behavior.
- Tezos derivation output is unchanged.

Storage:

- New wallet stores Tezos and EVM private/public keys.
- Legacy Tezos private-key reveal still works.
- EVM private-key reveal works through the new chain-aware API.
- Existing Sapling spending keys remain readable by Tezos address.
- Missing HD Sapling spending keys are restored with the same array-position `hdIndex` used for EVM derivation.
- Migration is retryable and idempotent.

Redux:

- Existing selected account is preserved.
- Existing balances/tokens remain under the same Tezos key.
- Imported Tezos accounts remain usable.
- EVM imported accounts do not trigger Tezos balance loading.

UI:

- Existing Tezos import default path and private-key import still feel unchanged.
- EVM import requires an explicit chain choice.
- Chain selector changes the default derivation path.
- Invalid EVM private keys show the same style of validation/error feedback as current Tezos failures.

## Product/Architecture Decisions

1. Mobile should introduce `walletId` for forward compatibility while keeping one mnemonic / one HD wallet group for now.
2. HD private-key reveal should include a chain selector, matching the extension.
3. EVM imported accounts should be visible as normal accounts; no feature flag is required.
4. Extension migration uses the existing stored `hdIndex` on legacy HD accounts. Mobile old HD accounts should use the same index rule as existing Sapling logic: position among HD accounts. Migration should persist this array-position `hdIndex` and derive EVM addresses from it. Imported private-key and seed-phrase accounts remain imported accounts and should migrate as Tezos-chain accounts only.
5. Legacy secret entries should be kept and marked deprecated. New code should prefer wallet/account namespaced keys, but old `seedPhrase`, Tezos private-key, and Sapling key entries must remain readable for backward compatibility.

## Legacy Secret Storage References

Mobile current entries:

- `src/shelter/shelter.ts`
  - `saveSensitiveData$` writes encrypted values to Keychain using the provided key.
  - `importHdAccount$` stores `seedPhrase`, `{publicKeyHash}: privateKey`, and `app-password`.
  - `createImportedAccount$` stores `{publicKeyHash}: privateKey`.
  - `createHdAccount$` stores `{publicKeyHash}: privateKey`.
  - `revealSeedPhrase$` reads `seedPhrase`.
  - `saveSaplingSpendingKey$` stores `sapling_sk_${publicKeyHash}`.
- `src/utils/keychain.utils.ts`
  - `getKeychainOptions` maps every secret key to Keychain service `com.madfish.temple-wallet/{key}`.

Deprecation decision:

- Keep these legacy entries indefinitely for now:
  - `seedPhrase`
  - `{tezosPublicKeyHash}: tezosPrivateKey`
  - `sapling_sk_${tezosPublicKeyHash}`
- Mark them as deprecated in code comments once namespaced replacements exist.
- New writes should duplicate into both the old keys and the new namespaced keys until a separate cleanup policy is approved.

Extension entries after EVM migration:

- `/Users/lendi/Desktop/Work/templewallet-extension/src/lib/temple/back/vault/storage-keys.ts`
  - legacy mnemonic key: `vault_mnemonic`
  - wallet mnemonic key: `vault_walletmnemonic_{walletId}`
  - account private key: `vault_accprivkey_{address}`
  - account public key: `vault_accpubkey_{address}`
- `/Users/lendi/Desktop/Work/templewallet-extension/src/lib/temple/back/vault/migrations.ts`
  - migration `[5]` reads legacy `vault_mnemonic`.
  - derives EVM credentials for HD accounts using `account.hdIndex`.
  - stores EVM keypairs.
  - stores the mnemonic under `walletMnemonicStrgKey(walletId)`.

## Recommended First PR Boundary

Start with Phases 1 and 2 only:

- derivation helpers
- account type extensions
- address helper selectors
- mocks/tests

This creates the foundation with low blast radius. Then implement Phase 3 and Phase 4 together, because account creation and migration must agree on the same storage keys and public account shape.
