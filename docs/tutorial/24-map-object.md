# Map Object

## ✅ What is a `Map`?

> A **Map** is an object that maps **keys to values**.
> It **cannot contain duplicate keys**, but **values can be duplicated**.

---

## 📦 Key Characteristics

| Feature                 | Description                                        |
| ----------------------- | -------------------------------------------------- |
| Key-Value structure     | Each key maps to**exactly one** value        |
| Unique keys             | ✅ Yes                                             |
| Duplicate values        | ✅ Yes                                             |
| Allows `null` keys?   | ✅ Once (in most implementations like `HashMap`) |
| Allows `null` values? | ✅ Yes                                             |

---

## ✅ Common Implementations of `Map`

| Type                  | Maintains Order?   | Thread-Safe?            | Allows `null`?                | Sorted? |
| --------------------- | ------------------ | ----------------------- | ------------------------------- | ------- |
| `HashMap`           | ❌ No              | ❌ No                   | ✅ 1 null key, many null values | ❌      |
| `LinkedHashMap`     | ✅ Insertion order | ❌ No                   | ✅                              | ❌      |
| `TreeMap`           | ✅ Sorted by key   | ❌ No                   | ❌ Null keys ❌                 | ✅      |
| `Hashtable`         | ❌ No              | ✅ Yes                  | ❌ No nulls allowed             | ❌      |
| `ConcurrentHashMap` | ❌ No              | ✅ Yes (concurrent use) | ❌ nulls disallowed             | ❌      |

---

## 🛠️ Creating a `Map`

```java
import java.util.*;

Map<String, Integer> ages = new HashMap<>();
ages.put("Alice", 30);
ages.put("Bob", 25);
ages.put("Alice", 35); // ✅ Replaces existing value for "Alice"

System.out.println(ages); // {Alice=35, Bob=25}
```

---

## 🧰 Useful Methods

| Method                      | Description                         |
| --------------------------- | ----------------------------------- |
| `put(K key, V value)`     | Adds/replaces a key-value pair      |
| `get(Object key)`         | Retrieves the value for a given key |
| `remove(Object key)`      | Removes a key and its value         |
| `containsKey(Object key)` | Checks if a key exists              |
| `containsValue(Object v)` | Checks if a value exists            |
| `keySet()`                | Returns a `Set` of keys           |
| `values()`                | Returns a `Collection` of values  |
| `entrySet()`              | Returns a `Set<Map.Entry<K, V>>`  |
| `size()`                  | Returns number of key-value pairs   |
| `clear()`                 | Removes all entries                 |
| `isEmpty()`               | Checks if the map is empty          |

---

## 🧪 Iterating a Map

### 🔹 Via `entrySet()`:

```java
for (Map.Entry<String, Integer> entry : ages.entrySet()) {
    System.out.println(entry.getKey() + " → " + entry.getValue());
}
```

### 🔹 Via `keySet()`:

```java
for (String key : ages.keySet()) {
    System.out.println(key + ": " + ages.get(key));
}
```

---

## ⚠️ OCA Pitfalls & Gotchas

### ❗ Keys must be **unique**

```java
map.put("X", 1);
map.put("X", 2); // ✅ Overwrites value
```

---

### ❗ `null` keys: allowed only in some implementations

| Map Type      | `null` Key Allowed?              | `null` Value Allowed? |
| ------------- | ---------------------------------- | ----------------------- |
| `HashMap`   | ✅ Yes (one)                       | ✅ Yes                  |
| `TreeMap`   | ❌ Throws `NullPointerException` | ✅ Yes                  |
| `Hashtable` | ❌ No                              | ❌ No                   |

---

### ❗ Order of entries is **not guaranteed** unless using `LinkedHashMap` or `TreeMap`

```java
Map<String, Integer> m = new HashMap<>();
m.put("A", 1);
m.put("B", 2);
m.put("C", 3);
System.out.println(m); // Order is arbitrary ❗
```

---

### ❗ `get()` returns `null` if key not found

```java
System.out.println(m.get("Z")); // null — not an error!
```

Be careful: `null` could mean **missing key** or **value is actually null**

---

## 📌 Example: `TreeMap` with Sorting

```java
Map<Integer, String> map = new TreeMap<>();
map.put(2, "B");
map.put(1, "A");
map.put(3, "C");

System.out.println(map); // Sorted by key: {1=A, 2=B, 3=C}
```

---

## 🔁 Map vs Set vs List

| Feature             | `Map`            | `Set` | `List` |
| ------------------- | ------------------ | ------- | -------- |
| Key-Value pairs     | ✅ Yes             | ❌      | ❌       |
| Allows duplicates   | Keys ❌, Values ✅ | ❌      | ✅       |
| Maintains order     | Depends on impl.   | Depends | ✅       |
| Access by key/index | ✅ key             | ❌      | ✅ index |

---

## 🧠 Summary Table

| Feature           | Map Behavior                                    |
| ----------------- | ----------------------------------------------- |
| Stores            | Key → Value pairs                              |
| Allows duplicates | ✅ Values only, ❌ Keys                         |
| Access            | Via `get(key)`                                |
| Common types      | `HashMap`, `TreeMap`, `LinkedHashMap`     |
| Null keys/values  | Varies by implementation                        |
| Ordered?          | ❌ Unless using `TreeMap` / `LinkedHashMap` |

---

## 🧪 Quick Quiz

### Q: What's the output?

```java
Map<String, Integer> map = new HashMap<>();
map.put("A", 1);
map.put("B", 2);
map.put("A", 3);
System.out.println(map.get("A"));
```

✅ **Answer:** `3` (value overwritten)

---

## 🎯 Final Rule of Thumb

> Use a `Map` when you need to **associate keys with values**, like a dictionary or lookup table.
> Choose the right implementation depending on whether you care about **ordering**, **null handling**, or **performance**.

## Video Tutorials

- [Map and HashMap in Java - Full Tutorial - Coding with John](https://www.youtube.com/watch?v=H62Jfv1DJlU)

