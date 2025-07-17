# 46. Polymorphism

**Related:** [45. Inheritance](45-inheritance.md) | [47. Abstraction](47-abstraction.md)

---

## 🧠 What is Polymorphism?

> **Polymorphism** means *"many forms"* — it allows **one reference type** to refer to **objects of different types** (usually subclasses).

📦 In Java:

> **Polymorphism = using a superclass reference to refer to a subclass object**

---

## 🎯 Why Use It?

- Promotes **code flexibility and reuse**
- Supports **dynamic method dispatch**
- Enables **object substitution** (you can treat a `Dog` like an `Animal`)

---

## 🔁 Basic Example

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
        Animal a = new Dog(); // polymorphism in action
        a.speak();            // Output: Dog barks 🐶
    }
}
```

✅ The reference is `Animal`, but the **actual object is a `Dog`**
✅ At runtime, Java dynamically calls the **`Dog`'s `speak()` method**

---

## 🧠 How It Works: Dynamic Method Dispatch

> Java uses **dynamic (late) binding** for overridden methods:

- The method that gets executed is **based on the object's actual type**
- Not the reference type

📌 This is what makes **runtime polymorphism** possible in Java.

---

## 🧪 Real-Life Analogy

| Scenario                       | Java Equivalent                     |
| ------------------------------ | ----------------------------------- |
| You plug a USB into any device | One interface, many implementations |
| Remote control for a TV, AC    | One remote, different behaviors     |

---

## 🔄 **Compile-Time vs Runtime in Java (Method Calls)**

### ⚙️ Scenario Setup

```java
Animal a = new Dog(); 
a.speak(); // Which 'speak()' gets called?
```

To fully understand what's going on, let's say we have the following class structure:

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

class Cat extends Animal {
    void speak() {
        System.out.println("Cat meows");
    }
}
```

---

### 🧠 Now the Key Concepts:

### ✅ **Compile-Time (aka Static Binding):**

This is when the Java compiler checks:

> “Which methods can I *see* from the variable's declared type?”

In:

```java
Animal a = new Dog();
```

* The **reference type** is `Animal`.
* So, at compile time, **only methods in `Animal`** are *visible* to the compiler.
* That means you *can’t* call methods that exist *only* in `Dog`, unless you cast.

```java
a.speak(); // OK ✅ because Animal has a speak() method
a.fetch(); // ❌ COMPILE ERROR - Animal doesn’t have a fetch() method
```

---

### ✅ **Runtime (aka Dynamic Binding or Late Binding):**

At runtime, Java checks:

> “What is the *actual object* behind the reference?”

In this case:

```java
Animal a = new Dog();
```

* `a` is **pointing to a Dog object**
* So at runtime, **Dog’s version** of `speak()` is executed.
* Even though `a` is declared as `Animal`, it behaves like a `Dog`.

```java
a.speak(); // OUTPUT: Dog barks 🐶
```

Then later:

```java
a = new Cat();
a.speak(); // OUTPUT: Cat meows 🐱
```

---

### 🧬 Final Summary

| Aspect                          | What It Depends On            | Example                                     |
| ------------------------------- | ----------------------------- | ------------------------------------------- |
| ✅ **What methods can I call?**  | Reference type (Compile Time) | `a.speak()` is OK if `Animal` has `speak()` |
| ✅ **Which method is executed?** | Object type (Runtime)         | Executes `Dog.speak()` or `Cat.speak()`     |

---

### 💡 Visual Analogy

Think of the **reference type** as the *TV remote* 📺 — it defines what buttons you’re allowed to press.

And the **object type** as the *actual TV brand* — determines what happens when you press a button.

So:

```java
Animal a = new Dog(); // Remote is Animal, TV is Dog
```

You press `speak()` — and Dog barks, because it’s a Dog TV!

---

Want a quick test code to run this behavior? I got you 👇

```java
public class Demo {
    static class Animal {
        void speak() {
            System.out.println("Animal speaks");
        }
    }

    static class Dog extends Animal {
        void speak() {
            System.out.println("Dog barks");
        }
    }

    static class Cat extends Animal {
        void speak() {
            System.out.println("Cat meows");
        }
    }

    public static void main(String[] args) {
        Animal a = new Dog();
        a.speak(); // Dog barks

        a = new Cat();
        a.speak(); // Cat meows
    }
}
```
---

## ✅ Method Overriding Enables Polymorphism

```java
class Animal {
    void sound() { System.out.println("Animal sound"); }
}

class Lion extends Animal {
    void sound() { System.out.println("Roar!"); }
}
```

---

## ❌ Polymorphism Doesn't Apply To Fields

```java
class Animal {
    String name = "Animal";
}

class Cat extends Animal {
    String name = "Cat";
}

Animal a = new Cat();
System.out.println(a.name); // Output: Animal ❗
```

📌 Fields are **not polymorphic** — Java uses **reference type** for variables.

---

## ✅ Arrays and Lists of Polymorphic Types

```java
Animal[] zoo = { new Dog(), new Cat(), new Lion() };

for (Animal animal : zoo) {
    animal.speak(); // Each object responds with its own behavior
}
```

---

## ⚠️ OCA Pitfalls

### ❗ Only overridden methods are polymorphic

```java
class Animal {
    void speak() {}
    void eat() {}
}

class Dog extends Animal {
    void speak() {}
    void fetch() {}
}

Animal a = new Dog();
a.speak();   // ✅ valid
a.fetch();   // ❌ Compile error! Not visible via Animal reference
```

➡️ `fetch()` is not declared in `Animal`, so it's **not available** through the `a` reference.

---

### ❗ Constructor behavior is **not polymorphic**

```java
class Animal {
    Animal() {
        System.out.println("Animal constructor");
    }
}

class Dog extends Animal {
    Dog() {
        System.out.println("Dog constructor");
    }
}

new Dog(); // Output:
           // Animal constructor
           // Dog constructor
```

✔️ Java always calls **superclass constructor first**, but it doesn't do it polymorphically.

---

## 📌 Summary Table

| Concept                     | Polymorphic? | Notes                                 |
| --------------------------- | ------------ | ------------------------------------- |
| Overridden methods          | ✔️ Yes       | Determined by object type at runtime  |
| Instance variables (fields) | ❌ No         | Determined by reference type          |
| Constructors                | ❌ No         | Not resolved polymorphically          |
| Static methods              | ❌ No         | Bound at compile time (method hiding) |

---

## 🧠 Final Rule of Thumb

> **Polymorphism works only with overridden instance methods.**
> The object type determines the behavior, the reference type determines what is accessible.

---

## 🧪 Quick Quiz

### Q: What is the output?

```java
class Animal {
    void speak() { System.out.println("Generic animal"); }
}

class Dog extends Animal {
    void speak() { System.out.println("Woof!"); }
}

public class Test {
    public static void main(String[] args) {
        Animal a = new Dog();
        a.speak();
    }
}
```

**Answer:** `Woof!`

---

## 🎯 OCA Exam Tips

1. **Polymorphism requires inheritance** and method overriding
2. **Method resolution is at runtime** (dynamic binding)
3. **Field access is at compile time** (static binding)
4. **Reference type determines accessibility** of methods
5. **Object type determines which method executes**
6. **Static methods use method hiding**, not polymorphism

---

## Advanced Example

```java
abstract class Shape {
    protected String color;
    
    public Shape(String color) {
        this.color = color;
    }
    
    // Abstract method - forces polymorphic behavior
    public abstract double getArea();
    
    // Concrete method - can be overridden
    public void display() {
        System.out.println(color + " shape with area: " + getArea());
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
    public void display() {
        System.out.println(color + " rectangle: " + width + "x" + height + 
                         " = " + getArea());
    }
}

// Polymorphic usage
public class Test {
    public static void main(String[] args) {
        Shape[] shapes = {
            new Circle("Red", 5),
            new Rectangle("Blue", 4, 6),
            new Circle("Green", 3)
        };
        
        // Polymorphism in action
        for (Shape shape : shapes) {
            shape.display(); // Calls appropriate method based on object type
        }
    }
}
```

**Output:**
```
Red shape with area: 78.53981633974483
Blue rectangle: 4.0x6.0 = 24.0
Green shape with area: 28.274333882308138
```

---

## Types of Polymorphism

### 1. Runtime Polymorphism (Method Overriding)
```java
Animal a = new Dog();
a.speak(); // Calls Dog's speak() method
```

### 2. Compile-time Polymorphism (Method Overloading)
```java
class Calculator {
    int add(int a, int b) { return a + b; }
    double add(double a, double b) { return a + b; }
}
```

### 3. Interface Polymorphism
```java
interface Drawable {
    void draw();
}

class Circle implements Drawable {
    public void draw() { System.out.println("Drawing circle"); }
}

Drawable d = new Circle();
d.draw(); // Calls Circle's draw() method
```
---

## Video Tutorial

- [Java Polymorphism Fully Explained In 7 Minutes - Coding with John](https://www.youtube.com/watch?v=jhDUxynEQRI)
- [Java polymorphism 🏁 - Bro Code](https://www.youtube.com/watch?v=2hkngtWLGvE)
- [Polymorphism - ForrestKnight](https://www.youtube.com/shorts/CWX3txO1jP0)
- [Learn RUNTIME POLYMORPHISM in 5 minutes! 🤷‍♂️ - Bro Code](https://www.youtube.com/watch?v=YDKHfqzaF30)

---

## Related Topics

- [46. Inheritance](46-inheritance.md) - Class relationships
- [48. Abstraction](48-abstraction.md) - Hiding complexity
- [38. Method Overriding](38-method-overriding.md) - Method replacement
- [44. Interfaces](44-interfaces.md) - Contract implementation
- [42. Abstract Classes](42-abstract-classes.md) - Partial implementations
- [41. Virtual vs Non-Virtual Methods](41-virtual-vs-non-virtual-methods.md) - Method types
