# Code styleguides:

## Linters and code format

In all projects we use [.eslintrc](.eslintrc) and [.prettierrc](.prettierrc)

## Variable naming

- All variable should be named in `camelCase`
- Generic names should not be used for naming(like data, array, list, etc)

## SVG import

SVG should be imported according to [this article](https://create-react-app.dev/docs/adding-images-fonts-and-files#adding-svgs) for React (excluding React Native).

```ts
import { ReactComponent as Logo } from './logo.svg';
```

---

- Return to the [Guides](../readme.md)

---
