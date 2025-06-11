# `this()` and `super()` Calls

## 🎯 Purpose at a Glance

| Keyword     | Calls...                                   | Used for...                      |
| ----------- | ------------------------------------------ | -------------------------------- |
| `this()`  | Another constructor in**same class** | Reuse constructor logic          |
| `super()` | A constructor in**superclass**       | Ensure superclass is initialized |

Both must be the **first statement** in the constructor.

---

## ✅ `this()` — Calling Another Constructor in the Same Class

> Use `this()` when you want to **reuse another constructor** in the **same class**.

### 🔧 Syntax

```java
this(arguments); // must be first line in constructor
```

### 🧪 Example

```java
public class Student {
    String name;
    int age;

    Student() {
        this("Unknown", 18); // calls next constructor
    }

    Student(String name, int age) {
        this.name = name;
        this.age = age;
    }
}
```

✔️ When you call `new Student()`, it will internally call `new Student("Unknown", 18)`.

---

### 💡 Why Use `this()`?

- Avoid **duplicating initialization logic**
- Maintain a **single initialization path**
- Helps with **overloaded constructors**

---

## ✅ `super()` — Calling a Superclass Constructor

> Use `super()` to **explicitly call a constructor in the superclass**.

### 🔧 Syntax

```java
super(arguments); // must be first line in constructor
```

If not specified, Java **automatically inserts `super()`**, calling the **no-arg constructor** of the superclass.

---

### 🧪 Example

```java
class Animal {
    Animal(String type) {
        System.out.println("Animal type: " + type);
    }
}

class Dog extends Animal {
    Dog() {
        super("Dog"); // calls Animal(String type)
        System.out.println("Dog created");
    }
}
```

### Output:

```
Animal type: Dog
Dog created
```

---

### 💡 Why Use `super()`?

- To **initialize the parent class** explicitly
- When the superclass has **no default constructor**
- When you want to **pass values up to the parent**

---

## ⚖️ `this()` vs `super()` — Comparison

| Feature           | `this()`                                 | `super()`                        |
| ----------------- | ------------------------------------------ | ---------------------------------- |
| Calls...          | Another constructor in**same class** | Constructor in**superclass** |
| Must be first?    | ✔️ Yes                                   | ✔️ Yes                           |
| Can both be used? | ❌ Not in same constructor                 | You must choose one                |
| Use case          | Overloaded constructor reuse               | Superclass constructor chaining    |

---

## ⚠️ OCA Pitfalls

### ❗ `this()` or `super()` must be **first statement**

```java
public class A {
    A() {
        System.out.println("Init"); // ❌ can't appear before `this()` or `super()`
        this(5);
    }

    A(int x) {}
}
```

✅ Fix:

```java
A() {
    this(5); // must be first
    System.out.println("Init");
}
```

---

### ❗ Constructors **never** call both `this()` and `super()` — only one is allowed

```java
A() {
    this();     // ✅ OK
    super();    // ❌ Compile error
}
```

---

### ❗ If superclass has **no no-arg constructor**, you **must call `super()` explicitly**

```java
class Animal {
    Animal(String name) {}
}

class Dog extends Animal {
    Dog() {} // ❌ Compile error — must call super(String)
}
```

✅ Fix:

```java
Dog() {
    super("Rex");
}
```

---

## 🔁 Chaining Constructors with `this()` and `super()`

```java
class A {
    A() {
        this(10);
        System.out.println("A()");
    }
    A(int x) {
        System.out.println("A(int)");
    }
}

class B extends A {
    B() {
        super();
        System.out.println("B()");
    }
}
```

### Output:

```
A(int)
A()
B()
```

---

## ✅ Summary Table

| Keyword     | Calls                                      | Must be 1st line | Use Case                                 |
| ----------- | ------------------------------------------ | ---------------- | ---------------------------------------- |
| `this()`  | Another constructor in**same class** | ✔️             | Constructor chaining, reuse logic        |
| `super()` | Superclass constructor                     | ✔️             | Parent initialization, inheritance setup |

---

## 🧪 Quick Quiz

### Q: What will this print?

```java
class A {
    A() {
        System.out.println("A()");
    }
}

class B extends A {
    B() {
        super();
        System.out.println("B()");
    }
}

public class Test {
    public static void main(String[] args) {
        new B();
    }
}
```

✅ **Answer:**

```
A()
B()
```

---

## Final Rule of Thumb

> Use `this()` to **reuse constructors within the same class**,
> Use `super()` to **ensure the parent class is properly initialized**.
