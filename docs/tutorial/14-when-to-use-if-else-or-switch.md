# When to use `if-else` or `switch` statements

Excellent question! 💡 Understanding **when to use `switch` vs `if-else`** is key for writing clean, readable, and efficient Java code — and it's **OCA exam relevant** too.

---

## When Should You Use `switch`?

Use `switch` when:

### 1️⃣ You are comparing **one variable** to **many constant values**

- Ideal when you check a single variable against multiple discrete options

```java
switch (day) {
    case 1: // Monday
    case 2: // Tuesday
    // ...
}
```

---

### 2️⃣ The variable is a **primitive**, `String`, or `enum`

- `switch` supports:

  - `byte`, `short`, `char`, `int`
  - `String` (Java 7+)
  - `enum` (great for state machines!)

---

### 3️⃣ You want **cleaner, more readable code**

- Especially when there are many `else if` branches

```java
// BAD: Clunky if-else
if (x == 1) {...}
else if (x == 2) {...}
else if (x == 3) {...}

// BETTER: Clean switch
switch (x) {
    case 1: ...
    case 2: ...
    case 3: ...
}
```

---

## ❌ When NOT to Use `switch`

Avoid `switch` when:

### ❌ You need to test **complex expressions**

```java
if (x > 10 && y < 5) { ... } // Use if-statement
```

### ❌ You're dealing with **non-supported types**

- e.g., `float`, `double`, `boolean`, or objects not allowed in switch

### ❌ Each condition has unique logic or nested checks

```java
if (user.isAdmin() && user.hasAccess()) { ... } // if is better here
```

---

## Rule of Thumb

| Situation                              | Use         |
| -------------------------------------- | ----------- |
| Comparing one value to constants       | `switch`  |
| Multiple, complex conditions           | `if-else` |
| Expression involves ranges or logic    | `if-else` |
| Matching `String` or `enum` values | `switch`  |

---

## Performance?

Historically, `switch` could be **faster** than `if-else` (especially with many conditions), because it's sometimes compiled into a **jump table**.
But with modern JVMs, the difference is usually negligible — prioritize **readability** and **clarity**. 🧼

---

## Quick Example

### `switch` Version:

```java
String command = "start";
switch (command) {
    case "start": System.out.println("Starting..."); break;
    case "stop": System.out.println("Stopping..."); break;
    default: System.out.println("Unknown command");
}
```

### `if-else` Version:

```java
if (command.equals("start")) {
    System.out.println("Starting...");
} else if (command.equals("stop")) {
    System.out.println("Stopping...");
} else {
    System.out.println("Unknown command");
}
```

➡️ Both work. But `switch` is easier to read when there are many options.

---

## OCA Tip

The OCA may ask:

> "Which is the most appropriate control flow statement for checking one variable against fixed values?"

✔️ Correct answer: `switch`
