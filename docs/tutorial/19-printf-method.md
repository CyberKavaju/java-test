# printf() method

## What is `printf()`?

`printf()` stands for "**print formatted**".
It allows you to format **strings, numbers, characters, booleans**, etc., using **placeholders** called *format specifiers*.

---

## Basic Syntax

```java
System.out.printf(formatString, argument1, argument2, ...);
```

Example:

```java
System.out.printf("Name: %s, Age: %d", "Alice", 30);
```

Output:

```
Name: Alice, Age: 30
```

---

## Common Format Specifiers

| Specifier | Type         | Description                       |
| --------- | ------------ | --------------------------------- |
| `%s`    | String       | Prints a string                   |
| `%d`    | Integer      | Prints decimal integers           |
| `%f`    | Float/Double | Prints floating-point numbers     |
| `%c`    | Character    | Prints a single character         |
| `%b`    | Boolean      | Prints true or false              |
| `%%`    | -            | Prints a literal percent sign (%) |

---

## Width, Precision, and Alignment

### Set Width:

```java
System.out.printf("|%10s|", "Java");
```

Output:

```
|      Java|   ← right-aligned in 10 spaces
```

### Left Align with `-`

```java
System.out.printf("|%-10s|", "Java");
```

Output:

```
|Java      |   ← left-aligned
```

### Decimal Precision:

```java
System.out.printf("Pi: %.2f", Math.PI);
```

Output:

```
Pi: 3.14
```

---

## Combine Width + Precision

```java
System.out.printf("|%10.2f|", 123.4567);
```

Output:

```
|    123.46| ← 10 chars wide, 2 decimal places
```

---

## Multiple Arguments

```java
String name = "Bob";
int age = 28;
double salary = 1234.56789;

System.out.printf("Name: %s | Age: %d | Salary: %.2f%n", name, age, salary);
```

Output:

```
Name: Bob | Age: 28 | Salary: 1234.57
```

Note: `%n` is used instead of `\n` for platform-independent line breaks.

The order in which you use the arguments is important

---

## OCA Exam Tips

✔️ Know `%s`, `%d`, `%f`, `%c` — and when to use them
✔️ Understand alignment (`%-10s` vs `%10s`)
✔️ Be familiar with precision (`%.2f`)
✔️ Know that `printf()` **returns a PrintStream**, so it's chainable (but rarely needed)

---

## Practice Problems

1. **Print a name and age, nicely aligned:**

   ```java
   System.out.printf("Name: %-10s | Age: %02d%n", "Eve", 9);
   ```

   Output:

   ```
   Name: Eve        | Age: 09
   ```
2. **Print double with 3 decimal places:**

   ```java
   System.out.printf("Balance: $%.3f%n", 1245.6);
   ```

   Output:

   ```
   Balance: $1245.600
   ```

---

## Summary

- `printf()` = formatted print
- `%d` = integer, `%f` = float/double, `%s` = string
- You can control width (`%10s`), precision (`%.2f`), and alignment (`%-10s`)
- Use `%n` for newline
