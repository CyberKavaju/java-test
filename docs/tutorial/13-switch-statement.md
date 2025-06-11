# `switch` Statement

---

## What is `switch`?

A `switch` is a **multi-way branch statement** used to execute one block of code among many based on the value of an expression.

---

## Basic Syntax

```java
switch (expression) {
    case value1:
        // code
        break;
    case value2:
        // code
        break;
    default:
        // optional
}
```

---

## Valid `switch` Expression Types (Java 8)

| Type                                         | Allowed in switch?                |
| -------------------------------------------- | --------------------------------- |
| `byte`                                     | ✔️                              |
| `short`                                    | ✔️                              |
| `char`                                     | ✔️                              |
| `int`                                      | ✔️                              |
| `enum`                                     | ✔️                              |
| `String`                                   | ✔️ (Since Java 7)               |
| `Integer`                                  | ❌ (Wrapper not allowed directly) |
| `long`, `float`, `double`, `boolean` | ❌ Not allowed                    |

---

## ⚠️ Common OCA Gotchas

1. ❌ `switch` only works with specific types (see table above).
2. ❗ `case` values **must be compile-time constants**.

   - Literal or `final` primitive values.
3. ❗ Fall-through happens if `break` is missing.
4. ✅ `default` is optional and can appear **anywhere**.
5. ❗ Duplicate `case` values are a compile-time error.

---

## Example with `int`

```java
int day = 2;
switch (day) {
    case 1:
        System.out.println("Monday");
        break;
    case 2:
        System.out.println("Tuesday");
        break;
    default:
        System.out.println("Another day");
}
```

Output:

```
Tuesday
```

---

## Example with `String`

```java
String lang = "Java";
switch (lang) {
    case "Python":
        System.out.println("Python");
        break;
    case "Java":
        System.out.println("Java");
        break;
    default:
        System.out.println("Unknown");
}
```

---

## Fall-through Example

```java
int x = 1;
switch (x) {
    case 1:
        System.out.println("One");
    case 2:
        System.out.println("Two");
}
```

Output:

```
One
Two
```

(No `break` → fall-through happens!)

---

## `default` Position Doesn't Matter

```java
int num = 3;
switch (num) {
    default:
        System.out.println("Default");
    case 3:
        System.out.println("Three");
}
```

Output:

```
Default
Three
```

(`default` runs and falls through to case 3)

---

## ⚠️ Illegal `switch` Examples (OCA Traps!)

```java
long l = 10;
// switch (l) { } ❌ Cannot use long

final int x = 1, y = 2;
// switch (3) {
//   case x: // ✔️ final constant
//   case y + 1: // ❌ not a constant expression
// }
```

---

## 🎓 OCA Quick Quiz

### Q1: What is the output?

```java
int a = 2;
switch (a) {
    case 1:
        System.out.print("One ");
    default:
        System.out.print("Default ");
    case 2:
        System.out.print("Two ");
}
```

**A:** `Default Two`

(No break → fall-through)

---

## 📌 Summary Table

| Feature                    | Supported?               |
| -------------------------- | ------------------------ |
| `switch` on `int`      | ✔️                     |
| `switch` on `String`   | ✔️                     |
| `switch` on `long`     | ❌                       |
| `default` mandatory?     | ❌                       |
| Fall-through by default?   | ✔️                     |
| Multiple `case` values   | ✔️ (no duplicates)     |
| `case` value: final only | ✔️ if using a variable |
