# Method Overloading

## ✅ **Method Overloading** means:

> Having **multiple methods with the same name** in the same class, but with **different parameter lists** (a.k.a. different method signatures).

---

## 📌 Why Use Method Overloading?

👉 To **perform similar operations** with **different kinds or numbers of inputs**.

🔧 It helps:

- Improve **readability** and **code reusability**
- Keep your method names **semantic** (descriptive of what they do)
- Allow **flexibility** with inputs

---

## ✅ Method Overloading Example

```java
public class Calculator {

    public int add(int a, int b) {
        return a + b;
    }

    public double add(double a, double b) {
        return a + b;
    }

    public int add(int a, int b, int c) {
        return a + b + c;
    }
}
```

You can call:

```java
Calculator calc = new Calculator();
calc.add(1, 2);         // calls first method
calc.add(1.5, 2.5);     // calls second method
calc.add(1, 2, 3);      // calls third method
```

✔️ All have the same name `add`, but the parameter list (signature) is different.

---

## 🧠 Rules for Method Overloading

| Rule                                 | Valid? |
| ------------------------------------ | ------ |
| Same method name                     | ✔️   |
| Different number of parameters       | ✔️   |
| Different parameter types            | ✔️   |
| Different order of parameters        | ✔️   |
| **Different return type only** | ❌     |

---

### ❌ INVALID Overload (return type doesn't matter alone)

```java
public int compute(int x) { return x; }
// Compile error: same signature, different return
public double compute(int x) { return (double) x; }
```

Java sees them as **the same method** → ❌ compile-time error.

---

## 🧪 Real-World Analogy

Think of a `print()` method:

```java
System.out.println(String x);
System.out.println(int x);
System.out.println(double x);
```

All are **overloaded versions** of the `println()` method from `PrintStream`.

---

## ⚠️ OCA Pitfalls

### ❗ Return type is **not** part of method signature

```java
void process(String x) {}
int process(String x) {} // ❌ compile error
```

### ❗ Watch out for auto-boxing and varargs

```java
void show(int x) {}
void show(Integer x) {} // Legal, but ambiguous with autoboxing

void show(int... x) {}   // Works, but lower priority than exact match
```

### ❗ Only **method name + parameter types** matter

Modifiers (`static`, `public`), parameter names, and return types **don't affect overloading**.

---

## 🧪 Overload with Different Parameter Order

```java
void greet(String name, int age) {}
void greet(int age, String name) {} // ✅ valid overload
```

---

## ✅ Summary Table

| Overload Type              | Valid? | Example                                              |
| -------------------------- | ------ | ---------------------------------------------------- |
| Different number of params | ✔️   | `add(int, int)` vs `add(int)`                    |
| Different types of params  | ✔️   | `add(int, int)` vs `add(double, double)`         |
| Different order of params  | ✔️   | `process(String, int)` vs `process(int, String)` |
| Only different return type | ❌     | `int print()` vs `void print()`                  |

---

## 🧠 Why You Should Use Overloading

- Cleaner, more intuitive method names
- Avoids unnecessary renaming (`addInt`, `addDouble`, `addThreeInts`)
- Provides **API flexibility** — Java libraries use this **everywhere**!
