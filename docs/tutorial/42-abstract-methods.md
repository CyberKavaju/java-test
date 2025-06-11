# 42. Abstract Methods

**Related:** [41. Abstract Classes](41-abstract-classes.md) | [43. Interfaces](43-interfaces.md)

---

## 🔍 What is an Abstract Method?

> An **abstract method** is a method **without a body** that is **declared inside an abstract class or interface**.
> It acts as a **contract**: subclasses **must override and implement** it.

---

### 🔹 Syntax

```java
abstract returnType methodName(parameterList);
```

### ✅ Example

```java
abstract class Animal {
    abstract void speak(); // Abstract method — no body
}
```

---

## 🚫 What Abstract Methods **Can't** Do

| Feature                      | Allowed? | Why?                                 |
| ---------------------------- | -------- | ------------------------------------ |
| Have a body `{}`           | ❌       | Must be overridden by subclasses     |
| Be `private` or `static` | ❌       | Those can't be overridden            |
| Exist in concrete classes    | ❌       | Only abstract classes/interfaces     |
| Be `final`                 | ❌       | Final means "can't be overridden" |

---

## ✅ Abstract Methods Must Be:

- Declared **inside an abstract class or interface**
- Marked with the `abstract` keyword
- **Implemented** by the first concrete subclass

---

## 🔁 Example in Use

```java
abstract class Vehicle {
    abstract void start(); // no body
    void stop() {
        System.out.println("Stopping...");
    }
}

class Car extends Vehicle {
    @Override
    void start() {
        System.out.println("Car is starting...");
    }
}
```

```java
public class Main {
    public static void main(String[] args) {
        Vehicle v = new Car();
        v.start(); // Output: Car is starting...
        v.stop();  // Output: Stopping...
    }
}
```

---

## 💡 Abstract Method in Interface (Java 8)

- All methods in an interface are **implicitly `abstract`** (unless `default` or `static`)
- You **don't need to write `abstract` keyword** explicitly

```java
interface Flyable {
    void fly(); // implicitly public & abstract
}
```

---

## 🧠 OCA Exam Pitfalls

### ❗ Must be in an abstract class or interface

```java
class Dog {
    abstract void bark(); // ❌ Compile-time error
}
```

✅ Fix:

```java
abstract class Dog {
    abstract void bark(); // ✅
}
```

---

### ❗ Abstract methods **cannot have a body**

```java
abstract void run() {
    System.out.println("Running");
} // ❌ Compile error
```

---

### ❗ Subclass must implement **all abstract methods**, unless it's abstract too

```java
abstract class Bird {
    abstract void fly();
}

class Penguin extends Bird {} // ❌ Compile error
```

✅ Fix:

```java
class Penguin extends Bird {
    void fly() {
        System.out.println("Nope. I waddle.");
    }
}
```

---

## 📌 Summary Table

| Concept                  | Abstract Method                        |
| ------------------------ | -------------------------------------- |
| Has body?                | ❌ No                                  |
| Can be static?           | ❌ No                                  |
| Can be final?            | ❌ No                                  |
| Must subclass implement? | ✔️ Yes (unless subclass is abstract) |
| Belongs in...            | Abstract class or interface only       |

---

## 🔥 Real-World Analogy

Imagine an abstract method like a **blank form** you must fill out in a subclass:

```java
abstract class Document {
    abstract void print(); // every kind of document must define this
}
```

Each subclass fills in that behavior:

```java
class PDF extends Document {
    void print() { System.out.println("Printing PDF..."); }
}
```

---

## 🎯 Quick Quiz

### Q: What's wrong with this code?

```java
class Animal {
    abstract void sound(); // ❌
}
```

**Answer:** `Animal` must be declared abstract to contain an abstract method.

---

## 🎯 OCA Exam Tips

1. **Abstract methods have no body** - just declaration with semicolon
2. **Must be in abstract class or interface** - cannot be in concrete classes
3. **Cannot be private, final, or static** - these prevent overriding
4. **Subclasses must implement** all abstract methods (or be abstract themselves)
5. **Interfaces make methods implicitly abstract** (unless default/static)

---

## Advanced Example

```java
abstract class Shape {
    protected String color;
    
    public Shape(String color) {
        this.color = color;
    }
    
    // Abstract methods - must be implemented by subclasses
    public abstract double getArea();
    public abstract double getPerimeter();
    
    // Concrete method - shared implementation
    public void displayColor() {
        System.out.println("Color: " + color);
    }
}

class Circle extends Shape {
    private double radius;
    
    public Circle(String color, double radius) {
        super(color);
        this.radius = radius;
    }
    
    @Override
    public double getArea() {
        return Math.PI * radius * radius;
    }
    
    @Override
    public double getPerimeter() {
        return 2 * Math.PI * radius;
    }
}

class Rectangle extends Shape {
    private double width, height;
    
    public Rectangle(String color, double width, double height) {
        super(color);
        this.width = width;
        this.height = height;
    }
    
    @Override
    public double getArea() {
        return width * height;
    }
    
    @Override
    public double getPerimeter() {
        return 2 * (width + height);
    }
}
```

---

## Related Topics

- [42. Abstract Classes](42-abstract-classes.md) - Abstract class concepts
- [44. Interfaces](44-interfaces.md) - Interface methods
- [41. Virtual vs Non-Virtual Methods](41-virtual-vs-non-virtual-methods.md) - Method types
- [38. Method Overriding](38-method-overriding.md) - Method implementation
- [46. Polymorphism](46-polymorphism.md) - Runtime behavior
