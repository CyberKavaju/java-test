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

## 🔄 Compile-Time vs Runtime Behavior

```java
Animal a = new Dog();
a.speak(); // Runtime: Dog's speak()

a = new Cat();
a.speak(); // Runtime: Cat's speak()
```

📌 Which method is called? Depends on **object type at runtime**
📌 Which methods are available to call? Depends on **reference type at compile time**

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

## Related Topics

- [46. Inheritance](46-inheritance.md) - Class relationships
- [48. Abstraction](48-abstraction.md) - Hiding complexity
- [38. Method Overriding](38-method-overriding.md) - Method replacement
- [44. Interfaces](44-interfaces.md) - Contract implementation
- [42. Abstract Classes](42-abstract-classes.md) - Partial implementations
- [41. Virtual vs Non-Virtual Methods](41-virtual-vs-non-virtual-methods.md) - Method types
