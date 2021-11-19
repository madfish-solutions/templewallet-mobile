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

## Short return

We tend to use short versions of functions where its possible

#### Bad

```jsx
const fn = boolean => {
  if (boolean) {
    return 1;
  } else {
    return 2;
  }
};
```

#### Good

```jsx
const fn = value => (value ? 1 : 2);
```

---

- Return to the [Guides](../readme.md)

---
