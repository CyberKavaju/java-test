# Looping Constructs

Java provides **4 main looping mechanisms**:

## 1️⃣ `for` loop

Used when the **number of iterations is known**.

Syntax: `for(init; cond; incr)`

```java
for (int i = 0; i < 5; i++) {
    System.out.println(i);
}
```

---

## 2️⃣ `while` loop

Used when the **condition is checked before** each iteration, and the number of iterations is not known in advance.

Syntax: `while(condition)`

```java
int i = 0;
while (i < 5) {
    System.out.println(i);
    i++;
}
```

---

## 3️⃣ `do-while` loop

Like `while`, but the **condition is checked after** the first iteration, so it **always runs at least once**.

Syntax: `do { } while(condition)`

```java
int i = 0;
do {
    System.out.println(i);
    i++;
} while (i < 5);
```

---

## 4️⃣ Enhanced `for-each` loop

Used to iterate over **arrays or collections** (no index required).

Syntax: `for(type var : array)`

```java
int[] numbers = {1, 2, 3};
for (int num : numbers) {
    System.out.println(num);
}
```

---

## Loop Control Statements

These are **not loops**, but control how loops behave:

| Keyword      | Purpose                                             |
| ------------ | --------------------------------------------------- |
| `break`    | Exits the loop entirely                             |
| `continue` | Skips to the next iteration of the loop             |
| `return`   | Exits the current method (can be inside a loop)     |
| `label:`   | Named block to refer with `break` or `continue` |

### Example with `break` and `continue`

```java
for (int i = 0; i < 5; i++) {
    if (i == 2) continue; // skip 2
    if (i == 4) break;    // stop at 4
    System.out.println(i);
}
```

---

## Labeled Loops (Advanced OCA)

Labeled loops can be broken or continued from nested loops.

```java
outer:
for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 3; j++) {
        if (j == 1) break outer;
        System.out.println(i + " " + j);
    }
}
```

---

## Invalid Loop Forms (OCA traps!)

- You **cannot declare loop variables** outside of `for` like `int i` **without initializing** in the header.
- You **can omit all three parts** in `for` (they are optional):

```java
for (;;) {
    break; // infinite loop unless broken
}
```

---

## Summary Table

| Loop Type    | Syntax                      | Entry/Exit | Use Case                      |
| ------------ | --------------------------- | ---------- | ----------------------------- |
| `for`      | `for(init; cond; incr)`   | Entry      | Known number of iterations    |
| `while`    | `while(condition)`        | Entry      | Unknown iterations, pre-check |
| `do-while` | `do { } while(condition)` | Exit       | Always run once, post-check   |
| `for-each` | `for(type var : array)`   | Entry      | Iterating arrays/collections  |
