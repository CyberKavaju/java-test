# `if-else` Statement

---

## What is `if-else`?

`if-else` is a fundamental decision-making construct in Java.
It allows your code to **branch** based on a **boolean condition**.

---

## Basic Syntax

```java
if (condition) {
    // code runs if condition is true
} else {
    // code runs if condition is false
}
```

---

## `if-else if-else` Ladder

```java
if (x == 1) {
    System.out.println("One");
} else if (x == 2) {
    System.out.println("Two");
} else {
    System.out.println("Other");
}
```

---

## Valid Conditions

- `if` requires a **boolean expression**

```java
boolean flag = true;
if (flag) { ... } // ✔️
```

---

## ⚠️ Common OCA Mistakes

### ❌ Invalid condition types

```java
int x = 5;
if (x) {}         // ❌ Compile error: int is not boolean
```

### ❗ No parentheses = syntax error

```java
if x == 5 { }     // ❌ Must use (x == 5)
```

### ❗ Misunderstanding `else` pairing

Java uses the **"closest unmatched if"** rule

In Java, **each `else` is matched with the closest previous unmatched `if`**.

That means:

- Java **pairs an `else` with the nearest `if`** that doesn't already have its own `else`.
- It does **not care about indentation** or what *looks* right to you — only the **braces `{}`** define blocks.

basically always use braces and avoid the syntax without braces

```java
if (a > b)
    if (b > c)
        System.out.println("b > c");
else
    System.out.println("else"); // belongs to the inner `if`
```

---

## Nested `if` Example

```java
int x = 10;
if (x > 5) {
    if (x < 20) {
        System.out.println("x is between 6 and 19");
    }
}
```

---

## Single-Line Body (without `{}`)

```java
if (x > 10)
    System.out.println("Big");  // valid
else
    System.out.println("Small"); // valid
```

⚠️ Always use braces `{}` in real projects to avoid logic errors.

---

## Ternary Operator (Conditional Operator)

The **ternary operator** `? :` is Java's only **three-operand operator**. It provides a concise way to write simple `if-else` statements in a single expression.

### Basic Syntax

```java
result = (condition) ? valueIfTrue : valueIfFalse;
```

### Simple Examples

```java
int age = 18;
String status = (age >= 18) ? "Adult" : "Minor";

int x = 5, y = 10;
int max = (x > y) ? x : y;  // Gets the maximum value

boolean isEven = (number % 2 == 0) ? true : false;
// Better: boolean isEven = (number % 2 == 0);
```

### Type Compatibility

The **second and third operands** must be **compatible types** or convertible to a common type:

```java
// ✔️ Both are int
int result = (x > 0) ? 10 : 20;

// ✔️ Both can be converted to double
double result = (x > 0) ? 10.5 : 20;  // 20 becomes 20.0

// ✔️ Both are String
String message = (passed) ? "Success" : "Failed";

// ❌ Incompatible types
String result = (x > 0) ? "text" : 42;  // Compile error!
```

### Nested Ternary Operators

You can nest ternary operators, but **readability suffers**:

```java
int score = 85;
String grade = (score >= 90) ? "A" : 
               (score >= 80) ? "B" : 
               (score >= 70) ? "C" : 
               (score >= 60) ? "D" : "F";
```

⚠️ **Better approach** for complex conditions: use `if-else if` chains for readability.

### When to Use Ternary vs. if-else

#### ✔️ Good use cases for ternary:
```java
// Simple value assignment
int abs = (num < 0) ? -num : num;

// Method parameters
System.out.println((count == 1) ? "item" : "items");

// Return statements
return (x > y) ? x : y;
```

#### ❌ Avoid ternary for:
```java
// Complex logic (hard to read)
String result = (user.isActive() && user.hasPermission() && 
                !user.isBlocked()) ? processUser(user) : 
                handleInactiveUser(user);

// Multiple statements (impossible with ternary)
if (condition) {
    doSomething();
    doSomethingElse();
} else {
    doAnotherThing();
}
```

### Common OCA Exam Gotchas

#### 1. **Parentheses around condition** (recommended)
```java
int result = (x > 0) ? 1 : -1;  // ✔️ Clear
int result = x > 0 ? 1 : -1;    // ✔️ Valid but less clear
```

#### 2. **Assignment vs. standalone expression**
```java
// ✔️ Assignment
String message = (flag) ? "Yes" : "No";

// ❌ Standalone ternary (not useful)
(flag) ? "Yes" : "No";  // Result is discarded
```

#### 3. **Operator precedence**
```java
// Be careful with operator precedence
int result = x > 0 ? x * 2 : x / 2;  // Works as expected
int result = x + (flag ? 10 : 20);   // Addition happens after ternary
```

### Equivalent if-else Conversion

Every ternary can be rewritten as `if-else`:

```java
// Ternary version
String status = (age >= 18) ? "Adult" : "Minor";

// Equivalent if-else version
String status;
if (age >= 18) {
    status = "Adult";
} else {
    status = "Minor";
}
```

---

## OCA Exam Quick Quiz

### Q1:

```java
int x = 10;
if (x > 5)
    if (x < 15)
        System.out.println("OK");
    else
        System.out.println("Too big");
```

🧠 What will it print?

✔️ **A:** `OK`
(else belongs to the inner if)

---

### Q2: Which compiles?

```java
int x = 0;
if (x == 1)
    System.out.println("One");
else
    x = 2;
```

✔️ Compiles! `else` can execute any valid statement — even an assignment.

---

## 📌 Summary Table

| Feature                  | Allowed?               |
| ------------------------ | ---------------------- |
| `if` with boolean only | ✔️                   |
| Nested `if` statements | ✔️                   |
| Omit `{}` braces       | ✔️ (not recommended) |
| `else` optional        | ✔️                   |
| `else if` chaining     | ✔️                   |
| Non-boolean condition    | ❌                     |

## Video tutorials

[If Else Statement In Java Tutorial #17 - Alex Lee](https://www.youtube.com/watch?v=yvWnj_HfG6s)

[Java if statements 🚧【6 minutes】 - Bro Code](https://www.youtube.com/watch?v=MY03bt_0JQI)

[if-else Statement in Java - Neso Academy](https://www.youtube.com/watch?v=-VeUElwL27I)