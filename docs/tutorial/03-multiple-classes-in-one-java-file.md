# Multiple Classes in One `.java` File

---

## Rule 1: Only One **Public Class** Is Allowed

```java

public class MainClass {
    // must match the file name: MainClass.java
}

class Helper {
    // non-public class — totally fine
}

```

- ✔️ You can have multiple **non-public classes**
- ✔️ Only one class can be marked `public`
- ✔️ The **public class name must match the file name**

---

## Rule 2: All Classes Compile Together

If you compile the file:

```bash

javac MainClass.java

```

Java will compile **all classes** in the file, and generate:

```bash

MainClass.class
Helper.class

```

---

## Rule 3: Inner Classes Can Be Inside Other Classes

You can define **nested (inner)** classes as well:

```java

public class Outer {
    class Inner {
        void greet() {
            System.out.println("Hello from Inner");
        }
    }
}

```

---

## Rule 4: Classes Don't Have to Be Related

```java

class A {}
class B {}
class C {}

```

They can be completely unrelated. No inheritance or hierarchy required.

---

## ⚠️ Common Mistake (OCA Exam Pitfall)

```java

// File: MyApp.java // ❌ the file name is not the same as the public class
public class FirstClass {} // ✅ OK

public class SecondClass {} // ❌ Compile error — only one public class per file!

```

✅ Fix: remove `public` from one of the classes or split into two files and change the file name to the main public class.

---

## Final Rule of Thumb

> You **can** have multiple classes in one file,
> but only **one** can be `public`, and the file name **must match** that public class.
