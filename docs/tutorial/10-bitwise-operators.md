# Bitwise Operators

---

Great question! 💡 **Bitwise operators** in Java are low-level operators that let you **manipulate individual bits** of integers (like `int`, `byte`, `short`, etc.). They're not only useful for performance-critical systems like games or embedded programming — but also show up in **interview questions** and sometimes even the **OCA Java SE 8 exam**.

---

> **Bitwise operators** work directly on the **binary representations** of integers.

Example:

```java

int a = 5;     // binary: 0101
int b = 3;     // binary: 0011
int result = a & b; // result: 0001 (1)

```

---

## 🔧 Why Use Bitwise Operators?

| Use Case                            | Why it matters                              |
| ----------------------------------- | ------------------------------------------- |
| Performance optimization            | Very fast operations (no loops or branches) |
| Flags and permissions               | Store multiple boolean states in one int    |
| Low-level protocol handling         | Networking, compression, encryption         |
| Game development, graphics, devices | Memory-efficient state storage              |
| Interview questions 🧠              | Often used to test logic & binary thinking  |

---

## Bitwise Operators table

| Operator | Name                 | Description                                     | Example (binary)                          |
| -------- | -------------------- | ----------------------------------------------- | ----------------------------------------- |
| `&`    | AND                  | Bit is `1` if **both** bits are `1`   | `0101 & 0011` → `0001` = `1`       |
| `\|`    | OR                   | Bit is `1` if **either** bit is `1`   | `0101 \| 0011` → `0111` = `7`       |
| `^`    | XOR                  | Bit is `1` if **only one** bit is `1` | `0101 ^ 0011` → `0110` = `6`       |
| `~`    | NOT (complement)     | Inverts all bits:`1` → `0`, `0` → `1` | `~0101` → `1010` = `-6` (2's comp) |
| `<<`   | Left shift           | Shifts bits left (multiplies by 2ⁿ)            | `3 << 1` → `6` (0011 → 0110)        |
| `>>`   | Right shift          | Shifts bits right, fills with sign bit          | `-4 >> 1` → `-2`                     |
| `>>>`  | Unsigned right shift | Shifts right, fills left with `0`             | `-4 >>> 1` → large positive value      |

---

## 🔎 Examples

### AND (`&`)

```java

int a = 5; // 0101
int b = 3; // 0011
System.out.println(a & b); // 0001 → 1

```

### OR (`|`)

```java

System.out.println(5 | 3); // 0101 | 0011 = 0111 → 7

```

### XOR (`^`)

```java

System.out.println(5 ^ 3); // 0101 ^ 0011 = 0110 → 6

```

### NOT (`~`)

```java

System.out.println(~5); // ~0101 = 1010 → -6 (2's complement)

```

---

## Bit Shifting

### Left shift (`<<`)

```java

int x = 3;     // 0011
System.out.println(x << 1); // 0110 → 6

```

### Right shift (`>>`)

```java

int x = -8;    // 11111000
System.out.println(x >> 1); // 11111100 → -4

```

### Unsigned right shift (`>>>`)

```java

int x = -8;
System.out.println(x >>> 1); // fills left bits with 0 → large positive number

```

---

## When Bitwise Beats Logical Operators

| Operator            | Use with               | Short-circuit? | Purpose                                                 |
| ------------------- | ---------------------- | -------------- | ------------------------------------------------------- |
| `&&`, `\|\|`      | `boolean` values     | ✅ Yes         | Logical operations with short-circuiting                |
| `&`, `\|`, `^` | `int` \| `boolean` | ❌ No          | Bit-level operations or non-short-circuit boolean logic |

---

## Bitwise Flags (Advanced Use)

```java

int READ = 1;       // 0001
int WRITE = 2;      // 0010
int EXECUTE = 4;    // 0100

int permissions = READ | EXECUTE; // 0001 | 0100 = 0101

boolean canRead = (permissions & READ) != 0; // ✔️
boolean canWrite = (permissions & WRITE) != 0; // ❌

```

This is how file systems and games store multiple states using **one int**!

---

## Quick Quiz

### Q: What is the output?

```java
int a = 6;   // 0110
int b = 4;   // 0100
System.out.println(a & b);
```

✅ **Answer:** `4` → 0110 & 0100 = `0100`

---

## ⚠️ OCA Pitfalls

| Trap                                          | Explanation                                           |
| --------------------------------------------- | ----------------------------------------------------- |
| Using bitwise `&` instead of logical `&&` | Will**not short-circuit** and can confuse logic |
| Using `~` and expecting positive results    | Produces 2's complement negative result              |
| Using `>>>` on `int` with negative values | Produces large**positive** values               |
| Forgetting parentheses with combined ops      | Bitwise operators have lower precedence               |

---

## Summary Table

| Symbol  | Name        | Action                        |
| ------- | ----------- | ----------------------------- |
| `&`   | AND         | Both bits must be 1           |
| `\|`   | OR          | At least one bit is 1         |
| `^`   | XOR         | Exactly one bit is 1          |
| `~`   | NOT         | Flip all bits                 |
| `<<`  | Left Shift  | Multiply by 2ⁿ               |
| `>>`  | Right Shift | Divide by 2ⁿ (preserve sign) |
| `>>>` | Unsigned RS | Fill with 0, ignore sign      |

---

## Final Rule of Thumb

> Use **bitwise operators** when you:

* Work with **flags or binary masks**
* Need **low-level performance**
* Want to **manipulate data at the bit level**
