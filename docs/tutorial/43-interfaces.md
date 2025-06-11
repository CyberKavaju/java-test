# 43. Interfaces

**Related:** [42. Abstract Methods](42-abstract-methods.md) | [44. Lambda Expressions](44-lambda-expressions.md)

---

## 🧠 What is an Interface?

> An **interface** is a **contract** that defines a set of **methods** that a class **must implement**.

It defines **what** a class must do — not **how** it does it.

---

### 💡 Think of it as:

> A **remote control** with buttons but **no wiring inside**.
> The class that implements the interface provides the **actual logic** (the wiring).

---

## 🔧 Interface Syntax (Java 8+)

```java
public interface Flyable {
    void fly(); // implicitly public and abstract
}
```

A class implements it like this:

```java
public class Bird implements Flyable {
    public void fly() {
        System.out.println("Flapping wings...");
    }
}
```

---

## 📌 Key Interface Rules (Java 8)

| Feature                             | Allowed?       | Notes                                         |
| ----------------------------------- | -------------- | --------------------------------------------- |
| Abstract methods (no body)          | ✔️           | Must be implemented by the class              |
| `default` methods (with body)     | ✔️           | Can provide a default implementation          |
| `static` methods (with body)      | ✔️           | Called on the interface, not the object       |
| `private` methods                 | ✔️ (Java 9+) | Used only inside the interface                |
| Instance fields                     | ❌             | Not allowed                                   |
| Constants (`public static final`) | ✔️           | All fields are implicitly public static final |

---

## 🛠️ Interface Members Are Implicitly:

- `public static final` for variables
- `public abstract` for methods (unless `default`, `static`, or `private`)

```java
interface MyInterface {
    int COUNT = 5;               // public static final
    void show();                 // public abstract
    default void print() { }     // default method
}
```

---

## 🔗 Interface vs Abstract Class

| Feature                      | **Interface**             | **Abstract Class** |
| ---------------------------- | ------------------------------- | ------------------------ |
| Can have abstract methods?   | ✔️                            | ✔️                     |
| Can have concrete methods?   | ✔️ (`default` / `static`) | ✔️                     |
| Can have constructors?       | ❌                              | ✔️                     |
| Can have instance variables? | ❌                              | ✔️                     |
| Can extend multiple?         | ✔️ (multiple interfaces)      | ❌ (only one class)      |
| Inheritance keyword          | `implements`                  | `extends`              |

---

## 🔁 Multiple Inheritance with Interfaces

Java does **not** support multiple class inheritance, but **does** allow a class to implement **multiple interfaces**:

```java
interface A { void a(); }
interface B { void b(); }

class C implements A, B {
    public void a() { System.out.println("A"); }
    public void b() { System.out.println("B"); }
}
```

✅ This is **legal and common** in Java.

---

## ✅ Interface Inheritance

Interfaces can extend other interfaces (unlike classes, which can only extend one class):

```java
interface Animal {
    void eat();
}

interface Flyable extends Animal {
    void fly();
}
```

---

## 🧠 Real-World Analogy

| Real World     | Interface Role              |
| -------------- | --------------------------- |
| `Driveable`  | A "contract" to `drive()` |
| `Flyable`    | Guarantees `fly()` method |
| `Comparable` | Guarantees `compareTo()`  |

---

## ⚠️ OCA Pitfalls

### ❗ Fields in interfaces are `public static final` — they are **constants**

```java
interface Test {
    int x = 10;
}
Test.x = 20; // ❌ Cannot assign value to final variable
```

---

### ❗ Methods are implicitly `public abstract` unless default/static

```java
interface A {
    void show(); // same as: public abstract void show();
}
```

If a class implements `A`, it must:

```java
public void show() { } // must be public!
```

---

### ❗ A class that doesn't implement **all methods** must be abstract

```java
interface A {
    void run();
}

class B implements A {} // ❌ compile error
```

✅ Fix:

```java
class B implements A {
    public void run() {
        System.out.println("Running");
    }
}
```

---

### ❗ `default` methods are not abstract

```java
interface A {
    default void greet() {
        System.out.println("Hello");
    }
}
```

Subclasses can **override** them, but **don't have to**.

---

## 📌 Summary Table

| Feature                  | Interface Behavior                           |
| ------------------------ | -------------------------------------------- |
| Implements keyword       | `implements`                               |
| Inheritance              | Multiple allowed                             |
| Fields                   | `public static final` only                 |
| Methods                  | `public abstract`, `default`, `static` |
| Constructors             | ❌ Not allowed                               |
| Multiple implementations | ✔️ Yes                                     |
| Supports polymorphism?   | ✔️ Absolutely                              |

---

## 🧪 Quick Quiz

### Q: What is the output?

```java
interface A {
    default void greet() {
        System.out.println("Hello");
    }
}

class B implements A {}

public class Test {
    public static void main(String[] args) {
        A obj = new B();
        obj.greet();
    }
}
```

**Answer:** `Hello`

---

## Final Rule of Thumb

> Use **interfaces** to define **contracts** (what classes **must** do),
> Use **abstract classes** when you want to provide **common base functionality** and **partial abstraction**.

---

## 🎯 OCA Exam Tips

1. **Multiple interface implementation** is allowed (`implements A, B, C`)
2. **Interface fields are constants** (`public static final`)
3. **Interface methods are public abstract** by default
4. **Default methods provide implementation** in interfaces (Java 8+)
5. **Static methods in interfaces** are called on the interface, not objects
6. **Interfaces cannot have constructors** or instance variables

---

## Advanced Example

```java
interface Drawable {
    // Constant
    String TYPE = "GRAPHIC"; // public static final
    
    // Abstract method
    void draw(); // public abstract
    
    // Default method
    default void display() {
        System.out.println("Displaying " + TYPE);
    }
    
    // Static method
    static void info() {
        System.out.println("Drawable interface for graphics");
    }
}

interface Colorable {
    void setColor(String color);
}

class Circle implements Drawable, Colorable {
    private String color;
    
    @Override
    public void draw() {
        System.out.println("Drawing a " + color + " circle");
    }
    
    @Override
    public void setColor(String color) {
        this.color = color;
    }
}

// Usage
public class Test {
    public static void main(String[] args) {
        Circle c = new Circle();
        c.setColor("red");
        c.draw();       // Drawing a red circle
        c.display();    // Displaying GRAPHIC
        Drawable.info(); // Static method call
    }
}
```

---

## Related Topics

- [43. Abstract Methods](43-abstract-methods.md) - Method contracts
- [45. Lambda Expressions](45-lambda-expressions.md) - Functional interfaces
- [42. Abstract Classes](42-abstract-classes.md) - Class abstractions
- [46. Polymorphism](46-polymorphism.md) - Interface polymorphism
- [47. Inheritance](47-inheritance.md) - Interface inheritance
