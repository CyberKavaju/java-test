# Arrays

## What is an Array?

An array is a **fixed-size**, **ordered**, **homogeneous** container — it holds elements of the **same type**, and each element is accessed via an **index** (starting from 0).

```java
int[] numbers = {1, 2, 3}; // array of 3 integers
```

---

## Array Declaration Syntax

You can declare arrays in **two main ways**:

```java
int[] a;     // recommended (Java convention)
int a[];     // also valid (C-style)
```

Both declare an array of integers.

---

## Array Initialization

### 1️⃣ Direct with Values

```java
int[] nums = {10, 20, 30}; // length = 3
```

### 2️⃣ With `new` Keyword

```java
int[] nums = new int[5]; // [0, 0, 0, 0, 0]
String[] names = new String[3]; // [null, null, null]
```

You can assign values later:

```java
names[0] = "Alice";
```

---

## Accessing Elements

```java
System.out.println(nums[0]); // First element
nums[1] = 50;                // Update second element
```

---

## Array Length

```java
System.out.println(nums.length); // Note: no parentheses
```

⚠️ `length` is a **field**, not a method!

---

## Multi-Dimensional Arrays

```java
int[][] matrix = new int[2][3]; // 2 rows × 3 columns
matrix[0][1] = 42;
```

You can also declare irregular (jagged) arrays:

```java
int[][] jagged = new int[3][];
jagged[0] = new int[2];
jagged[1] = new int[1];
```

---

## Looping Through Arrays

### Classic `for` loop:

```java
for (int i = 0; i < nums.length; i++) {
    System.out.println(nums[i]);
}
```

### Enhanced `for-each` loop:

```java
for (int n : nums) {
    System.out.println(n);
}
```

❌ Note: You **cannot modify the original array** with `for-each` directly.

---

## ⚠️ OCA Pitfalls

### ❗ Accessing invalid index

```java
int[] x = {1, 2, 3};
System.out.println(x[3]); // ❌ ArrayIndexOutOfBoundsException
```

---

### ❗ Mixing declaration with dimensions

```java
int[5] x;      // ❌ illegal size during declaration
int[] x = new int[5]; // ✅ correct
```

---

### ❗ Forgetting `new` keyword

```java
int[] x;
x = {1, 2, 3}; // ❌ compile error (must use 'new' with this form)
```

✅ Correct:

```java
x = new int[]{1, 2, 3};
```

---

### ❗ Confusing `length` with `length()`

```java
String s = "hello";
s.length();   // ✅ method for String

int[] arr = new int[3];
arr.length;   // ✅ field for array

arr.length(); // ❌ compile error
```

---

## Array of Objects

```java
String[] words = new String[2];
words[0] = "Hello";
words[1] = "World";
```

---

## 🎓 OCA Quick Quiz

### Q1: What's the output?

```java
int[] x = new int[2];
System.out.println(x[0]);
```

✔️ **A:** `0` (default for int array)

---

### Q2: Which is valid?

```java
A. int[] a = new int[2] {1, 2};     // ❌
B. int[] a = {1, 2};                // ✔️
C. int a[] = new int[] {1, 2};      // ✔️
```

---

## Summary Table

| Concept                     | Syntax / Behavior               |
| --------------------------- | ------------------------------- |
| Array Declaration           | `int[] a;` or `int a[];`    |
| Initialization (fixed size) | `new int[3]` → `[0, 0, 0]` |
| Initialization (values)     | `int[] a = {1, 2, 3};`        |
| Access                      | `a[0]`, `a[a.length - 1]`   |
| Length                      | `a.length` (no `()`)        |
| For-each Loop               | `for (int x : a)`             |
| Multi-dimensional Array     | `int[][] m = new int[2][3];`  |
| Jagged Arrays               | `int[][] j = new int[3][];`   |

---

## Multi-Dimensional Arrays

### ✅ What Is a Multi-Dimensional Array?

In Java, a **multi-dimensional array** is really an **array of arrays**.

The most common is the **2D array**, which can be visualized as a **table** (rows and columns).

```java
int[][] matrix = new int[2][3];
```

This creates:

- 2 **rows**
- Each with 3 **columns**
- Total 6 elements

📌 Java stores this as:
`matrix[0][0]`, `matrix[0][1]`, `matrix[0][2]`
`matrix[1][0]`, `matrix[1][1]`, `matrix[1][2]`

---

### ✅ Declaring Multi-Dimensional Arrays

#### 1️⃣ Standard (Recommended) Syntax

```java
int[][] a;       // 2D array (array of arrays)
int[][][] b;     // 3D array (array of 2D arrays)
```

#### 2️⃣ Less Common Syntax (Still Valid)

```java
int a[][];       // valid but not preferred
int[] a[];       // also valid
```

---

### ✅ Initializing Multi-Dimensional Arrays

#### 1️⃣ With `new` keyword

```java
int[][] grid = new int[2][3];
// creates 2 rows, each with 3 columns (default values = 0)
```

#### 2️⃣ With values directly

```java
int[][] scores = {
    {90, 80, 70},
    {85, 75, 65}
};
```

This creates a 2×3 array.

---

### 🔁 Accessing & Updating Elements

```java
int[][] grid = new int[2][3];
grid[0][0] = 10;
System.out.println(grid[0][0]); // Output: 10
```

---

### 🔄 Looping Through a 2D Array

#### Traditional `for` loop:

```java
for (int i = 0; i < grid.length; i++) {
    for (int j = 0; j < grid[i].length; j++) {
        System.out.print(grid[i][j] + " ");
    }
    System.out.println();
}
```

#### Enhanced `for-each` loop:

```java
for (int[] row : grid) {
    for (int col : row) {
        System.out.print(col + " ");
    }
    System.out.println();
}
```

---

### 📦 Jagged Arrays (Irregular 2D Arrays)

You can create a 2D array where each row has a **different length**.

```java
int[][] jagged = new int[3][];
jagged[0] = new int[2];   // 2 elements
jagged[1] = new int[4];   // 4 elements
jagged[2] = new int[1];   // 1 element
```

📌 Memory-efficient and flexible

---

### ✅ Multi-Dimensional Arrays Beyond 2D

#### 3D Array Example

```java
int[][][] cube = new int[2][3][4]; // 2 "sheets" of 3x4
```

Access:

```java
cube[0][1][2] = 99;
```

📌 Think of it as: sheet → row → column

---

## ✅ Arrays passed by reference

Java is **always pass-by-value**, even for arrays.

BUT… the value that gets passed for an array is a **reference to the object** — not the object itself.

So it **looks like pass-by-reference**, but it’s technically:

> ❗ **Pass-by-value of the reference**

---

## 🧠 Let's visualize:

```java
int[] a = {1, 2, 3};
int[] b = a;
```

* `a` holds a **reference** (like a pointer) to the array `[1, 2, 3]`.
* When we assign `b = a`, we are **copying the reference**, not the array.

So now:

* Both `a` and `b` point to the **same array** object in memory.

---

## 🔧 How it works in memory:

```text
a ─┐
   └─► [10, 2, 3]
b ─┘
```

When you do:

```java
b[0] = 10;
```

You're changing the shared array. So now:

```java
System.out.println(a[0]); // → 10
```

---

## 🧠 Why does this happen?

* Arrays are **objects** in Java.
* Objects live on the **heap**.
* Variables like `a` and `b` store **references** (addresses) to those objects.
* Passing an array means **passing the reference value**, not cloning the object.

---

## 📌 Key Takeaway

> Java is **pass-by-value**, but the "value" can be a **reference** to an object.
> When you pass or assign arrays, you're copying the **reference**, not the data.

---

### Bonus: What doesn't happen

This does **not** make a copy:

```java
int[] b = a; // Not a deep copy
```

To copy an array, you need:

```java
int[] b = Arrays.copyOf(a, a.length);
```
---
## A bad For loop `<=` expresion

When using a for loop, you might be tempted to use `<=` instead of `<`:

```java
for (int i = 0; i <= nums.length - 1; i++) {
    System.out.println(nums[i]);
}
```
This works, but it's not the best practice. The idiomatic way is to use `<`
```java
for (int i = 0; i < nums.length; i++) {
    System.out.println(nums[i]);
}
 
---

### ⚠️ OCA Pitfalls

#### ❌ Forgetting to Initialize Inner Arrays

```java
int[][] jagged = new int[3][];
jagged[0][0] = 10; // ❌ NullPointerException
```

✅ Must do:

```java
jagged[0] = new int[2];
jagged[0][0] = 10; // now valid
```

---

#### ❌ IndexOutOfBounds

```java
int[][] grid = new int[2][3];
System.out.println(grid[2][1]); // ❌ ArrayIndexOutOfBoundsException
```

---

#### ❌ Wrong Syntax for Initializing

```java
int[][] grid = new int[][3]; // ❌ compile-time error
```

✅ Always specify the first dimension:

```java
int[][] grid = new int[2][];
```

---

### 🔍 Inspecting with `Arrays.deepToString()`

```java
import java.util.Arrays;

int[][] arr = {{1, 2}, {3, 4}};
System.out.println(Arrays.deepToString(arr));
// Output: [[1, 2], [3, 4]]
```

## Video Turotials

- [Arrays In Java Tutorial #10 - Alex Lee](https://www.youtube.com/watch?v=xzjZy-dHHLw)
- [Arrays (Java Tutorial) - Bill Barnum](https://www.youtube.com/watch?v=B10TjOAyBnw)
- [Traversing an Array (Java Tutorial) - Bill Barnum](https://www.youtube.com/watch?v=A31qPGH43Gw)
- [Traversing a 2 Dimensional Array (Java Tutorial) - Bill Barnum](https://www.youtube.com/watch?v=zZWZNSeys_4)
- [Java arrays 🚗 - Bro Code](https://www.youtube.com/watch?v=ei_4Nt7XWOw)
- [Java 2D arrays 🚚 - Bro Code](https://www.youtube.com/watch?v=alwukGslBG8)