# 48. Abstraction

**Related:** [47. Polymorphism](47-polymorphism.md) | [42. Abstract Classes](42-abstract-classes.md)

---

## 🧠 What is Abstraction?

> **Abstraction** is the concept of **hiding the implementation details** and **showing only the essential features** of an object.

---

### 🔑 Simple Definition:

> **"What it does"** → ✅
> **"How it does it"** → ❌ hidden

It lets you **think at a higher level** and **reduce complexity** in your code.

---

## ✅ Real-Life Analogy

| Real World                                                                     | Java Equivalent                                             |
| ------------------------------------------------------------------------------ | ----------------------------------------------------------- |
| Car                                                                            | `drive()`                                                 |
| You press the accelerator — but you don't need to know how the engine works. | You call `car.drive()` — but the engine logic is hidden. |

---

## 📦 How Abstraction Works in Java

Java provides **two tools** for abstraction:

| Tool               | Purpose                            |
| ------------------ | ---------------------------------- |
| `abstract class` | Partial abstraction                |
| `interface`      | Full abstraction (prior to Java 8) |

---

## ✅ Abstraction with `abstract class`

### 🔹 Abstract class = A class that can **have abstract methods** (no body) and **concrete methods** (with implementation)

```java
abstract class Animal {
    abstract void makeSound();      // abstract method
    void breathe() {
        System.out.println("Breathing...");
    }
}
```

---

## ✅ Abstraction with `interface`

### 🔹 Interface = A **contract** that classes must implement

- All methods are **implicitly abstract** (unless marked `default` or `static` in Java 8+)

```java
interface Flyable {
    void fly(); // implicitly public abstract
}
```

---

## 🔄 Example in Practice

```java
abstract class Vehicle {
    abstract void start(); // abstract = no body
    void stop() {
        System.out.println("Stopping vehicle...");
    }
}

class Car extends Vehicle {
    void start() {
        System.out.println("Starting the car...");
    }
}
```

✔️ You focus on **what** the vehicle does (`start`, `stop`), not **how** each type implements it.

---

## ✅ Benefits of Abstraction

| Benefit                | Description                                      |
| ---------------------- | ------------------------------------------------ |
| Cleaner Code           | Hide internal implementation                     |
| Flexibility            | Change implementation without changing interface |
| Focus on What, Not How | Encourages top-down thinking                     |
| Contract Enforcement   | Force subclasses to implement critical behavior  |

---

## ⚠️ OCA Pitfalls

### ❗ You cannot instantiate an abstract class

```java
abstract class Animal {}
Animal a = new Animal(); // ❌ Compile error
```

---

### ❗ If a subclass doesn't implement all abstract methods, it must be abstract too

```java
abstract class Animal {
    abstract void speak();
}

class Dog extends Animal {} // ❌ Compile error
```

✅ Fix:

```java
class Dog extends Animal {
    void speak() {
        System.out.println("Bark!");
    }
}
```

---

### ❗ Abstract classes can have constructors

```java
abstract class Animal {
    Animal() {
        System.out.println("Animal created");
    }
}
```

✅ They're called during subclass instantiation.

---

## 📌 Summary Table

| Feature                    | `abstract class`   | `interface`                       |
| -------------------------- | -------------------- | ----------------------------------- |
| Can have abstract methods? | ✔️                 | ✔️ (implicit)                     |
| Can have concrete methods? | ✔️                 | ✔️ (via `default` / `static`) |
| Can have fields?           | ✔️                 | ✔️ (public static final only)     |
| Supports constructors?     | ✔️                 | ❌                                  |
| Multiple inheritance?      | ❌ Single class only | ✔️ Multiple interfaces            |

---

## 🧪 Quick Quiz

### Q: What will this code output?

```java
abstract class Animal {
    abstract void speak();
    void eat() { System.out.println("Eating..."); }
}

class Dog extends Animal {
    void speak() { System.out.println("Woof!"); }
}

public class Test {
    public static void main(String[] args) {
        Animal a = new Dog();
        a.speak();
        a.eat();
    }
}
```

**Output:**

```
Woof!
Eating...
```

---

## Final Rule of Thumb

> **Abstraction hides complexity.**
> Use **abstract classes** when you want to provide **base behavior + partial abstraction**, and **interfaces** when you want a **pure contract**.

---

## 🎯 OCA Exam Tips

1. **Abstraction hides implementation details** - focuses on what, not how
2. **Abstract classes provide partial abstraction** - mix of abstract and concrete methods
3. **Interfaces provide full abstraction** - pure contracts (pre-Java 8)
4. **Cannot instantiate abstract classes** - must use concrete subclasses
5. **Subclasses must implement all abstract methods** - or be abstract themselves
6. **Use abstraction for code flexibility** - easier to maintain and extend

---

## Levels of Abstraction

### 1. Data Abstraction
```java
public class BankAccount {
    private double balance; // Implementation hidden
    
    public void deposit(double amount) {
        // Complex validation logic hidden
        if (amount > 0) {
            balance += amount;
        }
    }
    
    public double getBalance() {
        return balance; // Simple interface
    }
}
```

### 2. Control Abstraction
```java
// User doesn't need to know sorting algorithm details
Collections.sort(list); // Implementation hidden

// High-level database operations
database.save(user); // Complex SQL hidden
```

### 3. Interface Abstraction
```java
interface PaymentProcessor {
    boolean processPayment(double amount);
}

// Implementation details hidden in concrete classes
class CreditCardProcessor implements PaymentProcessor {
    public boolean processPayment(double amount) {
        // Credit card specific logic
        return true;
    }
}

class PayPalProcessor implements PaymentProcessor {
    public boolean processPayment(double amount) {
        // PayPal specific logic
        return true;
    }
}
```

---

## Advanced Example

```java
// Abstract base class - partial abstraction
abstract class DatabaseConnection {
    protected String url;
    protected String username;
    
    public DatabaseConnection(String url, String username) {
        this.url = url;
        this.username = username;
    }
    
    // Abstract methods - must be implemented
    public abstract void connect();
    public abstract void disconnect();
    public abstract ResultSet executeQuery(String sql);
    
    // Concrete method - shared implementation
    public void logOperation(String operation) {
        System.out.println("Executing: " + operation + " on " + url);
    }
}

// Concrete implementation - full details hidden from client
class MySQLConnection extends DatabaseConnection {
    public MySQLConnection(String url, String username) {
        super(url, username);
    }
    
    @Override
    public void connect() {
        System.out.println("Connecting to MySQL at " + url);
        // Complex MySQL-specific connection logic hidden
    }
    
    @Override
    public void disconnect() {
        System.out.println("Disconnecting from MySQL");
        // MySQL-specific cleanup logic hidden
    }
    
    @Override
    public ResultSet executeQuery(String sql) {
        logOperation(sql);
        // MySQL-specific query execution hidden
        return null; // Simplified for example
    }
}

// Client code - uses abstraction, doesn't know implementation details
public class DatabaseClient {
    public void processData() {
        DatabaseConnection db = new MySQLConnection("localhost:3306", "user");
        db.connect();           // Client doesn't know HOW connection works
        db.executeQuery("SELECT * FROM users"); // Implementation hidden
        db.disconnect();        // Cleanup details hidden
    }
}
```

---

## Related Topics

- [47. Polymorphism](47-polymorphism.md) - Runtime behavior
- [42. Abstract Classes](42-abstract-classes.md) - Partial abstraction
- [44. Interfaces](44-interfaces.md) - Full abstraction
- [43. Abstract Methods](43-abstract-methods.md) - Method contracts
- [46. Inheritance](46-inheritance.md) - Code reuse
- [39. Encapsulation](39-encapsulation.md) - Data hiding
