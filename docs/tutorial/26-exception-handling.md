# `try-catch` Exception Handling

## 🔥 What is Exception Handling?

> Exception handling is Java's way of **detecting and managing errors** at runtime, allowing your program to **gracefully recover or report** instead of crashing.

You use:

* `try` to attempt code that might fail
* `catch` to handle failures
* `finally` to clean up resources
* `throw` to signal an exception
* `throws` to declare exceptions a method might throw

---

## 🔷 1. The `try-catch` Block

### 🔧 Syntax:

```java
try {
    // code that might throw an exception
} catch (ExceptionType e) {
    // handle exception
}
```

### 🧪 Example:

```java
try {
    int result = 10 / 0;
} catch (ArithmeticException e) {
    System.out.println("Divide by zero error");
}
```

> ✔️ Prevents app from crashing
> ✔️ Handles the problem without breaking program flow

---

## 📦 Types of Exceptions: Checked vs Unchecked

### ✅ Checked Exceptions

* **Checked at compile time**
* Must be handled with **`try-catch`** or **declared with `throws`**
* Usually from **external resources** (files, DB, network)

| Example Classes           |
| ------------------------- |
| `IOException`           |
| `FileNotFoundException` |
| `SQLException`          |

🧪 Example:

```java
try {
    FileReader fr = new FileReader("file.txt");
} catch (FileNotFoundException e) {
    System.out.println("File missing!");
}
```

---

### ❌ Unchecked Exceptions (Runtime Exceptions)

* **Not required** to handle at compile time
* Usually due to **logic/programming errors**
* Inherit from `RuntimeException`

| Example Classes                    |
| ---------------------------------- |
| `NullPointerException`           |
| `ArithmeticException`            |
| `ArrayIndexOutOfBoundsException` |
| `IllegalArgumentException`       |

🧪 Example:

```java
String s = null;
System.out.println(s.length()); // ❌ NullPointerException
```

---

## 🧩 2. `finally` — The Always-Execute Block

> The `finally` block always runs, **whether or not an exception occurs or is caught**.

### 🔧 Syntax:

```java
try {
    // risky code
} catch (Exception e) {
    // handle exception
} finally {
    // always executes
}
```

### 💡 Use `finally` for:

* Closing files
* Releasing DB connections
* Cleaning up memory, locks, sockets

🧪 Example:

```java
FileReader fr = null;
try {
    fr = new FileReader("data.txt");
    // process file
} catch (IOException e) {
    System.out.println("Error reading file");
} finally {
    if (fr != null) fr.close(); // ✅ guaranteed to run
}
```

---

## 🧨 3. `throw` — Manually Throwing an Exception

> Use `throw` to **create and send** an exception **yourself**.

### 🔧 Syntax:

```java
throw new ExceptionType("error message");
```

🧪 Example:

```java
public void setAge(int age) {
    if (age < 0) {
        throw new IllegalArgumentException("Age cannot be negative");
    }
    this.age = age;
}
```

---

## 📣 4. `throws` — Declaring Exceptions in Method Signatures

> Use `throws` in the method declaration to **tell the compiler** that the method **might throw an exception**.

### 🔧 Syntax:

```java
public void readFile() throws IOException {
    FileReader fr = new FileReader("file.txt"); // must be handled
}
```

🧠 If your method calls another method that throws a checked exception, and you **don't want to handle it**, you **must declare it** with `throws`.

---

## ⚖️ `throw` vs `throws`

| Keyword    | Purpose                                                         |
| ---------- | --------------------------------------------------------------- |
| `throw`  | Used to**actually throw** an exception                    |
| `throws` | Used to**declare** that a method might throw an exception |

🧪 Example:

```java
public void validate(int age) throws IllegalArgumentException {
    if (age < 0) {
        throw new IllegalArgumentException("Age can't be negative");
    }
}
```

---

## Why we use `throw`?

We use `throw` to **manually signal an error** when input or state violates a method's contract. It helps enforce rules, protect against invalid data, and stop execution early in exceptional situations. This ensures **safe, predictable, and maintainable** code.

---

## Why we use `throws`?

We use `throws` in the method signature to **indicate** that the method **might throw an exception** and **let the caller handle it**. This helps the caller understand the potential errors and provides a **clear contract** to the caller.

---

## 🔄 Flow of Execution with `try-catch-finally`

```java
try {
    // Code A
} catch (Exception e) {
    // Code B
} finally {
    // Code C
}
```

| Path        | Description                                                 |
| ----------- | ----------------------------------------------------------- |
| A → C       | if no exception occurs                                      |
| A → B → C   | if an exception occurs and is caught                        |
| A → C       | if exception occurs and is NOT caught (finally still runs!) |

---

## ⚠️ OCA Pitfalls to Know

### ❗ Only classes that extend `Throwable` can be caught or thrown

```java
catch (int x) {} // ❌ illegal
```

---

### ❗ Catch blocks must go from **specific → general**

```java
try {} 
catch (Exception e) {} 
catch (IOException e) {} // ❌ unreachable, IOException is subclass of Exception
```

✅ Fix:

```java
try {} 
catch (IOException e) {} 
catch (Exception e) {} // ✅ general last
```

---

### ❗ `finally` block **always runs**, even after `return` or `break`

```java
try {
    return;
} finally {
    System.out.println("Still runs!");
}
```

✅ Output: `"Still runs!"`

---

## ✅ Summary Table

| Keyword     | Role                                   | Notes                                        |
| ----------- | -------------------------------------- | -------------------------------------------- |
| `try`     | Defines risky code                     | Must be followed by `catch` or `finally` |
| `catch`   | Handles exception                      | Must catch Throwable types                   |
| `finally` | Always runs                            | Even with return/exception                   |
| `throw`   | Sends a specific exception             | e.g.`throw new IllegalArgumentException()` |
| `throws`  | Declares possible exceptions in method | Only needed for checked exceptions           |

---

## 🧪 Quick Quiz

### Q: What's the output?

```java
public static void main(String[] args) {
    try {
        int a = 10 / 0;
    } catch (ArithmeticException e) {
        System.out.println("Caught!");
    } finally {
        System.out.println("Cleanup!");
    }
}
```

✅ Output:

```
Caught!
Cleanup!
```

---

## Note:

You should only throw exceptions in exceptional situations — not for normal control flow.
You want to catch exceptions not errors.

Bad idea:
```java
try {
    // loop until exception breaks it ❌
} catch (Exception e) {
    // don't do this
}
```

---

## 🎯 Final Rule of Thumb

> Use exception handling to make your program **resilient**, **predictable**, and **safe** under unexpected conditions.

* ✅ Use `try-catch` for **expected recoverable errors**
* ✅ Use `finally` for **cleanup**
* ✅ Use `throw` to **manually trigger** exceptions
* ✅ Use `throws` to **delegate handling to the caller**

---

## Exception Hierarchy

```
java.lang.Object
  └── java.lang.Throwable
        ├── Error           ← serious problems, don't catch
        └── Exception
              ├── RuntimeException  ← unchecked (optional to handle)
              └── (others)          ← checked (must handle or declare)
```

---

### ✅ Common **Checked Exceptions** (must handle or declare)

| Exception                | Scenario                     |
| ------------------------ | ---------------------------- |
| `IOException`            | File not found, read failure |
| `SQLException`           | DB connection/query issue    |
| `ClassNotFoundException` | Missing class at runtime     |

---

### ✅ Common **Unchecked Exceptions** (Runtime)

| Exception                        | Scenario                        |
| -------------------------------- | ------------------------------- |
| `NullPointerException`           | Calling method on `null` object |
| `ArrayIndexOutOfBoundsException` | Accessing invalid array index   |
| `IllegalArgumentException`       | Invalid method parameter        |
| `ArithmeticException`            | Divide by zero                  |

---

## 🪤 Catch Order Matters!

### ❗ Catch from **specific → general**

Java checks catch blocks **top-down**, so you must put **more specific exceptions first**.

### ❌ Wrong (won't compile):

```java
try {
    // code
} catch (Exception e) {
    // general first
} catch (IOException e) {
    // ❌ unreachable — compiler error
}
```

### ✅ Correct:

```java
try {
    // code
} catch (IOException e) {
    // specific
} catch (Exception e) {
    // general last
}
```

---

## 🔢 How Many `catch` Blocks Can You Have?

> As many as you want — **one per exception type** (or multi-catch)

### Example with multiple `catch`:

```java
try {
    // risky code
} catch (FileNotFoundException e) {
    System.out.println("File not found!");
} catch (IOException e) {
    System.out.println("IO error!");
} catch (Exception e) {
    System.out.println("Generic error!");
}
```

---

## 🎯 Multi-Catch (Java 7+)

```java
try {
    // code
} catch (IOException | SQLException e) {
    // handle both
}
```

### 🚫 But: the exception variable `e` is **implicitly final**

You can't assign a new value to `e` inside the block.

---

## ✅ Summary

| Concept                | Rule                                                          |
| ---------------------- | ------------------------------------------------------------- |
| Hierarchy Root         | `Throwable`                                                   |
| Handle vs Declare      | Checked = must handle or declare, unchecked = optional        |
| Catch order            | From **most specific to most general**                        |
| Multiple catch blocks  | ✅ Yes, no limit                                              |
| Multi-catch allowed?   | ✅ Yes, use `\|` between exception types                      |
| Can you catch `Error`? | 🚫 Technically yes, but should not (e.g., `OutOfMemoryError`) |
