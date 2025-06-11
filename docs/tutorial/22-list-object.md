# List Object

## 📦 What is a `List`?

- A **List** is an **ordered**, **indexed**, **dynamic** collection.
- Unlike arrays, `List`s can grow and shrink in size.
- Defined in the **`java.util` package**.
- `List` is **an interface**, most commonly implemented by:

  - `ArrayList` ✅ (resizable array)
  - `LinkedList`
  - `Vector` (legacy)

---

## ✅ How to Declare and Use a List

### Using `ArrayList` (most common):

```java
import java.util.*;

List<String> list = new ArrayList<>();
list.add("A");
list.add("B");
System.out.println(list); // [A, B]
```

---

## 📌 Key Characteristics

| Feature        | List                                        |
| -------------- | ------------------------------------------- |
| Ordered        | ✔️ maintains insertion order              |
| Duplicates     | ✔️ allowed                                |
| Null elements  | ✔️ allowed                                |
| Random Access  | ✔️ in `ArrayList`, ❌ in `LinkedList` |
| Indexed access | ✔️                                        |

---

## ✅ Common List Methods

| Method                  | Description                       | Example                    |
| ----------------------- | --------------------------------- | -------------------------- |
| `add(E e)`            | Adds element at end               | `list.add("X")`          |
| `add(int index, E e)` | Inserts element at index          | `list.add(1, "Y")`       |
| `get(int index)`      | Returns element at index          | `list.get(0)` → "X"     |
| `set(int index, E e)` | Replaces element at index         | `list.set(0, "Z")`       |
| `remove(int index)`   | Removes element at index          | `list.remove(1)`         |
| `remove(Object o)`    | Removes first occurrence of value | `list.remove("A")`       |
| `size()`              | Returns number of elements        | `list.size()`            |
| `clear()`             | Removes all elements              | `list.clear()`           |
| `contains(Object o)`  | Checks if list contains element   | `list.contains("A")`     |
| `isEmpty()`           | Checks if list is empty           | `list.isEmpty()`         |
| `indexOf(Object o)`   | Returns index of first match      | `list.indexOf("A")` → 0 |

---

## 💡 List Initialization Tips

### ✅ Java 8+ Short Syntax

```java
List<String> list = Arrays.asList("A", "B", "C");
```

> ⚠️ This returns a **fixed-size list** — you can't add/remove elements.

```java
list.add("D"); // ❌ UnsupportedOperationException
```

### ✅ Safe resizable list

```java
List<String> list = new ArrayList<>(Arrays.asList("A", "B", "C"));
list.add("D"); // ✅ Works
```

---

## 🔁 Looping Through a List

### Enhanced `for` loop:

```java
for (String s : list) {
    System.out.println(s);
}
```

### Index-based loop:

```java
for (int i = 0; i < list.size(); i++) {
    System.out.println(list.get(i));
}
```

---

## ⚠️ OCA Pitfalls

### ❗ `Arrays.asList()` trap

```java
List<String> list = Arrays.asList("A", "B");
list.add("C"); // ❌ Throws exception (fixed size!)
```

### ❗ Using `==` to compare content

```java
List<String> l1 = Arrays.asList("A");
List<String> l2 = Arrays.asList("A");

System.out.println(l1 == l2);        // ❌ false
System.out.println(l1.equals(l2));   // ✅ true
```

### ❗ IndexOutOfBounds

```java
List<String> list = new ArrayList<>();
list.add("A");
System.out.println(list.get(1)); // ❌ Exception (index out of range)
```

---

## 🎓 OCA Quick Quiz

### Q1: What's the output?

```java
List<Integer> nums = Arrays.asList(1, 2, 3);
nums.set(1, 10);
System.out.println(nums);
```

✅ **A:** `[1, 10, 3]` — because `set()` replaces at index.

---

### Q2: Which line causes an error?

```java
List<String> list = Arrays.asList("A", "B", "C");
list.remove(1); // ❌
```

✔️ `Arrays.asList()` returns a **fixed-size list**, so `remove()` fails.

---

## ✅ Summary Table

| Task            | Method               |
| --------------- | -------------------- |
| Add item        | `add(item)`        |
| Insert at index | `add(index, item)` |
| Remove by index | `remove(index)`    |
| Remove by value | `remove(obj)`      |
| Update value    | `set(index, item)` |
| Get value       | `get(index)`       |
| Size of list    | `size()`           |
| Clear list      | `clear()`          |
| Check contains  | `contains(obj)`    |

---

## Arrays vs Lists

### 1. **Basic Differences**

| Feature       | Array                             | List (e.g.`ArrayList`)           |
| ------------- | --------------------------------- | ---------------------------------- |
| Size          | **Fixed-size** (can't grow) | **Dynamic size** (resizable) |
| Type          | Can hold**primitives**      | Can only hold**objects**     |
| Flexibility   | Less flexible (static)            | More flexible (dynamic)            |
| Performance   | Slightly faster (no overhead)     | Slightly slower (more features)    |
| Memory usage  | More efficient                    | Uses more memory (wrapper objects) |
| Supported Ops | Basic access & loop               | Full CRUD (add, remove, search)    |

---

### 2. Use **Array** When:

🔸 You know the size **in advance**
🔸 You want to store **primitive types** directly
🔸 You're doing **performance-critical** tasks (less overhead)
🔸 You don't need advanced operations like insert/remove/move

#### Example:

```java
int[] scores = new int[5]; // Efficient and compact
```

---

### 3. Use **List** When:

🔸 You need to **add/remove** elements dynamically
🔸 You want to work with **collections utilities** (like `sort`, `contains`, etc.)
🔸 You want to use **higher-level APIs** like Streams
🔸 You want to easily **convert to other collections**
🔸 You are storing **objects** (like `String`, `Integer`, etc.)

#### Example:

```java
List<String> names = new ArrayList<>();
names.add("Alice");
names.add("Bob");
names.remove("Bob");
```

---

### 4. Things to Consider Before Choosing

| Question                           | If "Yes"... Use |
| ---------------------------------- | --------------- |
| Do I know the exact size?          | ✅ Array        |
| Do I need to grow/shrink size?     | ✅ List         |
| Am I storing primitives?           | ✅ Array        |
| Do I need insert/remove often?     | ✅ List         |
| Do I want rich collection methods? | ✅ List         |
| Is memory/performance critical?    | ✅ Array        |

---

### Example Comparison

#### Array

```java
int[] ages = {21, 22, 23};
System.out.println(ages[1]); // 22
```

#### List

```java
List<Integer> ages = new ArrayList<>();
ages.add(21);
ages.add(22);
ages.remove(0);
System.out.println(ages); // [22]
```

---

### OCA Exam Tips

- You **can't use primitive types in a List**:

  ```java
  List<int> nums = new ArrayList<>(); // ❌ Compile error
  List<Integer> nums = new ArrayList<>(); // ✅
  ```
- **Arrays.asList(...)** returns a **fixed-size** list:

  ```java
  List<String> list = Arrays.asList("A", "B");
  list.add("C"); // ❌ UnsupportedOperationException
  ```
- You **can't resize** an array:

  ```java
  int[] arr = new int[2];
  arr[2] = 99; // ❌ ArrayIndexOutOfBoundsException
  ```

---

### Final Rule of Thumb

> 💡 Use **`Array`** when you're working with **fixed-size, performance-sensitive, or primitive data**,
> Use **`List`** when you need **flexibility, rich features, and dynamic operations**.
