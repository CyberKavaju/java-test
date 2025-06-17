# 58. Working With Java Data Types

---

## 🧠 What are Data Types?

Data types define what kind of data a variable can hold and what operations can be performed on that data. Java has two main categories of data types:

1. **Primitive Types** - Store actual values directly in memory
2. **Reference Types** - Store references (addresses) to objects in memory

Understanding the difference between these is crucial for the OCA exam!

---

## 📊 Primitive Data Types

Java has **8 primitive data types** that store simple values directly in memory:

### Numeric Types

| Type | Size | Range | Default | Example |
|------|------|-------|---------|---------|
| `byte` | 8 bits | -128 to 127 | 0 | `byte b = 100;` |
| `short` | 16 bits | -32,768 to 32,767 | 0 | `short s = 1000;` |
| `int` | 32 bits | -2³¹ to 2³¹-1 | 0 | `int i = 42;` |
| `long` | 64 bits | -2⁶³ to 2⁶³-1 | 0L | `long l = 123L;` |
| `float` | 32 bits | ~7 decimal digits | 0.0f | `float f = 3.14f;` |
| `double` | 64 bits | ~15 decimal digits | 0.0d | `double d = 3.14159;` |

### Non-Numeric Types

| Type | Size | Range | Default | Example |
|------|------|-------|---------|---------|
| `char` | 16 bits | 0 to 65,535 (Unicode) | '\u0000' | `char c = 'A';` |
| `boolean` | 1 bit | true/false | false | `boolean flag = true;` |

### 🎯 OCA Exam Tips for Primitives

1. **Literals must match the type:**
   ```java
   long big = 10000000000L;  // ✅ L suffix required
   float pi = 3.14f;         // ✅ f suffix required
   double d = 3.14;          // ✅ default is double
   ```

2. **Underscores in numeric literals (Java 7+):**
   ```java
   int million = 1_000_000;  // ✅ Valid
   long big = 123_456_789L;  // ✅ Valid
   double pi = 3.14_159;     // ✅ Valid
   ```

3. **char is unsigned 16-bit:**
   ```java
   char c1 = 'A';       // ✅ Character literal
   char c2 = 65;        // ✅ ASCII value
   char c3 = '\u0041';  // ✅ Unicode escape
   ```

---

## 🔗 Object Reference Variables

Reference variables don't store the actual object - they store a **reference** (memory address) to where the object is located in heap memory.

```java
String name = "Java";  // name holds reference to String object
String copy = name;    // copy holds same reference
name = "Python";       // name now references different object
System.out.println(copy); // Still prints "Java"
```

### Key Concepts:

1. **Multiple references can point to same object**
2. **Reassigning a reference doesn't affect the object**
3. **Objects are created in heap memory**
4. **References are stored in stack memory**

---

## 📦 Wrapper Classes

Every primitive type has a corresponding **wrapper class** that provides object-oriented capabilities:

| Primitive | Wrapper Class |
|-----------|---------------|
| `byte` | `Byte` |
| `short` | `Short` |
| `int` | `Integer` |
| `long` | `Long` |
| `float` | `Float` |
| `double` | `Double` |
| `char` | `Character` |
| `boolean` | `Boolean` |

### Creating Wrapper Objects

```java
// Multiple ways to create wrapper objects
Integer num1 = new Integer(42);      // Deprecated in Java 9+
Integer num2 = Integer.valueOf(42);  // ✅ Preferred
Integer num3 = 42;                   // ✅ Autoboxing
```

### Common Wrapper Methods

```java
Integer num = 42;

// Converting to other types
int primitive = num.intValue();
String text = num.toString();
double d = num.doubleValue();

// Static utility methods
Integer parsed = Integer.valueOf("123");
int max = Integer.max(10, 20);
String binary = Integer.toBinaryString(42);
```

---

## 🔄 Autoboxing and Unboxing

**Autoboxing** = automatic conversion from primitive to wrapper
**Unboxing** = automatic conversion from wrapper to primitive

```java
// Autoboxing examples
Integer num = 42;           // int → Integer
List<Integer> list = new ArrayList<>();
list.add(10);              // int → Integer

// Unboxing examples  
Integer wrapper = 100;
int primitive = wrapper;    // Integer → int
int sum = wrapper + 5;      // Integer → int for arithmetic
```

### ⚠️ Null Pointer Exception Risk

```java
Integer nullInt = null;
int value = nullInt;  // ❌ NullPointerException at runtime!
```

### 🎯 Integer Caching (OCA Favorite!)

Java caches `Integer` objects for values from **-128 to 127**:

```java
Integer a = 100;
Integer b = 100;
System.out.println(a == b);  // ✅ true (same cached object)

Integer c = 200;  
Integer d = 200;
System.out.println(c == d);  // ❌ false (different objects)

// Always use .equals() for wrapper comparison!
System.out.println(c.equals(d)); // ✅ true
```

---

## 📋 Variable Declaration and Initialization

### Declaration Syntax

```java
// Basic declaration
int age;
String name;

// Multiple variables of same type
int x, y, z;
String first, last;

// Declaration with initialization
int count = 0;
String greeting = "Hello";
```

### 🎯 Initialization Rules (OCA Critical!)

1. **Local variables MUST be initialized before use:**
   ```java
   public void method() {
       int x;
       System.out.println(x); // ❌ Compile error!
   }
   ```

2. **Instance variables get default values:**
   ```java
   public class Example {
       int number;        // Defaults to 0
       String text;       // Defaults to null
       boolean flag;      // Defaults to false
   }
   ```

3. **Final variables must be initialized:**
   ```java
   final int CONSTANT = 42;  // ✅ Must initialize
   final String NAME;        // ❌ Compile error if not initialized
   ```

---

## 🔄 Type Casting and Conversions

### Widening (Implicit) Conversion
**Safe** - smaller type to larger type, happens automatically:

```java
int i = 100;
long l = i;      // ✅ int → long (implicit)
float f = l;     // ✅ long → float (implicit)
double d = f;    // ✅ float → double (implicit)
```

### Narrowing (Explicit) Conversion
**Potentially unsafe** - larger type to smaller type, requires casting:

```java
double d = 10.5;
int i = (int) d;        // ✅ Explicit cast required, i = 10
byte b = (byte) 200;    // ✅ Legal but causes overflow: b = -56
```

### 🎯 Literal Assignment Rules

Java allows assigning **compile-time constants** to smaller types if they fit:

```java
byte b = 100;        // ✅ OK (100 fits in byte range)
byte b2 = 200;       // ❌ Compile error (200 > 127)

final int x = 10;
byte b3 = x;         // ✅ OK (x is final constant in range)

int y = 10;
byte b4 = y;         // ❌ Compile error (y is not final)
```

---

## 🔄 Object Lifecycle

Understanding object lifecycle is crucial for OCA exam:

### Object Creation
```java
String str = new String("Hello");  // Creates new object
String str2 = "Hello";             // May reuse from string pool
```

### Dereference by Reassignment
```java
String original = "Java";
String copy = original;    // Both reference same object
original = "Python";       // original now references different object
// The "Java" object still exists (referenced by copy)
```

### Garbage Collection Eligibility
Objects become eligible for garbage collection when:
1. No references point to them
2. All references go out of scope
3. References are explicitly set to null

```java
String str = new String("Hello");
str = null;  // Object becomes eligible for GC
```

---

## 📊 Default Values

### Instance Variables (Fields)
| Type | Default Value |
|------|---------------|
| `byte`, `short`, `int`, `long` | 0 |
| `float`, `double` | 0.0 |
| `char` | '\u0000' |
| `boolean` | false |
| Object references | null |

### Local Variables
**No default values** - must be explicitly initialized before use!

### Array Elements
Arrays automatically initialize elements to default values:
```java
int[] numbers = new int[5];     // All elements are 0
String[] names = new String[3]; // All elements are null
boolean[] flags = new boolean[2]; // All elements are false
```

---

## 🏷️ Identifiers and Naming Rules

### Valid Identifier Rules
1. Can contain letters, digits, underscore (_), and dollar sign ($)
2. Cannot start with a digit
3. Cannot be a Java keyword
4. Case-sensitive

```java
// ✅ Valid identifiers
int age;
String firstName;
double $price;
boolean _isActive;
int var123;

// ❌ Invalid identifiers
int 2point;      // Starts with digit
String class;    // Java keyword
double my-var;   // Contains hyphen
boolean @flag;   // Contains @
```

### 🎯 OCA Exam Tricks
```java
// These are all VALID but confusing:
int $;           // ✅ Valid
String _;        // ✅ Valid  
boolean $1_2$;   // ✅ Valid
char _$_$;       // ✅ Valid
```

---

## 🎯 OCA Exam Tips

### Critical Points to Remember:

1. **Primitive vs Reference:**
   - Primitives store values directly
   - References store memory addresses

2. **Wrapper Caching:**
   - Integer cache: -128 to 127
   - Use `.equals()` not `==` for comparison

3. **Initialization:**
   - Local variables: Must initialize before use
   - Instance variables: Get default values
   - Array elements: Get default values

4. **Casting:**
   - Widening: Automatic (safe)
   - Narrowing: Explicit cast required (data loss possible)

5. **Autoboxing/Unboxing:**
   - Automatic conversion between primitive and wrapper
   - Watch out for NullPointerException

6. **Object Lifecycle:**
   - Creation → Use → Dereference → Garbage Collection
   - Objects become eligible for GC when no references exist

---

## 💡 Common Exam Scenarios

### Scenario 1: Local Variable Initialization
```java
public static void calc(double value) {
    int coupon, offset, base;  // Declared but not initialized
    if (value < 10) {
        coupon = 15;
        offset = 20; 
        base = 10;
    }
    return coupon * offset * base;  // ❌ Compile error!
}
```
**Why it fails:** Compiler can't guarantee initialization in all code paths.

### Scenario 2: Wrapper Comparison
```java
Integer a = 100;
Integer b = 100;
Integer c = 200;
Integer d = 200;
System.out.println(a == b);        // true (cached)
System.out.println(c == d);        // false (not cached)
System.out.println(c.equals(d));   // true (value comparison)
```

### Scenario 3: Autoboxing with Null
```java
Integer value = null;
int result = value + 10;  // ❌ NullPointerException
```

---

## 📚 Practice Questions

### Question 1
What is the output of this code?
```java
int x = 5;
Integer y = x;  // autoboxing
x = 10;
System.out.println(y);
```
**Answer:** 5 (y holds reference to Integer object with value 5)

### Question 2  
Which lines will compile?
```java
byte b = 127;     // Line 1
byte b2 = 128;    // Line 2  
final int x = 50;
byte b3 = x;      // Line 3
int y = 50;
byte b4 = y;      // Line 4
```
**Answer:** Lines 1 and 3 compile. Line 2 fails (128 > 127), Line 4 fails (y is not final).

### Question 3
What happens when this code runs?
```java
Integer i = null;
int j = i;
```
**Answer:** NullPointerException at runtime during unboxing.

---

## 🔗 Related Topics

- [04. Variable](04-variable.md) - Basic variable concepts
- [05. Variable Casting and Conversions](05-variable-casting-and-conversions.md) - Detailed casting rules
- [17. Numeric Method](17-numeric-method.md) - Wrapper class methods
- [57. Autoboxing and Unboxing](57-autoboxing-unboxing.md) - Detailed autoboxing concepts

---

*This tutorial covers the "Working With Java Data Types" topic comprehensively for OCA Java SE 8 certification preparation.*

## 📹 Video Resources

**Recommended YouTube Videos:**
- [Introduction to Data Types in Java - Neso Academy](https://www.youtube.com/watch?v=UwpXXiGdlOE)
- [Primitives Data Types In Java - All the Primitives And What They Do - Coding with John](https://www.youtube.com/watch?v=WQ7mvQFSmYc)
- [Primitive Types and Reference Types in Java - Neso Academy](https://www.youtube.com/watch?v=OmcFVHpb0v0)
