# 40. Virtual vs Non-Virtual Methods

**Related:** [39. Pass by Value vs Pass by Reference](39-pass-by-value-vs-reference.md) | [41. Abstract Classes](41-abstract-classes.md)

---

## ✅ 1. What is a *Virtual Method*?

> In Java, a **virtual method** is a method that can be **overridden** in a subclass and is resolved **at runtime**, not at compile time.

This allows **polymorphism** (the runtime behavior depends on the actual object type, not the reference type).

---

### 🔁 Virtual Method Example

```java
class Animal {
    void speak() {
        System.out.println("Animal speaks");
    }
}

class Dog extends Animal {
    void speak() {
        System.out.println("Dog barks");
    }
}

public class Test {
    public static void main(String[] args) {
        Animal a = new Dog(); // Upcasting
        a.speak();            // Output: Dog barks
    }
}
```

➡️ Although `a` is of type `Animal`, the **`Dog` version of `speak()`** is called.
This is **runtime polymorphism**, powered by **virtual method dispatch**.

---

## ✅ 2. What is a *Non-Virtual Method*?

> A **non-virtual method** is one that **cannot be overridden**, and is **resolved at compile time**.

In Java, these include:

- **`static` methods**
- **`final` methods**
- **`private` methods**
- **Constructors**

These do **not** participate in polymorphism.

---

### 🔐 Example: Non-Virtual Methods

#### 🔸 `static` method:

```java
class Parent {
    static void greet() {
        System.out.println("Hello from Parent");
    }
}

class Child extends Parent {
    static void greet() {
        System.out.println("Hello from Child");
    }
}

public class Test {
    public static void main(String[] args) {
        Parent p = new Child();
        p.greet(); // Output: Hello from Parent ❗ (no override)
    }
}
```

✔️ This is **method hiding**, not overriding.
`static` methods are **non-virtual** and resolved at **compile time**.

---

#### 🔸 `final` method:

```java
class Parent {
    final void run() {
        System.out.println("Running");
    }
}

class Child extends Parent {
    // void run() {} ❌ Compile error – cannot override final method
}
```

✔️ `final` prevents overriding, so it's **non-virtual**.

---

#### 🔸 `private` method:

```java
class A {
    private void show() {
        System.out.println("A's show()");
    }
}

class B extends A {
    private void show() {
        System.out.println("B's show()");
    }
}
```

✔️ Even though both classes have a `show()` method, they are **separate**, not overrides.
Java uses **compile-time resolution** — **non-virtual**.

---

## 📌 Summary Table: Virtual vs Non-Virtual Methods

| Feature                       | **Virtual Methods**              | **Non-Virtual Methods**      |
| ----------------------------- | -------------------------------------- | ---------------------------------- |
| Can be overridden             | ✔️ Yes                               | ❌ No                              |
| Resolved at                   | 🕐**Runtime (dynamic dispatch)** | ⚡**Compile time**           |
| Examples                      | Normal instance methods                | `static`, `final`, `private` |
| Participates in polymorphism  | ✔️ Yes                               | ❌ No                              |
| Behavior changes via subclass | ✔️ Yes                               | ❌ No                              |

---

## ✅ What Java Does by Default

In Java, **all non-`private` instance methods are virtual** by default.

This is different from C++, where you have to **mark** a method `virtual`.

---

## 💡 Real-World Analogy

| Situation          | Analogy                                                                          |
| ------------------ | -------------------------------------------------------------------------------- |
| Virtual Method     | Call to a manager who redirects based on department (object type)                |
| Non-Virtual Method | Call to a recorded line — always gives the same message (fixed at compile time) |

---

## ⚠️ OCA Pitfalls

### ❗ Static methods are **not overridden**

```java
class A { static void print() {} }
class B extends A { static void print() {} }

A a = new B();
a.print(); // calls A's method ❗
```

---

### ❗ Private methods look like overrides — but are **not**

```java
class A {
    private void test() {}
}

class B extends A {
    private void test() {} // this is a new method, not an override
}
```

---

### ❗ You **can't override `final` or `static` methods**

```java
final void run() {}      // ❌ can't override
static void greet() {}   // ❌ hiding, not overriding
```

---

### ❗ Constructors are **never virtual**

They are tied to class construction and resolved at compile time.

---

## 🧪 Quick Quiz

### Q: What will this print?

```java
class A {
    void speak() { System.out.println("A"); }
}

class B extends A {
    void speak() { System.out.println("B"); }
}

public class Test {
    public static void main(String[] args) {
        A obj = new B();
        obj.speak();
    }
}
```

**Answer:** `B` — because `speak()` is virtual and overridden.

---

## 🎯 Final Takeaway

- ✅ **Virtual methods** = polymorphic, dynamic, overrideable
- ❌ **Non-virtual methods** = static/final/private, resolved at compile-time
- ✅ In Java, **normal instance methods are virtual** by default

---

## 🎯 OCA Exam Tips

1. **Virtual Methods**: Non-private instance methods that can be overridden
2. **Non-Virtual Methods**: `static`, `final`, `private` methods and constructors
3. **Method Resolution**: Virtual = runtime, Non-virtual = compile time
4. **Static Methods**: Use "method hiding", not overriding
5. **Polymorphism**: Only works with virtual methods

---

## Related Topics

- [39. Pass by Value vs Pass by Reference](39-pass-by-value-vs-reference.md) - Parameter passing
- [41. Abstract Classes](41-abstract-classes.md) - Abstract class concepts
- [38. Method Overriding](38-method-overriding.md) - Virtual method overriding
- [37. Static vs Instance Methods](37-static-vs-instance-methods.md) - Method types
- [46. Polymorphism](46-polymorphism.md) - Runtime behavior
