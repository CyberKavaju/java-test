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

**Basic comparison operators with primitive types:** This example demonstrates how to use all comparison operators with integers.

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

**String content comparison:** Shows the difference between reference equality (`==`) and content equality (`.equals()`).

```java
String s1 = "Java";
String s2 = "Java";
System.out.println(s1 == s2);         // true (in this case — same literal)
System.out.println(s1.equals(s2));    // ✅ always preferred
```

### Additional Object Comparison Methods:

#### 1. `.compareTo()` Method (for Comparable objects):

**Lexicographic comparison:** Returns negative, zero, or positive integer based on alphabetical/numerical order comparison.

```java
String str1 = "Apple";
String str2 = "Banana";
String str3 = "Apple";

System.out.println(str1.compareTo(str2));  // negative value (Apple < Banana)
System.out.println(str2.compareTo(str1));  // positive value (Banana > Apple)
System.out.println(str1.compareTo(str3));  // 0 (Apple == Apple)

// For numbers as strings
String num1 = "10";
String num2 = "20";
System.out.println(num1.compareTo(num2));  // negative value
```

#### 2. `.equalsIgnoreCase()` for Strings:

**Case-insensitive string comparison:** Compares string content while ignoring uppercase/lowercase differences.

```java
String text1 = "JAVA";
String text2 = "java";
System.out.println(text1.equals(text2));           // false
System.out.println(text1.equalsIgnoreCase(text2)); // true ✅
```

#### 3. Safe Comparison with `Objects.equals()`:

**Null-safe equality check:** Safely compares objects without throwing NullPointerException when one or both objects are null.

```java
import java.util.Objects;

String a = null;
String b = null;
String c = "Hello";

// Safe null comparison
System.out.println(Objects.equals(a, b));    // true (both null)
System.out.println(Objects.equals(a, c));    // false (one is null)
System.out.println(Objects.equals(c, c));    // true

// Avoids NullPointerException
// System.out.println(a.equals(b));  // ❌ Would throw NullPointerException
```

#### 4. Comparing Custom Objects:

**Custom object equality:** By default, objects use reference equality (`==`). To compare by content, we must override the `equals()` method.

**Why we need custom equals():** Without overriding, two Person objects with identical data would be considered "not equal" because they're different objects in memory.

```java
class Person {
    private String name;
    private int age;
    
    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }
    
    // Step-by-step equals() method breakdown:
    @Override
    public boolean equals(Object obj) {
        // Step 1: Check if comparing to itself (same memory location)
        if (this == obj) return true;
        
        // Step 2: Check if the other object is null or different type
        if (obj == null || getClass() != obj.getClass()) return false;
        
        // Step 3: Cast to Person type (safe after type check above)
        Person person = (Person) obj;
        
        // Step 4: Compare the actual field values
        return age == person.age && Objects.equals(name, person.name);
    }
    
    // IMPORTANT: Always override hashCode when overriding equals
    // This ensures objects that are "equal" have the same hash code
    @Override
    public int hashCode() {
        return Objects.hash(name, age);
    }
}

// Usage demonstration:
Person p1 = new Person("John", 25);    // First John object
Person p2 = new Person("John", 25);    // Second John object (different memory)
Person p3 = new Person("Jane", 30);    // Different person

System.out.println(p1 == p2);        // false (different objects in memory)
System.out.println(p1.equals(p2));   // true ✅ (same name and age values)
System.out.println(p1.equals(p3));   // false (different name and age)
```

**Key Points:**
- `==` compares **memory addresses** (are they the same object?)
- `.equals()` compares **content** (do they have the same data?)
- Always override `hashCode()` when you override `equals()` for proper behavior in collections

#### 5. Comparing Arrays:

**Array content comparison:** Uses `Arrays.equals()` to compare array contents rather than references.

```java
import java.util.Arrays;

int[] arr1 = {1, 2, 3};
int[] arr2 = {1, 2, 3};
int[] arr3 = {1, 2, 4};

System.out.println(arr1 == arr2);              // false (different objects)
System.out.println(Arrays.equals(arr1, arr2)); // true ✅ (same content)
System.out.println(Arrays.equals(arr1, arr3)); // false (different content)
```

#### 6. Deep Comparison for Multi-dimensional Arrays:

**Multi-dimensional array comparison:** Uses `Arrays.deepEquals()` to compare nested arrays and their contents recursively.

```java
int[][] matrix1 = {{1, 2}, {3, 4}};
int[][] matrix2 = {{1, 2}, {3, 4}};

System.out.println(Arrays.equals(matrix1, matrix2));     // false ❌
System.out.println(Arrays.deepEquals(matrix1, matrix2)); // true ✅
```
