## Components

- All components should be functional and use hooks, class components are not supported
- Each component should reside in a separate folder under named `my-component`
- Сomponent name should be in the **CamelCase**: `MyAwesomeComponent`
- Components can be grouped in folders for better understanding of the structure
- Component JSX should contain as minimum JS code as possible, all logic code should be extracted into **components render function**:

### Bad

```jsx
return <View>{hasTitle ? title : ''}</View>;
```

### Good

```jsx
const title = hasTitle ? title : '';

return <View>{title}</View>;
```

## Component Styles

- All colors should be defined in `shared-style`
- All font constants(sizes, letter spacing, color, etc) should be defined in `shared-style`
- All padding and margins constants should be defined in `shared-style` and extend base values
- Each component should have separate `my-components.styles.ts` file
- Multiple styles and style merging should be done only via arrays `[]`
- Conditional styling should be done via `conditionalStyle` function
- For different platform(Web, iOS, Android) styling use `iosStyles` and `androidStyles` functions
- JSX should not contain style merging, this styles should be extracted into **components render function**:

### Bad

```jsx
return <View style={[style.root, cs(isActive, style.rootActive)]} />;
```

### Good:

```jsx
const rootStyle = [style.root, cs(isActive, style.rootActive)];

return <View style={rootStyle} />;
```

## Variable naming

- All classnames, interfaces, props and components should be named id `PascalCase`
- All variables and functions should be named in `camelCase`
- Generic names should not be used for naming(like data, array, list, etc)
- Interfaces can be named `Person` if there no shadowing or no corresponding classes/components, `PersonProps` for `Person` component, `IPerson` for `Person` class

## Code-related

- Do not use default export in files
- Do not use `@ts-ignore`, `any` type and `as` casting
- Casting:
  - `Boolean` for casting to `bool` (not `!!myvar`)
  - `String` for casting to `string` (not `+ ''`)
  - `Number` for casting to `number` (not `+myvar`)

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

## Component props

- Component may have inline props interface that should be defined as `interface Props {}`
- If component is generic and its props can be used in another components than props should be defined
  in a separate file named `my-component.props.ts`

## Naming of handlers in components

What handles - named handle%Anything%, what represents event named on%Anything%.
In most cases on/handle should have same base i.e.
`onPress -> handlePress`
`onResize -> handleResize`

### Bad:

```jsx
const Component = () => {
    const fixEverythingFn = (event) => event.preventDefault() && fixEverythingInProject();

    return (
        <TouchableOpacity onPress={fixEverythingFn}>{...}</TouchableOpacity>
    )
};
```

### Good:

```jsx
const Component = () => {
    const handlePress = (event) => event.preventDefault() && doRightThings();

    return (
        <TouchableOpacity onPress={handlePress}>{...}</TouchableOpacity>
    )
};
```

## Avoid props drilling

Anyone who has worked in React would have faced this and if not then will face it definitely. Prop drilling is basically a situation when the same data is being sent at almost every level due to requirements in the final level. Use `Context` and `Providers` to avoid props drilling.

### Bad:

```jsx
import React, { useState } from 'react';

function Parent() {
  const [fName, setfName] = useState('firstName');
  const [lName, setlName] = useState('LastName');
  return (
    <>
      <div>This is a Parent component</div>
      <br />
      <ChildA fName={fName} lName={lName} />
    </>
  );
}

function ChildA({ fName, lName }) {
  return (
    <>
      This is ChildA Component.
      <br />
      <ChildB fName={fName} lName={lName} />
    </>
  );
}

function ChildB({ fName, lName }) {
  return (
    <>
      This is ChildB Component.
      <br />
      <ChildC fName={fName} lName={lName} />
    </>
  );
}

function ChildC({ fName, lName }) {
  return (
    <>
      This is ChildC component.
      <br />
      <h3> Data from Parent component is as follows:</h3>
      <h4>{fName}</h4>
      <h4>{lName}</h4>
    </>
  );
}

export default Parent;
```

### Good:

```jsx
const Component = () => {
    const handlePress = (event) => event.preventDefault() && doRightThings();

    return (
        <TouchableOpacity onPress={handlePress}>{...}</TouchableOpacity>
    )
};
```

## Ternary return

when it comes to rendering multiple elements with fragments depending on a condition

#### Bad

```jsx
const AuthButton = props => {
  let { isLoggedIn } = props;

  if (isLoggedIn) {
    return <button>Logout</button>;
  } else {
    return <button>Login</button>;
  }
};
```

#### Good

```jsx
const AuthButton = props => {
  let { isLoggedIn } = props;

  return isLoggedIn ? <button>Logout</button> : <button>Login</button>;
};
```

The ternary approach is useful for uncomplicated `if…else` evaluations. For complicated comparisons and components, it may impact readability as a project grows.

## Using hooks in components

Hooks should be defined/used as top as possible. Hooks shouldn't be used in props directly.

> Hooks should be created only if its logic is being used in two and more components

### Bad:

```jsx
const Component = () => <View>{useAwesomeConst()}</View>;
```

```jsx
const Component = () => <TouchableOpacity onPress={useSomeHandler()}>{...}</TouchableOpacity>;
```

### Good:

```jsx
const Component = () => {
  const awesomeConst = useAwesomeConst();

  return <View>{awesomeConst}</View>;
};
```

```jsx
const Component = () => {
    const handlePress = useSomeHandler();

    return <TouchableOpacity onPress={handlePress}>{...}</TouchableOpacity>;
}
```

## Optimization and performance

Try to avoid premature optimization practices

### React.memo

Add this **React optimization** only for complex components with rendering problems

### useMemo

Do not overuse `useMemo` hook, as it should be used only for complex computations

#### Bad

```jsx
const isAbleToSubmit = useMemo(() => isValid && !isSubmitting, [isValid, isSubmitting, values]);
```

#### Good

```jsx
const calculatedData = useMemo(
  () => input.map(complexCalculationFn).filter(complexFilterFn),
  [input, complexCalculationFn, complexFilterFn]
);
```

## Ternary operators should not be nested

Just because you can do something, doesn’t mean you should, and that’s the case with nested ternary operations. Nesting ternary operators results in the kind of code that may seem clear as day when you write it, but six months later will leave maintainers (or worse - future you) scratching their heads and cursing.

Instead, err on the side of clarity, and use another line to express the nested operation as a separate statement.

### Noncompliant Code Example

```jsx
function getReadableStatus(job) {
  return job.isRunning() ? 'Running' : job.hasErrors() ? 'Failed' : 'Succeeded '; // Noncompliant
}
```

### Compliant Solution

```jsx
function getReadableStatus(job) {
  if (job.isRunning()) {
    return 'Running';
  }
  return job.hasErrors() ? 'Failed' : 'Succeeded';
}
```

## Sections of code should not be commented out

Programmers should not comment out code as it bloats programs and reduces readability.

Unused code should be deleted and can be retrieved from source control history if required.

## Functions should not be empty

There are several reasons for a function not to have a function body:

It is an unintentional omission, and should be fixed to prevent an unexpected behavior in production.
It is not yet, or never will be, supported. In this case an exception should be thrown in languages where that mechanism is available.
The method is an intentionally-blank override. In this case a nested comment should explain the reason for the blank override.

### Noncompliant Code Example

```jsx
function foo() {}

var foo = () => {};
```

### Compliant Solution

```jsx
function foo() {
  // This is intentional
}

var foo = () => {
  do_something();
};
```

### Exceptions

Case, underscores ( \_ ) and dashes (-) are ignored from the name comparison.

## Library classname composition

In some projects we use Tailwind and its better to reuse its classnames instead of implementing new one.

## Prefer interfaces over types

## Do not let leak `console.log` in development branch

## Try to use implicit type casting (var!.field => var: IType {field:any};)

### Bad

```ts
const getSplittedString = (variable?: string) => {
  return variable!.split(' ');
};
```

### Good

```ts
const getSplittedString = (variable: string): string[] => {
  return variable.split(' ');
};
```

## Do not export if not entity not used outside of file

## Use `isDefined()` helper-function instead of pure boolean check

### Bad

```jsx
return !!variable ? true : false;
```

### Good

```jsx
return isDefined(variable) ? true : false;
```

## use `EmptyFn` for typing side-effect function

## Reuse components as much as possible

## Try to implement `// TODO` as early as possible

## Try to cover with test utils and helpers

## Consider using `try...catch` on unsecure code

## Component props order

Try to follow these recommended order of props filling in component:

- styles
- props (e.g. disabled)
- handlers

## Error handling

if there are several types of errors that you need to handle, then you can check instance of error in catch block to determine the types of errors

### Example

```jsx
try {
  // Here we throw CustomError
  someOperation();
  // Here we throw AnotherCustomError
  anotherOperation();
} catch (e) {
  if (e instanceof CustomError) {
    // Custom handling
  } else if (e instanceof AnotherCustomError) {
    // Another custom handling
  } else {
    // Default error handling
  }
}
```

## SVG import

SVG should be imported according to [this article](https://create-react-app.dev/docs/adding-images-fonts-and-files#adding-svgs) for React (excluding React Native).

```ts
import { ReactComponent as Logo } from './logo.svg';
```

In React Native use svg-transformer [config](../../metro.config.js) and import-as-default-component

```ts
import AlertShield from './assets/alert-shield.svg';
```

---

- Return to the [Guides](../readme.md)

---
