# Numeric Method

---

## Numeric Wrapper Classes

Java provides wrapper classes for primitive numeric types:

| Primitive  | Wrapper Class |
| ---------- | ------------- |
| `byte`   | `Byte`      |
| `short`  | `Short`     |
| `int`    | `Integer`   |
| `long`   | `Long`      |
| `float`  | `Float`     |
| `double` | `Double`    |

All these are subclasses of `Number` and provide **useful static and instance methods**.

---

## Common Numeric Methods

All numeric wrapper classes support these (with minor variations):

### Value Conversion Methods

| Method            | Description           | Example                                         |
| ----------------- | --------------------- | ----------------------------------------------- |
| `intValue()`    | Convert to `int`    | `Double.valueOf(3.5).intValue()` → `3`     |
| `doubleValue()` | Convert to `double` | `Integer.valueOf(5).doubleValue()` → `5.0` |
| `longValue()`   | Convert to `long`   |                                                 |
| `floatValue()`  | Convert to `float`  |                                                 |

All wrappers inherit these from `Number`

---

### Static Parsing Methods

| Method                  | Purpose                          | Example                        |
| ----------------------- | -------------------------------- | ------------------------------ |
| `parseInt(String)`    | Convert `String` → `int`    | `Integer.parseInt("123")`    |
| `parseDouble(String)` | Convert `String` → `double` | `Double.parseDouble("3.14")` |
| `parseLong(String)`   | Convert `String` → `long`   |                                |

⚠️ These throw `NumberFormatException` if the string is invalid.

---

### Value Creation

| Method              | Description                          | Example                   |
| ------------------- | ------------------------------------ | ------------------------- |
| `valueOf(String)` | Returns a wrapper object             | `Integer.valueOf("42")` |
| `valueOf(int)`    | Also returns wrapper (with caching!) | `Integer.valueOf(100)`  |

➡️ Prefer `valueOf()` over constructor (`new Integer(...)` is deprecated)

---

## Type Check & Constants

| Constant or Method | Purpose                  | Example                               |
| ------------------ | ------------------------ | ------------------------------------- |
| `MAX_VALUE`      | Largest possible value   | `Integer.MAX_VALUE`                 |
| `MIN_VALUE`      | Smallest possible value  | `Double.MIN_VALUE` (tiny positive)  |
| `isNaN()`        | Check for "Not a Number" | `Double.isNaN(0.0/0.0)` → `true` |
| `isInfinite()`   | Check for infinity       | `Double.isInfinite(1.0/0.0)`        |

---

## Autoboxing & Unboxing (OCA FAVORITE 💥)

### Autoboxing:

Java **automatically converts** primitives to wrapper objects:

```java
Integer num = 5; // int → Integer (autoboxing)
```

### Unboxing:

Java **automatically extracts** primitive from wrapper:

```java
int x = num; // Integer → int (unboxing)
```

⚠️ **NullPointerException risk!**

```java
Integer val = null;
int i = val; // ❌ NPE at runtime
```

---

## ⚠️ OCA Pitfalls

### 1️ Don't confuse `parseXxx()` with `valueOf()`

```java
int x = Integer.parseInt("5");       // returns int
Integer y = Integer.valueOf("5");    // returns Integer
```

### 2️ Don't use `==` to compare wrappers

```java
Integer a = 128;
Integer b = 128;
System.out.println(a == b); // false (different objects)

Integer x = 100;
Integer y = 100;
System.out.println(x == y); // true (cached range is from -128 to 127)
```

basically it saves the ints from -128 to 127 in cache memory when other variables use this number. something to do with efficiency so if you comparre any two Integer variable that are in that number range the `==` comparison operator will work. one number under or over it won't work. again this is only for objects `Integer` not primative types like `int` these contain the value directly and not memory reference.

✔️ Use `.equals()` to compare values. because this compares the value in the the variable and not the memory location and its not limited for certain numbers.

```java
Integer a = 128;
Integer b = 128;
System.out.println(a.equals(b)); // ✅ true (compares actual values)
```

## OCA Exam Tips

✅ **Memorize the cache range**: `-128 to 127`
✅ Use `.equals()` for comparing wrapper values
✅ Use `==` **only** if you're checking whether two references point to **exact same object**
❌ Don't assume that two boxed objects with same value are `==`

---

## Math Class Goodies (Static Methods)

| Method              | Example                    | Result  |
| ------------------- | -------------------------- | ------- |
| `Math.abs(-10)`   |                            | `10`  |
| `Math.max(5, 10)` |                            | `10`  |
| `Math.min(5, 10)` |                            | `5`   |
| `Math.round(4.6)` |                            | `5`   |
| `Math.ceil(2.3)`  |                            | `3.0` |
| `Math.floor(2.9)` |                            | `2.0` |
| `Math.pow(2, 3)`  |                            | `8.0` |
| `Math.sqrt(16)`   |                            | `4.0` |
| `Math.random()`   | Random double `0.0–1.0` | varies  |

### Math class examples

Its very important tool for any project, it has all the math tools you may need for whatever type of program so it extends beyond the simple math operators

there is no need to import anything because they are static methods, you just use them like so;

```java
Math.PI; // you get the pi constant 
Math.pow(2, 5); // you get the 2 to the power of 5
Math.abs(-5); // the absolute value of -5
Math.sqrt(9) // square root of 9
Math.round(50.6) // rounds the number to 51
Math.ceil(50.4) // rounds up so it will give me 51 
Math.floor(50.9) // it rounds down to 50
Math.max(150, 300) // looks for the maximun between two values in this case it will be 300
Math.min(150, 300) // the minimun between two values
```

---

## Summary Table

| Task                   | Use                                  |
| ---------------------- | ------------------------------------ |
| Convert string to int  | `Integer.parseInt("123")`          |
| Get max int            | `Integer.MAX_VALUE`                |
| Box int to object      | `Integer.valueOf(123)`             |
| Unbox Integer to int   | `Integer intValue()`               |
| Convert to double      | `intVar.doubleValue()`             |
| Math operations        | `Math.abs()`, `Math.pow()`, etc. |
| Random number (0–1)   | `Math.random()`                    |
| Compare wrapper values | `a.equals(b)`                      |

---

## 🎓 OCA Quick Quiz

### Q1:

What will this print?

```java
Integer x = 127;
Integer y = 127;
System.out.println(x == y);
```

✅ A: `true` — Cached range

### Q2:

What happens here?

```java
Integer a = null;
int b = a;
```

❌ Throws `NullPointerException` — Unboxing null!
