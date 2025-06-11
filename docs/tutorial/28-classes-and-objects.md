# Classes and Objects

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
