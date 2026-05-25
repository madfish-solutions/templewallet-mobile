# Phase 1: Shared Derivation Helpers

## Agent Scope

Implement only shared Tezos/EVM derivation helpers and tests.

Do not change Redux account shape, Shelter storage, migration, or UI in this phase. Future phases depend on this phase being small, deterministic, and well-tested.

## Read First

- [Implementation overview](../evm-address-derivation-implementation-plan.md)
- Extension helpers:
  - `/Users/lendi/Desktop/Work/templewallet-extension/src/lib/temple/accounts-helpers.ts`
  - `/Users/lendi/Desktop/Work/templewallet-extension/src/lib/temple/back/vault/misc.ts`
  - `/Users/lendi/Desktop/Work/templewallet-extension/src/lib/temple/helpers.ts`

## Previous Phases Contract

None. This is the first phase.

## Current Mobile Context

Files to inspect:

- `src/utils/keys.util.ts`
- `src/utils/keys.utils.spec.ts`
- `src/mocks/account-credentials.mock.ts`

Mobile currently derives Tezos only:

- `getDerivationPath(accountIndex)` returns `m/44'/1729'/{index}'/0'`.
- `seedToPrivateKey(seed, derivationPath?)` uses `ed25519-hd-key`.
- `getPublicKeyAndHash$` uses Taquito `InMemorySigner`.

`viem` is already installed in mobile.

## Required Behavior

Add explicit chain-aware derivation helpers:

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

Keep `getDerivationPath` as a deprecated alias for `getTezosDerivationPath` to avoid noisy mechanical rewrites in this phase.

Add Tezos helpers:

- `mnemonicToTezosAccountCreds(mnemonic, hdIndex, bip39Passphrase?)`
- `privateKeyToTezosAccountCreds(privateKey, encPassword?)`
- Preserve existing Tezos derivation behavior.

Add EVM helpers, copied from the extension:

- `mnemonicToEvmAccountCreds(mnemonic, hdIndex)`
  - use `viem/accounts` `mnemonicToAccount(mnemonic, { addressIndex: hdIndex })`
  - `address = account.address`
  - `publicKey = account.publicKey`
  - `privateKey = toHex(account.getHdKey().privateKey!)`
- `privateKeyToEvmAccountCreds(privateKey)`
  - validate with `isHex`
  - derive via `privateKeyToAccount`
- `mnemonicToPrivateKey(mnemonic, errorFactory, bip39Passphrase?, derivationPath?)`
  - if path starts with `m/44'/60'`, use `HDKey.fromMasterSeed` and `hdKeyToAccount`
  - otherwise use existing Ed25519 derivation
  - return `{ chain, privateKey }`

Naming rule:

- In mnemonic helpers, `password` means BIP39 passphrase. Prefer naming it `bip39Passphrase`.
- App unlock/encryption credentials should be named `appPassword`, `passwordHash`, or `encPassword`.

## Test Vectors

Use the current mobile mnemonic fixture:

- Mnemonic: `alter fruit table habit match oval blame bar top kitten test web`
- EVM index 0 address: `0xfDc237eff648793c9F3B976c702493f0EE056489`
- EVM index 0 private key: `0x3925ef64b24414526bd9d28826c642a34d4d8fbb292b467a33f5376126632d3d`

Tests should cover:

- Existing Tezos derivation output is unchanged.
- `getDerivationPath` still returns the Tezos path.
- EVM index 0 address/private key match the vector.
- EVM index N uses `m/44'/60'/0'/0/{N}` behavior.
- `mnemonicToPrivateKey` returns `TempleChainKind.EVM` for custom `m/44'/60'...` paths.
- Invalid EVM private keys fail with a useful error.

## Handoff To Phase 2

Phase 2 may import:

- `TempleChainKind`, if created here; otherwise Phase 2 will create the enum.
- `AccountCreds`
- path helpers
- Tezos/EVM mnemonic and private-key credential helpers

Do not introduce account model fields in this phase unless needed for typing the helpers.
