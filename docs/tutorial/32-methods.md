# Methods

## 🧠 What is a Method?

A **method** is a reusable block of code that performs a specific task. It can take inputs (parameters), perform logic, and optionally return a value.

---

## ✅ Basic Method Syntax

```java
modifier returnType methodName(parameters) {
    // method body
}
```

### Example:

```java
public int add(int a, int b) {
    return a + b;
}
```

---

## 🧱 Method Components Explained

| Part               | Description                             | Example             |
| ------------------ | --------------------------------------- | ------------------- |
| `public`         | Access modifier                         | visible everywhere  |
| `int`            | Return type                             | returns an `int`  |
| `add`            | Method name                             | name of the method  |
| `(int a, int b)` | Parameters list (input)                 | two `int` inputs  |
| `return a + b;`  | Return statement (optional if `void`) | sends back a result |

---

## ✅ Calling a Method

```java
int result = add(2, 3); // result = 5
```

---

## ✅ Void Methods (no return)

```java
public void greet(String name) {
    System.out.println("Hello " + name);
}
```

> ⚠️ You can use the `return;` but instead of returning a value it just ends/exits the method

---

## ✅ Method Overloading

> Multiple methods with the **same name** but **different parameter lists**

```java
public int multiply(int a, int b) { return a * b; }
public double multiply(double a, double b) { return a * b; }
```

> ⚠️ Return type **alone is NOT enough** to overload

---

## ✅ Static vs Instance Methods

| Type     | Declaration        | Called using           |
| -------- | ------------------ | ---------------------- |
| Static   | `static` keyword | `ClassName.method()` |
| Instance | No `static`      | Requires object        |

```java
public static void greet() { }
public void sayHi() { }

Main.greet();          // ✅ static
new Main().sayHi();    // ✅ instance
```

---

## ✅ Parameters vs Arguments

- **Parameters** are declared in the method signature:

  ```java
  void greet(String name) // name is a parameter
  ```
- **Arguments** are passed when calling the method:

  ```java
  greet("Alice"); // "Alice" is the argument
  ```

---

## 🧠 OCA Method Pitfalls & Traps

### ❗ 1. Return type mismatch

```java
public int test() {
    return "hello"; // ❌ incompatible return type
}
```

---

### ❗ 2. Missing return statement

```java
public int getNum() {
    // ❌ missing return value
}
```

✅ Must return a value if the method is **not void**.

---

### ❗ 3. Overload confusion (signature matters!)

```java
void doSomething(int a) { }
int doSomething(int a) { return 1; } // ❌ Compile error: same signature!
```

> ✅ Method **signature = name + parameter types**

---

### ❗ 4. Can't overload by return type only

```java
void process() {}
int process() { return 1; } // ❌ not allowed
```

---

### ❗ 5. Can't call non-static method from static context

```java
public void sayHi() { }

public static void main(String[] args) {
    sayHi(); // ❌ Compile error
}
```

✅ You must create an instance first:

```java
new Main().sayHi(); // ✅
```

---

## 🧪 Common Java Access Modifiers for Methods

| Modifier      | Access Level                  |
| ------------- | ----------------------------- |
| `public`    | Accessible from everywhere    |
| `private`   | Only inside the same class    |
| `protected` | Same package or subclasses    |
| (default)     | Package-private (no modifier) |

---

---
## 📌 Summary Table

| Feature            | Example                          |
| ------------------ | -------------------------------- |
| Method Declaration | `public int sum(int a, int b)` |
| Void Return        | `public void print()`          |
| Static Method      | `public static void main()`    |
| Overloading        | Same name, different parameters  |
| Return statement   | Required for non-void methods    |
| Call method        | `object.method(args)`          |

---

## 🎓 OCA Quick Quiz

### Q1: Which one is valid?

```java
A. int compute() { return; }         // ❌ must return int
B. void compute() { return 1; }      // ❌ void can't return a value
C. int compute() { return 10; }      // ✅
```

✔️ **Answer:** C

---

### Q2: What's the output?

```java
class Test {
    static void print() {
        System.out.println("Hello");
    }

    public static void main(String[] args) {
        Test.print(); // ✅
    }
}
```

✔️ **Output:** `Hello`

---

## ✅ Method Hiding

> When a **static method** in a subclass has the **same signature** as a static method in the parent class

```java
class Parent {
    static void show() {
        System.out.println("Parent static method");
    }
}

class Child extends Parent {
    static void show() {  // This HIDES the parent method
        System.out.println("Child static method");
    }
}
```

### Key Points:
- **Method hiding** applies to **static methods only**
- The child class method **hides** (not overrides) the parent method
- Which method is called depends on the **reference type**, not object type

```java
Parent p = new Child();
p.show();        // Output: "Parent static method" (reference type is Parent)

Child c = new Child();
c.show();        // Output: "Child static method" (reference type is Child)
```

### ⚠️ Method Hiding vs Method Overriding

| Feature           | Method Hiding (static)      | Method Overriding (instance) |
| ----------------- | --------------------------- | ---------------------------- |
| Method type       | `static`                  | non-static (instance)        |
| Resolved at       | Compile time               | Runtime                      |
| Depends on        | Reference type             | Object type                  |
| Keyword           | No special keyword         | Can use `@Override`        |

---
