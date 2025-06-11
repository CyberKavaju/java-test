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
| Forgetting `char` is numeric                  | `'A' + 1 = 66`, not "B"          |
| Casting does**not round** floats              | `(int) 9.99` → 9 (not 10!)       |
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

## Final Rule of Thumb

> 🔁 Use **widening** when possible (safe, no cast)
> ⚠️ Use **narrowing** carefully (explicit cast, risk of data loss)
> 📦 Remember: **Object casts compile easily but fail at runtime if types are incompatible**
