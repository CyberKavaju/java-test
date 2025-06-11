# 45. Inheritance

**Related:** [44. Lambda Expressions](44-lambda-expressions.md) | [46. Polymorphism](46-polymorphism.md)

---

## 🧠 What is Inheritance?

> **Inheritance** is the ability of one class (child/subclass) to **inherit** the fields and methods of another class (parent/superclass).

It allows for:

- **Code reuse** 🧱
- **"Is-a" relationships** 🔗
- **Polymorphism** 🌐

---

## 🧱 Basic Syntax

```java
class Parent {
    void show() {
        System.out.println("Parent class");
    }
}

class Child extends Parent {
    void greet() {
        System.out.println("Hello from Child");
    }
}
```

### Usage:

```java
Child c = new Child();
c.show();  // Inherited from Parent
c.greet(); // Defined in Child
```

---

## ✅ Keyword: `extends`

- A class **inherits** another using the `extends` keyword:

```java
class Dog extends Animal { }
```

This means:

- Dog **inherits** all accessible members (fields + methods) of Animal
- Dog **can override** or **add new methods**

---

## 🧠 Real-World Analogy

| Concept             | Java Example                       |
| ------------------- | ---------------------------------- |
| Animal → Dog       | `class Dog extends Animal`       |
| Car → Tesla        | `class Tesla extends Car`        |
| Employee → Manager | `class Manager extends Employee` |

---

## 🎯 Why Use Inheritance?

✔️ Reuse common code
✔️ Simplify maintenance
✔️ Model natural hierarchies
✔️ Enable **polymorphism** (runtime method selection)

---

## ✅ Access Control and Inheritance

| Modifier      | Inherited? | Accessible in subclass?   |
| ------------- | ---------- | ------------------------- |
| `public`    | ✔️       | ✔️                      |
| `protected` | ✔️       | ✔️                      |
| (default)     | ✔️       | ✔️ only if same package |
| `private`   | ❌         | ❌                        |

### ➕ Use `super` to access hidden members:

```java
super.methodName();  // calls parent version
super.fieldName;     // accesses parent field
```

---

## 🔁 Method Overriding (Ties into Inheritance)

```java
class Animal {
    void speak() {
        System.out.println("Animal speaks");
    }
}

class Cat extends Animal {
    @Override
    void speak() {
        System.out.println("Meow");
    }
}
```

✔️ The `Cat` class **replaces** the behavior of `speak()` using **overriding**.

---

## 🧪 Inheritance and Constructors

- Constructors are **not inherited**
- But the **parent constructor is always called first** (implicitly or via `super()`)

```java
class A {
    A() { System.out.println("A created"); }
}

class B extends A {
    B() { System.out.println("B created"); }
}
```

### Output:

```
A created
B created
```

---

## 📌 Summary Table

| Concept                    | Supported?                                    |
| -------------------------- | --------------------------------------------- |
| Inheriting fields          | ✔️                                          |
| Inheriting methods         | ✔️                                          |
| Inheriting constructors    | ❌                                            |
| Method overriding          | ✔️                                          |
| Multiple class inheritance | ❌ (Java does not allow multiple `extends`) |
| Inheriting private fields  | ❌ (but can be accessed through methods)      |

---

## ⚠️ OCA Pitfalls

### ❗ Java does **not support multiple inheritance** with classes

```java
class A {}
class B {}

// ❌ Compile error
class C extends A, B {}
```

✅ Use **interfaces** to achieve multiple inheritance of type.

---

### ❗ Constructors aren't inherited

```java
class A {
    A(int x) {}
}

class B extends A {} // ❌ must call A(int) explicitly
```

✅ Fix:

```java
class B extends A {
    B() {
        super(5); // must call parent constructor
    }
}
```

---

### ❗ Only visible members are inherited

```java
class A {
    private int secret = 42;
}

class B extends A {
    // secret is NOT accessible here
}
```

---

## 🧪 Quick Quiz

### Q: What will this print?

```java
class Animal {
    String name = "Animal";
    void speak() { System.out.println("Animal speaks"); }
}

class Dog extends Animal {
    String name = "Dog";
    void speak() { System.out.println("Dog barks"); }
}

public class Test {
    public static void main(String[] args) {
        Animal a = new Dog();
        System.out.println(a.name);
        a.speak();
    }
}
```

**Answer:** 
```
Animal
Dog barks
```

**Explanation:** Fields use reference type (Animal), methods use object type (Dog).

---

## 🎯 OCA Exam Tips

1. **Single inheritance only** - one class can extend only one other class
2. **Constructors are not inherited** - must call super() explicitly if needed
3. **Private members are not inherited** - not accessible in subclasses
4. **Method overriding enables polymorphism** - runtime method selection
5. **Use super keyword** to access parent class members
6. **All classes extend Object** implicitly if no explicit inheritance

---

## Advanced Example

```java
class Vehicle {
    protected String brand;
    protected int year;
    
    public Vehicle(String brand, int year) {
        this.brand = brand;
        this.year = year;
    }
    
    public void start() {
        System.out.println(brand + " vehicle starting...");
    }
    
    public void displayInfo() {
        System.out.println(year + " " + brand);
    }
}

class Car extends Vehicle {
    private int doors;
    
    public Car(String brand, int year, int doors) {
        super(brand, year); // Call parent constructor
        this.doors = doors;
    }
    
    @Override
    public void start() {
        System.out.println("Car engine starting with key...");
    }
    
    public void honk() {
        System.out.println("Beep beep!");
    }
    
    @Override
    public void displayInfo() {
        super.displayInfo(); // Call parent method
        System.out.println("Doors: " + doors);
    }
}

// Usage
public class Test {
    public static void main(String[] args) {
        Car myCar = new Car("Toyota", 2023, 4);
        myCar.start();       // Overridden method
        myCar.displayInfo(); // Calls super and adds more info
        myCar.honk();        // Car-specific method
        
        Vehicle vehicle = new Car("Honda", 2022, 2);
        vehicle.start();     // Polymorphism - calls Car's start()
        // vehicle.honk();   // Error - not available through Vehicle reference
    }
}
```

---

## Related Topics

- [44. Lambda Expressions](44-lambda-expressions.md) - Functional programming
- [46. Polymorphism](46-polymorphism.md) - Runtime behavior
- [41. Abstract Classes](41-abstract-classes.md) - Inheritance hierarchies
- [43. Interfaces](43-interfaces.md) - Multiple inheritance of type
- [38. Method Overriding](38-method-overriding.md) - Method replacement
- [35. Super Reference Variable](35-super-reference-variable.md) - Parent access
