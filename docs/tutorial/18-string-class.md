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

### What Does Immutable Mean?

When we say `String` is **immutable**, it means that once a `String` object is created, its internal character array **cannot be modified**. Any operation that appears to "change" a string actually creates a **new String object**.

```java
String s = "Cat";
s.concat(" Dog");
System.out.println(s); // Cat (original string is unchanged!)
```

✔️ You must assign the result:

```java
s = s.concat(" Dog"); // Now s = "Cat Dog"
```

### Why Are Strings Immutable?

Java designers made `String` immutable for several important reasons:

#### 1. **String Pool Optimization**
- String literals are stored in the **String Pool** (a special area in heap memory)
- Multiple variables can safely reference the same string object
- If strings were mutable, changing one reference would affect all others

```java
String s1 = "Hello";
String s2 = "Hello"; // Both point to same object in String Pool
String s3 = s1;      // s3 also points to same object

// If strings were mutable, this would be dangerous:
// s1.changeToUpperCase(); // Would affect s2 and s3 too!
```

#### 2. **Thread Safety**
- Immutable objects are **inherently thread-safe**
- Multiple threads can access the same string without synchronization
- No risk of one thread modifying a string while another thread reads it

```java
// Multiple threads can safely access the same string
String message = "Hello World";
// Thread 1 can read message
// Thread 2 can read message
// No synchronization needed!
```

#### 3. **HashCode Caching**
- String's `hashCode()` is calculated once and cached
- Since strings can't change, the hash code never becomes invalid
- Makes strings very efficient as HashMap keys

```java
String key = "username";
// Hash code calculated once and cached
// Perfect for use in HashMap, HashSet, etc.
Map<String, String> map = new HashMap<>();
map.put(key, "john_doe"); // Fast hash code lookup
```

#### 4. **Security**
- Strings are used for sensitive data (passwords, file paths, URLs)
- Immutability prevents accidental or malicious modification
- Once a secure string is created, it cannot be tampered with

```java
String fileName = "/secure/path/config.txt";
someMethod(fileName);
// fileName cannot be modified by someMethod()
// Security is maintained
```

#### 5. **Method Parameter Safety**
- When you pass a string to a method, you know it cannot be modified
- No defensive copying needed
- Eliminates side effects

```java
public void processUserName(String userName) {
    // userName cannot be modified
    // Calling code's string is safe
    System.out.println("Processing: " + userName);
}
```

### How Immutability Works Internally

The `String` class stores its characters in a **private final char array**:

```java
public final class String {
    private final char[] value; // Cannot be reassigned
    // No methods to modify the char array
    // All "modification" methods return new String objects
}
```

### Memory Impact of Immutability

```java
String s = "Hello";
s = s + " World";    // Creates new object, "Hello" may be garbage collected
s = s + "!";         // Creates another new object
s = s.toUpperCase(); // Creates yet another new object

// Result: Multiple String objects created in memory
// Old objects become eligible for garbage collection
```

### Proof of Immutability

```java
String original = "Java";
String modified = original.concat(" Programming");

System.out.println("Original: " + original);   // "Java" (unchanged)
System.out.println("Modified: " + modified);   // "Java Programming" (new object)
System.out.println(original == modified);      // false (different objects)

// Even methods that seem to modify actually return new objects:
String upper = original.toUpperCase();
System.out.println("Original: " + original);   // "Java" (still unchanged)
System.out.println("Upper: " + upper);         // "JAVA" (new object)
```

### Performance Implications

❌ **Inefficient** - Creates many objects:
```java
String result = "";
for (int i = 0; i < 1000; i++) {
    result += "a"; // Creates 1000 new String objects!
}
```

✔️ **Efficient** - Use StringBuilder for multiple modifications:
```java
StringBuilder sb = new StringBuilder();
for (int i = 0; i < 1000; i++) {
    sb.append("a"); // Modifies existing buffer
}
String result = sb.toString(); // One final String object
```

### Common Immutability Pitfalls

```java
// ❌ This doesn't work as expected
String text = "hello";
text.replace('h', 'H'); // Returns new string, but not assigned
System.out.println(text); // Still "hello"

// ✔️ Correct way
text = text.replace('h', 'H'); // Assign the returned new string
System.out.println(text); // Now "Hello"

// ❌ This creates unnecessary objects
String name = "John";
name = name.toUpperCase();
name = name.substring(0, 2);
name = name + "HN";

// ✔️ Better approach for multiple operations
StringBuilder sb = new StringBuilder("John");
String name = sb.toString().toUpperCase().substring(0, 2) + "HN";
// Or use StringBuilder for the whole operation
```

---

## String Pool & Interning

The `String.intern()` method in Java is used to **optimize memory usage and performance** when working with many **duplicate string values**.

### ✅ Purpose of `String.intern()`

When you call `.intern()` on a string, Java checks the **string pool** (a special memory region for storing unique string literals). If the pool already contains a string equal to the current string, it returns the **reference to the pooled string**. Otherwise, it adds the string to the pool and returns that reference.

### 💥 Why use it?

To ensure that all identical strings share the **same memory reference**, which helps:

1. **Reduce memory usage** (by avoiding duplicate strings).
2. **Enable faster equality checks** via `==` instead of `.equals()`.

### 🔧 Example

```java
public class InternExample {
    public static void main(String[] args) {
        String a = new String("hello");
        String b = "hello";

        System.out.println(a == b);              // false (different references)
        System.out.println(a.intern() == b);     // true (interned to pool, same reference)
    }
}
```

### ⚠️ When to Use It?

Use `.intern()`:

* When you deal with many string duplicates (e.g. large CSV parsing, XML keys, etc.).
* When you want to **save memory**.
* When you need **reference equality** (`==`) checks for strings.

**Avoid overusing it**, though, because:

* It can increase **GC pressure** on the string pool.
* Since JDK 7+, the pool is on the heap, not PermGen (in JDK 6 and earlier), but it's still a shared resource.

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

## StringBuilder

`StringBuilder` is a **mutable** alternative to `String` for when you need to perform many string modifications.

### Key Features:
- **Mutable**: Can be modified without creating new objects
- **Not thread-safe**: Faster performance in single-threaded environments
- **Efficient**: Better performance when concatenating many strings

### Common StringBuilder Methods:

| Method                      | Description                           | Example                                    |
| --------------------------- | ------------------------------------- | ------------------------------------------ |
| `append(str)`              | Adds string to the end               | `sb.append("Hello")` → adds "Hello"       |
| `insert(index, str)`       | Inserts string at specific position  | `sb.insert(0, "Hi ")` → adds at start     |
| `delete(start, end)`       | Deletes characters from start to end-1| `sb.delete(0, 2)` → removes first 2 chars |
| `deleteCharAt(index)`      | Deletes character at specific index  | `sb.deleteCharAt(0)` → removes first char |
| `replace(start, end, str)` | Replaces substring with new string   | `sb.replace(0, 2, "Hi")` → replaces chars |
| `reverse()`                | Reverses the string                   | `sb.reverse()` → reverses content         |
| `toString()`               | Converts to String                    | `sb.toString()` → returns String object   |
| `length()`                 | Returns current length                | `sb.length()` → returns size              |
| `capacity()`               | Returns current capacity              | `sb.capacity()` → returns buffer size     |

### StringBuilder Examples:

```java
// Creating StringBuilder
StringBuilder sb = new StringBuilder();          // empty, capacity 16
StringBuilder sb2 = new StringBuilder("Hello");  // with initial string
StringBuilder sb3 = new StringBuilder(50);       // with initial capacity

// Appending
sb.append("Java");
sb.append(" ").append("Programming"); // Method chaining
System.out.println(sb); // "Java Programming"

// Inserting
sb.insert(5, "OCA ");
System.out.println(sb); // "Java OCA Programming"

// Deleting
sb.delete(5, 9); // Removes "OCA "
System.out.println(sb); // "Java Programming"

// Replacing
sb.replace(0, 4, "Python");
System.out.println(sb); // "Python Programming"

// Reversing
sb.reverse();
System.out.println(sb); // "gnimmargorP nohtyP"
```

### Performance Comparison:

```java
// ❌ Inefficient with String (creates many objects)
String result = "";
for (int i = 0; i < 1000; i++) {
    result += "a"; // Creates new String object each time
}

// ✔️ Efficient with StringBuilder
StringBuilder sb = new StringBuilder();
for (int i = 0; i < 1000; i++) {
    sb.append("a"); // Modifies existing buffer
}
String result = sb.toString();
```

---

## StringBuffer

`StringBuffer` is similar to `StringBuilder` but is **thread-safe**.

### Key Features:
- **Mutable**: Can be modified without creating new objects
- **Thread-safe**: Synchronized methods for multi-threaded environments
- **Slower**: Performance overhead due to synchronization

### When to Use StringBuffer:
- When multiple threads need to modify the same string buffer
- In legacy code (StringBuffer existed before StringBuilder)
- When thread safety is required

### StringBuffer vs StringBuilder:

| Feature           | StringBuilder | StringBuffer |
| ----------------- | ------------- | ------------ |
| Thread-safe?      | ❌ No         | ✔️ Yes       |
| Performance       | Faster        | Slower       |
| Synchronization   | None          | Synchronized |
| Introduced        | Java 5        | Java 1.0     |

### StringBuffer Example:

```java
StringBuffer sb = new StringBuffer("Hello");
sb.append(" World");
sb.insert(5, " Java");
System.out.println(sb); // "Hello Java World"

// Thread-safe operations
// Multiple threads can safely access this StringBuffer
```

### Method Chaining:

Both `StringBuilder` and `StringBuffer` support method chaining:

```java
StringBuilder result = new StringBuilder()
    .append("Hello")
    .append(" ")
    .append("World")
    .insert(5, " Java")
    .reverse();
System.out.println(result); // "dlroW avaJ olleH"
```

### Capacity Management:

```java
StringBuilder sb = new StringBuilder(); // default capacity 16
System.out.println(sb.capacity()); // 16
System.out.println(sb.length());   // 0

sb.append("Hello World Programming");
System.out.println(sb.capacity()); // 34 (expanded automatically)
System.out.println(sb.length());   // 23

// Pre-allocate capacity for better performance
StringBuilder sb2 = new StringBuilder(100);
```
---
## Why Java has 3 String Handling classes: `String`, `StringBuffer`, and `StringBuilder`
---
Java provides **three** main classes to handle text—`String`, `StringBuffer`, and `StringBuilder`—because each serves **a different purpose** with distinct trade-offs for **immutability**, **thread safety**, and **performance**.

---

### 🔹 1. `String` — Immutable and Safe

* **Immutable**: Once created, the contents of a `String` cannot be changed.
* Every modification (e.g., concatenation) creates a **new object**.
* ✅ Ideal for constants, keys, method parameters, or when safety is more important than performance.

```java
String s = "Hello";
s = s + " World"; // Creates a new String object
```

---

### 🔹 2. `StringBuffer` — Mutable + Thread-Safe

* **Mutable**: Contents can be modified without creating new objects.
* **Thread-safe**: Methods are synchronized (safe in multithreaded code).
* ❗ Slower due to synchronization overhead.

```java
StringBuffer sb = new StringBuffer("Hello");
sb.append(" World"); // Efficient and safe in threads
```

---

### 🔹 3. `StringBuilder` — Mutable + Fast (Not Thread-Safe)

* **Mutable**, like `StringBuffer`.
* **Not thread-safe**, but **faster** in single-threaded environments (no locking).
* ✅ Best for most string manipulations in performance-critical code.

```java
StringBuilder sb = new StringBuilder("Hello");
sb.append(" World"); // Faster in single-threaded code
```

---

### 🧠 Why not just one?

Java separates these to give **developers control** over:

* **Safety vs performance**
* **Immutability vs mutability**
* **Single-threaded vs multi-threaded use**

A single class wouldn't cover all these needs efficiently without complexity or unnecessary overhead.

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

| Feature                 | String        | StringBuilder | StringBuffer |
| ----------------------- | ------------- | ------------- | ------------ |
| Immutable?              | ✔️ Yes        | ❌ No         | ❌ No        |
| Thread-safe?            | ✔️ Yes        | ❌ No         | ✔️ Yes       |
| Use for modification?   | ❌ No         | ✔️ Yes        | ✔️ Yes       |
| Performance             | Slow (many objects) | Fast    | Medium       |
| Memory efficient?       | ❌ No         | ✔️ Yes        | ✔️ Yes       |
| `.equals()` compares?   | Content       | Content       | Content      |
| `==` compares?          | References    | References    | References   |
| Best for?               | Immutable text | Single-thread | Multi-thread |

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

#### deep explanation:

String s is created:

```java
String s = "abc";
```
Now, s refers to the string "abc".

Concatenation:

```java
s.concat("def");
```
This creates a new string, "abcdef", but you did not assign it to any variable.
Since String is immutable, this method does not modify s—it just returns a new String.

Printing:

```java
System.out.println(s);
```
This prints the original s, which is still "abc".
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

---

### Q3:

What does this StringBuilder code print?

```java
StringBuilder sb = new StringBuilder("Java");
sb.append(" OCA").insert(4, " is").delete(0, 4);
System.out.println(sb);
```

**A:** ` is OCA` – First appends " OCA" → "Java OCA", then inserts " is" at index 4 → "Java is OCA", then deletes first 4 chars → " is OCA"

---

### Q4:

Which is most efficient for concatenating 1000 strings?

```java
A. String s = ""; for(...) s += "x";           // ❌ Creates many objects
B. StringBuilder sb = new StringBuilder();     // ✔️ Most efficient
   for(...) sb.append("x");
C. StringBuffer sb = new StringBuffer();       // ❌ Slower due to synchronization
   for(...) sb.append("x");
```

**Answer:** B - StringBuilder is most efficient for single-threaded string building.
## Video learn more

[Java Strings are Immutable - Here's What That Actually Means - Coding with John](https://www.youtube.com/watch?v=Bj9Mx_Lx3q4)

[Java String methods 💬 - Bro Code](https://www.youtube.com/watch?v=P9hEmbfdiuc)