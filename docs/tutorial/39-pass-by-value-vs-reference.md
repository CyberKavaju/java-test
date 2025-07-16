# 39. Pass by Value vs Pass by Reference

**Related:** [38. Method Overriding](38-method-overriding.md) | [40. Virtual vs Non-Virtual Methods](40-virtual-vs-non-virtual-methods.md)

---

## 🧠 Short Answer

> ✅ **Java is always pass-by-value** — even for objects.
> BUT for **objects**, the "value" that's passed is a **copy of the reference**.

This causes **a lot of confusion**, so let's walk through it carefully.

---

## 📦 What is "Pass-by-Value"?

- Java **passes a copy** of the variable to methods.
- If you change the **parameter inside the method**, it **does NOT change the original** variable (unless it's a reference pointing to a mutable object).

---

## 🔢 Example 1: Primitive Type (like `int`)

```java
public class Test {
    public static void update(int x) {
        x = 99;
    }

    public static void main(String[] args) {
        int a = 10;
        update(a);
        System.out.println(a); // Output: 10 ✅
    }
}
```

➡️ `x` is a copy of `a`, so updating `x` doesn't affect `a`.

---

## 🧪 Example 2: Object Reference

```java
class Dog {
    String name;
}

public class Test {
    public static void rename(Dog d) {
        d.name = "Buddy"; // changes the actual object
    }

    public static void main(String[] args) {
        Dog myDog = new Dog();
        myDog.name = "Rex";
        rename(myDog);
        System.out.println(myDog.name); // Output: Buddy ✅
    }
}
```

➡️ You passed a **copy of the reference**, but **both references point to the same object**, so internal changes are reflected.

---

## ❌ Example 3: Reassigning the Reference

```java
public class Test {
    public static void changeRef(Dog d) {
        d = new Dog();         // new object created
        d.name = "Max";        // change only applies to local ref
    }

    public static void main(String[] args) {
        Dog myDog = new Dog();
        myDog.name = "Rex";
        changeRef(myDog);
        System.out.println(myDog.name); // Output: Rex ❌
    }
}
```

➡️ `d = new Dog()` only changes the **local copy of the reference**, **not** the original one.

📌 Java does **not** pass the reference itself — it passes a **copy of the reference**.

---

## ⚠️ Java is NOT Pass-by-Reference

Languages like C++ allow actual **pass-by-reference**, where you can truly change the caller's variable.
Java **does not** allow this.

---

## ✅ Java's Behavior Summary

| Data Type                 | Is It Pass-by-Value?   | Can It Be Mutated?  | Can It Be Reassigned?       |
| ------------------------- | ---------------------- | ------------------- | --------------------------- |
| `int`, `double`, etc. | ✅ Yes                 | ❌ No (copy only)   | ❌ No (copy only)           |
| `String`                | ✅ Yes (Immutable)     | ❌ No               | ❌ No                       |
| Object (e.g.,`Dog`)     | ✅ Yes (ref is copied) | ✅ Yes (via fields) | ❌ No (ref itself is local) |

---

## 🧠 Visual Analogy

### Original:

```java
Dog myDog = new Dog(); // Let's say ref = #100
```

### Inside method:

```java
public void doSomething(Dog d) {
    // d is a copy of reference #100
}
```

Both `myDog` and `d` point to the same object initially.
If you **change fields**, it shows up outside.
If you **assign `d = new Dog()`**, it only changes the **local copy** of the reference.

---

## ⚠️ OCA Pitfalls

### ❗ Confusing "changing the object" vs "changing the reference"

```java
void updateList(List<String> list) {
    list.add("new");      // ✅ modifies the object
    list = new ArrayList<>(); // ❌ only changes local reference
    list.add("another");  // not visible outside
}
```

### ❗ Thinking objects are passed by reference — **they're not**

```java
void test(String s) {
    s = "Hi"; // ✅ doesn't change the original String
}
```

➡️ Strings are immutable and passed by value — this does **not** affect the original string.

---

## 🧪 Final Code Examples

### ✅ Modifies object fields:

```java
void modify(Car c) {
    c.model = "Toyota";
}
```

### ❌ Doesn't modify original object reference:

```java
void reset(Car c) {
    c = new Car(); // creates new Car locally
}
```

---

## ✅ Summary: Golden Rule

> ✅ Java is **pass-by-value**, but for **objects**, the value is a **copy of the reference**.

You **can change object contents**,
but **you cannot reassign the reference** to affect the caller's original variable.

---

## 📌 Quick Quiz

### Q: What will this print?

```java
public class Test {
    public static void change(String s) {
        s = "changed";
    }

    public static void main(String[] args) {
        String s = "original";
        change(s);
        System.out.println(s);
    }
}
```

**Answer:** `original` — because `s` is passed by value, and Strings are immutable.

---

## 🎯 OCA Exam Tips

1. **Remember**: Java is **always pass-by-value**, never pass-by-reference
2. **Object parameters**: You get a copy of the reference, not the reference itself
3. **Primitive parameters**: You get a copy of the value
4. **String parameters**: Immutable, so changes create new objects
5. **Arrays and Collections**: Can modify contents, but not reassign the reference

---
## Video Tutorials
- [Java is ALWAYS Pass By Value. Here's Why - Coding with John](https://www.youtube.com/watch?v=-5NC5_sI-vQ)
## Related Topics

- [38. Method Overriding](38-method-overriding.md) - Method replacement in inheritance
- [40. Virtual vs Non-Virtual Methods](40-virtual-vs-non-virtual-methods.md) - Method resolution
- [32. Methods](32-methods.md) - Method fundamentals
- [30. Getters and Setters](30-getters-and-setters.md) - Accessor methods
