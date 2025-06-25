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
| `removeIf(Predicate<? super E> filter)` | Removes elements matching condition | `list.removeIf(s -> s.startsWith("A"))` |
| `toArray()`           | Converts to array                  | `list.toArray()`          |
| `toArray(T[] a)`      | Converts to typed array            | `list.toArray(new String[0])` |
| `contains(Object o)`  | Checks if list contains element   | `list.contains("A")`     |
| `size()`              | Returns number of elements        | `list.size()`            |
| `clear()`             | Removes all elements              | `list.clear()`           |
| `contains(Object o)`  | Checks if list contains element   | `list.contains("A")`     |
| `isEmpty()`           | Checks if list is empty           | `list.isEmpty()`         |
| `indexOf(Object o)`   | Returns index of first match      | `list.indexOf("A")` → 0 |

---

## 📌 **What is `removeIf()`?**

`removeIf()` is a method provided by the `Collection` interface (and therefore available in all implementing classes like `List`, `Set`, etc.) since **Java 8**.

### ✅ Purpose:

To **remove elements** from a collection **based on a condition (predicate)**.

---

## 🧬 **Method Signature**

```java
boolean removeIf(Predicate<? super E> filter);
```

* `Predicate<E>` is a **functional interface** that takes a single argument and returns a boolean:

  ```java
  boolean test(E e);
  ```

* `removeIf()` goes through each element in the collection and applies the predicate.

* If `test(e)` returns `true`, the element is removed.

---

## 🛠️ Example Usage

```java
List<Integer> numbers = new ArrayList<>(Arrays.asList(1, 2, 3, 4, 5, 6));

// Remove all even numbers
numbers.removeIf(n -> n % 2 == 0);

System.out.println(numbers); // Output: [1, 3, 5]
```

---

## 🧠 How It Works Internally (Conceptually)

Internally, the method uses an iterator to avoid `ConcurrentModificationException`:

```java
Iterator<E> it = list.iterator();
while (it.hasNext()) {
    E e = it.next();
    if (predicate.test(e)) {
        it.remove();  // safe removal
    }
}
```

This ensures thread-safe iteration while modifying the list.

---

## 💡 Real-World Use Cases

### 🧹 1. Clean up nulls:

```java
list.removeIf(Objects::isNull);
```

### 🔍 2. Filter based on string match:

```java
List<String> names = List.of("Alice", "Bob", "Charlie");
names.removeIf(name -> name.startsWith("A")); // Removes "Alice"
```

### 📆 3. Remove expired items:

```java
list.removeIf(item -> item.getExpiryDate().isBefore(LocalDate.now()));
```

---

## ⚠️ Notes and Gotchas

### 1. ✅ Return Value:

It returns a `boolean` indicating **whether any elements were removed**:

```java
boolean modified = list.removeIf(n -> n < 0);
```

---

### 2. 🚫 No ConcurrentModificationException:

Unlike manually removing in a `for-each` loop, this method is **safe**.

### ❌ This is BAD:

```java
for (Integer n : list) {
    if (n % 2 == 0) list.remove(n);  // ❌ Throws ConcurrentModificationException
}
```

---

## 🔗 Bonus: Combine with Streams (but Streams are not in-place)

If you **don’t want to mutate** the original list:

```java
List<Integer> filtered = list.stream()
                             .filter(n -> n % 2 != 0)
                             .collect(Collectors.toList());
```

* `removeIf()` modifies the list in-place.
* `stream().filter()` creates a **new list**.

---

## 🔚 Summary Table

| Feature          | Description                                    |
| ---------------- | ---------------------------------------------- |
| 📌 Method        | `removeIf(Predicate<E> predicate)`             |
| 🔍 Purpose       | Removes elements that match a condition        |
| 💡 Returns       | `true` if any elements were removed            |
| 🚫 Safe?         | ✅ Yes, uses iterator internally                |
| 🧠 Introduced in | Java 8                                         |
| ⚠️ Caution       | Don't use `for-each` loop for removal manually |

---

## 🧪 Mini Quiz for You?

What will this print?

```java
List<String> list = new ArrayList<>(List.of("a", "bb", "ccc", "dd"));
list.removeIf(s -> s.length() == 2);
System.out.println(list);
```

Want me to solve or let you try? 😄

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

## 🔑 **Key Characteristic of `List` returned by `Arrays.asList()`**

The **List** returned by `Arrays.asList(T... a)` is:

> ✅ **A fixed-size list backed by the original array.**

---

### 🔍 What does this mean?

* The list **reflects** changes to the original array, and **vice versa**.
* You **cannot add or remove** elements from this list. Attempts will throw an exception:

  ```java
  UnsupportedOperationException
  ```
* You **can update** elements (i.e., set), because the size is fixed—not immutable.

---

### 🔧 Example:

```java
String[] array = {"Java", "Python", "C++"};
List<String> list = Arrays.asList(array);

list.set(0, "JavaScript"); // ✅ Allowed
System.out.println(array[0]); // ➜ JavaScript

list.add("Go"); // ❌ Throws UnsupportedOperationException
```

---

### 🚨 Common Pitfall

```java
List<Integer> list = Arrays.asList(1, 2, 3);
list.add(4); // ❗ BOOM! UnsupportedOperationException
```

If you want a **modifiable list**, wrap it like this:

```java
List<Integer> modifiableList = new ArrayList<>(Arrays.asList(1, 2, 3));
modifiableList.add(4); // ✅ Now works
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
