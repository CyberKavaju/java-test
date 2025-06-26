# 41. Abstract Classes

**Related:** [40. Virtual vs Non-Virtual Methods](40-virtual-vs-non-virtual-methods.md) | [42. Abstract Methods](42-abstract-methods.md)

---

## ✅ What is an Abstract Class?

> An **abstract class** is a class that **cannot be instantiated** and may contain **abstract methods** (methods without a body) as well as **concrete methods** (with implementation).

It's designed to be **inherited** — not used on its own.

---

### 🔹 Syntax:

```java
abstract class Animal {
    abstract void makeSound();  // abstract method
    void breathe() {            // concrete method
        System.out.println("Breathing...");
    }
}
```

---

## ✅ Why Use Abstract Classes?

- To **define common behavior** (via concrete methods)
- To **enforce a contract** for subclasses (via abstract methods)
- To create a **partial implementation** of a concept

📌 Great for defining **"is-a" relationships** with shared code.

---

## ✅ Key Characteristics

| Feature                          | Abstract Class              |
| -------------------------------- | --------------------------- |
| Can contain `abstract` methods | ✔️                        |
| Can contain concrete methods     | ✔️                        |
| Can have fields                  | ✔️ (static or instance)   |
| Can have constructors            | ✔️ (used by subclasses)   |
| Can extend another class         | ✔️ (abstract or concrete) |
| Can implement interfaces         | ✔️                        |
| Can't be instantiated directly  | ❌                          |

---

## 🧪 Example

```java
abstract class Vehicle {
    String brand = "Generic";

    abstract void start();  // abstract method

    void stop() {           // concrete method
        System.out.println("Stopping vehicle...");
    }
}

class Car extends Vehicle {
    void start() {
        System.out.println("Car is starting...");
    }
}
```

### 🔹 Usage:

```java
Vehicle myCar = new Car(); // ✅ polymorphism
myCar.start();             // Output: Car is starting...
myCar.stop();              // Output: Stopping vehicle...
```

---

## 🧠 Abstract Class vs Interface

| Feature                       | **Abstract Class**        | **Interface (Java 8)**          |
| ----------------------------- | ------------------------------- | ------------------------------------- |
| Can have concrete methods     | ✔️                            | ✔️ (default & static only)          |
| Can have constructors         | ✔️                            | ❌                                    |
| Can have fields               | ✔️ (normal vars)              | ✔️ but only `public static final` |
| Supports multiple inheritance | ❌ (only one superclass)        | ✔️ multiple interfaces              |
| Use when...                   | You need partial implementation | You need full abstraction             |

---

## 🧠 OCA Exam Traps and Gotchas

### ❗ Can't instantiate abstract classes

```java
abstract class Shape {}
Shape s = new Shape(); // ❌ Compile error
```

---

### ❗ You don't need to have abstract methods!

```java
abstract class Example {
    void sayHi() { System.out.println("Hi"); }
}
// Still abstract, just not fully implemented
```

---

### ❗ If a subclass doesn't implement all abstract methods → it must be abstract too

```java
abstract class Animal {
    abstract void speak();
}

class Dog extends Animal {
    // ❌ Missing speak() → must declare Dog as abstract or implement method
}
```

---

## 🔁 Inheritance Chain

```java
abstract class Animal {
    abstract void sound();
}

abstract class Mammal extends Animal {
    void walk() {
        System.out.println("Walking...");
    }
}

class Dog extends Mammal {
    void sound() {
        System.out.println("Bark!");
    }
}
```

✔️ You can chain abstract classes, and only the **concrete (last) subclass** needs to implement all inherited abstract methods.

---

## ✅ Summary Table

| Feature                          | Abstract Class                 |
| -------------------------------- | ------------------------------ |
| Can be extended?                 | ✔️                           |
| Can be instantiated?             | ❌                             |
| Can have abstract methods?       | ✔️                           |
| Can have concrete methods?       | ✔️                           |
| Can have fields?                 | ✔️                           |
| Must subclass implement methods? | ✔️ if abstract methods exist |

---

## 🔥 Quick Quiz

### Q: Which of the following is true?

```java
abstract class A {
    abstract void run();
    void stop() { System.out.println("Stop"); }
}

class B extends A {
    // missing run() method
}
```

**Answer:** ❌ Compile error — `B` must either implement `run()` or be declared abstract.

---

## 🎯 OCA Exam Tips

1. **Abstract classes cannot be instantiated** directly
2. **Can contain both abstract and concrete methods**
3. **Subclasses must implement all abstract methods** (or be abstract themselves)
4. **Can have constructors** (called by subclasses)
5. **Can have instance variables** and static methods
6. **Only one abstract class** can be extended (single inheritance)

---

## Real-World Example

```java
abstract class Employee {
    protected String name;
    protected double salary;
    
    public Employee(String name, double salary) {
        this.name = name;
        this.salary = salary;
    }
    
    // Abstract method - must be implemented by subclasses
    public abstract double calculateBonus();
    
    // Concrete method - shared implementation
    public void displayInfo() {
        System.out.println("Name: " + name + ", Salary: " + salary);
    }
}

class Manager extends Employee {
    public Manager(String name, double salary) {
        super(name, salary);
    }
    
    @Override
    public double calculateBonus() {
        return salary * 0.2; // 20% bonus for managers
    }
}

class Developer extends Employee {
    public Developer(String name, double salary) {
        super(name, salary);
    }
    
    @Override
    public double calculateBonus() {
        return salary * 0.1; // 10% bonus for developers
    }
}
```

---

## Related Topics

- [40. Virtual vs Non-Virtual Methods](40-virtual-vs-non-virtual-methods.md) - Method resolution
- [42. Abstract Methods](42-abstract-methods.md) - Abstract method details
- [43. Interfaces](43-interfaces.md) - Interface concepts
- [45. Inheritance](45-inheritance.md) - Inheritance principles
- [46. Polymorphism](46-polymorphism.md) - Runtime behavior

## Video Tutorials

- [Abstract Class In Java Tutorial #79 - Alex Lee](https://www.youtube.com/watch?v=52frlN8webg&t=42s)
- [Abstract Classes and Methods in Java Explained in 7 Minutes - Coding with John](https://www.youtube.com/watch?v=HvPlEJ3LHgE)
- [Java abstraction 👻 - Bro Code](https://www.youtube.com/watch?v=Lvnb83qt57g)