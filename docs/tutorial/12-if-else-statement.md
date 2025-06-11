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

## Ternary Alternative (shorthand if-else)

```java
int age = 18;
String status = (age >= 18) ? "Adult" : "Minor";
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
