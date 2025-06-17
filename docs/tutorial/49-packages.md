# 49. Packages

**Related:** [01. Main Characteristics of Java](01-main-characteristics-of-java.md) | [28. Classes and Objects](28-classes-and-objects.md)

---

## 🧠 What are Packages?

Packages in Java are a way of organizing related classes and interfaces into a hierarchical structure. Think of packages as folders on your computer that help organize files.

**Real-world analogy:** Just like you organize your documents into folders like "Work", "Personal", "Projects", Java packages organize classes into logical groups like `java.util`, `java.io`, `com.company.project`.

## 🧱 Basic Package Syntax

### Package Declaration
```java
package com.example.myproject;

public class MyClass {
    // class implementation
}
```

### Package Import
```java
import java.util.ArrayList;
import java.util.List;
import java.io.*; // Import all classes from java.io

public class Example {
    private List<String> names = new ArrayList<>();
}
```

## ✅ Package Naming Conventions

### Standard Naming Rules
- Use **lowercase letters** only
- Use **reverse domain name** (e.g., `com.company.project`)
- Separate words with **dots** (.)
- Avoid Java **reserved keywords**

```java
// Good package names
package com.oracle.database;
package org.apache.commons;
package edu.stanford.nlp;

// Bad package names  
package Com.Oracle.Database;  // Capital letters
package my-project;           // Hyphens not allowed
package 123company;           // Cannot start with numbers
```

## 🎯 Built-in Java Packages

### Core Packages
| Package | Purpose | Example Classes |
|---------|---------|-----------------|
| `java.lang` | Language fundamentals | String, Object, System |
| `java.util` | Utilities and collections | ArrayList, HashMap, Scanner |
| `java.io` | Input/Output operations | File, FileReader, BufferedWriter |
| `java.net` | Network programming | URL, Socket, HttpURLConnection |
| `java.sql` | Database connectivity | Connection, Statement, ResultSet |

### Auto-imported Package
```java
// java.lang is automatically imported
// No need to write: import java.lang.String;

public class Example {
    public static void main(String[] args) {  // String from java.lang
        System.out.println("Hello");          // System from java.lang
    }
}
```

## ✅ Creating Your Own Package

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

### Step 2: Package Declaration in Files

**User.java**
```java
package com.example.myapp.model;

public class User {
    private String name;
    private String email;
    
    // constructors, getters, setters
    public User(String name, String email) {
        this.name = name;
        this.email = email;
    }
    
    public String getName() { return name; }
    public String getEmail() { return email; }
}
```

**UserService.java**
```java
package com.example.myapp.service;

import com.example.myapp.model.User;  // Import from another package

public class UserService {
    public void printUserInfo(User user) {
        System.out.println("User: " + user.getName());
        System.out.println("Email: " + user.getEmail());
    }
}
```

**Main.java**
```java
package com.example.myapp;

import com.example.myapp.model.User;
import com.example.myapp.service.UserService;

public class Main {
    public static void main(String[] args) {
        User user = new User("John Doe", "john@example.com");
        UserService service = new UserService();
        service.printUserInfo(user);
    }
}
```

## 🧪 Import Statements

### Specific Imports (Recommended)
```java
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
```

### Wildcard Imports
```java
import java.util.*;  // Imports all public classes from java.util
```

### Static Imports
```java
import static java.lang.Math.PI;
import static java.lang.Math.sqrt;

public class MathExample {
    public static void main(String[] args) {
        double area = PI * 5 * 5;        // No need for Math.PI
        double hypotenuse = sqrt(25);    // No need for Math.sqrt()
    }
}
```

## 🔍 Fully Qualified Names

When classes have the same name in different packages:

```java
// Two Date classes exist
java.util.Date utilDate = new java.util.Date();
java.sql.Date sqlDate = new java.sql.Date(System.currentTimeMillis());

// Or use imports with aliases (not directly supported, but solved via full names)
import java.util.Date;  // This will be the default Date

public class Example {
    Date utilDate = new Date();                              // java.util.Date
    java.sql.Date sqlDate = new java.sql.Date(1234567890L); // Fully qualified
}
```

## 📌 Access Control with Packages

### Package-Private (Default Access)
```java
package com.example.app;

class PackagePrivateClass {  // No access modifier = package-private
    void packageMethod() {   // Package-private method
        System.out.println("Only accessible within the same package");
    }
}
```

### Protected Access
```java
package com.example.parent;

public class Parent {
    protected void protectedMethod() {  // Accessible to subclasses and same package
        System.out.println("Protected method");
    }
}
```

```java
package com.example.child;

import com.example.parent.Parent;

public class Child extends Parent {
    public void test() {
        protectedMethod();  // OK - subclass can access protected members
    }
}
```

## ⚠️ OCA Pitfalls

### 1. Package Declaration Must Be First
```java
// WRONG - package must be the very first line
import java.util.List;
package com.example;  // Compile error

public class Wrong { }
```

```java
// CORRECT
package com.example;
import java.util.List;

public class Correct { }
```

### 2. Only One Package Declaration Per File
```java
// WRONG - multiple package declarations
package com.example.one;
package com.example.two;  // Compile error

public class Wrong { }
```

### 3. Package Names Must Match Directory Structure
```java
// File location: src/com/example/Wrong.java
package com.different.path;  // WRONG - doesn't match directory

public class Wrong { }
```

### 4. Import Statements Order Matters for Readability
```java
// Good practice - organize imports
import java.io.*;
import java.util.*;

import javax.swing.*;

import com.company.project.*;
```

## 🧪 Quick Quiz

**Question 1:** What will happen with this code?
```java
package com.test;
import java.util.*;

public class Quiz {
    public static void main(String[] args) {
        List<String> list = new ArrayList<>();
        System.out.println(list.getClass().getName());
    }
}
```

<details>
<summary>Click for answer</summary>

**Answer:** It will print `java.util.ArrayList`

The code will compile and run successfully. Even though we used wildcard import `java.util.*`, the `List` and `ArrayList` are properly imported, and `getClass().getName()` returns the full class name including the package.

</details>

**Question 2:** Which access modifier allows access from the same package but not from subclasses in different packages?
- A) public
- B) private  
- C) protected
- D) package-private (default)

<details>
<summary>Click for answer</summary>

**Answer:** D) package-private (default)

Package-private (no access modifier) allows access from the same package only. Protected allows access from same package AND subclasses in different packages.

</details>

## 🎯 OCA Exam Tips

1. **Package statement must be first** (after comments)
2. **Only one package statement** per file
3. **Package names use dots**, not slashes
4. **java.lang is auto-imported** - no need to import String, Object, etc.
5. **Wildcard imports** don't import sub-packages
6. **Package-private is default access** when no modifier is specified

## 📚 Best Practices

1. **Use reverse domain naming**: `com.company.project`
2. **Keep packages focused**: Related classes together
3. **Avoid deep nesting**: Usually 3-4 levels maximum
4. **Use specific imports**: More readable than wildcards
5. **Organize by functionality**: Not by class type
6. **Follow naming conventions**: All lowercase, no special characters

## Related Topics

- [28. Classes and Objects](28-classes-and-objects.md) - Class fundamentals
- [30. Getters and Setters](30-getters-and-setters.md) - Access control methods
- [39. Encapsulation](39-encapsulation.md) - Data hiding and access control
- [48. Abstraction](48-abstraction.md) - Hiding implementation details

---

## video learn more

[Java Tutorials: What is Java Module? Java Project Structure with Modules in Java 9 - Shane Crouch - The Coding Zoo](https://www.youtube.com/watch?v=Bw5lq9lJDlQ&t=109s)
