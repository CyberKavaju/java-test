# Method Overriding

## ✅ What Is Method Overriding?

**Overriding** means providing a **new implementation** of a **method inherited from a superclass** in a **subclass**.

> 🧠 It allows a subclass to **customize behavior** while still using the superclass structure.

---

## ✅ Basic Example

```java
class Animal {
    void sound() {
        System.out.println("Animal makes a sound");
    }
}

class Dog extends Animal {
    @Override
    void sound() {
        System.out.println("Dog barks");
    }
}
```

### Output:

```java
Animal animal = new Dog();
animal.sound(); // "Dog barks" ← runtime polymorphism!
```

---

## 🔧 Syntax Rules for Overriding

| Rule                                                      | Required?        |
| --------------------------------------------------------- | ---------------- |
| Method name must be the same                              | ✅               |
| Parameter list must be identical                          | ✅               |
| Return type must be the same or**covariant**        | ✅               |
| Access level must be same or**more visible**        | ✅               |
| Must not throw**new or broader checked exceptions** | ✅               |
| Must be**inherited** from superclass                | ✅               |
| Use `@Override` annotation (recommended)                | 🟢 Best practice |

---

## 📌 Access Modifier Rules

| Superclass Modifier   | Valid in Subclass?                                               |
| --------------------- | ---------------------------------------------------------------- |
| `public`            | `public` only                                                  |
| `protected`         | `protected` or `public`                                      |
| *default* (package) | *default*, `protected`, or `public` (in same package only) |
| `private`           | ❌ Can't override (not inherited)                                |

---

## 🔁 Covariant Return Types

In Java 5+, overridden methods can **return a subtype** of the original return type.

```java
class Animal {}
class Dog extends Animal {}

class Parent {
    Animal getPet() { return new Animal(); }
}

class Child extends Parent {
    @Override
    Dog getPet() { return new Dog(); } // ✅ Covariant return
}
```

---

## ❗ Exception Rules

- You can override a method and:

  - ✅ Throw **no exception**
  - ✅ Throw **fewer** or **narrower checked exceptions**
  - ❌ Cannot throw **new or broader checked exceptions**

```java
class Parent {
    void run() throws IOException {}
}

class Child extends Parent {
    @Override
    void run() throws FileNotFoundException {} // ✅ narrower
}
```

---

## ✅ @Override Annotation

Using the `@Override` annotation in Java is not mandatory when overriding a method. However, it is highly recommended as a best practice.

### Why Use `@Override`?

1. **Compile-Time Error Checking**: If you mistakenly do not match the method signature of the superclass (e.g., by misspelling the method name or using incorrect parameters), the compiler will generate an error. This helps catch errors early in the development process.
2. **Improved Code Readability**: The annotation clearly indicates that a method is intended to override a method in a superclass, making the code easier to understand and maintain.
3. **Protection Against Signature Changes**: If the method signature in the superclass changes, the compiler will alert you to update the overriding methods accordingly.

### Example

```java
class Animal {
    void makeSound() {
        System.out.println("Some generic animal sound");
    }
}

class Dog extends Animal {
    @Override
    void makeSound() {
        System.out.println("Bark");
    }
}
```

In this example, the `@Override` annotation ensures that `makeSound` in `Dog` correctly overrides the method in `Animal`. If there were a mismatch in the method signature, the compiler would produce an error.

### Special Considerations

- **Implementing Interface Methods**: Starting from Java 6, you can use `@Override` when implementing methods from an interface. This provides the same benefits of compile-time checking and clarity.
- **Optional but Recommended**: While not required, consistently using `@Override` can prevent subtle bugs and improve code quality.

In summary, although not mandatory, using the `@Override` annotation is a good practice that enhances code reliability and maintainability.

---

## ⚠️ OCA Pitfalls

### ❌ Overloading ≠ Overriding

```java
class A {
    void say() {}
}

class B extends A {
    void say(String msg) {} // ❌ This is OVERLOADING, not overriding
}
```

### ❌ private/static/final methods can't be overridden

```java
class A {
    private void foo() {}   // ❌ Not inherited
    static void bar() {}    // ❌ Hides, not overrides
    final void baz() {}     // ❌ Cannot be overridden
}
```

---

## 🧠 OCA Practice Quiz

### Q1: Which of the following is a valid override?

```java
class A {
    protected Number getValue() { return 42; }
}

class B extends A {
    public Integer getValue() { return 42; } // ✅ Covariant & more visible
}
```

---

### Q2: What's the output?

```java
class Animal {
    void speak() { System.out.println("Animal speaks"); }
}
class Cat extends Animal {
    void speak() { System.out.println("Meow"); }
}

Animal a = new Cat();
a.speak();
```

✔️ **Output:** `Meow` (overridden method runs at runtime)

---

## ✅ Summary Table

| Feature            | Overriding                |
| ------------------ | ------------------------- |
| Same method name   | ✔️                      |
| Same parameters    | ✔️                      |
| Return type        | ✔️ or covariant         |
| Access modifier    | Same or more visible      |
| Checked exceptions | Same, fewer, or none      |
| Happens at         | Runtime                   |
| Annotation         | `@Override` recommended |

---

## Why Use Method Overriding in Java?

### ✅ **Purpose**:

To allow a **subclass** to provide a **specific implementation** of a method that is already defined in its **superclass**.

---

## When Should You Override a Method?

### 1️⃣ **To Customize Behavior of a Parent Method**

You override when the **default behavior** of a superclass method doesn't suit your subclass.

```java
class Animal {
    void speak() {
        System.out.println("Animal speaks");
    }
}

class Dog extends Animal {
    @Override
    void speak() {
        System.out.println("Dog barks");
    }
}
```

➡️ Now calling `speak()` on a `Dog` object gives a different result than calling it on an `Animal`.

---

### 2️⃣ **To Implement Polymorphism**

**Polymorphism** = one interface, many implementations

```java
Animal a = new Dog();
a.speak(); // prints "Dog barks"
```

- The method that runs is **determined at runtime**, not compile time.
- This allows flexible, extensible code where base-class references can point to subclass objects.

---

### 3️⃣ **To Follow a Contract (e.g. Abstract Method or Interface)**

When a class **extends an abstract class** or **implements an interface**, it **must override** the abstract methods.

```java
abstract class Shape {
    abstract double area();
}

class Circle extends Shape {
    @Override
    double area() {
        return Math.PI * radius * radius;
    }
}
```

---

### 4️⃣ **To Support Frameworks and APIs (Real-World Usage)**

Frameworks like Spring, Hibernate, or Java EE rely on method overriding to **inject custom logic**.

Example: overriding `toString()`, `equals()`, or `hashCode()` in custom classes.

```java
@Override
public String toString() {
    return name + " (" + id + ")";
}
```

---

## ✅ Summary: When to Override a Method

| Situation                          | Should You Override? | Why?                  |
| ---------------------------------- | -------------------- | --------------------- |
| Subclass needs different behavior  | ✅ Yes               | To customize logic    |
| Implementing an abstract/interface | ✅ Yes               | Required to compile   |
| Extend a reusable base class       | ✅ Often             | Add or modify logic   |
| Using polymorphism (OOP design)    | ✅ Yes               | Runtime flexibility   |
| Just using a method as-is          | ❌ No                | Use inherited version |

---

## 🔥 Real-World Examples

✅ Override `toString()` → For better logging
✅ Override `equals()` → For comparing object contents
✅ Override `compareTo()` → For sorting
✅ Override `onClick()` → In GUI programming
✅ Override `run()` → In multithreading

---

## 🧠 Final Thoughts

> **You override a method when the child class needs to change or define specific behavior that already exists in the parent class.**

It's a core tool for **flexible**, **extensible**, and **modular** design in OOP.
