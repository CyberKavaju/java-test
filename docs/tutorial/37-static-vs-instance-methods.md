# Static Methods vs Instance Methods

## 📌 At a Glance

| Feature                     | **Static Method** | **Instance Method**     |
| --------------------------- | ----------------------- | ----------------------------- |
| Belongs to                  | **Class**         | **Object (instance)**   |
| Needs object to call?       | ❌ No                   | ✅ Yes                        |
| Can access instance fields? | ❌ No                   | ✅ Yes                        |
| Syntax to call              | `ClassName.method()`  | `object.method()`           |
| Use case                    | Shared utility logic    | Behavior tied to object state |

---

## ✅ Static Method – What & When

A **static method** is **shared across all objects** of the class. It belongs to the **class itself**, not any one object.

### 🔹 Declaration:

```java
public static void greet() {
    System.out.println("Hello from static method");
}
```

### 🔹 Usage:

```java
MyClass.greet(); // ✔️ Called using class name
```

---

### ✅ When to Use Static Methods

✔️ The method **does not depend on instance state** (i.e., doesn't use instance variables)

Examples:

- Utility methods (e.g. `Math.abs()`, `Arrays.sort()`)
- Factory methods (`valueOf()`)
- Main method (`public static void main(String[] args)`)

---

## 🟡 Instance Method – What & When

An **instance method** operates on a **specific object**, and it **can access instance fields** (data specific to that object).

### 🔹 Declaration:

```java
public class Person {
    String name;

    public void sayHello() {
        System.out.println("Hi, I'm " + name);
    }
}
```

### 🔹 Usage:

```java
Person p = new Person();
p.name = "Alice";
p.sayHello(); // Output: Hi, I'm Alice
```

---

### ✅ When to Use Instance Methods

✔️ The method **needs to access or modify instance variables**

Examples:

- Business logic tied to the object
- Getters and setters
- Object-specific behaviors (`car.drive()`, `user.login()`)

---

## ❗ Big Differences in Access

### ❌ Static methods **can't access** instance members directly:

```java
public class Demo {
    int x = 5;

    public static void printX() {
        System.out.println(x); // ❌ Compile error!
    }
}
```

To fix:

```java
public static void printX() {
    Demo d = new Demo();
    System.out.println(d.x); // ✅
}
```

---

## ⚠️ OCA Pitfalls

### ❗ You **can't call an instance method from a static method** without an object:

```java
public class Test {
    public void sayHi() {
        System.out.println("Hi");
    }

    public static void main(String[] args) {
        sayHi(); // ❌ Error: non-static method cannot be referenced
    }
}
```

✅ Fix:

```java
Test t = new Test();
t.sayHi();
```

---

### ❗ You **can** call static methods from instance methods:

```java
public class Test {
    public static void greet() {
        System.out.println("Hello");
    }

    public void callGreet() {
        greet(); // ✅ this works
    }
}
```

---

## 🧪 Example in Action

```java
public class MathUtil {

    // static method
    public static int square(int x) {
        return x * x;
    }

    // instance method
    public int multiply(int a, int b) {
        return a * b;
    }
}
```

### Usage:

```java
int result1 = MathUtil.square(5);          // ✅ static: no object needed
MathUtil util = new MathUtil();
int result2 = util.multiply(2, 3);         // ✅ instance: needs object
```

---

## ✅ Summary Table

| Feature                      | Static Method        | Instance Method          |
| ---------------------------- | -------------------- | ------------------------ |
| Belongs to                   | Class                | Object                   |
| Requires object to call?     | ❌ No                | ✅ Yes                   |
| Can access instance vars?    | ❌ No                | ✅ Yes                   |
| Can be called in `main()`? | ✔️ Yes             | ❌ Needs object          |
| Common use cases             | Utilities, factories | Business logic, behavior |

---

## Final Rule of Thumb:

> Use **`static`** when the method's logic is **not dependent on object data**
> Use **instance methods** when the method **relies on fields or behaviors of an object**
