# The `enum` field

---

## ✅ What is an `enum` in Java?

> `enum` (short for **enumeration**) is a **special data type** that represents a **fixed set of constants**.

```java
enum Day {
    MONDAY, TUESDAY, WEDNESDAY
}
```

Each constant (e.g. `MONDAY`) is actually an instance of the `enum` type: `Day`.

---

## 🧠 What is an `enum field`?

> An **enum field** is like any other class field — it **stores data** associated with each enum constant.

## ✅ Why use fields in enums?

To attach **custom values** or behavior to each constant.

---

## 🔧 Defining Fields in Enums

```java
enum Level {
    LOW(1), MEDIUM(2), HIGH(3);

    private int priority; // 👈 enum field

    // constructor
    Level(int priority) {
        this.priority = priority;
    }

    // getter method
    public int getPriority() {
        return priority;
    }
}
```

### ✅ Usage:

```java
System.out.println(Level.HIGH.getPriority()); // Output: 3
```

---

## 📌 Key Rules of Enum Fields

| Rule                                            | Explanation                                               |
| ----------------------------------------------- | --------------------------------------------------------- |
| Fields can be `private`, `final`, etc.      | Same as in normal classes                                 |
| Must be initialized via constructor             | Just like regular class fields                            |
| Enum constructor is**implicitly private** | You cannot call it from outside                           |
| You**can override methods** per constant  | But you must use `;` to separate the list from the body |

---

## 🧪 Example: Enum with Fields and Methods

```java
enum Planet {
    EARTH(5.97), MARS(0.64), JUPITER(1898);

    private double mass;

    Planet(double mass) {
        this.mass = mass;
    }

    public double getMass() {
        return mass;
    }
}
```

```java
System.out.println(Planet.EARTH.getMass()); // 5.97
```

---

## 🧠 Advanced: Enum with Behavior (Override per Constant)

```java
enum Operation {
    ADD {
        public int apply(int x, int y) {
            return x + y;
        }
    },
    MULTIPLY {
        public int apply(int x, int y) {
            return x * y;
        }
    };

    public abstract int apply(int x, int y);
}
```

```java
int result = Operation.ADD.apply(3, 4); // 7
```

---

## ⚠️ OCA Pitfalls

### ❗ Enum constructors must be `private` or package-private (default)

```java
enum Test {
    A(1);
    private Test(int x) {} // ✅ OK
}
```

### ❗ If you add methods or fields, **you must use `;`** after constants

```java
enum Status {
    ACTIVE, INACTIVE; // 👈 don't forget the semicolon!

    void print() {
        System.out.println(this);
    }
}
```

---

## Summary Table

| Feature               | Supported in Enum? | Notes                                      |
| --------------------- | ------------------ | ------------------------------------------ |
| Fields                | ✔️ Yes           | Must be initialized via constructor        |
| Constructor           | ✔️ Yes           | Must be `private` or default             |
| Methods               | ✔️ Yes           | Can add common or override per constant    |
| Multiple constructors | ✔️ Yes           | Must match constant usage                  |
| Inheritance           | ❌ No extends      | Enums implicitly extend `java.lang.Enum` |

---

## Final Rule of Thumb

> Enums can have fields and methods just like classes.
> Use them to **associate metadata** with each constant and **encapsulate logic** per enum value.
