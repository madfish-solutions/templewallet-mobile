# Phase 6: Cleanup And Guardrails

## Agent Scope

Finalize the grand PR: tighten deprecated usage, add missing guards, update developer docs, and run broad validation.

Do not add new EVM product features such as balances, transactions, network switching, signing confirmations, or dApp support.

## Read First

- [Implementation overview](../evm-address-derivation-implementation-plan.md)
- Phase docs 1-5 handoff sections

## Previous Phases Contract

By this phase:

- Derivation helpers exist and are tested.
- Account records include ids, wallet ids, HD indexes, and chain-aware address fields.
- `selectedAccountId` is canonical.
- New wallets store Tezos/EVM credentials.
- Legacy wallets migrate before wallet entry.
- Imported account flows support Tezos and EVM.

## Cleanup Targets

Replace direct `publicKeyHash` usage where it means account identity or where chain ambiguity matters.

Do not mechanically rewrite every Tezos-specific call site. Tezos balances, Sapling, delegation, swap, and token operations may still use Tezos addresses, but they should obtain those addresses through helpers when the selected account could be EVM-only.

Add `/** @deprecated */` comments to old compatibility fields and APIs once replacements exist:

- `publicKeyHash` as account id
- `publicKey` on public account records
- `selectedAccountPublicKeyHash`
- Tezos-only selected-account selectors where new selected-account selectors should be used
- legacy secret key helpers where new address-keyed helpers exist

## Guardrails

Ensure Tezos-only actions are disabled or skipped for EVM-only accounts:

- send
- swap
- buy/on-ramp
- delegation
- Sapling
- reveal Tezos private key
- Tezos balance refresh
- Tezos token/activity loading

Use:

- `selectedAccountId`
- `useSelectedAccountSelector`
- `getAccountForChain`
- `canUseAccountForChain`
- `getAccountAddressForTezos`
- `getAccountAddressForEvm`

## Docs

Add or update developer docs near the implementation:

- final account shape
- selected-account model
- deprecated Tezos compatibility fields
- secure storage keys
- migration marker
- rules for adding future EVM features

Keep docs concise and link back to `docs/evm/evm-address-derivation-implementation-plan.md`.

## Final Validation Checklist

Run:

- `yarn ts`
- focused tests touched throughout the grand PR
- `yarn lint`

Confirm:

- HD EVM addresses match extension for known mnemonic/index.
- Custom EVM derivation paths match extension `mnemonicToPrivateKey` behavior.
- Tezos derivation output is unchanged.
- New wallet stores Tezos and EVM private/public keys.
- Legacy Tezos private-key reveal still works.
- EVM private-key reveal works through address-keyed Shelter APIs.
- Existing Sapling spending keys remain readable by Tezos address.
- Missing HD Sapling spending keys are restored with the same array-position `hdIndex` used for EVM derivation.
- Migration is retryable and idempotent.
- Migration marker is written only after Keychain writes, Redux update, and persistence flush.
- Existing selected account is preserved by `selectedAccountId`.
- Existing balances/tokens remain under the same Tezos key.
- Imported Tezos accounts remain usable.
- EVM imported accounts do not trigger Tezos balance loading.
- EVM imported accounts are selected through `selectedAccountId`, not `selectedAccountPublicKeyHash`.
- EVM-only selected accounts render in all account lists with Tezos-only actions disabled.
- Unlock shows a blocking migration modal until EVM account migration completes.

## Handoff

At the end of this phase, the grand PR should be ready for review as the EVM account-foundation change.

Future PRs can add:

- EVM balances
- EVM transactions
- EVM signing confirmations
- dApp provider support
- network switching
- multiple HD wallet group UI
