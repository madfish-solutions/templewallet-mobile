# Folder and file naming

## Folder naming patterns

- All folders should be in lowercase format
- Words in folders name should be separated using `-`(dash) sign - **kebab-case**

## File naming patterns

- All files should be in lowercase format
- Component files should have `.tsx` extension
- Other TS files should have `.ts` extension
- Words in file name should be separated using `-`(dash) sign - **kebab-case**
- Files naming pattern `[a-z0-9-].?[a-z0-9]?.tsx`:
  - all `[name]` - `my-awesome-component`: all words should be separated using `-`(dash) sign
  - all `[type]` - `service|util|prop|interface|enum|model|type`: single word describing component type
  - names can be combined `[name].[type].ts`
- Every type of entity should have separate folder, for ex:
  - `src/components` - for React/RN components
  - `src/enums` - for enums
  - `src/hooks` - for hooks
  - `src/interfaces` - for interfaces
  - `src/modals` - for React/RN modals
  - `src/utils` - for general usage utils and helpers
  - `src/screens` - for RN page containers
  - `src/pages` - for React/nextjs page containers
  - `src/store` - for Redux or Context Providers

---

- Return to the [Guides](../readme.md)

---
