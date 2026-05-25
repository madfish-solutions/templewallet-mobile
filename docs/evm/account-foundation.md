# EVM Account Foundation

This note summarizes the implemented account foundation. The full plan lives in
[evm-address-derivation-implementation-plan.md](./evm-address-derivation-implementation-plan.md).

## Account Shape

HD accounts are multi-chain accounts. One HD record owns the Tezos address, EVM address, wallet id, and HD index:

```ts
{
  id: tezosAddress,
  type: AccountTypeEnum.HD_ACCOUNT,
  walletId,
  hdIndex,
  tezosAddress,
  evmAddress,
  publicKeyHash: tezosAddress, // deprecated Tezos alias
  publicKey // deprecated public record alias
}
```

Imported accounts are chain-specific:

```ts
{
  id: address,
  type: AccountTypeEnum.IMPORTED_ACCOUNT,
  chain: TempleChainKind.Tezos | TempleChainKind.EVM,
  address,
  publicKeyHash // deprecated, present only for Tezos-compatible records
}
```

Use `getAccountAddressForTezos`, `getAccountAddressForEvm`, `getAccountForChain`, and
`canUseAccountForChain` instead of reading address fields directly when the selected account may be EVM-only.

## Selected Account

`wallet.selectedAccountId` is canonical. `wallet.selectedAccountPublicKeyHash` remains only as a deprecated Tezos
compatibility value and is updated when the selected account has a Tezos address.

Use `useSelectedAccountSelector` or `useSelectedAccountIdSelector` for account identity. Use
`useCurrentAccountTezosAddressSelector` only for Tezos flows.

## Secure Storage

Address-keyed credential entries are canonical:

- `account_private_key_${address}`
- `account_public_key_${address}`
- `wallet_mnemonic_${walletId}`

Legacy entries remain readable:

- `seedPhrase`
- `{tezosPublicKeyHash}`
- `sapling_sk_${tezosPublicKeyHash}`

Prefer `Shelter.revealAccountPrivateKey$` and `Shelter.revealAccountPublicKey$` for address-keyed credentials.
`Shelter.revealSecretKey$` is a deprecated Tezos compatibility helper.

## Migration Marker

The runtime EVM account migration is gated by `EVM_ACCOUNTS_MIGRATION_KEY`. The marker must be written only after
Keychain writes, Redux account updates, and persisted state flushing succeed. The migration must remain retryable and
idempotent.

## Future EVM Feature Rules

EVM imported accounts are visible and selectable, but Tezos-only work must guard with `canUseAccountForChain` or a Tezos
address helper before running:

- Tezos send, swap, buy/on-ramp, delegation, and Sapling
- Tezos balance refresh, token loading, and activity loading
- Tezos private-key reveal

Future PRs can add EVM balances, transactions, signing confirmations, dApp provider support, network switching, and
multiple HD wallet group UI. Until then, do not reuse Tezos token or activity pipelines for EVM addresses.
