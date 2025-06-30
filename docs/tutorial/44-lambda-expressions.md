# 44. Lambda Expressions

**Related:** [43. Interfaces](43-interfaces.md) | [45. Inheritance](45-inheritance.md)

---

## ✅ What is a Lambda?

> A **lambda expression** is a **concise way** to represent an **anonymous method** (a function without a name).
> A **lambda expression** is a **short block of code** that can be passed as an argument to a method.

It lets you **pass behavior as a value**.
It's like a **function without a name**.

---

### 🔠 Basic Syntax:

```java
(parameters) -> expression
```

Or with a block:

```java
(parameters) -> {
    // multiple statements
}
```

---

## Why Do We Need Lambdas?

Before Java 8, to pass behavior, you had to:

```java
Runnable r = new Runnable() {
    public void run() {
        System.out.println("Running...");
    }
};
```

With lambdas:

```java
Runnable r = () -> System.out.println("Running...");
```

### ✔️ Lambdas reduce:

* **Boilerplate code**
* **Anonymous class bloat**
* **Verbosity**

---

## 🔗 Where Can We Use Lambdas?

> Only in contexts where a **functional interface** is expected.

---

### 💡 What's a Functional Interface?

> An interface with **exactly one abstract method**

Examples:

* `Runnable` → `void run()`
* `Comparator<T>` → `int compare(T a, T b)`
* `Predicate<T>` → `boolean test(T t)`
* `Consumer<T>` → `void accept(T t)`
* `Function<T, R>` → `R apply(T t)`
* `Supplier<T>` → `T get()`

---

### 1. **Runnable → `void run()`**

🧠 **Concept**: `Runnable` is the oldest one here, introduced in Java 1.0. It represents a **task** that can be executed **without returning any result**.

```java
Runnable task = () -> System.out.println("Task is running...");
new Thread(task).start();
```

📌 **Use Case**:

* You want to **run code concurrently** (e.g., using `Thread`)
* No input, no return — just run something.

🛠️ Think of it like: *"Hey Java, just run this code, I don’t need anything back."*

---

### 2. **Comparator<T> → `int compare(T a, T b)`**

🧠 **Concept**: Compares two objects of type `T`. Returns:

* Negative number if `a < b`
* Zero if `a == b`
* Positive number if `a > b`

```java
Comparator<String> compareByLength = (a, b) -> Integer.compare(a.length(), b.length());
```

📌 **Use Case**:

* Sorting collections: `Collections.sort(list, comparator);`
* Custom order logic

🔁 **Why use it**? You define **how to order elements** — alphabetically, by size, by weight, etc.

---

### 3. **Predicate<T> → `boolean test(T t)`**

🧠 **Concept**: A **boolean-valued function**. Think of this like a **filter** or **condition checker**.

```java
Predicate<String> isLongWord = s -> s.length() > 10;
```

📌 **Use Case**:

* `Stream.filter()`
* Condition logic like validation

💡 Think of it like a **yes/no question** about an object.

---

### 4. **Consumer<T> → `void accept(T t)`**

🧠 **Concept**: Consumes a value and performs some **action**, but doesn’t return anything.

```java
Consumer<String> printer = s -> System.out.println("Printing: " + s);
```

📌 **Use Case**:

* Processing elements in a stream: `.forEach(consumer)`
* Logging, modifying, saving, etc.

🔨 **Consumer eats the data** and does something with it.

---

### 5. **Function\<T, R> → `R apply(T t)`**

🧠 **Concept**: Takes a value of type `T`, returns a value of type `R`. It **transforms input** into output.

```java
Function<String, Integer> lengthFinder = s -> s.length();
```

📌 **Use Case**:

* Mapping objects: `.map(function)`
* Conversions, transformations, lookups

💡 Think of it as: *Input → Processing → Output*
---

### 6. **Supplier<T> → `T get()`**
🧠 **Concept**: Provides a value of type `T` without taking any input. It’s like a **factory** for objects.

```java
Supplier<String> stringSupplier = () -> "Hello, Supplier!";
```
📌 **Use Case**
* Lazy initialization
* Generating values on demand
💡 Think of it as a **value provider** that gives you something when you ask for it.

---

### Visual Summary

| Interface       | Input | Output  | Purpose                     |
| --------------- | ----- | ------- | --------------------------- |
| `Runnable`      | none  | void    | Execute code (e.g., thread) |
| `Comparator<T>` | T, T  | int     | Compare two objects         |
| `Predicate<T>`  | T     | boolean | Test a condition            |
| `Consumer<T>`   | T     | void    | Use the value               |
| `Function<T,R>` | T     | R       | Transform value             |

---
## 🧪 Lambda Examples

### 🔹 No Parameters

```java
Runnable r = () -> System.out.println("Hi!");
```

---

### 🔹 One Parameter

```java
Consumer<String> print = s -> System.out.println(s);
print.accept("Hello Lambda");
```

---

### 🔹 Two Parameters

```java
Comparator<Integer> comp = (a, b) -> a - b;
System.out.println(comp.compare(5, 3)); // Output: 2
```

---

### 🔹 Block Body

```java
Predicate<String> isShort = s -> {
    return s.length() < 5;
};
```

---

## ✅ Lambda Syntax Rules (OCA-Testable)

| Feature              | Rule                                   |
| -------------------- | -------------------------------------- |
| 1 parameter, no type | `(x) -> x + 1` or `x -> x + 1`     |
| 2+ parameters        | Must use `()` — `(a, b) -> a + b` |
| No parameters        | Use `()` — `() -> doSomething()`  |
| 1 statement          | No `{}` or `return` needed         |
| Multiple statements  | Use `{}` and `return` if needed    |

---

## ❗ OCA Pitfalls

### ❌ Not using parentheses for 2+ parameters

```java
(a, b) -> a + b;     // ✅
a, b -> a + b;       // ❌ compile error
```

---

### ❌ Missing return with `{}` block

```java
(x, y) -> {
    x + y;           // ❌ must use return
}
```

✅ Fix:

```java
(x, y) -> {
    return x + y;
}
```

---

### ❌ Using lambdas with non-functional interfaces

```java
interface MyInterface {
    void method1();
    void method2(); // ❌ not a functional interface
}
```

Lambdas only work with interfaces that have **one abstract method**.

---

## 📦 Real-World Use Case: Sorting with Lambdas

```java
List<String> names = Arrays.asList("Bob", "Anna", "Joe");
names.sort((a, b) -> a.compareTo(b));
```

Before lambdas, you'd need an anonymous class. Now, it's a one-liner!

---

## Summary Table

| Syntax                         | Description                  |
| ------------------------------ | ---------------------------- |
| `() -> action`               | No parameters                |
| `x -> x + 1`                 | One parameter                |
| `(a, b) -> a - b`            | Two parameters               |
| `(x) -> { return x * x; }`   | Block body with return       |
| Only for functional interfaces | One abstract method required |

---

## 🔥 Bonus: Functional Interface Shortcut

Use `@FunctionalInterface` to ensure your interface has **exactly one abstract method**:

```java
@FunctionalInterface
interface MyAction {
    void run();
}
```

---

## 🧪 Quick Quiz

### Q: What does this output?

```java
Consumer<String> c = x -> System.out.println(x.toUpperCase());
c.accept("java");
```

**Answer:** `JAVA`

---

## Final Rule of Thumb

> Lambdas = **lightweight anonymous methods** used to pass behavior
> Only legal with **functional interfaces**
> Best for **clean, readable**, and **expressive code**

---

## 🎯 OCA Exam Tips

1. **Functional interfaces have exactly one abstract method**
2. **Parentheses are required for 0 or 2+ parameters**
3. **Curly braces require explicit return statement**
4. **Lambdas can access effectively final variables**
5. **Common functional interfaces**: `Predicate`, `Consumer`, `Function`, `Supplier`

---

## Advanced Examples

### Predicate (Testing)
```java
Predicate<String> isEmpty = s -> s.isEmpty();
Predicate<Integer> isEven = n -> n % 2 == 0;

System.out.println(isEmpty.test(""));     // true
System.out.println(isEven.test(4));       // true
```

### Consumer (Consuming)
```java
Consumer<String> printer = s -> System.out.println("Value: " + s);
List<String> list = Arrays.asList("a", "b", "c");
list.forEach(printer);
```

### Function (Transforming)
```java
Function<String, Integer> length = s -> s.length();
Function<Integer, Integer> square = x -> x * x;

System.out.println(length.apply("hello"));  // 5
System.out.println(square.apply(4));        // 16
```

### Supplier (Supplying)
```java
Supplier<String> greeting = () -> "Hello World!";
System.out.println(greeting.get());  // Hello World!
```

---

## Related Topics

- [43. Interfaces](43-interfaces.md) - Functional interfaces
- [45. Inheritance](45-inheritance.md) - Object relationships
- [22. List Object](22-list-object.md) - Collection operations
- [26. Exception Handling](26-exception-handling.md) - Lambda exception handling

## Video Tutorials

- [Lambda Expressions in Java - Full Simple Tutorial - Coding with John](https://www.youtube.com/watch?v=tj5sLSFjVj4)
- [Java lambda λ - Bro Code](https://www.youtube.com/watch?v=LEJ1kGHSXdA)
- [Java's Lambda Expressions Explained - Java Programming - Will Tollefson](https://www.youtube.com/watch?v=qsWpxQoM9vA)
- [Java Lambda Expressions Tutorial - Java Code Geeks](https://www.youtube.com/watch?v=5FkmiqGlcYY)