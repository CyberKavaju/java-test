# 57. Autoboxing and Unboxing

**Related:** [04. Variable](04-variable.md) | [05. Variable Casting and Conversions](05-variable-casting-and-conversions.md)

---

## 🧠 What is Autoboxing and Unboxing?

Autoboxing and unboxing are automatic conversions between primitive types and their corresponding wrapper classes in Java. Autoboxing converts primitives to wrapper objects, while unboxing converts wrapper objects back to primitives.

**Real-world analogy:** Think of autoboxing like automatically gift-wrapping items when you need them wrapped, and unboxing like automatically unwrapping gifts when you need the actual item inside. Java does this conversion seamlessly behind the scenes.

## 🎯 Primitive Types vs Wrapper Classes

### The Eight Primitive-Wrapper Pairs
```java
public class PrimitiveWrapperPairs {
    public static void main(String[] args) {
        // Primitive types (lowercase, stored on stack)
        byte    primByte    = 127;
        short   primShort   = 32767;
        int     primInt     = 2147483647;
        long    primLong    = 9223372036854775807L;
        float   primFloat   = 3.14f;
        double  primDouble  = 3.14159;
        char    primChar    = 'A';
        boolean primBool    = true;
        
        // Wrapper classes (uppercase, objects on heap)
        Byte    wrapByte    = Byte.valueOf((byte) 127);
        Short   wrapShort   = Short.valueOf((short) 32767);
        Integer wrapInt     = Integer.valueOf(2147483647);
        Long    wrapLong    = Long.valueOf(9223372036854775807L);
        Float   wrapFloat   = Float.valueOf(3.14f);
        Double  wrapDouble  = Double.valueOf(3.14159);
        Character wrapChar  = Character.valueOf('A');
        Boolean wrapBool    = Boolean.valueOf(true);
        
        System.out.println("Primitives and their wrapper counterparts:");
        System.out.println("byte: " + primByte + " -> Byte: " + wrapByte);
        System.out.println("int: " + primInt + " -> Integer: " + wrapInt);
        System.out.println("boolean: " + primBool + " -> Boolean: " + wrapBool);
    }
}
```

## ✅ Autoboxing (Primitive → Wrapper)

### Automatic Conversion
```java
import java.util.*;

public class AutoboxingExamples {
    public static void main(String[] args) {
        // Manual boxing (old way)
        Integer manualBoxed = Integer.valueOf(42);
        
        // Autoboxing (automatic conversion)
        Integer autoBoxed = 42;  // int automatically converted to Integer
        
        System.out.println("Manual boxed: " + manualBoxed);
        System.out.println("Auto boxed: " + autoBoxed);
        
        // Autoboxing in collections (most common use case)
        List<Integer> numbers = new ArrayList<>();
        numbers.add(10);    // int 10 autoboxed to Integer
        numbers.add(20);    // int 20 autoboxed to Integer
        numbers.add(30);    // int 30 autoboxed to Integer
        
        System.out.println("Numbers list: " + numbers);
        
        // Autoboxing with different types
        List<Double> prices = new ArrayList<>();
        prices.add(19.99);  // double autoboxed to Double
        prices.add(25.50);  // double autoboxed to Double
        
        List<Boolean> flags = new ArrayList<>();
        flags.add(true);    // boolean autoboxed to Boolean
        flags.add(false);   // boolean autoboxed to Boolean
        
        System.out.println("Prices: " + prices);
        System.out.println("Flags: " + flags);
    }
}
```

### Method Parameters and Return Types
```java
public class AutoboxingMethods {
    
    // Method expecting wrapper type
    public static void processInteger(Integer number) {
        System.out.println("Processing Integer: " + number);
    }
    
    // Method returning wrapper type
    public static Double calculateAverage(int a, int b) {
        return (a + b) / 2.0;  // double result autoboxed to Double
    }
    
    // Method with wrapper parameter, primitive logic
    public static boolean isEven(Integer number) {
        return number % 2 == 0;  // Integer unboxed to int for calculation
    }
    
    public static void main(String[] args) {
        // Autoboxing when calling method
        processInteger(25);  // int 25 autoboxed to Integer
        
        // Autoboxing with return values
        Double average = calculateAverage(10, 20);  // Method returns Double
        System.out.println("Average: " + average);
        
        // Mixed autoboxing/unboxing
        Integer num = 15;  // Autoboxing
        boolean even = isEven(num);  // Parameter passed as Integer, unboxed inside method
        System.out.println(num + " is even: " + even);
    }
}
```

## ✅ Unboxing (Wrapper → Primitive)

### Automatic Conversion
```java
import java.util.*;

public class UnboxingExamples {
    public static void main(String[] args) {
        // Create wrapper objects
        Integer wrappedInt = 100;
        Double wrappedDouble = 3.14;
        Boolean wrappedBool = true;
        
        // Manual unboxing (old way)
        int manualUnboxed = wrappedInt.intValue();
        
        // Auto-unboxing (automatic conversion)
        int autoUnboxed = wrappedInt;  // Integer automatically converted to int
        double primitiveDouble = wrappedDouble;  // Double to double
        boolean primitiveBool = wrappedBool;     // Boolean to boolean
        
        System.out.println("Manual unboxed: " + manualUnboxed);
        System.out.println("Auto unboxed: " + autoUnboxed);
        
        // Unboxing in arithmetic operations
        Integer a = 10;
        Integer b = 20;
        int sum = a + b;  // Both Integers unboxed to int for addition
        
        System.out.println("Sum: " + sum);
        
        // Unboxing from collections
        List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);
        int total = 0;
        for (int number : numbers) {  // Each Integer unboxed to int
            total += number;
        }
        System.out.println("Total: " + total);
        
        // Unboxing in conditional expressions
        Boolean condition = false;
        if (condition) {  // Boolean unboxed to boolean
            System.out.println("Condition was true");
        } else {
            System.out.println("Condition was false");
        }
    }
}
```

### Unboxing in Expressions
```java
public class UnboxingInExpressions {
    public static void main(String[] args) {
        Integer x = 10;
        Integer y = 20;
        Double z = 3.5;
        
        // Arithmetic operations - unboxing happens automatically
        int result1 = x + y;      // Both unboxed to int
        double result2 = x * z;   // x unboxed to int, z unboxed to double
        boolean result3 = x < y;  // Both unboxed for comparison
        
        System.out.println("x + y = " + result1);
        System.out.println("x * z = " + result2);
        System.out.println("x < y = " + result3);
        
        // Increment/decrement operations
        Integer counter = 5;
        counter++;        // Unboxed to int, incremented, autoboxed back to Integer
        ++counter;        // Same process
        
        System.out.println("Counter after increment: " + counter);
        
        // Array indexing
        Integer[] array = {10, 20, 30, 40, 50};
        Integer index = 2;
        int value = array[index];  // index unboxed to int for array access
        
        System.out.println("Value at index " + index + ": " + value);
    }
}
```

## 🔧 Practical Examples

### Working with Collections
```java
import java.util.*;
import java.util.stream.Collectors;

public class CollectionsAutoboxing {
    public static void main(String[] args) {
        // Creating a list with autoboxing
        List<Integer> scores = new ArrayList<>();
        
        // Adding primitive values (autoboxed)
        scores.add(85);  // int → Integer
        scores.add(92);
        scores.add(78);
        scores.add(96);
        scores.add(88);
        
        // Processing with unboxing
        int total = 0;
        for (Integer score : scores) {
            total += score;  // Integer → int for addition
        }
        
        double average = total / (double) scores.size();
        System.out.println("Average score: " + average);
        
        // Using streams (lots of autoboxing/unboxing)
        List<Integer> highScores = scores.stream()
            .filter(score -> score >= 90)  // Integer unboxed for comparison
            .map(score -> score + 5)       // Unboxed, calculated, autoboxed back
            .collect(Collectors.toList());
        
        System.out.println("High scores with bonus: " + highScores);
        
        // Finding maximum (unboxing for comparison)
        Optional<Integer> maxScore = scores.stream().max(Integer::compareTo);
        if (maxScore.isPresent()) {
            int max = maxScore.get();  // Integer → int
            System.out.println("Maximum score: " + max);
        }
    }
}
```

### Method Overloading with Autoboxing
```java
public class OverloadingWithAutoboxing {
    
    // Method 1: primitive parameter
    public static void process(int number) {
        System.out.println("Processing primitive int: " + number);
    }
    
    // Method 2: wrapper parameter
    public static void process(Integer number) {
        System.out.println("Processing Integer wrapper: " + number);
    }
    
    // Method 3: different wrapper
    public static void process(Double number) {
        System.out.println("Processing Double wrapper: " + number);
    }
    
    public static void main(String[] args) {
        int primitiveInt = 10;
        Integer wrapperInt = 20;
        double primitiveDouble = 3.14;
        
        // Method resolution with autoboxing
        process(primitiveInt);    // Calls process(int) - exact match, no boxing
        process(wrapperInt);      // Calls process(Integer) - exact match, no unboxing
        process(30);              // Calls process(int) - exact match for literal
        
        // When autoboxing is needed
        process(primitiveDouble); // Calls process(Double) - double autoboxed to Double
        
        // Demonstrating preference for exact matches
        Object obj1 = primitiveInt;    // int autoboxed to Integer, then upcasted to Object
        Object obj2 = wrapperInt;      // Integer upcasted to Object, no boxing
        
        System.out.println("obj1 type: " + obj1.getClass().getSimpleName());
        System.out.println("obj2 type: " + obj2.getClass().getSimpleName());
    }
}
```

### Performance Considerations
```java
public class PerformanceExample {
    public static void main(String[] args) {
        // Performance test: primitive vs wrapper
        final int ITERATIONS = 1000000;
        
        // Test 1: Primitive operations
        long startTime = System.currentTimeMillis();
        int primitiveSum = 0;
        for (int i = 0; i < ITERATIONS; i++) {
            primitiveSum += i;  // No boxing/unboxing
        }
        long primitiveTime = System.currentTimeMillis() - startTime;
        
        // Test 2: Wrapper operations (lots of autoboxing/unboxing)
        startTime = System.currentTimeMillis();
        Integer wrapperSum = 0;
        for (int i = 0; i < ITERATIONS; i++) {
            wrapperSum += i;  // i autoboxed to Integer, then unboxed for addition
        }
        long wrapperTime = System.currentTimeMillis() - startTime;
        
        System.out.println("Primitive sum: " + primitiveSum + " (Time: " + primitiveTime + "ms)");
        System.out.println("Wrapper sum: " + wrapperSum + " (Time: " + wrapperTime + "ms)");
        System.out.println("Performance difference: " + (wrapperTime - primitiveTime) + "ms");
        
        // Memory usage difference
        demonstrateMemoryUsage();
    }
    
    private static void demonstrateMemoryUsage() {
        // Primitives use less memory
        int[] primitiveArray = new int[1000];  // 4 bytes per int
        
        // Wrappers use more memory (object overhead)
        Integer[] wrapperArray = new Integer[1000];  // Object overhead + 4 bytes per Integer
        for (int i = 0; i < 1000; i++) {
            wrapperArray[i] = i;  // Autoboxing creates new Integer objects
        }
        
        System.out.println("Created arrays with different memory footprints");
        System.out.println("Primitive array: Direct memory usage");
        System.out.println("Wrapper array: Higher memory usage due to object overhead");
    }
}
```

## ⚠️ OCA Pitfalls

### 1. NullPointerException on Unboxing
```java
public class NullPointerPitfall {
    public static void main(String[] args) {
        Integer nullInteger = null;
        
        // This will throw NullPointerException
        try {
            int primitive = nullInteger;  // Trying to unbox null
            System.out.println("This won't print: " + primitive);
        } catch (NullPointerException e) {
            System.out.println("NullPointerException when unboxing null: " + e);
        }
        
        // Safe way to handle potentially null wrappers
        Integer possiblyNull = getNumber();  // Might return null
        if (possiblyNull != null) {
            int safe = possiblyNull;  // Safe unboxing
            System.out.println("Safe unboxing: " + safe);
        } else {
            System.out.println("Cannot unbox null value");
        }
        
        // Using ternary operator safely
        int result = (possiblyNull != null) ? possiblyNull : 0;
        System.out.println("Safe with default: " + result);
    }
    
    private static Integer getNumber() {
        return Math.random() > 0.5 ? 42 : null;
    }
}
```

### 2. Reference Equality vs Value Equality
```java
public class EqualityPitfall {
    public static void main(String[] args) {
        // Integer caching for values -128 to 127
        Integer a = 100;    // From cache
        Integer b = 100;    // Same cached object
        Integer c = 200;    // New object
        Integer d = 200;    // Different new object
        
        System.out.println("=== Reference Equality (==) ===");
        System.out.println("a == b (100): " + (a == b));    // true - same cached object
        System.out.println("c == d (200): " + (c == d));    // false - different objects
        
        System.out.println("=== Value Equality (.equals()) ===");
        System.out.println("a.equals(b): " + a.equals(b));  // true - same value
        System.out.println("c.equals(d): " + c.equals(d));  // true - same value
        
        // Mixing primitives and wrappers
        int primitive = 100;
        Integer wrapper = 100;
        
        System.out.println("=== Mixed Comparison ===");
        System.out.println("primitive == wrapper: " + (primitive == wrapper));  // true - wrapper unboxed
        
        // Dangerous pattern
        Integer x = 128;
        Integer y = 128;
        if (x == y) {  // DON'T DO THIS - use .equals() for wrapper comparison
            System.out.println("This might not print for values outside cache range");
        } else {
            System.out.println("Different objects for 128 (outside cache range)");
        }
        
        // Correct way
        if (x.equals(y)) {
            System.out.println("Values are equal using .equals()");
        }
    }
}
```

### 3. Performance Impact
```java
public class PerformancePitfall {
    public static void main(String[] args) {
        // INEFFICIENT - creates many Integer objects
        Integer sum = 0;
        for (int i = 0; i < 1000; i++) {
            sum += i;  // sum unboxed, added to i, result autoboxed to new Integer
        }
        System.out.println("Inefficient sum: " + sum);
        
        // EFFICIENT - use primitives for calculations
        int efficientSum = 0;
        for (int i = 0; i < 1000; i++) {
            efficientSum += i;  // All primitive operations
        }
        Integer finalResult = efficientSum;  // Box only once at the end
        System.out.println("Efficient sum: " + finalResult);
        
        // VERY INEFFICIENT - repeated boxing in loop
        List<Integer> numbers = new ArrayList<>();
        for (int i = 0; i < 1000; i++) {
            numbers.add(new Integer(i));  // Explicit boxing (deprecated)
        }
        
        // BETTER - let autoboxing handle it
        List<Integer> betterNumbers = new ArrayList<>();
        for (int i = 0; i < 1000; i++) {
            betterNumbers.add(i);  // Autoboxing handles it efficiently
        }
    }
}
```

## 🧪 Quick Quiz

**Question 1:** What will this code output?
```java
Integer a = 127;
Integer b = 127;
Integer c = 128;
Integer d = 128;

System.out.println(a == b);
System.out.println(c == d);
```

<details>
<summary>Click for answer</summary>

**Answer:**
```
true
false
```

Integer caching occurs for values -128 to 127. So `a` and `b` reference the same cached object (true), but `c` and `d` are different objects (false).

</details>

**Question 2:** What happens when you try to unbox a null Integer?
- A) Returns 0
- B) Returns null
- C) Throws NullPointerException
- D) Compilation error

<details>
<summary>Click for answer</summary>

**Answer:** C) Throws NullPointerException

Attempting to unbox a null wrapper object results in a runtime NullPointerException.

</details>

## 🎯 OCA Exam Tips

1. **Autoboxing converts primitives to wrappers** automatically
2. **Unboxing converts wrappers to primitives** automatically
3. **Unboxing null throws NullPointerException** at runtime
4. **Integer caching** for values -128 to 127 affects `==` comparisons
5. **Use .equals() for wrapper comparisons**, not `==`
6. **Autoboxing/unboxing can impact performance** in loops

## 📚 Best Practices

1. **Use primitives for calculations** - box only when necessary
2. **Always null-check before unboxing** wrapper objects
3. **Use .equals() for wrapper comparison** - never rely on `==`
4. **Avoid unnecessary boxing** in performance-critical code
5. **Be aware of Integer caching** behavior for small values
6. **Prefer primitive collections** (like IntStream) when possible

## Related Topics

- [04. Variable](04-variable.md) - Variable types and declarations
- [05. Variable Casting and Conversions](05-variable-casting-and-conversions.md) - Type conversions
- [22. List Object](22-list-object.md) - Collections and autoboxing
- [51. Generics](51-generics.md) - Generic collections with wrapper types

---

*This tutorial covers Autoboxing and Unboxing in Java, automatic conversions between primitive types and their wrapper classes that enable seamless integration with collections and generic code.*
