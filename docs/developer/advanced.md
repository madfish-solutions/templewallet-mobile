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

### Noncompliant Code Example

```tsx
const loadAssetsBalances$ = (rpcUrl: string, publicKeyHash: string, assetSlugs: string[]) =>
  forkJoin(
    assetSlugs.map(assetSlugs =>
      loadAssetBalance$(createReadOnlyTezosToolkit(rpcUrl, readOnlySignerAccount), publicKeyHash, assetSlugs)
    )
  );
```

### Compliant Solution

```tsx
const loadAssetsBalances$ = (rpcUrl: string, publicKeyHash: string, assetSlugs: string[]) =>
  forkJoin(
    assetSlugs.map(assets =>
      loadAssetBalance$(createReadOnlyTezosToolkit(rpcUrl, readOnlySignerAccount), publicKeyHash, assets)
    )
  );
```

## Cognitive Complexity of functions should not be too high

Cognitive Complexity is a measure of how hard the control flow of a function is to understand. Functions with high Cognitive Complexity will be difficult to maintain.
Try to refactor complicated logic to utils and helpers.

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
```

### Compliant Solution

```jsx
var b = [...a].reverse(); // de-structure and create a new array, so reverse doesn't impact 'a'
a.reverse();

c.sort(); // this sorts array in place
```

## Unused assignments should be removed

A dead store happens when a local variable is assigned a value that is not read by any subsequent instruction. Calculating or retrieving a value only to then overwrite it or throw it away, could indicate a serious error in the code. Even if it’s not an error, it is at best a waste of resources. Therefore all calculated values should be used.

### Noncompliant Code Example

```jsx
i = a + b; // Noncompliant; calculation result not used before value is overwritten
i = compute();
```

### Compliant Solution

```jsx
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
Also `void` is acceptable for `useEffect` with short return.

```jsx
if (parameter === void 0) {...}
```

No issue is also raised when void is used before immediately invoked function expressions.

```jsx
void (function() {
   ...
}());
```

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

## Positive condition ternary in components/tsx

Its easier to understand "positive" conditions.

### Bad

```jsx
return !onboardingCompleted ? <Onboarding /> : <PageLayout />;
```

### Good

```jsx
return onboardingCompleted ? <PageLayout /> : <Onboarding />;
```

---

- Return to the [Guides](../readme.md)

---
