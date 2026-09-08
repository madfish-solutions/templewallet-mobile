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

## A Note to the Agent
We are building this together. When you learn something non-obvious, add it here so future changes go faster.
