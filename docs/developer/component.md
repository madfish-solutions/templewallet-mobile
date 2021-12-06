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

## Component props

- Component may have inline props interface that should be defined as `interface Props {}`
- If component is generic and its props can be used in another components than props should be defined
  in a separate file named `my-component.props.ts`

## Component example file structure

Example:

- Component file `my-awesome-component/my-awesome-component.tsx`
- Styles file `my-awesome-component/my-awesome-component.styles.ts`
- Props interface file `my-awesome-component/my-awesome-component.props.ts`
- Tests file `my-awesome-component/my-awesome-component.spec.tsx`
- Description file `my-awesome-component/my-awesome-component.md`

Another example:

- Helper file `utils/image.utils.ts`
- Tests file `utils/image.utils.spec.ts`

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

---

- Return to the [Guides](../readme.md)

---

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

## Default export names and file names should match

By convention, a file that exports only one class, function, or constant should be named for that class, function or constant. Anything else may confuse maintainers.

### Noncompliant Code Example

```jsx
// file path: myclass.js  -- Noncompliant
class MyClass {
  // ...
}
export default MyClass;
```

### Compliant Solution

```jsx
// file path: MyClass.js
class MyClass {
  // ...
}
export default MyClass;
```

### Exceptions

Case, underscores ( \_ ) and dashes (-) are ignored from the name comparison.

## "switch" statements should have at least 3 "case" clauses

switch statements are useful when there are many different cases depending on the value of the same expression.

For just one or two cases however, the code will be more readable with if statements.

### Noncompliant Code Example

```jsx
switch (variable) {
  case 0:
    doSomething();
    break;
  default:
    doSomethingElse();
    break;
}
```

### Compliant Solution

```jsx
if (variable == 0) {
  doSomething();
} else {
  doSomethingElse();
}
```

## Deprecated APIs should not be used

Once deprecated, classes, and interfaces, and their members should be avoided, rather than used, inherited or extended. Deprecation is a warning that the class or interface has been superseded, and will eventually be removed. The deprecation period allows you to make a smooth transition away from the aging, soon-to-be-retired technology.

### Noncompliant Code Example

```jsx
export interface LanguageService {
  /**
   * @deprecated Use getEncodedSyntacticClassifications instead.
   */
  getSyntacticClassifications(fileName: string, span: TextSpan): ClassifiedSpan[];
}

const syntacticClassifications = getLanguageService().getSyntacticClassifications(file, span); // Noncompliant
```

## Redundant casts and non-null assertions should be avoided

The TypeScript compiler automatically casts a variable to the relevant type inside conditionals where it is possible to infer the type (because typeof, instanceof, etc was used). This compiler feature makes casts and not-null assertions unnecessary.

### Noncompliant Code Example

```jsx
function getName(x?: string | UserName) {
  if (x) {
    console.log("Getting name for " + x!); // Noncompliant

    if (typeof x === "string")
      return (x as string); // Noncompliant
    else
      return (x as UserName).name; // Noncompliant
  }
  return "NoName";
}
```

### Compliant Solution

```jsx
function getName(x?: string | UserName) {
  if (x) {
    console.log('Getting name for ' + x);

    if (typeof x === 'string') return x;
    else return x.name;
  }
  return 'NoName';
}
```

## Variables should not be shadowed

Overriding or shadowing a variable declared in an outer scope can strongly impact the readability, and therefore the maintainability, of a piece of code. Further, it could lead maintainers to introduce bugs because they think they’re using one variable but are really using another.

## Cognitive Complexity of functions should not be too high

Cognitive Complexity is a measure of how hard the control flow of a function is to understand. Functions with high Cognitive Complexity will be difficult to maintain.

## Local variables should not be declared and then immediately returned or thrown

Declaring a variable only to immediately return or throw it is a bad practice.

Some developers argue that the practice improves code readability, because it enables them to explicitly name what is being returned. However, this variable is an internal implementation detail that is not exposed to the callers of the method. The method name should be sufficient for callers to know exactly what will be returned.

### Noncompliant Code Example

```jsx
function computeDurationInMilliseconds(hours, minutes, seconds) {
  let duration = ((hours * 60 + minutes) * 60 + seconds) * 1000;
  return duration;
}
```

### Compliant Solution

```jsx
function computeDurationInMilliseconds(hours, minutes, seconds) {
  return ((hours * 60 + minutes) * 60 + seconds) * 1000;
}
```

## Functions should not have identical implementations

When two functions have the same implementation, either it was a mistake - something else was intended - or the duplication was intentional, but may be confusing to maintainers. In the latter case, the code should be refactored.

### Noncompliant Code Example

```jsx
function calculateCode() {
  doTheThing();
  doOtherThing();
  return code;
}

function getName() {
  // Noncompliant
  doTheThing();
  doOtherThing();
  return code;
}
```

### Compliant Solution

```jsx
function calculateCode() {
  doTheThing();
  doOtherThing();
  return code;
}

function getName() {
  return calculateCode();
}
```

### Exceptions

Functions with fewer than 3 lines are ignored.

## Array-mutating methods should not be used misleadingly

Many of JavaScript’s Array methods return an altered version of the array while leaving the source array intact. reverse and sort do not fall into this category. Instead, they alter the source array in addition to returning the altered version, which is likely not what was intended.

### Noncompliant Code Example

```jsx
var b = a.reverse(); // Noncompliant
var d = c.sort(); // Noncompliant
Compliant Solution
var b = [...a].reverse();  // de-structure and create a new array, so reverse doesn't impact 'a'
a.reverse();

c.sort(); // this sorts array in place
```

## Unused assignments should be removed

A dead store happens when a local variable is assigned a value that is not read by any subsequent instruction. Calculating or retrieving a value only to then overwrite it or throw it away, could indicate a serious error in the code. Even if it’s not an error, it is at best a waste of resources. Therefore all calculated values should be used.

### Noncompliant Code Example

```jsx
i = a + b; // Noncompliant; calculation result not used before value is overwritten
i = compute();
Compliant Solution
i = a + b;
i += compute();
```

### Exceptions

```jsx
let { a, b, ...rest } = obj; // 'a' and 'b' are ok
doSomething(rest);

let [x1, x2, x3] = arr; // but 'x1' is noncompliant, as omitting syntax can be used: "let [, x2, x3] = arr;"
doSomething(x2, x3);
```

## "void" should not be used

The void operator evaluates its argument and unconditionally returns undefined. It can be useful in pre-ECMAScript 5 environments, where undefined could be reassigned, but generally, its use makes code harder to understand.

### Noncompliant Code Example

```jsx
void doSomething();
```

### Compliant Solution

```jsx
doSomething();
```

### Exceptions

No issue is raised when void 0 is used in place of undefined.

```jsx
if (parameter === void 0) {...}
```

No issue is also raised when void is used before immediately invoked function expressions.

```jsx
void (function() {
   ...
}());
```

Also `void` is acceptable for `useEffect` with short return

## "for of" should be used with Iterables

If you have an iterable, such as an array, set, or list, your best option for looping through its values is the for of syntax. Use a counter, and …​ well you’ll get the right behavior, but your code just isn’t as clean or clear.

### Noncompliant Code Example

```jsx
const arr = [4, 3, 2, 1];

for (let i = 0; i < arr.length; i++) {
  // Noncompliant
  console.log(arr[i]);
}
```

### Compliant Solution

```jsx
const arr = [4, 3, 2, 1];

for (let value of arr) {
  console.log(value);
}
```

## Promise rejections should not be caught by 'try' block

An exception (including reject) thrown by a promise will not be caught by a nesting try block, due to the asynchronous nature of execution. Instead, use catch method of Promise or wrap it inside await expression.

### Noncompliant Code Example

```jsx
function runPromise() {
  return Promise.reject('rejection reason');
}

function foo() {
  try {
    // Noncompliant, the catch clause of the 'try' will not be executed for the code inside promise
    runPromise();
  } catch (e) {
    console.log('Failed to run promise', e);
  }
}
```

### Compliant Solution

```jsx
function foo() {
  runPromise().catch(e => console.log('Failed to run promise', e));
}

// or
async function foo() {
  try {
    await runPromise();
  } catch (e) {
    console.log('Failed to run promise', e);
  }
}
```

## Jump statements should not be redundant

Jump statements, such as `return`, `break` and `continue` let you change the default flow of program execution, but jump statements that direct the control flow to the original direction are just a waste of keystrokes.

### Noncompliant Code Example

```jsx
function redundantJump(x) {
  if (x == 1) {
    console.log('x == 1');
    return; // Noncompliant
  }
}
```

### Compliant Solution

```jsx
function redundantJump(x) {
  if (x == 1) {
    console.log('x == 1');
  }
}
```

### Exceptions

`break` and `return` inside `switch` statement are ignored, because they are often used for consistency. `continue` with label is also ignored, because label is usually used for clarity. Also a jump statement being a single statement in a block is ignored.

## Template literals should not be nested

Template literals (previously named "template strings") are an elegant way to build a string without using the `+` operator to make strings concatenation more readable.

However, it’s possible to build complex string literals by nesting together multiple template literals, and therefore lose readability and maintainability.

In such situations, it’s preferable to move the nested template into a separate statement.

### Noncompliant Code Example

```jsx
let color = 'red';
let count = 3;
let message = `I have ${color ? `${count} ${color}` : count} apples`; // Noncompliant; nested template strings not easy to read
```

### Compliant Solution

```jsx
let color = 'red';
let count = 3;
let apples = color ? `${count} ${color}` : count;
let message = `I have ${apples} apples`;
```

<!-- do not use ts-ignore -->
<!-- positive condition ternary (watch screenshot_2) -->
<!-- use tailwind's classname composition in extension -->
<!-- try do not use inline styles as much as possible -->
<!-- naming - interface, type, components with uppercase. functions with lower -->
<!-- prefer interfaces over types -->
<!-- do not let console.log be pushed to VCS -->
<!-- try to use implicit type casting (var!.field => var: IType {field:any};) -->
<!-- filenaming and classname inside must match -->
<!-- interface and component naming must match -->
<!-- no export if not use outside -->
<!-- use isDefined() insteand of pure boolean check, ex if(var) => if(isDefined(var)) -->
<!-- reuse components as much as possible -->
<!-- try implement todos as much as possible -->
<!-- try to remove comments -->
<!-- try to refactor complicated logic to utils and helpers -->
<!-- try to cover with test utils and helpers -->
<!-- consider using try...catch on unsecure code -->
<!-- Emptry.Fn for side-effect functions -->
<!-- void on single instruction useEffects -->

## Component props order

Try to follow these recommended order of props filling in component:

- styles
- props (e.g. disabled)
- handlers

```

```
