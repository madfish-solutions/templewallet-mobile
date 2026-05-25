# Phase 5: Imported Account Flows

## Agent Scope

Add Tezos/EVM chain choice to imported-account private-key and seed-phrase flows.

Do not implement EVM balances, transactions, network switching, or dApp support.

## Read First

- [Implementation overview](../evm-address-derivation-implementation-plan.md)
- [Phase 1 handoff](./phase-1-shared-derivation-helpers.md)
- [Phase 2 handoff](./phase-2-account-model-selection-facades.md)
- [Phase 3 handoff](./phase-3-hd-wallet-creation-secure-storage.md)
- [Phase 4 handoff](./phase-4-legacy-account-migration.md)
- Extension import logic:
  - `/Users/lendi/Desktop/Work/templewallet-extension/src/lib/temple/back/vault/index.ts`
  - `/Users/lendi/Desktop/Work/templewallet-extension/src/lib/temple/accounts-helpers.ts`
  - `/Users/lendi/Desktop/Work/templewallet-extension/src/lib/temple/back/vault/misc.ts`

## Previous Phases Contract

You can assume:

- `selectedAccountId` exists and is canonical.
- EVM imported accounts can be selected by id.
- Tezos-only actions can be disabled through `canUseAccountForChain`.
- Shelter can store/reveal private/public keys by address.
- New and migrated HD accounts already have EVM credentials.
- Derivation helpers support extension-compatible custom EVM paths.

## Files To Inspect

- `src/modals/choose-account-import-type/index.tsx`
- `src/modals/import-account/import-account-private-key/`
- `src/modals/import-account/import-account-seed/`
- `src/shelter/use-shelter.hook.ts`
- `src/shelter/utils/create-import-account-subscription.util.ts`
- `src/shelter/shelter.ts`
- relevant import-account form validation files

## Add Chain Choice

Add a compact chain selector to both imported-account flows:

- Tezos
- EVM

Default to Tezos to preserve current behavior.

Use concise labels and existing form controls. Do not add marketing/explanatory copy.

## Import From Private Key

Current behavior:

- Always validates as Tezos through `getPublicKeyAndHash$`.
- Rejects duplicates by comparing derived Tezos public key with existing `account.publicKey`.
- Saves Tezos private key under legacy key.
- Derives/stores Sapling.
- Selects the new account by `publicKeyHash`.
- Loads Tezos balance and on-ramp side effects.

New behavior:

If chain is Tezos:

- Preserve current validation and import behavior.
- Also use new address-keyed Shelter credential APIs.
- Select by `selectedAccountId`.
- Update deprecated `selectedAccountPublicKeyHash`.
- Keep Sapling derivation.
- Keep Tezos balance/on-ramp side effects.

If chain is EVM:

- Validate hex private key with `privateKeyToEvmAccountCreds`.
- Store EVM private/public key under address-keyed keys.
- Create imported account:

```ts
{
  id,
  type: AccountTypeEnum.IMPORTED_ACCOUNT,
  chain: TempleChainKind.EVM,
  address,
  name
}
```

- Do not write `publicKeyHash`.
- Do not derive or store Sapling key.
- Do not run `loadTezosBalance$`.
- Do not run Tezos on-ramp logic.
- Select by `selectedAccountId`.
- Do not update deprecated `selectedAccountPublicKeyHash`.

Duplicate detection:

- Compare chain + address.
- Reject if same-chain address already exists on HD/imported/watch-only/ledger/managed account.
- Do not compare Tezos `publicKey` only.

## Import From Seed Phrase

Current behavior:

- Uses `ed25519-hd-key` validation only.
- Default path is Tezos account 0.
- Derives Tezos private key and imports as Tezos imported account.

New behavior:

If chain is Tezos:

- Default path `m/44'/1729'/0'/0'`.
- Validation uses current Ed25519 path validation.
- Derive Sapling key from Tezos HD index when possible.
- Preserve current behavior as much as possible.

If chain is EVM:

- Default path `m/44'/60'/0'/0/0`.
- Copy extension behavior for custom paths:
  - accept valid paths starting with `m/44'/60'`;
  - derive with Viem `HDKey.fromMasterSeed` + `hdKeyToAccount`;
  - return `{ chain: TempleChainKind.EVM, privateKey }` from `mnemonicToPrivateKey`.
- Import as chain-specific EVM account.
- Skip Sapling derivation.
- Select by `selectedAccountId`.
- Do not update deprecated `selectedAccountPublicKeyHash`.

The form can keep one "Default account" option, but the default path must update when the chain changes.

## UI State Rules

EVM imported accounts should appear in all account lists.

When an EVM-only account is selected:

- Tezos-only actions are disabled.
- Tezos balances should not load.
- EVM balance/action surfaces can render empty or chain-limited states until later EVM features exist.

## Tests

Add focused tests for:

- Tezos private-key import still works.
- EVM private-key import validates and stores address-keyed private/public keys.
- Invalid EVM private key shows same style of validation/error feedback as Tezos failures.
- Tezos seed import default path remains unchanged.
- EVM seed import default path is `m/44'/60'/0'/0/0`.
- EVM custom `m/44'/60'...` paths match extension behavior.
- EVM import skips Sapling and Tezos balance/on-ramp side effects.
- Imported EVM account is selected by `selectedAccountId`.
- Deprecated `selectedAccountPublicKeyHash` is not updated for EVM-only accounts.
- Duplicate same-chain address import is rejected.

## Handoff To Phase 6

After this phase:

- New imported Tezos accounts use the new model while preserving old behavior.
- New imported EVM accounts exist as chain-specific imported accounts.
- Tezos-only actions should be guarded for EVM-only selected accounts where touched.

Phase 6 will do broader cleanup, guardrails, docs, and final validation.
