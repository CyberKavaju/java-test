# OOP Overview

## ✅ What is OOP?

**Object-Oriented Programming (OOP)** is a way of structuring your programs using **objects**, which are **instances of classes**. Java is a 100% OOP language (except for primitives).

---

## 🧱 The 4 Pillars of OOP

| Pillar                  | What It Means                              | Real-World Analogy              |
| ----------------------- | ------------------------------------------ | ------------------------------- |
| **Encapsulation** | Hide internal state; expose only necessary | TV remote hides wires           |
| **Abstraction**   | Show only relevant details                 | Drive a car, don't see engine  |
| **Inheritance**   | Child class inherits from parent class     | Dog is-an Animal                |
| **Polymorphism**  | One interface, many implementations        | Same "fly()" for Bird and Plane |

---

## 1️⃣ **Class & Object**

A **class** is a **blueprint** for an object.
An **object** is a **real instance** of that blueprint.

```java
class Car {
    String color;
    void drive() {
        System.out.println("Driving...");
    }
}

public class Main {
    public static void main(String[] args) {
        Car myCar = new Car(); // Object created
        myCar.color = "Red";
        myCar.drive(); // Output: Driving...
    }
}
```

---

## 2️⃣ **Encapsulation**

- Hiding data using `private`
- Exposing data using `getters` and `setters`

```java
class Person {
    private String name;

    public void setName(String n) {
        name = n;
    }

    public String getName() {
        return name;
    }
}
```

📌 Benefit: Protects internal data from unwanted changes.

---

## 3️⃣ **Abstraction**

- Focus on **what** an object does, not **how**
- Achieved via **abstract classes** and **interfaces**

```java
abstract class Animal {
    abstract void sound();
}

class Dog extends Animal {
    void sound() {
        System.out.println("Bark!");
    }
}
```

---

## 4️⃣ **Inheritance**

- Allows one class to **reuse** code from another
- `extends` keyword

```java
class Animal {
    void eat() {
        System.out.println("Eating...");
    }
}

class Dog extends Animal {
    void bark() {
        System.out.println("Barking...");
    }
}
```

---

## 5️⃣ **Polymorphism**

- **Compile-time (Method Overloading)**:

```java
class MathUtil {
    int add(int a, int b) { return a + b; }
    double add(double a, double b) { return a + b; }
}
```

- **Runtime (Method Overriding)**:

```java
class Animal {
    void speak() { System.out.println("Animal speaks"); }
}
class Cat extends Animal {
    void speak() { System.out.println("Meow"); }
}
```

```java
Animal a = new Cat(); // Polymorphism in action
a.speak(); // Output: Meow
```

---

## 🔁 OOP Terms Glossary

| Term             | Meaning                                |
| ---------------- | -------------------------------------- |
| Class            | Blueprint for objects                  |
| Object           | Instance of a class                    |
| Method           | Behavior/function of an object         |
| Field / Variable | Data/properties of an object           |
| Constructor      | Special method to initialize an object |
| Inheritance      | One class reuses another class's code  |
| Interface        | A contract that classes must follow    |
| Abstract Class   | Partial implementation + abstraction   |

---

## ⚠️ OCA Pitfalls

✅ You **can't create an object from an abstract class**
✅ You **must override all methods** from an interface
✅ Use `super` to call the parent class
✅ Constructors are **not inherited**

---

## 🎓 OCA Quick Quiz

### Q1: Can you instantiate an abstract class?

❌ No

---

### Q2: What is printed?

```java
class A {
    void print() { System.out.println("A"); }
}
class B extends A {
    void print() { System.out.println("B"); }
}
public class Test {
    public static void main(String[] args) {
        A obj = new B();
        obj.print();
    }
}
```

✔️ **Output:** `B` — dynamic dispatch (runtime polymorphism)

---

## ✅ Summary Table

| Feature       | Keyword                   | Purpose                          |
| ------------- | ------------------------- | -------------------------------- |
| Class         | `class`                 | Define blueprint                 |
| Inheritance   | `extends`               | Reuse parent class               |
| Abstraction   | `abstract`              | Partial class, to be implemented |
| Polymorphism  | `@Override`             | Redefine parent method           |
| Interface     | `interface`             | Define contract without logic    |
| Encapsulation | `private` + `get/set` | Hide fields from direct access   |

---

## 📚 Detailed OOP Topics

This overview covers the fundamental concepts of Object-Oriented Programming in Java. For more detailed explanations and examples, refer to these individual topic files:

### Core OOP Concepts
- **[28-classes-and-objects.md](./28-classes-and-objects.md)** - Classes, objects, and the 4 pillars of OOP
- **[29-fields-vs-attributes.md](./29-fields-vs-attributes.md)** - Understanding the difference between fields and attributes
- **[39-encapsulation.md](./39-encapsulation.md)** - Deep dive into encapsulation principles and best practices

### Data Access and Management
- **[30-getters-and-setters.md](./30-getters-and-setters.md)** - Creating and using getter/setter methods
- **[31-constructors.md](./31-constructors.md)** - Constructor fundamentals, overloading, and chaining

### Methods and Behavior
- **[32-methods.md](./32-methods.md)** - Method declaration, parameters, return types, and access modifiers
- **[36-method-overloading.md](./36-method-overloading.md)** - Multiple methods with the same name
- **[37-static-vs-instance-methods.md](./37-static-vs-instance-methods.md)** - Understanding static and instance methods
- **[38-method-overriding.md](./38-method-overriding.md)** - Overriding methods in subclasses for polymorphism

### Reference Variables and Keywords
- **[33-this-and-super-calls.md](./33-this-and-super-calls.md)** - Constructor chaining with `this()` and `super()`
- **[34-this-reference-variable.md](./34-this-reference-variable.md)** - Using `this` to reference the current object
- **[35-super-reference-variable.md](./35-super-reference-variable.md)** - Using `super` to access parent class members

### Advanced OOP Concepts

#### Parameter Passing and Method Resolution
- **[40-pass-by-value-vs-reference.md](./40-pass-by-value-vs-reference.md)** - Understanding Java's parameter passing mechanism
- **[41-virtual-vs-non-virtual-methods.md](./41-virtual-vs-non-virtual-methods.md)** - Method resolution at compile vs runtime

#### Abstract Programming
- **[42-abstract-classes.md](./42-abstract-classes.md)** - Partial implementation and abstract concepts
- **[43-abstract-methods.md](./43-abstract-methods.md)** - Method contracts without implementation
- **[44-interfaces.md](./44-interfaces.md)** - Pure contracts and multiple inheritance
- **[48-abstraction.md](./48-abstraction.md)** - Hiding complexity and implementation details

#### Modern Java Features
- **[45-lambda-expressions.md](./45-lambda-expressions.md)** - Functional programming with lambdas (Java 8+)

#### Core OOP Pillars
- **[46-inheritance.md](./46-inheritance.md)** - Class relationships and code reuse
- **[47-polymorphism.md](./47-polymorphism.md)** - Runtime method selection and dynamic binding

---

## 🎯 Study Path Recommendation

### Beginner Path
1. **Start with**: [28-classes-and-objects.md](./28-classes-and-objects.md) for fundamental concepts
2. **Learn data management**: [29-fields-vs-attributes.md](./29-fields-vs-attributes.md) → [30-getters-and-setters.md](./30-getters-and-setters.md) → [39-encapsulation.md](./39-encapsulation.md)
3. **Master object creation**: [31-constructors.md](./31-constructors.md) → [33-this-and-super-calls.md](./33-this-and-super-calls.md)
4. **Understand methods**: [32-methods.md](./32-methods.md) → [36-method-overloading.md](./36-method-overloading.md) → [37-static-vs-instance-methods.md](./37-static-vs-instance-methods.md)
5. **Advanced concepts**: [34-this-reference-variable.md](./34-this-reference-variable.md) → [35-super-reference-variable.md](./35-super-reference-variable.md) → [38-method-overriding.md](./38-method-overriding.md)

### Advanced Path (After completing basics)
6. **Parameter mechanics**: [40-pass-by-value-vs-reference.md](./40-pass-by-value-vs-reference.md) → [41-virtual-vs-non-virtual-methods.md](./41-virtual-vs-non-virtual-methods.md)
7. **Abstract concepts**: [42-abstract-classes.md](./42-abstract-classes.md) → [43-abstract-methods.md](./43-abstract-methods.md) → [44-interfaces.md](./44-interfaces.md)
8. **OOP pillars**: [46-inheritance.md](./46-inheritance.md) → [47-polymorphism.md](./47-polymorphism.md) → [48-abstraction.md](./48-abstraction.md)
9. **Modern features**: [45-lambda-expressions.md](./45-lambda-expressions.md)

### OCA Exam Preparation
- **Essential**: 28, 30, 31, 32, 36, 37, 38, 39
- **Important**: 40, 42, 43, 44, 46, 47, 48
- **Advanced**: 41, 45 (Java 8 features)

Each file contains detailed explanations, code examples, OCA exam tips, and practice questions to help you master Object-Oriented Programming in Java.
