# Map Object

## ✅ What is a `Map`?

> A **Map** is an object that maps **keys to values**.
> It **cannot contain duplicate keys**, but **values can be duplicated**.

Here's a concise explanation you can add to your tutorial:

---

### 💡 `Map` is an interface

In Java, `Map<K, V>` is an **interface** — it defines a **contract** for key-value data structures. It specifies **what operations** a map must support (like `put()`, `get()`, `remove()`, etc.), but **not how** they are implemented.

Classes like `HashMap`, `TreeMap`, `LinkedHashMap`, and `ConcurrentHashMap` are **concrete implementations** of the `Map` interface. They provide their **own behavior** for how data is stored, ordered, and accessed.

Think of it like this:

> `Map` is the **blueprint**, and `HashMap` (or others) are the **buildings** made from that blueprint — each with different features.

---

#### ✅ Example:

```java
Map<String, Integer> scores = new HashMap<>();
```

Here, you're using the `Map` interface type (good OOP practice), but assigning it to an instance of `HashMap`, which provides the actual functionality.

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

## 🧭 When and Why to Use Different `Map` Implementations in Java

Java provides multiple `Map` implementations, each with specific use cases. Understanding their strengths helps you choose the best one for performance, memory, ordering, or concurrency needs.

---

### 🌳 **Core Map Implementations**

| Map Type               | When to Use                                        | Why Choose It                                                                      |
| ---------------------- | -------------------------------------------------- | ---------------------------------------------------------------------------------- |
| 🔹 `HashMap`           | General-purpose, unordered map                     | ✅ Fastest `get/put` (O(1)) <br> ❌ No ordering guarantee <br> ✅ Allows one null key |
| 🔹 `LinkedHashMap`     | Need to preserve **insertion** or **access** order | 🧭 Predictable iteration order <br> ✅ Used in caching (e.g., LRU)                  |
| 🔹 `TreeMap`           | Need **sorted** keys                               | 🔡 Keeps keys sorted (natural or custom comparator) <br> ⚠️ Slower (O(log n))      |
| 🔹 `ConcurrentHashMap` | **Thread-safe** access in concurrent environments  | 🧵 Highly scalable concurrency <br> ❌ No null keys/values                          |
| 🔹 `Hashtable`         | Maintaining **legacy** code only                   | 🧓 Synchronized but outdated <br> ❌ No nulls <br> ❌ Avoid in modern code           |

---

### 🧪 **Specialized & Utility Map Implementations**

| Map Type                              | When to Use                                       | Why Choose It                                                                     |
| ------------------------------------- | ------------------------------------------------- | --------------------------------------------------------------------------------- |
| 🧩 `EnumMap<K extends Enum<K>, V>`    | Keys are enum constants                           | 🏎️ Very fast, compact memory usage <br> ❌ Keys must be same enum type            |
| 🌬 `WeakHashMap<K, V>`                | Cache-like behavior, auto-remove keys when GC’ed  | 🧠 Keys are held weakly (GC can remove them) <br> ✅ Used in memory-sensitive apps |
| 🪞 `IdentityHashMap<K, V>`            | Identity comparison (`==` instead of `.equals()`) | 🔍 Unusual use cases like graph traversal or frameworks                           |
| ⚙️ `Properties`                       | Application config settings                       | 🧾 Map of `String` → `String` <br> ✅ Supports `.properties` file reading          |
| 🔒 `Collections.synchronizedMap(Map)` | Basic thread-safe wrapper for any map             | 🚫 Slower than `ConcurrentHashMap` <br> ✅ Easy to wrap legacy code                |
| 🛡 `Collections.unmodifiableMap(Map)` | Read-only access to an existing map               | ✅ Prevents accidental modification <br> 🚫 Runtime error on mutation attempt      |

---

### 🧠 Summary: Which Map for What?

| Use Case                      | Best Map                                      |
| ----------------------------- | --------------------------------------------- |
| Max speed, no order           | `HashMap`                                     |
| Maintain insertion order      | `LinkedHashMap`                               |
| Sorted keys                   | `TreeMap`                                     |
| Thread-safe (modern)          | `ConcurrentHashMap`                           |
| Legacy synchronization        | `Hashtable` / `Collections.synchronizedMap()` |
| Enum keys                     | `EnumMap`                                     |
| Garbage-collected keys        | `WeakHashMap`                                 |
| Identity-based key comparison | `IdentityHashMap`                             |
| Read-only map                 | `Collections.unmodifiableMap()`               |
| Config files                  | `Properties`                                  |

---

## 🧠 Best Practices

* 🔒 **Never use `Hashtable` in new code** — it's obsolete.
* 🧼 **Always prefer `Map<K,V> map = new HashMap<>()`** (coding to interface).
* 🚀 Use `ConcurrentHashMap` for **high-performance multithreading** — it's miles ahead of synchronized maps.

---

## 📦 Java Map Implementations — Import Table

| Map Type                        | Import Statement                                                 |
| ------------------------------- | ---------------------------------------------------------------- |
| `Map` (interface)               | `import java.util.Map;`                                          |
| `HashMap`                       | `import java.util.HashMap;`                                      |
| `LinkedHashMap`                 | `import java.util.LinkedHashMap;`                                |
| `TreeMap`                       | `import java.util.TreeMap;`                                      |
| `Hashtable`                     | `import java.util.Hashtable;`                                    |
| `ConcurrentHashMap`             | `import java.util.concurrent.ConcurrentHashMap;`                 |
| `EnumMap`                       | `import java.util.EnumMap;`                                      |
| `WeakHashMap`                   | `import java.util.WeakHashMap;`                                  |
| `IdentityHashMap`               | `import java.util.IdentityHashMap;`                              |
| `Properties`                    | `import java.util.Properties;`                                   |
| `Collections.synchronizedMap()` | `import java.util.Collections;`                                  |
| `Collections.unmodifiableMap()` | `import java.util.Collections;`                                  |
| `SortedMap` / `NavigableMap`    | `import java.util.SortedMap;` / `import java.util.NavigableMap;` |

---

### 🧠 Tips:

* `Map`, `HashMap`, `TreeMap`, etc. all live in `java.util`.
* `ConcurrentHashMap` is in `java.util.concurrent`.
* `Collections` class provides static utility methods like `synchronizedMap()` and `unmodifiableMap()`.

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

### 📦 Java Map API — Method Table

| 🧾 Name                       | 📘 Description                    | 🔁 Return Value           |
| ----------------------------- | --------------------------------- | ------------------------- |
| `put(K key, V value)`         | Adds or replaces a key-value pair | `V` (old value or `null`) |
| `get(Object key)`             | Retrieves value by key            | `V` (or `null`)           |
| `remove(Object key)`          | Removes key and its value         | `V` (or `null`)           |
| `containsKey(Object key)`     | Checks if the map contains a key  | `boolean`                 |
| `containsValue(Object value)` | Checks if a value exists          | `boolean`                 |
| `size()`                      | Returns number of entries         | `int`                     |
| `clear()`                     | Removes all entries               | `void`                    |
| `isEmpty()`                   | Checks if map is empty            | `boolean`                 |
| `keySet()`                    | Gets set of keys                  | `Set<K>`                  |
| `values()`                    | Gets all values                   | `Collection<V>`           |
| `entrySet()`                  | Gets key-value entry set          | `Set<Map.Entry<K,V>>`     |

---

### ⚡ Java 8+ Functional & Enhanced Methods

| 🧾 Name                                                      | 📘 Description                               | 🔁 Return Value                |
| ------------------------------------------------------------ | -------------------------------------------- | ------------------------------ |
| `getOrDefault(Object key, V defaultValue)`                   | Returns value or default if key not found    | `V`                            |
| `putIfAbsent(K key, V value)`                                | Puts value only if key isn't already present | `V` (existing or `null`)       |
| `compute(K key, BiFunction<K,V,V> remappingFunction)`        | Computes and updates value for key           | `V` (updated or removed value) |
| `computeIfAbsent(K key, Function<K,V> mappingFunction)`      | Computes value if key is missing             | `V`                            |
| `computeIfPresent(K key, BiFunction<K,V,V>)`                 | Updates value if key exists                  | `V`                            |
| `merge(K key, V value, BiFunction<V,V,V> remappingFunction)` | Merges existing and new value                | `V`                            |
| `forEach(BiConsumer<K,V> action)`                            | Performs action for each entry               | `void`                         |
| `replace(K key, V newValue)`                                 | Replaces value only if key exists            | `V` (old value or `null`)      |
| `replace(K key, V oldValue, V newValue)`                     | Replaces value only if current value matches | `boolean`                      |
| `replaceAll(BiFunction<K,V,V> function)`                     | Applies function to all entries              | `void`                         |

---

### 🧱 Map.Entry Methods

| 🧾 Name             | 📘 Description                    | 🔁 Return Value |
| ------------------- | --------------------------------- | --------------- |
| `getKey()`          | Returns entry's key               | `K`             |
| `getValue()`        | Returns entry's value             | `V`             |
| `setValue(V value)` | Replaces entry's value in the map | `V` (old value) |

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
- [Learn Java HASHMAPS in 10 minutes! 🗺️ - Bro Code](https://www.youtube.com/watch?v=NMHk1CGb28o)
- []()