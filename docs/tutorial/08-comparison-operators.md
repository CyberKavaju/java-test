# Comparison Operators

Comparison (relational) operators in Java — these are used to **compare values** and return a boolean (`true` or `false`) ✔️

| Operator | Description              | Example    | Result   |
| -------- | ------------------------ | ---------- | -------- |
| `==`   | Equal to                 | `5 == 5` | `true` |
| `!=`   | Not equal to             | `5 != 3` | `true` |
| `>`    | Greater than             | `10 > 3` | `true` |
| `<`    | Less than                | `3 < 7`  | `true` |
| `>=`   | Greater than or equal to | `5 >= 5` | `true` |
| `<=`   | Less than or equal to    | `4 <= 9` | `true` |

## Example in Code:

```java
public class ComparisonExample {
    public static void main(String[] args) {
        int a = 10;
        int b = 20;

        System.out.println("a == b: " + (a == b));   // false
        System.out.println("a != b: " + (a != b));   // true
        System.out.println("a < b: " + (a < b));     // true
        System.out.println("a > b: " + (a > b));     // false
        System.out.println("a <= b: " + (a <= b));   // true
        System.out.println("a >= b: " + (a >= b));   // false
    }
}
```

## For Strings (and Objects):

- Use `.equals()` for content comparison:

```java
String s1 = "Java";
String s2 = "Java";
System.out.println(s1 == s2);         // true (in this case — same literal)
System.out.println(s1.equals(s2));    // ✅ always preferred
```

## Tip:

- These operators work on **numbers**, **chars**, and even **objects (using == / !=)**, but for **real equality of objects**, always use `.equals()` unless you're comparing references.
