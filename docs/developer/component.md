## Components

- All components should be functional and use hooks, class components are not supported
- Each component should reside in a separate folder under named `my-component`
- Сomponent name should be in the **CamelCase**: `MyAwesomeComponent`
- Component can be grouped in folders for better understanding of the structure
- Component JSX should containt as minimum JS code as possible, all logic code should be extracted into **components render function**:

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
- Conditional styling should be done via [rnw-community/shared](https://github.com/rnw-community/rnw-community/tree/master/packages/shared) `cs()` util
- For different platform(Web, iOS, Android) styling use [rnw-community/platform](https://github.com/rnw-community/rnw-community/blob/master/packages/platform/readme.md) helpers
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

## Component props

- Component may have inline props interface that should be defined as `interface Props {}`
- If component is generic and its props can be used in another components than props should be defined
  in a separate file named `my-component.props.ts`

## Component example file structure

- Component file `my-awesome-component/my-awesome-component.tsx`
- Styles file `my-awesome-component/my-awesome-component.styles.ts`
- Props interface file `my-awesome-component/my-awesome-component.props.ts`
- Tests file `my-awesome-component/my-awesome-component.spec.tsx`
- Description file `my-awesome-component/my-awesome-component.md`

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

Add this **React optimization** only for complex components with rendering problems, leave it to Dan =)

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
