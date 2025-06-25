# Variable Casting and Conversions

---

## What Is Type Conversion?

> Type conversion is the process of **changing a variable from one data type to another**.

Java supports:

1. ✅ **Widening Conversion** (automatic / implicit)
2. ⚠️ **Narrowing Conversion** (manual / explicit)

---

## 📌 1. Widening (Implicit) Conversion

> ✅ Safe — smaller type ➡️ larger type
> ✅ No data loss — happens **automatically**

### Example:

```java

int i = 100;
long l = i;         // int → long (implicit)
float f = l;        // long → float (implicit)

```

### ✅ Valid Widening Conversions:

| From      | To                                                  |
| --------- | --------------------------------------------------- |
| `byte`    | `short`, `int`, `long`, `float`, `double`           |
| `short`   | `int`, `long`, `float`, `double`                    |
| `char`    | `int`, `long`, `float`, `double`                    |
| `int`     | `long`, `float`, `double`                           |
| `long`    | `float`, `double`                                   |
| `float`   | `double`                                            |

---

## 2. Narrowing (Explicit) Conversion

> ⚠️ Risky — larger type ➡️ smaller type
> ❗ Requires **manual cast**
> ❗ Can cause **data loss or overflow**

### Example:

```java

double d = 9.9;
int x = (int) d;     // narrowing — fractional part lost
System.out.println(x); // 9

```

### Without casting — won't compile:

```java

int x = 9.8;          // ❌ Error: incompatible types

```

---

## Syntax: Casting

```java

TargetType varName = (TargetType) originalValue;

```

Example:

```java

int i = (int) 5.75; // i becomes 5

```

---

## Char & Numeric Types

`char` is special: it's **unsigned 16-bit integer** (`0` to `65535`)

```java

char c = 'A';
int x = c;            // ✔️ widening: char → int
char d = (char) 66;   // ✔️ narrowing: int → char → 'B'

```

---

## Literal Assignments & Compile-Time Conversions

Java allows **assigning smaller literals** to narrower types **if in range**:

```java

byte b = 100;        // ✅ OK (within -128 to 127)
byte b2 = 200;       // ❌ Compile error: out of range

final int x = 10;
byte b3 = x;         // ✅ OK: `x` is a `final` constant in range

```

---

## Reference Type Casting (Objects)

> ✅ **Upcasting** — subclass ➡️ superclass (automatic)
> ⚠️ **Downcasting** — superclass ➡️ subclass (requires explicit cast)

### Example:

```java

class Animal {}
class Dog extends Animal {
    void bark() {}
}

Animal a = new Dog();         // ✔️ upcasting
Dog d = (Dog) a;              // ✔️ downcasting (safe here)
d.bark();                     // works!

```

### ❗ Unsafe downcasting

```java

Animal a = new Animal();
Dog d = (Dog) a; // ❌ Runtime error: ClassCastException

```

---

## ⚠️ OCA Pitfalls

| Trap                                          | Explanation                      |
| --------------------------------------------- | -------------------------------- |
| Forgetting to cast when narrowing             | `int x = 5.7;` → ❌              |
| Assuming casting prevents overflow            | `(byte) 130` → wraps to -126     |
| Not recognizing overflow in calculations      | `byte b = (byte)(127 + 1)` → -128 |
| Forgetting `char` is numeric                  | `'A' + 1 = 66`, not "B"          |
| Casting does**not round** floats              | `(int) 9.99` → 9 (not 10!)       |
| Loop counters with small data types          | `for(byte i=0; i<200; i++)` → infinite loop |
| Reference cast compiles but fails at run-time | `new Animal()` cast to `Dog`     |

---

## Conversion Summary Table

| From → To        | Widening | Narrowing | Cast Needed |
| ---------------- | -------- | --------- | ----------- |
| `int` → `long`   | ✔️        | ❌        | No          |
| `double` → `int` | ❌       | ✔️         | Yes         |
| `float` → `byte` | ❌       | ✔️         | Yes         |
| `char` → `int`   | ✔️        | ❌        | No          |
| `int` → `char`   | ❌       | ✔️         | Yes         |

---

## Quick Quiz

### Q: What is the output?

```java

double d = 9.99;
int i = (int) d;
System.out.println(i);

```

✅ **Answer:** `9`

---

### Q: Will this compile?

```java

byte b = 128;

```

❌ **No** — 128 is out of `byte` range (-128 to 127)

---

### Q: Will this compile?

```java

final int x = 100;
byte b = x;

```

✅ **Yes** — because `x` is a final constant and in `byte` range

---

### Q: What is the output?

```java

byte b = (byte) 130;
System.out.println(b);

```

✅ **Answer:** `-126` (130 overflows and wraps around)

---

### Q: What happens here?

```java

int max = Integer.MAX_VALUE;
int result = max + 1;
System.out.println(result);

```

✅ **Answer:** `-2147483648` (Integer.MIN_VALUE due to overflow)

---

## Final Rule of Thumb

> 🔁 Use **widening** when possible (safe, no cast)
> ⚠️ Use **narrowing** carefully (explicit cast, risk of data loss)
> 📦 Remember: **Object casts compile easily but fail at runtime if types are incompatible**

---

## why can i use a final int to assign to a byte?

---

### 🧠 Code:

```java
final int x = 100;
byte b = x;
System.out.println(b);
```

---

### 🔍 Why It *Should* Work:

* `x` is declared `final` (a **constant**), and it has a value of `100`.
* The value `100` **fits into a `byte`**, which has a range of **-128 to 127**.

---

### 🤔 BUT — Does it Compile?

#### ✅ Yes, it **does compile** and **prints:**

```
100
```

### ✅ Why?

Because:

* The compiler sees that `x` is a **`final int`** with a known constant value at **compile time**.
* Java allows **implicit narrowing** of constant integer expressions into smaller types **if the value is within range**.

This is a **special rule for final constants**.

---

### 🔥 So the output is:

```
100
```

Had `x` **not** been `final`, this would result in a **compilation error**:

```java
int x = 100;   // NOT final
byte b = x;    // ❌ Compilation Error: possible lossy conversion from int to byte
```
---
## 3. Overflow and Underflow

> ⚠️ **Overflow** occurs when a value exceeds the maximum limit of its data type
> ⚠️ **Underflow** occurs when a value goes below the minimum limit of its data type

### What Happens During Overflow?

Java **wraps around** the values rather than throwing an error:

```java
byte max = 127;           // maximum byte value
byte overflow = (byte)(max + 1);  // wraps to -128
System.out.println(overflow);     // -128

int maxInt = Integer.MAX_VALUE;   // 2,147,483,647
int overflowInt = maxInt + 1;     // wraps to -2,147,483,648
System.out.println(overflowInt);  // -2147483648
```

### Understanding the Wrap-Around

> Java uses **two's complement** representation for signed integers

| Data Type | Min Value | Max Value | Overflow Behavior |
|-----------|-----------|-----------|-------------------|
| `byte`    | -128      | 127       | 127 + 1 = -128   |
| `short`   | -32,768   | 32,767    | 32,767 + 1 = -32,768 |
| `int`     | -2³¹      | 2³¹-1     | MAX + 1 = MIN     |
| `long`    | -2⁶³      | 2⁶³-1     | MAX + 1 = MIN     |

### Overflow Examples

```java
// Byte overflow
byte b1 = 100;
byte b2 = 50;
byte sum = (byte)(b1 + b2);  // 150 wraps to -106
System.out.println(sum);     // -106

// Integer overflow in operations
int big = 2_000_000_000;
int bigger = big + big;      // overflow!
System.out.println(bigger);  // negative number

// Multiplication overflow
int x = 50_000;
int y = 50_000;
int result = x * y;          // 2,500,000,000 > Integer.MAX_VALUE
System.out.println(result);  // -1794967296 (wrapped)
```

### Detecting Overflow

Java provides methods to safely perform arithmetic:

```java
// Using Math methods (Java 8+)
try {
    int safe = Math.addExact(Integer.MAX_VALUE, 1);
} catch (ArithmeticException e) {
    System.out.println("Overflow detected!"); // This will print
}

// Using Math.multiplyExact()
try {
    int safe = Math.multiplyExact(50_000, 50_000);
} catch (ArithmeticException e) {
    System.out.println("Multiplication overflow!");
}
```

### Floating Point Overflow

Floating point numbers behave differently:

```java
float maxFloat = Float.MAX_VALUE;           // ~3.4 × 10³⁸
float overflow = maxFloat * 2;              // Infinity
System.out.println(overflow);               // Infinity

double tiny = Double.MIN_VALUE;             // smallest positive value
double underflow = tiny / 2;                // 0.0 (gradual underflow)
System.out.println(underflow);              // 0.0

// Special floating point values
System.out.println(1.0 / 0.0);            // Infinity
System.out.println(-1.0 / 0.0);           // -Infinity
System.out.println(0.0 / 0.0);            // NaN (Not a Number)
```

### ⚠️ Common Overflow Pitfalls in OCA

| Situation | Problem | Solution |
|-----------|---------|----------|
| `byte b = 130;` | Literal out of range | Use explicit cast: `(byte)130` |
| `int sum = big1 + big2;` | Runtime overflow | Check with `Math.addExact()` |
| Loop counters | Infinite loops from overflow | Use appropriate data types |
| Array indexing | Negative indices from overflow | Validate calculations |

### Real-World Example: Loop Counter Overflow

```java
// ❌ Dangerous - can cause infinite loop
for (byte i = 0; i < 200; i++) {
    // i wraps from 127 to -128, never reaches 200!
    System.out.println(i);
}

// ✅ Safe - use appropriate data type
for (int i = 0; i < 200; i++) {
    System.out.println(i);
}
```

### Overflow Prevention Best Practices

1. **Choose appropriate data types** for your value ranges
2. **Validate input** before arithmetic operations
3. **Use `Math.xxxExact()` methods** for critical calculations
4. **Be aware of implicit promotions** in expressions
5. **Test edge cases** with maximum and minimum values

---

## How **type casting** works with `byte` and integers.

---

### ✅ **Code**:

```java
int i = 258;
byte b = (byte) i;
System.out.println(b);
```

---

### 🧠 What’s happening here?

* `int i = 258;` → `i` holds the value `258`
* `byte b = (byte) i;` → you're **casting** `258` to a `byte`

---

### 💡 `byte` in Java:

* `byte` is an **8-bit signed integer**
* Its range is **−128 to 127**
* So if you cast an `int` (which is 32-bit) to a `byte`, only the **lowest 8 bits** are preserved, and the rest are discarded

---

### ⚙️ What are the lowest 8 bits of `258`?

Binary of `258` (in 32-bit int) is:

```
00000000 00000000 00000001 00000010
                           ↑↑↑↑↑↑↑↑
                       These 8 bits remain
```

That's `00000010` → which is **2** in decimal.

---

### ✅ Final Output:

```
2
```

---

### 🧪 Bonus Experiment:

Try changing `i` to other values, like `130`, `256`, `384`, etc., and observe how the byte value "wraps around" due to overflow.

