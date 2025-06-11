# String Class

---

## What is `String`?

- `String` is a **final**, **immutable** class in `java.lang`.
- Once a `String` is created, its value **cannot be changed**.
- `String` literals are stored in the **String Pool** (interned for memory efficiency).

```java
String s1 = "hello";           // in String pool
String s2 = new String("hi");  // in heap, NOT interned
```

---

## String Creation

### Literal

```java
String s = "Java"; // stored in String pool
```

### Constructor

```java
String s = new String("Java"); // stored in heap
```

⚠️ Not recommended unless you need a separate object

---

## Common String Methods (OCA Favorites)

| Method                    | Description                         | Example                                         |
| ------------------------- | ----------------------------------- | ----------------------------------------------- |
| `length()`              | Returns string length               | `"Java".length()` → `4`                    |
| `charAt(index)`         | Returns char at index               | `"Java".charAt(2)` → `'v'`                 |
| `indexOf(str)`          | Finds position of substring         | `"Java".indexOf("a")` → `1`                |
| `substring(start)`      | From index to end                   | `"Hello".substring(2)` → `"llo"`           |
| `substring(start, end)` | From start to end-1                 | `"Hello".substring(1, 4)` → `"ell"`        |
| `toUpperCase()`         | All uppercase                       | `"java".toUpperCase()` → `"JAVA"`          |
| `toLowerCase()`         | All lowercase                       | `"JAVA".toLowerCase()` → `"java"`          |
| `equals(str)`           | Checks content equality             | `"Java".equals("java")` → `false`          |
| `equalsIgnoreCase(str)` | Ignores case                        | `"Java".equalsIgnoreCase("java")` → `true` |
| `startsWith(prefix)`    | Checks prefix                       | `"Java".startsWith("J")` → `true`          |
| `endsWith(suffix)`      | Checks suffix                       | `"Java".endsWith("a")` → `true`            |
| `contains(seq)`         | Checks for substring                | `"Java".contains("av")` → `true`           |
| `replace(old, new)`     | Replaces characters or substrings   | `"java".replace("a", "o")` → `"jovo"`      |
| `trim()`                | Removes leading and trailing spaces | `" hello ".trim()` → `"hello"`             |

---

## String Comparison: `==` vs `.equals()`

```java
String a = "Hello";
String b = "Hello";
String c = new String("Hello");

System.out.println(a == b);       // true (same pool object)
System.out.println(a == c);       // false (different object)
System.out.println(a.equals(c));  // true (same content)
```

✔️ **Always use `.equals()`** to compare string **contents**.
❌ `==` compares object **references**.

---

## String Immutability

```java
String s = "Cat";
s.concat(" Dog");
System.out.println(s); // Cat (original string is unchanged!)
```

✔️ You must assign the result:

```java
s = s.concat(" Dog"); // Now s = "Cat Dog"
```

---

## String Pool & Interning

```java
String s1 = "Java";
String s2 = new String("Java");
String s3 = s2.intern(); // returns reference from pool

System.out.println(s1 == s2); // false
System.out.println(s1 == s3); // true
```

---

## StringBuilder vs String (Bonus Tip)

- `String` is immutable
- `StringBuilder` is mutable (preferred for many changes)

```java
StringBuilder sb = new StringBuilder("Java");
sb.append(" Rocks!");
System.out.println(sb); // Java Rocks!
```

---

## OCA Pitfalls

1. **String index is zero-based**

   ```java
   "java".charAt(4); // ❌ StringIndexOutOfBoundsException
   ```
2. **String is immutable**

   ```java
   "hello".replace("h", "j"); // doesn't change original string
   ```
3. **Don't compare using `==` unless checking reference**

---

## Summary Table

| Feature                 | String        | StringBuilder |
| ----------------------- | ------------- | ------------- |
| Immutable?              | ✔️          | ❌            |
| Thread-safe?            | ✔️ (String) | ❌            |
| Use for modification?   | ❌            | ✔️          |
| `.equals()` compares? | Content       | Content       |
| `==` compares?        | References    | References    |

---

## OCA Practice Quiz

### Q1:

What does this print?

```java
String s = "abc";
s.concat("def");
System.out.println(s);
```

**A:** `abc` – because strings are immutable!

---

### Q2:

Which of the following returns `true`?

```java
String a = "Hello";
String b = new String("Hello");
String c = a;

A. a == b     //❌
B. a.equals(b) //✔️
C. a == c     //✔️
```
