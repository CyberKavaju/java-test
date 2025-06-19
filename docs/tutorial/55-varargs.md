# 55. Varargs (Variable Arguments)

**Related:** [32. Methods](32-methods.md) | [21. Arrays](21-arrays.md)

---

## 🧠 What are Varargs?

Varargs (variable arguments) is a Java feature that allows a method to accept a variable number of arguments of the same type. Instead of overloading methods or passing arrays, you can use varargs to make method calls more flexible and convenient.

**Real-world analogy:** Think of varargs like a restaurant menu where you can order "any number of side dishes." You might order 1 side, 3 sides, or no sides at all - the method adapts to however many arguments you provide.

## 🎯 Why Use Varargs?

### Without Varargs (Traditional Approach)
```java
public class WithoutVarargs {
    
    // Multiple overloaded methods
    public static int sum(int a) {
        return a;
    }
    
    public static int sum(int a, int b) {
        return a + b;
    }
    
    public static int sum(int a, int b, int c) {
        return a + b + c;
    }
    
    // Or using array
    public static int sumArray(int[] numbers) {
        int total = 0;
        for (int num : numbers) {
            total += num;
        }
        return total;
    }
    
    public static void main(String[] args) {
        System.out.println(sum(5));           // One parameter
        System.out.println(sum(5, 10));       // Two parameters
        System.out.println(sum(5, 10, 15));   // Three parameters
        
        // Using array - more verbose
        System.out.println(sumArray(new int[]{1, 2, 3, 4, 5}));
    }
}
```

### With Varargs (Modern Approach)
```java
public class WithVarargs {
    
    // Single method handles any number of arguments
    public static int sum(int... numbers) {
        int total = 0;
        for (int num : numbers) {
            total += num;
        }
        return total;
    }
    
    public static void main(String[] args) {
        System.out.println(sum());                    // No arguments
        System.out.println(sum(5));                  // One argument
        System.out.println(sum(5, 10));              // Two arguments
        System.out.println(sum(5, 10, 15));          // Three arguments
        System.out.println(sum(1, 2, 3, 4, 5));      // Five arguments
        
        // Can also pass an array
        int[] numbers = {1, 2, 3, 4, 5};
        System.out.println(sum(numbers));
    }
}
```

## ✅ Varargs Syntax

### Basic Declaration
```java
public class VarargsSyntax {
    
    // Varargs parameter - must be last parameter
    public static void printMessages(String... messages) {
        System.out.println("Number of messages: " + messages.length);
        for (String message : messages) {
            System.out.println("- " + message);
        }
    }
    
    // Mixing regular parameters with varargs
    public static void logMessages(String level, String... messages) {
        System.out.println("Log Level: " + level);
        for (String message : messages) {
            System.out.println("[" + level + "] " + message);
        }
    }
    
    public static void main(String[] args) {
        // Various ways to call varargs methods
        printMessages();                                    // No arguments
        printMessages("Hello");                             // One argument
        printMessages("Hello", "World", "Java");           // Multiple arguments
        
        // With regular parameter + varargs
        logMessages("INFO", "Application started");
        logMessages("ERROR", "Connection failed", "Retrying...", "Success");
    }
}
```

### Type-Safe Varargs
```java
import java.util.*;

public class TypeSafeVarargs {
    
    // Generic varargs
    @SafeVarargs  // Suppresses heap pollution warning
    public static <T> List<T> createList(T... elements) {
        List<T> list = new ArrayList<>();
        for (T element : elements) {
            list.add(element);
        }
        return list;
    }
    
    // Varargs with different types
    public static void printIntegers(int... numbers) {
        System.out.print("Integers: ");
        for (int num : numbers) {
            System.out.print(num + " ");
        }
        System.out.println();
    }
    
    public static void printStrings(String... strings) {
        System.out.print("Strings: ");
        for (String str : strings) {
            System.out.print(str + " ");
        }
        System.out.println();
    }
    
    public static void main(String[] args) {
        // Generic varargs
        List<String> fruits = createList("Apple", "Banana", "Cherry");
        List<Integer> numbers = createList(1, 2, 3, 4, 5);
        
        System.out.println("Fruits: " + fruits);
        System.out.println("Numbers: " + numbers);
        
        // Type-specific varargs
        printIntegers(1, 2, 3, 4, 5);
        printStrings("Java", "Python", "JavaScript");
    }
}
```

## ✅ Practical Examples

### Math Operations
```java
public class MathOperations {
    
    public static int add(int... numbers) {
        int sum = 0;
        for (int num : numbers) {
            sum += num;
        }
        return sum;
    }
    
    public static int multiply(int... numbers) {
        if (numbers.length == 0) return 0;
        
        int product = 1;
        for (int num : numbers) {
            product *= num;
        }
        return product;
    }
    
    public static double average(double... numbers) {
        if (numbers.length == 0) return 0.0;
        
        double sum = 0;
        for (double num : numbers) {
            sum += num;
        }
        return sum / numbers.length;
    }
    
    public static int max(int... numbers) {
        if (numbers.length == 0) {
            throw new IllegalArgumentException("At least one number required");
        }
        
        int maximum = numbers[0];
        for (int i = 1; i < numbers.length; i++) {
            if (numbers[i] > maximum) {
                maximum = numbers[i];
            }
        }
        return maximum;
    }
    
    public static void main(String[] args) {
        System.out.println("Sum: " + add(1, 2, 3, 4, 5));              // 15
        System.out.println("Product: " + multiply(2, 3, 4));           // 24
        System.out.println("Average: " + average(1.5, 2.5, 3.5, 4.5)); // 3.0
        System.out.println("Max: " + max(10, 25, 5, 30, 15));          // 30
    }
}
```

### String Formatting and Logging
```java
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class LoggingUtility {
    
    public static void log(String level, String format, Object... args) {
        String timestamp = LocalDateTime.now()
            .format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        
        String message = String.format(format, args);
        System.out.printf("[%s] [%s] %s%n", timestamp, level, message);
    }
    
    public static void info(String format, Object... args) {
        log("INFO", format, args);
    }
    
    public static void warn(String format, Object... args) {
        log("WARN", format, args);
    }
    
    public static void error(String format, Object... args) {
        log("ERROR", format, args);
    }
    
    // Concatenate strings with separator
    public static String join(String separator, String... strings) {
        if (strings.length == 0) return "";
        
        StringBuilder result = new StringBuilder(strings[0]);
        for (int i = 1; i < strings.length; i++) {
            result.append(separator).append(strings[i]);
        }
        return result.toString();
    }
    
    public static void main(String[] args) {
        // Logging examples
        info("Application started");
        info("User %s logged in with ID %d", "Alice", 123);
        warn("Connection timeout after %d seconds", 30);
        error("Failed to process file: %s (error code: %d)", "data.txt", 404);
        
        // String joining
        String path = join("/", "home", "user", "documents", "file.txt");
        System.out.println("Path: " + path);
        
        String csv = join(", ", "Apple", "Banana", "Cherry", "Date");
        System.out.println("CSV: " + csv);
    }
}
```

### Collection Utilities
```java
import java.util.*;

public class CollectionUtils {
    
    @SafeVarargs
    public static <T> Set<T> createSet(T... elements) {
        Set<T> set = new HashSet<>();
        Collections.addAll(set, elements);
        return set;
    }
    
    @SafeVarargs
    public static <T> List<T> createList(T... elements) {
        List<T> list = new ArrayList<>();
        Collections.addAll(list, elements);
        return list;
    }
    
    public static <T> boolean containsAny(Collection<T> collection, T... elements) {
        for (T element : elements) {
            if (collection.contains(element)) {
                return true;
            }
        }
        return false;
    }
    
    public static <T> boolean containsAll(Collection<T> collection, T... elements) {
        for (T element : elements) {
            if (!collection.contains(element)) {
                return false;
            }
        }
        return true;
    }
    
    public static void printCollection(String name, Object... elements) {
        System.out.print(name + ": [");
        for (int i = 0; i < elements.length; i++) {
            System.out.print(elements[i]);
            if (i < elements.length - 1) {
                System.out.print(", ");
            }
        }
        System.out.println("]");
    }
    
    public static void main(String[] args) {
        // Create collections
        Set<String> fruits = createSet("Apple", "Banana", "Cherry");
        List<Integer> numbers = createList(1, 2, 3, 4, 5);
        
        printCollection("Fruits", fruits.toArray());
        printCollection("Numbers", numbers.toArray());
        
        // Test containment
        System.out.println("Has Apple or Orange: " + 
            containsAny(fruits, "Apple", "Orange"));        // true
        System.out.println("Has Apple and Banana: " + 
            containsAll(fruits, "Apple", "Banana"));        // true
        System.out.println("Has all citrus: " + 
            containsAll(fruits, "Orange", "Lemon"));        // false
    }
}
```

## 🔧 Advanced Varargs Usage

### Method Overloading with Varargs
```java
public class VarargsOverloading {
    
    // Specific method for no arguments
    public static void process() {
        System.out.println("Processing with no arguments");
    }
    
    // Specific method for one argument
    public static void process(String single) {
        System.out.println("Processing single argument: " + single);
    }
    
    // Varargs method for multiple arguments
    public static void process(String first, String... rest) {
        System.out.println("Processing first: " + first);
        System.out.println("Processing rest: " + Arrays.toString(rest));
    }
    
    // Alternative: pure varargs (but less specific)
    public static void processAll(String... args) {
        System.out.println("Processing all: " + Arrays.toString(args));
    }
    
    public static void main(String[] args) {
        process();                              // Calls process()
        process("Single");                      // Calls process(String)
        process("First", "Second", "Third");    // Calls process(String, String...)
        
        System.out.println();
        
        processAll();                           // Calls processAll(String...)
        processAll("Single");                   // Calls processAll(String...)
        processAll("First", "Second", "Third"); // Calls processAll(String...)
    }
}
```

### Varargs with Generics
```java
import java.util.*;
import java.util.function.Function;

public class GenericVarargs {
    
    @SafeVarargs
    public static <T> T getFirst(T... elements) {
        return elements.length > 0 ? elements[0] : null;
    }
    
    @SafeVarargs
    public static <T> T getLast(T... elements) {
        return elements.length > 0 ? elements[elements.length - 1] : null;
    }
    
    @SafeVarargs
    public static <T, R> List<R> transform(Function<T, R> mapper, T... elements) {
        List<R> result = new ArrayList<>();
        for (T element : elements) {
            result.add(mapper.apply(element));
        }
        return result;
    }
    
    @SafeVarargs
    public static <T extends Comparable<T>> T findMax(T... elements) {
        if (elements.length == 0) return null;
        
        T max = elements[0];
        for (int i = 1; i < elements.length; i++) {
            if (elements[i].compareTo(max) > 0) {
                max = elements[i];
            }
        }
        return max;
    }
    
    public static void main(String[] args) {
        // Generic varargs usage
        String firstString = getFirst("Apple", "Banana", "Cherry");
        Integer lastNumber = getLast(1, 2, 3, 4, 5);
        
        System.out.println("First string: " + firstString);  // Apple
        System.out.println("Last number: " + lastNumber);    // 5
        
        // Transform with lambda
        List<String> upperCased = transform(String::toUpperCase, "hello", "world", "java");
        List<Integer> lengths = transform(String::length, "Hello", "World", "Java");
        
        System.out.println("Upper cased: " + upperCased);
        System.out.println("Lengths: " + lengths);
        
        // Find maximum
        String maxString = findMax("apple", "zebra", "banana");
        Integer maxNumber = findMax(10, 25, 5, 30, 15);
        
        System.out.println("Max string: " + maxString);      // zebra
        System.out.println("Max number: " + maxNumber);      // 30
    }
}
```

## ⚠️ OCA Pitfalls

### 1. Varargs Must Be Last Parameter
```java
// WRONG - varargs must be last
// public static void method(String... strings, int number) { }  // Compile error

// CORRECT - varargs is last parameter
public static void method(int number, String... strings) {
    System.out.println("Number: " + number);
    System.out.println("Strings: " + Arrays.toString(strings));
}
```

### 2. Only One Varargs Parameter Per Method
```java
// WRONG - only one varargs parameter allowed
// public static void method(String... strings, int... numbers) { }  // Compile error

// CORRECT - use array for additional variable-length parameters
public static void method(String[] strings, int... numbers) {
    // Implementation
}
```

### 3. Varargs vs Array Ambiguity
```java
public class VarargsAmbiguity {
    
    public static void process(int[] array) {
        System.out.println("Array method: " + Arrays.toString(array));
    }
    
    public static void process(int... varargs) {
        System.out.println("Varargs method: " + Arrays.toString(varargs));
    }
    
    public static void main(String[] args) {
        // This will cause compilation error - ambiguous method call
        // process(new int[]{1, 2, 3});  // Could match either method
        
        // Be explicit
        process((int[]) new int[]{1, 2, 3});    // Explicitly call array version
        process(1, 2, 3);                       // Clearly varargs
    }
}
```

### 4. Heap Pollution with Generic Varargs
```java
import java.util.*;

public class HeapPollution {
    
    // This method can cause heap pollution
    public static void problematic(List<String>... lists) {
        Object[] array = lists;                     // Varargs is array
        array[0] = Arrays.asList(42);               // Adding Integer list to String list array!
        String firstString = lists[0].get(0);       // ClassCastException at runtime
    }
    
    // Use @SafeVarargs to suppress warnings (only if method is actually safe)
    @SafeVarargs
    public static void safe(List<String>... lists) {
        for (List<String> list : lists) {
            for (String item : list) {
                System.out.println(item);
            }
        }
    }
    
    public static void main(String[] args) {
        List<String> list1 = Arrays.asList("Hello", "World");
        List<String> list2 = Arrays.asList("Java", "Programming");
        
        safe(list1, list2);  // This is safe
        // Don't call problematic() - it would cause ClassCastException
    }
}
```

## 🧪 Quick Quiz

**Question 1:** What will this code output?
```java
public static void test(String first, String... rest) {
    System.out.println("First: " + first);
    System.out.println("Rest length: " + rest.length);
}

public static void main(String[] args) {
    test("Hello");
    test("Hello", "World", "Java");
}
```

<details>
<summary>Click for answer</summary>

**Answer:**
```
First: Hello
Rest length: 0
First: Hello
Rest length: 2
```

In the first call, only the required parameter is provided, so `rest` is an empty array. In the second call, `rest` contains ["World", "Java"].

</details>

**Question 2:** Which method declaration is valid?
- A) `public void method(String... args, int count)`
- B) `public void method(int count, String... args)`
- C) `public void method(String... args1, String... args2)`
- D) `public void method(String args...)`

<details>
<summary>Click for answer</summary>

**Answer:** B) `public void method(int count, String... args)`

Varargs must be the last parameter, only one varargs per method is allowed, and the syntax is `type... name`, not `type name...`.

</details>

## 🎯 OCA Exam Tips

1. **Varargs must be last parameter** in method signature
2. **Only one varargs parameter** per method
3. **Varargs is treated as array** inside the method
4. **Can pass zero arguments** to varargs parameter
5. **Can pass array** to varargs parameter
6. **@SafeVarargs** suppresses heap pollution warnings for generic varargs

## 📚 Best Practices

1. **Use varargs sparingly** - only when you truly need variable arguments
2. **Consider overloading** for common cases (0, 1, 2 arguments)
3. **Use @SafeVarargs** only when method is actually safe
4. **Validate input** - check for null arrays/elements
5. **Document expected usage** - especially for generic varargs
6. **Prefer specific types** over Object... when possible

## Related Topics

- [32. Methods](32-methods.md) - Method fundamentals and overloading
- [21. Arrays](21-arrays.md) - Array operations and iteration
- [51. Generics](51-generics.md) - Generic type parameters with varargs
- [22. List Object](22-list-object.md) - Collections and varargs

---

*This tutorial covers Varargs in Java, providing flexible method signatures that can accept a variable number of arguments of the same type.*

## Video Tutorials

[Learn VARARGS in 6 minutes! 💬 - Bro Code](https://www.youtube.com/watch?v=2knxgAFqwKk)

[Learn Java Programming - Varargs Array Part 1 Tutorial - Daniel Ross](https://www.youtube.com/watch?v=O2pG6lVvYhQ)

[Learn Java Programming - Varargs Array Part 2 Tutorial - Daniel Ross](https://www.youtube.com/watch?v=ztKY9_ThIaY)
