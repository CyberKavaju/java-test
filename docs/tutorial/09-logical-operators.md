# Logical Operators

Logical operators allow you to **combine or manipulate boolean expressions** — essential in `if`, `while`, and other control statements.

---

## Logical Operators Summary

| Operator | Name                     | Description                                  | Type                                      |
| -------- | ------------------------ | -------------------------------------------- | ----------------------------------------- |
| `&&`   | Logical AND              | `true` if **both** operands are true | Short-circuit                             |
| `\|      | `                        |                                              | `                                         |
| `!`    | Logical NOT              | Inverts the boolean value                    | Unary                                     |
| `&`    | Bitwise AND (or Logical) | Also works on booleans (no short-circuit)    | Full eval                                 |
| `\|`    | `                        | Bitwise OR (or Logical)                      | Also works on booleans (no short-circuit) |
| `^`    | Logical XOR              | `true` if operands differ (true/false)     | Full eval                                 |

---

## 1. `&&` — Logical AND (Short-Circuit)

```java
boolean result = (5 > 2) && (10 > 5); // true && true → true
```

### Short-circuit behavior:

If the first condition is false, Java **doesn't evaluate** the second one.

```java
int x = 5;
if (x < 2 && ++x < 10) {
    // won't increment x — short-circuit stops it
}
```

---

## 2. `||` — Logical OR (Short-Circuit)

```java
boolean result = (4 < 2) || (5 < 10); // false || true → true
```

### Short-circuit behavior:

If the first condition is true, Java skips the second.

```java
int x = 5;
if (x > 2 || ++x < 10) {
    // x is not incremented — short-circuit stops it
}
```

---

## 3. `!` — Logical NOT

```java
boolean a = true;
System.out.println(!a); // false
```

---

## 4. `&` — AND (No Short-Circuit!)

```java

boolean a = true;
boolean b = false;
System.out.println(a & b); // false

```

> Even if `a` is false, `b` is still evaluated.

```java

int x = 5;
if (x < 2 & ++x < 10) {
    // x is incremented even though first condition is false
}

```

---

## 5. `|` — OR (No Short-Circuit!)

```java
boolean a = true;
boolean b = false;
System.out.println(a | b); // true
```

> Both sides are always evaluated

---

## 6. `^` — Logical XOR (Exclusive OR)

```java
System.out.println(true ^ false); // true
System.out.println(true ^ true);  // false
```

| A     | B     | A ^ B |
| ----- | ----- | ----- |
| true  | true  | false |
| true  | false | true  |
| false | true  | true  |
| false | false | false |

---

## ⚠️ OCA Pitfalls

### ❗ Don't confuse `&` vs `&&`, or `|` vs `||`

- `&&`, `||` — **short-circuit**, only for booleans
- `&`, `|` — **bitwise** for numbers, or **logical (non-short-circuit)** for booleans

### ❗ Only booleans allowed in `if` conditions

```java
int x = 1;
if (x & 1) { }   // ❌ compile error — must be boolean
```

---

## Quick Quiz

### Q: What is the output?

```java
int x = 5;
if (x > 1 || ++x > 10) {
    System.out.println(x);
}
```

**A:** `5` — because `x > 1` is true, so `++x` is skipped due to short-circuiting

---

## Summary Table

| Operator | Short-Circuit? | Boolean Use | Bitwise Use | Example    |
| -------- | -------------- | ----------- | ----------- | ---------- |
| `&&`   | ✔️           | ✔️        | ❌          | `a && b` |
| `\|      | `              | ✔️        | ✔️        | ✔️       |
| `!`    | N/A            | ✔️        | ❌          | `!a`     |
| `&`    | ❌             | ✔️        | ✔️        | `a & b`  |
| `\|`    | ❌             | ❌          | ✔️        | ✔️       |
| `^`    | ❌             | ✔️        | ✔️        | `a ^ b`  |
