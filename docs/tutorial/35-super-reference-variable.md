# `super` Reference Variable

> **`super` is a keyword that refers to the parent (superclass) of the current object.**

Think of it as:

> 🔁 "Hey Java, go up the inheritance chain and grab that method or field from the parent class."

---

## ✅ What Can You Do with `super`?

| Use Case                      | Example            | Why?                                                                      |
| ----------------------------- | ------------------ | ------------------------------------------------------------------------- |
| Call a superclass method      | `super.method()` | When you**override** it and still want to call the parent's version |
| Access a superclass field     | `super.field`    | If the subclass**hides** a field with the same name                 |
| Call a superclass constructor | `super(args)`    | To ensure**parent class is properly initialized**                   |

---

## 🧪 1. **Using `super` to Access Superclass Fields and Methods**

```java
class Animal {
    String name = "Generic Animal";

    void speak() {
        System.out.println("Animal speaks");
    }
}

class Dog extends Animal {
    String name = "Dog";

    void speak() {
        System.out.println("Dog barks");
        super.speak(); // 🔁 calls Animal's speak()
        System.out.println(super.name); // 🔁 accesses Animal's name
    }
}
```

### Output:

```
Dog barks
Animal speaks
Generic Animal
```

---

## ⚙️ 2. **Calling Superclass Constructor with `super()`**

```java
class Animal {
    Animal(String type) {
        System.out.println("Animal type: " + type);
    }
}

class Cat extends Animal {
    Cat() {
        super("Cat"); // 🔁 calls Animal(String)
        System.out.println("Cat created");
    }
}
```

### Output:

```
Animal type: Cat
Cat created
```

✔️ You **must use `super()`** if your superclass doesn't have a **no-arg constructor**.

---

## 📌 Important Notes on `super`

| Rule                                              | Example                                          |
| ------------------------------------------------- | ------------------------------------------------ |
| Must be**first line** in constructor        | `super(...);` ✅                               |
| Can only be used**in subclass**             | Not allowed in top-level class                   |
| Can call**only one superclass constructor** | No chaining like `super(), this()` together ❌ |
| Fields and methods must be**accessible**    | `protected` or `public` only                 |

---

## ❗ Use `super` when...

1. You **override a method**, but still want to call the **parent's version**
2. You **shadow a field** and need to access the one in the parent
3. You **must call a non-default superclass constructor**

---

## 🔁 `super` vs `this` — What's the Difference?

| Keyword   | Refers to...                  | Common Uses                                         |
| --------- | ----------------------------- | --------------------------------------------------- |
| `this`  | The current object (yourself) | Disambiguate fields, call same-class constructor    |
| `super` | The parent class              | Call parent constructor, access parent method/field |

---

## ⚠️ OCA Pitfalls

### ❗ Cannot use `super()` after other statements in constructor

```java
class A {
    A(String msg) {}
}

class B extends A {
    B() {
        System.out.println("Init"); // ❌ illegal
        super("Hello");
    }
}
```

✅ Fix:

```java
B() {
    super("Hello"); // ✅ must be first
    System.out.println("Init");
}
```

---

### ❗ Private methods are not inherited, so `super.somePrivateMethod()` ❌ won't work

---

## ✅ Summary Table

| Feature                     | `super` keyword                             |
| --------------------------- | --------------------------------------------- |
| Calls superclass method     | `super.methodName()`                        |
| Access superclass field     | `super.fieldName`                           |
| Call superclass constructor | `super(arguments)` (first line only)        |
| Useful for                  | Inheritance, overriding, constructor chaining |

---

## 🧪 Quick Quiz

### Q: What's the output?

```java
class A {
    void greet() {
        System.out.println("Hello from A");
    }
}

class B extends A {
    void greet() {
        super.greet();
        System.out.println("Hello from B");
    }
}

public class Test {
    public static void main(String[] args) {
        new B().greet();
    }
}
```

✅ **Answer:**

```
Hello from A
Hello from B
```

---

## Final Rule of Thumb

> Use `super` when you want to **access something from the parent class** — a constructor, field, or method — especially when it's been **overridden or shadowed** in the child class.
