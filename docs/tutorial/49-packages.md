# 📦 Java Packages – Extended Guide

**Related Topics:** [Classes and Objects](28-classes-and-objects.md) | [Encapsulation](39-encapsulation.md)

---

## 🧠 What are Packages?

Packages in Java are a way of organizing related classes and interfaces into a hierarchical folder-like structure. Think of packages as folders on your system – they help organize your code and avoid name conflicts.

**Real-world analogy:** You wouldn’t put all your documents in one folder – likewise, Java lets you structure code via packages like `java.util`, `java.io`, or `com.company.project`.

---

## 🧱 Basic Package Syntax

### Package Declaration

```java
package com.example.myproject;

public class MyClass {
    // class implementation
}
```

### Import Statements

```java
import java.util.ArrayList;
import java.util.List;
import java.io.*; // Import everything from java.io
```

---

## ✅ Naming Conventions

* Use **lowercase** only
* Use **reverse domain name** for uniqueness
* Avoid **reserved keywords**
* Do not use **hyphens**, **numbers at the start**, or **special characters**

Good:

```java
package com.google.gson;
package org.apache.commons;
```

Bad:

```java
package My-Project;
package 123company;
```

---

## 📚 Built-in Java Packages

| Package     | Purpose               | Example Classes                  |
| ----------- | --------------------- | -------------------------------- |
| `java.lang` | Language fundamentals | String, Object, System           |
| `java.util` | Utilities/collections | List, ArrayList, HashMap         |
| `java.io`   | Input/output          | File, FileReader, BufferedWriter |
| `java.net`  | Networking            | URL, Socket, HttpURLConnection   |
| `java.sql`  | Database connectivity | Connection, Statement            |

---

## 🧭 Creating Your Own Package (Step-by-Step)

### Step 1: Directory Structure

```
src/
└── com/
    └── example/
        └── myapp/
            ├── model/
            │   └── User.java
            ├── service/
            │   └── UserService.java
            └── Main.java
```

### Step 2: Declaring Packages in Each File

```java
// User.java
package com.example.myapp.model;

public class User {
    private String name, email;
    // constructor, getters
}
```

```java
// UserService.java
package com.example.myapp.service;

import com.example.myapp.model.User;

public class UserService {
    public void printUserInfo(User user) {
        System.out.println(user.getName());
    }
}
```

```java
// Main.java
package com.example.myapp;

import com.example.myapp.model.User;
import com.example.myapp.service.UserService;

public class Main {
    public static void main(String[] args) {
        User user = new User("Jane", "jane@mail.com");
        new UserService().printUserInfo(user);
    }
}
```

---

## 🔍 Import Techniques

```java
// Specific Imports
import java.util.List;
import java.util.ArrayList;

// Wildcard Import
import java.util.*;

// Static Import
import static java.lang.Math.PI;
```

### ❗ Important Rule:

> **Importing ********`java.util.*`******** DOES NOT import \*\*\*\*\*\*\*\*`java.util.concurrent.*`**
> Always import sub-packages explicitly.

---

## 🎯 Fully Qualified Names

To resolve naming clashes:

```java
java.util.Date utilDate = new java.util.Date();
java.sql.Date sqlDate = new java.sql.Date(System.currentTimeMillis());
```

---

## Why one should avoid Wildcard Imports

---

Wildcard imports (e.g., `import java.util.*;`) can seem convenient, but they come with significant downsides that can lead to confusion and maintenance challenges in larger codebases. Here’s why you should avoid them:

Although wildcard imports can save a few keystrokes, **they are not recommended in most professional Java codebases**—especially when writing public APIs or reusable libraries.

---

### ❌ 1. Unclear Dependencies

Wildcard imports hide **which classes** are actually being used:

```java
import java.util.*;

public class MyApi {
    public List<String> getNames() {
        return new ArrayList<>();
    }
}
```

* It’s not obvious which types (`List`, `ArrayList`, etc.) are being pulled in.
* Makes it harder to **read, audit, or debug** the code.

---

### ⚠️ 2. Namespace Collisions

Two packages may contain classes with the **same name**:

```java
import java.util.*;
import java.sql.*;

public class ConfusedCode {
    Date date; // java.util.Date or java.sql.Date? ❓
}
```

* Leads to **ambiguous references** and potential **compiler errors**
* Often forces you to use **fully qualified class names**, which defeats the purpose of importing

---

### 🧨 3. Uncontrolled API Surface

If your code is **exposed as a library**:

```java
import java.util.*;

public class ApiUtil {
    public static void print(Map<String, String> map) {
        System.out.println(map);
    }
}
```

* Future JDK versions might introduce **new classes in `java.util`** that clash with your own
* You may unintentionally expose more than you intended in your public API

---

### 🧱 4. Inconsistent IDE Behavior

Some IDEs (e.g., IntelliJ, Eclipse) **auto-collapse multiple imports into wildcards**, which can:

* Cause merge conflicts in version control
* Break readability for teammates using different IDE settings

---

### ❗ 5. Static Wildcard Imports Are Even Riskier

```java
import static java.lang.Math.*;

public class MathDemo {
    public double calc(double r) {
        return PI * pow(r, 2); // 🤷 Where do these come from?
    }
}
```

* Code becomes **opaque**—hard to tell which methods/constants are imported
* Makes maintenance and debugging more difficult

---

### ✅ Best Practice Summary

| ❌ Avoid                           | ✅ Use                              |
| --------------------------------- | ---------------------------------- |
| `import java.util.*;`             | `import java.util.List;`           |
| `import static java.lang.Math.*;` | `import static java.lang.Math.PI;` |

> Use **explicit imports** to ensure clarity, avoid ambiguity, and write stable, predictable code—especially in **shared, production, or public APIs**.
---
Great question! Static imports in Java are a **powerful but subtle tool**, and using them wisely can improve code **readability** and **conciseness** — or lead to **confusion**, if abused.

---

## 💡 What is a `static import`?

Static import lets you **access static members** (fields or methods) of a class **without qualifying them with the class name**.

### 🧪 Syntax:

```java
import static java.lang.Math.PI;
import static java.lang.Math.sqrt;
```

Now you can write:

```java
double area = PI * radius * radius;
double hypotenuse = sqrt(a*a + b*b);
```

Instead of:

```java
double area = Math.PI * radius * radius;
```

---

## ✅ When to Use Static Imports

### 1. **For Common Constants or Utility Methods**

Especially when they're used frequently and are **well-known**, like from `Math`, `TimeUnit`, or `ChronoUnit`.

```java
import static java.util.concurrent.TimeUnit.SECONDS;

System.out.println(SECONDS.toMillis(30));
```

---

### 2. **In Testing Frameworks (JUnit, AssertJ, etc.)**

Makes test code cleaner and more expressive:

```java
import static org.junit.jupiter.api.Assertions.*;

@Test
void testSomething() {
    assertEquals(42, result);
    assertTrue(flag);
}
```

✅ This is **one of the best and most common use cases**.

---

### 3. **For DSL-like Code**

In libraries or frameworks that are written to read fluently like a **Domain Specific Language** (DSL):

```java
import static java.nio.file.StandardOpenOption.*;

Files.write(path, data, CREATE, TRUNCATE_EXISTING);
```

✅ Looks cleaner and makes sense when the context is clear.

---

## 🚫 When to Avoid Static Imports

| Scenario                             | Why You Should Avoid                                              |
| ------------------------------------ | ----------------------------------------------------------------- |
| Too many static imports              | Reduces clarity; you don’t know where methods/constants come from |
| Common method names (`max`, `print`) | May clash with your own or other classes’ methods                 |
| Unfamiliar APIs                      | Reader might not recognize where methods/constants are defined    |
| In shared libraries or public APIs   | Can confuse consumers of your code                                |

---

## 👎 Bad Example: Overuse

```java
import static java.lang.Math.*;
import static java.util.Collections.*;

double d = sin(toRadians(45)); // 🤯 What class are these methods from?
```

Hard to tell what class each method belongs to unless you're very familiar with the imported classes.

---

## 🎯 Rule of Thumb

| Use static import if...                             | Avoid if...                                         |
| --------------------------------------------------- | --------------------------------------------------- |
| You're using constants/methods often                | You’re only using it once or twice                  |
| The static member is obvious (`PI`, `assertEquals`) | It could confuse the reader (`log`, `print`, etc.)  |
| You're writing tests or DSL-style APIs              | You're writing core logic meant to be very explicit |
---

## 👮 Access Control & Package Boundaries

### Package-private (default access):

```java
package com.example.util;

class Helper {
    void log() {}
}
```

```java
package com.example.main;

import com.example.util.Helper; // ❌ Compile error - Helper is not public

class App {
    public static void main(String[] args) {
        Helper h = new Helper(); // ❌ Cannot access package-private class
        h.log(); // ❌ Cannot access package-private method
    }
}
```

**To fix this, make Helper and its methods public:**

```java
package com.example.util;

public class Helper {  // ✅ Now public - accessible from other packages
    public void log() {  // ✅ Now public - accessible from other packages
        System.out.println("Logging...");
    }
}
```

```java
package com.example.main;

import com.example.util.Helper; // ✅ Now works - Helper is public

class App {
    public static void main(String[] args) {
        Helper h = new Helper(); // ✅ Works - public class
        h.log(); // ✅ Works - public method
    }
}
```

#### 🔍 Deep Explanation: Why This Happens

**Java's Package Security Model:**
Java treats packages like "security boundaries." By default, anything without an explicit access modifier is **package-private**, meaning it's only visible within its own package. This is Java's way of enforcing encapsulation at the package level.

**The Four Access Levels (from most restrictive to least):**

| Access Modifier | Same Class | Same Package | Subclass (any package) | Any Package |
|----------------|------------|--------------|----------------------|-------------|
| `private`      | ✅         | ❌           | ❌                   | ❌          |
| *(no modifier)* | ✅         | ✅           | ❌                   | ❌          |
| `protected`    | ✅         | ✅           | ✅                   | ❌          |
| `public`       | ✅         | ✅           | ✅                   | ✅          |

**Why the first example fails:**
1. `Helper` class has no access modifier → package-private
2. `log()` method has no access modifier → package-private  
3. `App` is in a different package (`com.example.main` vs `com.example.util`)
4. Java compiler blocks access → **Compilation error**

**Real-world analogy:** Think of packages like apartment buildings. Package-private is like "residents only" - only people living in the same building can access it. Public is like a "public library" - anyone from anywhere can enter.

**Key takeaway:** If you want to share code across packages, you MUST explicitly declare it `public`. Java doesn't assume you want cross-package access - you have to be intentional about it.

### Protected Access

```java
// com.example.parent
public class Parent {
    protected void test() {}
}

// com.example.child
public class Child extends Parent {
    public void use() {
        test();  // ✅ OK
    }
}
```

---

## ⚠️ Common Pitfalls

### 1. **Package must be first (before imports)**
**Why it's a pitfall:** The Java compiler requires the package declaration to be the very first non-comment statement in the file. Placing imports before the package declaration will result in a compilation error.

```java
// ❌ WRONG - This will cause a compile error
import java.util.List;
package com.example.myapp;  // Compile Error: package declaration must be first

public class MyClass { }
```

```java
// ✅ CORRECT
package com.example.myapp;
import java.util.List;

public class MyClass { }
```

### 2. **Only one package per file**
**Why it's a pitfall:** Java enforces a one-to-one relationship between files and packages. Each `.java` file can belong to exactly one package, and attempting to declare multiple packages will cause compilation errors.

```java
// ❌ WRONG - Multiple package declarations
package com.example.util;
package com.example.service;  // Compile Error

public class MyClass { }
```

```java
// ✅ CORRECT - One package per file
package com.example.util;

public class MyClass { }
```

### 3. **Import order matters for readability**
**Why it's a pitfall:** While Java doesn't enforce import order for compilation, inconsistent ordering makes code harder to read and maintain. Many IDEs and style guides have specific ordering conventions.

```java
// ❌ POOR PRACTICE - Random import order
import java.util.List;
import com.example.custom.Helper;
import java.io.File;
import java.util.ArrayList;
```

```java
// ✅ GOOD PRACTICE - Organized import order
import java.io.File;
import java.util.ArrayList;
import java.util.List;

import com.example.custom.Helper;
```

### 4. **Wildcard imports don't include sub-packages**
**Why it's a pitfall:** Many developers assume that `import java.util.*` will import everything under `java.util`, including sub-packages like `java.util.concurrent`. This leads to unexpected compilation errors.

```java
// ❌ WRONG ASSUMPTION
import java.util.*;

public class MyClass {
    // This will cause a compile error!
    private ExecutorService executor = Executors.newFixedThreadPool(5);
    //      ^-- Cannot resolve ExecutorService (it's in java.util.concurrent)
}
```

```java
// ✅ CORRECT - Import sub-packages explicitly
import java.util.*;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class MyClass {
    private ExecutorService executor = Executors.newFixedThreadPool(5);
}
```

### 5. **Access modifiers restrict visibility across packages**
**Why it's a pitfall:** Package-private (default) and protected access modifiers can create unexpected compilation errors when trying to access classes or members from different packages, especially for beginners who aren't familiar with Java's access control.

```java
// File: com/example/util/Helper.java
package com.example.util;

class Helper {  // package-private (default access)
    void doSomething() { }
}
```

```java
// File: com/example/main/App.java
package com.example.main;

import com.example.util.Helper;  // ❌ Compile Error: Helper is not public

public class App {
    public static void main(String[] args) {
        Helper h = new Helper();  // Cannot access package-private class
    }
}
```

```java
// ✅ CORRECT - Make Helper public
package com.example.util;

public class Helper {  // Now accessible from other packages
    public void doSomething() { }
}
```
---

## 💡 Package Sealing (JAR-level)

In `MANIFEST.MF`:

```
Sealed: true
```

This prevents mixing classes from different JARs into the same package — used in **security-sensitive** or **plugin-based** systems.

---

## 🧱 Java Modules (JPMS – Java 9+)

```java
// module-info.java
module com.example.myapp {
    requires java.sql;
    exports com.example.myapp.model;
}
```

* Introduced in Java 9
* Modules define which packages are **exposed** and which dependencies are **required**
* Improves **encapsulation**, startup time, and code structure

---

## 🧰 Build Tool Integration (Maven/Gradle)

Typical Maven structure:

```
src/
└── main/
    └── java/
        └── com/
            └── example/
                └── project/
```

* `groupId` typically maps to the base package name:

  ```xml
  <groupId>com.example</groupId>
  ```

---

## 🚫 Circular Package Dependencies

Avoid:

```
service -> util
util -> service  ❌
```

Instead, create a new abstraction layer or move shared logic into a dedicated **common** package.

---

## 🧪 Quiz Time

**Q1:** Does `import java.util.*;` include `java.util.concurrent`?

> ❌ No. Sub-packages must be imported separately.

**Q2:** Which modifier allows access to a member within the same package only?

> ✅ Package-private (default)

**Q3:** What's the error in this file?

```java
import java.util.List;
package com.example;  // ❌ Compile Error
```

> ❗ Package declaration must come **before all import statements**

---

## 📌 Best Practices (Expanded)

### Use reverse domain naming

This convention (like `com.company.project`) ensures global uniqueness of your packages. Since domain names are unique worldwide, using your organization's domain in reverse prevents naming conflicts when your code is used alongside libraries from other organizations. For example, both Google and Apache could have a "utils" package, but `com.google.utils` and `org.apache.utils` are clearly distinct.

### Limit nesting depth (3–4 levels max)

Deep package hierarchies become difficult to navigate and understand. Beyond 3-4 levels, developers spend more time figuring out where classes belong rather than focusing on the actual functionality. A structure like `com.company.project.module` is clear, while `com.company.project.domain.service.impl.util.helper` is overwhelming and suggests poor organization.

### Avoid wildcard imports for public APIs

Wildcard imports (import `java.util.*`) make it unclear which specific classes your code depends on, making the code harder to understand and maintain. They can also lead to naming conflicts when multiple packages contain classes with the same name. Explicit imports serve as documentation of your dependencies and make code more readable.

### Organize by functionality, not by type

Grouping related business logic together (like `com.company.billing` containing all billing-related classes) is more intuitive than organizing by technical type (like having separate controllers, services, models packages). Functional organization makes it easier to understand, modify, and test related features as a cohesive unit.

### Keep API and implementation packages separate

Separating public interfaces (like `com.company.api`) from their implementations (like `com.company.impl`) allows you to change internal implementation details without affecting client code. This supports the principle of programming to interfaces rather than concrete classes, making your code more flexible and maintainable.

### Avoid circular package references

Circular dependencies (Package A depends on Package B, which depends on Package A) create tight coupling and make code difficult to understand, test, and modify. They can also cause issues with compilation order and module loading. Breaking circular dependencies usually leads to better separation of concerns and cleaner architecture.

### Use module-info.java in modular apps

The Java Module System (introduced in Java 9) provides explicit control over which packages are exposed and which dependencies are required. This improves encapsulation by hiding internal implementation details, reduces the application's attack surface, and can improve startup performance by only loading required modules.

These practices collectively promote code that is more maintainable, understandable, and less prone to conflicts as your application grows in size and complexity.

---

## 📺 Learn More

* [Java Modules Overview – The Coding Zoo](https://www.youtube.com/watch?v=Bw5lq9lJDlQ&t=109s)
* [Java packages 📦 - Bro Code](https://www.youtube.com/watch?v=NZ7NfZD8T2Y)
* [How Java REALLY Works: Packages, Jars & Classpath - Bartek Spitza](https://www.youtube.com/watch?v=zJPFwGs4q9o)
* [Java Packages, Classes, and Methods - Neso Academy](https://www.youtube.com/watch?v=mgixJYEZ1Fk)
---
