# Phase 4: Legacy Account Migration

## Agent Scope

Migrate existing persisted Tezos-only wallets to the new account shape and secure-storage layout.

This phase must be retryable, idempotent, and conservative. It blocks full wallet entry until migration completes.

## Read First

- [Implementation overview](../evm-address-derivation-implementation-plan.md)
- [Phase 1 handoff](./phase-1-shared-derivation-helpers.md)
- [Phase 2 handoff](./phase-2-account-model-selection-facades.md)
- [Phase 3 handoff](./phase-3-hd-wallet-creation-secure-storage.md)
- Extension migration:
  - `/Users/lendi/Desktop/Work/templewallet-extension/src/lib/temple/back/vault/migrations.ts`
  - `/Users/lendi/Desktop/Work/templewallet-extension/src/lib/temple/back/vault/storage-keys.ts`

## Previous Phases Contract

Phase 3 should already define final storage APIs and ensure new wallets use:

- `wallet_mnemonic_${walletId}`
- `account_private_key_${address}`
- `account_public_key_${address}`
- HD account records with `id`, `walletId`, `hdIndex`, `tezosAddress`, `evmAddress`
- `selectedAccountId`
- wallet specs

Phase 4 migrates old data into that same shape.

## Files To Inspect

- `src/store/root-state.reducers.ts`
- `src/store/migrations.ts`
- `src/store/wallet/wallet-actions.ts`
- `src/store/wallet/wallet-reducers.ts`
- `src/hooks/use-do-migrations.hook.ts` or app bootstrap migration place
- `src/shelter/shelter.ts`
- `src/utils/wallet.utils.ts`
- `src/utils/sapling/address-utils`
- `src/store/sapling/`

## Migration Stores

This migration has two stores:

- Redux-persist stores public account records.
- Keychain/Shelter stores seed phrases, private keys, public keys, and Sapling spending keys.

Do not derive EVM private keys inside a Redux-persist migration. Redux migrations cannot safely access the unlocked password hash or Keychain secrets.

Use:

1. Redux public-data migration for shape-only public fields.
2. Runtime migration after unlock for mnemonic/private-key derivation and Keychain writes.

## Redux Public-Data Migration

Add root persist version `9`.

Normalize public records only:

- Ensure each account has `id`.
- Add `selectedAccountId` by mapping old `selectedAccountPublicKeyHash` to the matching account.
- Add `walletsSpecsRecord` for the single existing mobile HD wallet.
- For HD accounts:
  - set `tezosAddress = publicKeyHash`
  - preserve deprecated `publicKey` and `publicKeyHash`
  - add provisional `walletId` if missing
  - leave `evmAddress` absent if it cannot be derived yet
- For imported accounts:
  - set `chain = TempleChainKind.Tezos`
  - set `address = publicKeyHash`
  - preserve deprecated `publicKey` and `publicKeyHash`
- Leave `selectedAccountPublicKeyHash` and `accountsStateRecord` unchanged for Tezos compatibility.

Use `nanoid` from `@reduxjs/toolkit`, already available in the app.

Idempotency:

- Do not regenerate `id` or `walletId` if they already exist.
- Do not rewrite wallet specs if the wallet id already has specs.

## Runtime Migration Trigger

Add an AsyncStorage marker:

```ts
const EVM_ACCOUNTS_MIGRATION_VERSION_KEY = 'evmAccountsMigrationVersion';
const TARGET_EVM_ACCOUNTS_MIGRATION_VERSION = 1;
```

Run migration when:

- Redux rehydration is complete.
- Shelter is unlocked.
- `wallet.accounts` contains legacy accounts or HD accounts missing `evmAddress`.
- The marker is less than target.

Block full wallet entry until migration completes.

## Migration Modal

After the user unlocks successfully and before the wallet screen is entered, show a blocking migration modal:

- Title: concise, for example "Updating wallet accounts".
- Body: explain that the wallet is being prepared for EVM support.
- Show a loader while migration runs.
- Show recoverable errors in the modal body with retry and lock/reset navigation where appropriate.
- Normalize errors into user-facing messages.
- Keep technical errors available for analytics/logging.
- If migration succeeds, dismiss the modal and enter the wallet normally.

Expected duration:

- Typical wallets should migrate quickly.
- Keychain writes are likely slower than derivation.
- Add lightweight timing logs/analytics around derivation, Keychain writes, Redux dispatch, and persistence flush.
- If common wallets take more than a couple of seconds, keep modal progress explicit.

## Runtime Migration Steps

Inputs:

- current `wallet.accounts`
- current `wallet.selectedAccountId`
- current `wallet.selectedAccountPublicKeyHash`
- current `wallet.walletsSpecsRecord`
- dispatch
- Shelter APIs that use the current password hash internally

Steps:

1. Detect whether any HD account is missing `evmAddress`, `hdIndex`, or `walletId`.
2. Read the mnemonic:
   - prefer `revealWalletMnemonic$(walletId)`;
   - fall back to legacy `revealSeedPhrase$()`.
3. Resolve `walletId`:
   - if no wallet id exists, create one id for all existing mobile HD accounts;
   - create/update `walletsSpecsRecord[walletId]` with a default wallet name and `createdAt`.
4. Resolve each HD account `hdIndex`:
   - extension migration uses stored `account.hdIndex`;
   - mobile legacy HD accounts do not currently store `hdIndex`;
   - use the same rule mobile already uses for Sapling: the account position among HD accounts is its `hdIndex`;
   - do not scan/derive Tezos addresses over a bounded range to infer a different index;
   - document this as a compatibility decision.
5. For each HD account:
   - preserve existing `publicKeyHash` as `tezosAddress`;
   - derive Tezos creds only if needed to backfill new address-keyed Tezos storage;
   - derive EVM creds via `mnemonicToEvmAccountCreds(mnemonic, hdIndex)`;
   - save Tezos creds under new address-keyed keys;
   - keep legacy Tezos private-key key intact;
   - save EVM private/public keys under address-keyed keys;
   - save/update public account record with `id`, `walletId`, `hdIndex`, `tezosAddress`, `evmAddress`, and deprecated Tezos aliases.
6. For imported accounts:
   - mark as `{ chain: TempleChainKind.Tezos, address: publicKeyHash }`;
   - keep Tezos secret under legacy key;
   - optionally duplicate into new address-keyed Tezos key on first reveal/import.
7. Save `wallet_mnemonic_${walletId}`.
8. Dispatch one wallet action such as `replaceAccountsAction(migratedAccounts)` or `completeEvmAccountsMigrationAction`.
9. Flush Redux persistence with the app `persistor`.
10. Set `EVM_ACCOUNTS_MIGRATION_VERSION_KEY` only after all Keychain writes, Redux update, and persistence flush succeed.

Failure handling:

- If EVM private-key storage fails, do not update public accounts to include `evmAddress`.
- If Redux update or persistence flush fails, keep the marker unset.
- Show migration failure in the blocking modal.

## Sapling Rules

Sapling is Tezos-only and stays attached to the Tezos address side of an account.

Current mobile behavior:

- Sapling spending keys are stored under `sapling_sk_${publicKeyHash}`.
- Sapling Redux state is keyed by `publicKeyHash`.
- HD wallet import and new HD account creation derive Sapling from wallet mnemonic and `getSaplingDerivationPath(hdIndex)`.
- For legacy HD accounts missing `hdIndex`, runtime Sapling logic computes `hdIndex` as position among HD accounts.
- Imported private-key accounts derive Sapling from a deterministic fake mnemonic generated from the Tezos secret key.

Important compatibility detail:

- `getSaplingDerivationPath(0)` currently returns `undefined`, so index-0 HD accounts use the Sapling library default path `m/`.
- Indexes greater than zero use `m/44'/1729'/{index}'/0'`.
- Do not change this behavior in the EVM task.

Migration rules:

- Keep existing `sapling_sk_${tezosAddress}` entries as-is.
- Keep `sapling.accountsRecord[tezosAddress]` keyed by Tezos address.
- When an old HD account is missing a stored Sapling key, restore it using the same array-position `hdIndex` used for EVM derivation.
- After migration, `withSelectedAccountHdIndex` should prefer persisted `account.hdIndex`.
- EVM imported accounts must not derive or store Sapling credentials.

## Tests

Add focused tests for:

- Legacy one-account HD wallet gets EVM address matching the test vector.
- Multiple HD accounts preserve names, Tezos addresses, selected account, and wallet specs.
- Existing `accountsStateRecord` remains keyed by Tezos address.
- Existing `sapling.accountsRecord` remains keyed by Tezos address.
- Existing `sapling_sk_${tezosAddress}` entries remain readable.
- Missing HD Sapling keys are restored with the array-position `hdIndex`.
- Imported account becomes chain-specific Tezos and does not get an EVM address.
- Migration marker is written only after Keychain writes, Redux update, and persistence flush.
- Failed EVM Keychain save does not mark migration complete.
- Retry does not regenerate existing account ids or wallet ids.

## Handoff To Phase 5

After this phase:

- Existing users have account ids, wallet specs, `walletId`, `hdIndex`, and EVM addresses for HD accounts.
- All HD EVM private/public keys are stored under address-keyed keys.
- Full wallet entry is blocked until migration succeeds.

Phase 5 can assume imported-account UI can create true EVM imported accounts.
