# Constructors

## 🧠 What is a Constructor?

> A **constructor** is a special method that is **called automatically** when an object is **created**.

Its purpose is to **initialize the object's state** (i.e., assign values to its fields).

---

## 🧱 Basic Syntax

```java
class Person {
    String name;

    // Constructor
    Person(String inputName) {
        name = inputName;
    }
}
```

### ✅ Usage:

```java
Person p = new Person("Alice");
System.out.println(p.name); // Output: Alice
```

---

## ✅ Rules of Constructors

| Rule                                                           | Example                                  |
| -------------------------------------------------------------- | ---------------------------------------- |
| Same name as the class                                         | `class Car { Car() { } }`              |
| No return type (not even `void`)                             | ❌`void Car() {}` → not a constructor |
| Can be overloaded                                              | ✔️ Multiple constructors allowed       |
| Can call another constructor using `this()`                  | `this(params)` must be the first line  |
| Can call the superclass constructor with `super()`           | must be first line too                   |
| If no constructor is declared, Java adds a default constructor | `Car() {}` (if no custom one exists)   |

---

## 🔄 Default Constructor

> If **no constructor is written**, Java provides a **default constructor** that takes **no arguments** and assigns default values.

```java
class Dog {
    String name;
}
Dog d = new Dog(); // Works because Java inserts: Dog() {}
```

---

## 🔧 No-Arg Constructor

You can explicitly define your own **no-argument constructor**:

```java
class Cat {
    Cat() {
        System.out.println("Cat created");
    }
}
```

---

## 🔄 Constructor Overloading

You can define **multiple constructors** with different parameter lists:

```java
class Book {
    String title;
    int pages;

    Book() {
        title = "Untitled";
    }

    Book(String t, int p) {
        title = t;
        pages = p;
    }
}
```

---

## 🔁 Calling Another Constructor (`this()`)

Use `this()` to call another constructor **in the same class**:

```java
class Student {
    String name;
    int age;

    Student() {
        this("Unknown", 18); // must be 1st line
    }

    Student(String n, int a) {
        name = n;
        age = a;
    }
}
```

---

## 👨‍👧 Calling Superclass Constructor (`super()`)

Java automatically inserts `super();` if not specified, calling the **no-arg constructor of the superclass**.

```java
class Animal {
    Animal() {
        System.out.println("Animal created");
    }
}

class Dog extends Animal {
    Dog() {
        super(); // optional if no-arg constructor exists
        System.out.println("Dog created");
    }
}
```

---

## 🧠 Real-World Analogy

Think of a constructor like the **assembly instructions** for creating a new object:

> New phone 📱 → constructor sets model, memory, OS during "birth"

---

## ✅ Summary Table

| Feature                         | Constructor Behavior           |
| ------------------------------- | ------------------------------ |
| Name                            | Must match class name          |
| Return type                     | ❌ No return type allowed      |
| Overloading                     | ✔️ Yes                       |
| Can be private                  | ✔️ Used in Singleton pattern |
| Can call another constructor    | ✔️`this(...)`              |
| Can call superclass constructor | ✔️`super(...)`             |
| Implicitly added by compiler    | ✔️ If none are written       |

---

## ⚠️ OCA Pitfalls

### ❗ Constructor with `void` = **not a constructor**

```java
class A {
    void A() { } // ❌ This is a method, not a constructor
}
```

---

### ❗ `this()` or `super()` must be the **first line**

```java
class A {
    A() {
        System.out.println("Hi");
        this("Hello"); // ❌ Error
    }

    A(String msg) {}
}
```

---

### ❗ No default constructor if **any constructor is defined**

```java
class Car {
    Car(String model) {}
}

new Car(); // ❌ Compile-time error
```

✅ Fix: Add a no-arg constructor manually.

---

## 🧪 Quick Quiz

### Q: What is the output?

```java
class A {
    A() {
        System.out.println("A");
    }
}

class B extends A {
    B() {
        System.out.println("B");
    }
}

public class Test {
    public static void main(String[] args) {
        new B();
    }
}
```

✅ **Output:**

```
A
B
```

---

## Final Rule of Thumb

> Constructors **build your object**, **set its state**, and **don't return values**.
> Use **overloading** to support flexible initialization, and remember `this()` and `super()` for reuse and inheritance.
