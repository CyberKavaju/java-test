# Set Object

## 🔍 What is a `Set`?

> A **`Set`** is a **collection** that **cannot contain duplicate elements**.

It models a **mathematical set** — where each element is **unique** and **unordered** (unless using sorted/linked implementations).

---

## 📌 Key Characteristics

| Feature            | Value                                         |
| ------------------ | --------------------------------------------- |
| Allows duplicates? | ❌ No                                         |
| Allows null?       | ✅ Yes (only once, depends on implementation) |
| Preserves order?   | ❌ Not always                                 |
| Is part of?        | Java Collections Framework                    |
| Interface type?    | `Set<E>` (generic)                          |
| Extends?           | `Collection<E>`                             |

---

## ✅ Common Implementations of `Set`

| Type              | Preserves Order?           | Sorted? | Thread-Safe? | Notes                                 |
| ----------------- | -------------------------- | ------- | ------------ | ------------------------------------- |
| `HashSet`       | ❌ No                      | ❌ No   | ❌ No        | Fast, unordered, most common          |
| `LinkedHashSet` | ✅ Yes (insertion order)   | ❌ No   | ❌ No        | Maintains order of insertion          |
| `TreeSet`       | ❌ No (natural sort order) | ✅ Yes  | ❌ No        | Uses `Comparable` or `Comparator` |

---

## 🧪 Example: `HashSet`

```java
import java.util.HashSet;

Set<String> set = new HashSet<>();
set.add("apple");
set.add("banana");
set.add("apple"); // duplicate, will be ignored

System.out.println(set); // Output: [apple, banana]
```

---

## 🧪 Example: `TreeSet` (Sorted)

```java
import java.util.TreeSet;

Set<Integer> numbers = new TreeSet<>();
numbers.add(5);
numbers.add(1);
numbers.add(3);

System.out.println(numbers); // Output: [1, 3, 5] (sorted)
```

---

## 🧪 Example: `LinkedHashSet` (Ordered)

```java
import java.util.LinkedHashSet;

Set<String> set = new LinkedHashSet<>();
set.add("Z");
set.add("A");
set.add("B");

System.out.println(set); // Output: [Z, A, B] (insertion order)
```

---

## ✅ Useful Methods in Set

| Method                 | Description                               |
| ---------------------- | ----------------------------------------- |
| `add(E e)`           | Adds element (returns false if duplicate) |
| `remove(Object o)`   | Removes the specified element             |
| `contains(Object o)` | Checks if element is present              |
| `isEmpty()`          | Checks if the set is empty                |
| `size()`             | Returns number of elements                |
| `clear()`            | Removes all elements                      |
| `iterator()`         | Iterates over the set                     |

---

## ❗ Common OCA Pitfalls

### 1️⃣ Duplicates are silently ignored

```java
Set<String> s = new HashSet<>();
s.add("X");
s.add("X"); // no error, but set still has only one "X"
```

---

### 2️⃣ No index-based access

```java
Set<String> s = new HashSet<>();
// s.get(0); // ❌ Compile error — no indexed access
```

---

### 3️⃣ `null` is allowed once in `HashSet`, but **not at all in `TreeSet`** (unless you use a custom Comparator)

```java
Set<String> set = new HashSet<>();
set.add(null); // ✅ allowed

Set<String> treeSet = new TreeSet<>();
treeSet.add(null); // ❌ NullPointerException
```

---

### 4️⃣ Order is not guaranteed (unless using `LinkedHashSet`)

```java
Set<String> set = new HashSet<>();
set.add("A");
set.add("B");
set.add("C");
// output order may vary
```

---

## ✅ When Should You Use a Set?

* You need **unique** elements only (e.g., usernames, IDs)
* You don't care about order → use `HashSet`
* You want to **preserve insertion order** → use `LinkedHashSet`
* You want **sorted elements** → use `TreeSet`

---

## 🔁 Set vs List vs Map

| Feature            | `Set`              | `List`        | `Map`                      |
| ------------------ | -------------------- | --------------- | ---------------------------- |
| Allows duplicates? | ❌ No                | ✅ Yes          | Keys ❌, Values ✅           |
| Maintains order?   | `LinkedHashSet` ✅ | ✅`ArrayList` | ✅`LinkedHashMap`, TreeMap |
| Access by index?   | ❌ No                | ✅ Yes          | ❌                           |

---

## 🧠 Final Rule of Thumb

> Use a `Set` when you need a **collection of unique elements**.
> Choose the right implementation depending on whether you care about **order**, **sorting**, or **performance**.
