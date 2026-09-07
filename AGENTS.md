# AGENTS.md – Working Effectively In This Repo

This repository is the Temple Wallet mobile app codebase. Temple Wallet is an open-source wallet for Tezos blockchain, focusing on security and seamless UX.

Tech stack: React Native CLI 0.83.1, React v19, TypeScript, Redux Toolkit, RxJS with Redux Observable

Optimize for clarity, polish, and performance in every change.

## Core Tenets (Do Not Violate)
1. Polish is a feature. Visual and interaction quality matter as much as correctness.
2. Performance is a feature. Avoid UI hitches, excessive main-thread work, and unnecessary re-rendering.
3. Stay aligned with the existing architecture. Prefer small, targeted improvements over new abstractions.
4. Do not quietly change security-sensitive behavior. Call it out.
5. When instructions are unclear or conflicting, ask for clarification.

## Commands
- `yarn start`: Start Metro server
- `yarn android`: Create a debug build for Android and run it on an Android device or simulator
- `yarn ios`: Create a debug build for iOS and run it on an iOS device or simulator
- `yarn test`: Run unit tests (prefer single test files for speed)
- `yarn ts`: Run the typechecker
- `yarn lint`: Run the linter
- `yarn find-deadcode`: Check for dead code

## Code Style
- See `src/components/loading-placeholder/loading-placeholder.tsx` for canonical component structure
- Avoid repetitive code (DRY principle)
- Break down large components into smaller, focused sub-components
- Add comments for complex logic only

## TypeScript
- Enforce proper typing (avoid `any` unless absolutely necessary)
- Define explicit types for function parameters and return values
- Use interfaces for object shapes
- Use type aliases for complex types
- Leverage union types and discriminated unions

## State Management
- Migrations are mandatory for persisted state changes

## Reusable Components, Hooks, Utils, Constants
- API clients: `src/apis/`
- Constants for configuration: `src/config/`
- Types: `src/enums`, `src/interfaces`, `src/types/`
- Components with some forms logic: `src/form/`
- Layouts: `src/layouts/`
- Navigation-specific hooks, components, and types: `src/navigator/`
- General utils: `src/utils/`
- Secure storage implementation: `src/shelter`

## Objkt collectibles-by-slug
- `MAX_OBJKT_QUERY_RESPONSE_ITEMS` (500) is Hasura's max rows, used for collection pagination — not a safe request size for nested token queries.
- Collectibles-by-slug uses `OBJKT_COLLECTIBLES_QUERY_CHUNK_SIZE` (50), concurrency 2, per-chunk retries, a 60s abort timeout, and a 1s `bufferTime` so Redux is not updated on every HTTP response.
- Failed chunks throw/wrap `ObjktCollectiblesBySlugsError` with the chunk slugs; those slugs stay `undefined` in details (retryable). Successful chunks may still mark some slugs `null` (Objkt had no row).
- Bulk details loading: `concatMap` so same-account slug deltas do not cancel in-flight work; `switchMap` on `selectedAccountPublicKeyHash` so account switches drop the queue and abort HTTP. `isLoading` follows remaining `collectiblesDetailsInFlight`.
- Submit marks in-flight by replacing the record (plain object, not per-key Immer writes). The hook concatenates priority groups into one `submit`. redux-logger skips these bulk collectibles/metadata actions — `diff: true` on tens of thousands of slugs stalls the JS thread in `__DEV__`.
- Load-priority grouping must parse mint timestamps once per token, never inside `sort` comparators — `new Date()` on Hermes is too slow for whale collections.

## Tezos token metadata (batch POST)
- `loadTokensMetadata$` POSTs slugs in chunks of 100, concurrency 2, HTTP retries (2, exponential backoff), and a 1s `bufferTime` so Redux is not updated on every response.
- API `null` is often a flake for NFTs (unlike Objkt details, where `null` means "no row"). After all chunks of a wave finish, remaining nulls are retried against the **full submit**: always once, then while `|nulls| * 2 <= |original slugs|`, max 3 extra rounds. Each retry wave waits `1s * 2^extraRound` (1s, 2s, 4s) so the metadata API can catch up. Per-chunk 2× shrink gives up too early on NFT-heavy 100-slug POSTs.
- Streamed `success` keeps `isLoading`; `{ done: true }` or `fail` clears it. `use-metadata-loading` submits all missing slugs (fetch already chunks); a `Set` skips slugs already requested. Remaining nulls after retries are not fetched again.
- Bulk metadata loading: `concatMap` so same-account slug deltas do not cancel in-flight work; `switchMap` on `selectedAccountPublicKeyHash` so account switches drop the queue. `setSelectedAccountAction` clears `isLoading`.

## A Note to the Agent
We are building this together. When you learn something non-obvious, add it here so future changes go faster.
