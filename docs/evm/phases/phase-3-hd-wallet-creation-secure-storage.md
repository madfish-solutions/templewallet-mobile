# Phase 3: HD Wallet Creation And Secure Storage

## Agent Scope

Update new wallet restore/create and new HD account creation so HD accounts store both Tezos and EVM credentials.

Do not implement legacy account migration in this phase. This phase handles new data created after the code ships; Phase 4 handles old persisted wallets.

## Read First

- [Implementation overview](../evm-address-derivation-implementation-plan.md)
- [Phase 1 handoff](./phase-1-shared-derivation-helpers.md)
- [Phase 2 handoff](./phase-2-account-model-selection-facades.md)
- Extension vault creation/storage:
  - `/Users/lendi/Desktop/Work/templewallet-extension/src/lib/temple/back/vault/index.ts`
  - `/Users/lendi/Desktop/Work/templewallet-extension/src/lib/temple/back/vault/misc.ts`
  - `/Users/lendi/Desktop/Work/templewallet-extension/src/lib/temple/back/vault/storage-keys.ts`

## Previous Phases Contract

Phase 1 provides:

- `mnemonicToTezosAccountCreds`
- `mnemonicToEvmAccountCreds`
- `privateKeyToTezosAccountCreds`
- `privateKeyToEvmAccountCreds`
- derivation path helpers

Phase 2 provides:

- `TempleChainKind`
- account ids
- `walletId`
- `hdIndex`
- `selectedAccountId`
- wallet specs state
- address facade helpers

## Files To Inspect

- `src/shelter/shelter.ts`
- `src/shelter/shelter.spec.ts`
- `src/shelter/utils/import-wallet-subscription.util.ts`
- `src/shelter/utils/create-hd-account-subscription.util.ts`
- `src/screens/create-new-wallet/create-new-wallet.form.tsx`
- `src/modals/import-wallet/`
- sync/cloud restore flows that call `importWallet`
- `src/utils/wallet.utils.ts`

## Secure Storage Contract

Current mobile legacy keys:

- `seedPhrase`
- `{tezosPublicKeyHash}: tezosPrivateKey`
- `sapling_sk_{tezosPublicKeyHash}`
- `app-password`

New address-keyed keys:

```ts
const LEGACY_SEED_PHRASE_KEY = 'seedPhrase';
const walletMnemonicKey = (walletId: string) => `wallet_mnemonic_${walletId}`;
const accountPrivateKeyKey = (address: string) => `account_private_key_${address}`;
const accountPublicKeyKey = (address: string) => `account_public_key_${address}`;
```

Use address-keyed credential keys, matching the extension abstraction:

- extension: `vault_accprivkey_{address}`, `vault_accpubkey_{address}`
- mobile: `account_private_key_${address}`, `account_public_key_${address}`

Do not use chain-prefixed credential keys.

Add Shelter APIs:

- `saveAccountCreds$(creds, passwordHash?)`
- `revealAccountPrivateKey$(address, passwordHash?)`
- `revealAccountPublicKey$(address, passwordHash?)`
- `revealWalletMnemonic$(walletId?, passwordHash?)`
- `saveWalletMnemonic$(walletId, mnemonic, passwordHash?)`
- `getTezosSigner$(tezosAddress)`
- future: `getEvmAccount$(evmAddress)`

Keep chain-specific validation at the edges:

- Tezos signer creation validates the supplied address belongs to a Tezos-capable account.
- EVM local-account reveal validates the supplied address belongs to an EVM-capable account.
- Generic save/reveal methods remain address-keyed and chain-agnostic.

## New Wallet / Restore Wallet

Change `Shelter.importHdAccount$`:

- Validate mnemonic as today.
- Create or receive one `walletId`.
- Create/update wallet specs for that wallet id.
- For every `hdAccountIndex`, derive Tezos creds and EVM creds.
- Store:
  - legacy `seedPhrase`
  - wallet-level mnemonic under `wallet_mnemonic_${walletId}`
  - Tezos private key under legacy key and new address-keyed key
  - Tezos public key under new address-keyed key
  - EVM private/public keys under new address-keyed keys
  - password check key
  - Sapling key by Tezos address
- Return HD accounts with:
  - `id`
  - `walletId`
  - `hdIndex`
  - `tezosAddress`
  - `evmAddress`
  - deprecated `publicKey = tezosAcc.publicKey`
  - deprecated `publicKeyHash = tezosAddress`

Update subscriptions to select the first account by `selectedAccountId` and update deprecated `selectedAccountPublicKeyHash` because the selected account is Tezos-capable.

## Add New HD Account

Change `Shelter.createHdAccount$`:

- Accept `walletId` and optional explicit `accountIndex`.
- Use `revealWalletMnemonic$(walletId)` when selected account has `walletId`.
- Fall back to `revealSeedPhrase$` only for legacy compatibility.
- Derive and store Tezos and EVM creds.
- Return a dual-chain HD account.

Update HD index lookup:

- Prefer persisted `account.hdIndex`.
- Fall back to old array-position logic only if `hdIndex` is missing.

## Duplicate Avoidance

Copy extension behavior:

- Importing an account rejects same-chain duplicate addresses.
- Automatic HD creation skips indexes whose Tezos or EVM address collides with an existing non-HD account.
- Explicit HD-index creation throws on same-chain collisions.
- Duplicate checks compare chain + address, not Tezos `publicKey` only.

Current mobile reference:

- private-key import currently compares Tezos `publicKey`;
- HD creation currently skips Tezos `publicKeyHash` duplicates up to 10 attempts.

Extension reference:

- `/Users/lendi/Desktop/Work/templewallet-extension/src/lib/temple/back/vault/misc.ts`
- `/Users/lendi/Desktop/Work/templewallet-extension/src/lib/temple/back/vault/index.ts`
- `/Users/lendi/Desktop/Work/templewallet-extension/src/lib/temple/back/vault/vault.test.ts`

## Tests

Add focused tests for:

- New wallet stores wallet mnemonic under address-keyed/wallet-level keys.
- New wallet stores Tezos and EVM private/public keys.
- New wallet still stores legacy `seedPhrase` and Tezos private key.
- New wallet returns HD accounts with `walletId`, `hdIndex`, `tezosAddress`, `evmAddress`, and deprecated Tezos aliases.
- New HD account derives EVM address matching extension for the same index.
- Automatic HD creation skips same-chain imported collisions.
- Explicit HD index throws on same-chain collision.
- Tezos signer reveal still works through legacy and new paths.

## Handoff To Phase 4

Phase 4 expects new wallets to already use the final account/storage shape.

Phase 4 will migrate legacy Redux records and legacy Keychain/Shelter entries into the same shape and key scheme used here.
