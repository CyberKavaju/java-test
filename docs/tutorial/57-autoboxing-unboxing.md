# 57. Autoboxing and Unboxing

**Related:** [04. Variable](04-variable.md) | [05. Variable Casting and Conversions](05-variable-casting-and-conversions.md)

---

## 🚩 Why Do We Need Autoboxing and Unboxing?

- **Autoboxing** is needed because many Java APIs (like collections) only work with objects, not primitives. If you want to store an `int` in a `List`, Java must convert it to an `Integer` object automatically.
- **Unboxing** is needed when you retrieve a value from an object (like `Integer` from a `List<Integer>`) and want to use it in a primitive operation (math, logic, etc). Java automatically converts the object back to a primitive.

**In short:**
- Use autoboxing to put primitives into object-based APIs.
- Use unboxing to get primitives out of objects for calculations.

---

## 🧠 What is Autoboxing and Unboxing?

Autoboxing and unboxing are automatic conversions between primitive types and their corresponding wrapper classes in Java. Autoboxing converts primitives to wrapper objects, while unboxing converts wrapper objects back to primitives.

---

## 🔑 Simple Examples

### Autoboxing (Primitive → Wrapper)
```java
List<Integer> numbers = new ArrayList<>();
numbers.add(10); // int autoboxed to Integer
```

### Unboxing (Wrapper → Primitive)
```java
Integer wrapped = 20;
int value = wrapped; // Integer unboxed to int
int sum = value + 5; // can use in arithmetic
```

---

## ⚠️ Common Pitfalls

- Unboxing a null wrapper (e.g., `Integer x = null; int y = x;`) throws a `NullPointerException`.
- Use `.equals()` for comparing wrapper objects, not `==` (which checks reference equality).
- Autoboxing/unboxing in tight loops can hurt performance—prefer primitives for calculations.

---

## 📝 Summary

- Autoboxing lets you use primitives with object-based APIs (like collections).
- Unboxing lets you use wrapper objects in primitive operations.
- Be careful with nulls and performance.
