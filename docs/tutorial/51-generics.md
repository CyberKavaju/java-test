# 51. Generics

**Related:** [22. List Object](22-list-object.md) | [23. Set Object](23-set-object.md) | [24. Map Object](24-map-object.md)

---

## 🧠 What are Generics?

Generics in Java allow you to write code that works with different types while providing compile-time type safety. They enable you to create classes, interfaces, and methods that operate on a parameterized type.

**Real-world analogy:** Think of generics like a generic prescription bottle. The bottle (container) is the same, but you can specify what type of medicine (data type) goes inside it. A `List<String>` is like a bottle specifically for storing strings.

## 🎯 Why Use Generics?

### Before Generics (Java 1.4 and earlier)

This example demonstrates the problems with using collections without generics. The code shows how easy it was to accidentally add different types of objects to the same collection, leading to runtime errors when trying to cast them back to the expected type. Without generics, we had no compile-time type checking, making our code prone to `ClassCastException` errors at runtime.

```java
import java.util.*;

public class WithoutGenerics {
    public static void main(String[] args) {
        List list = new ArrayList();  // Raw type - no type safety
        list.add("Hello");
        list.add("World");
        list.add(42);  // Oops! Added an Integer
        
        for (Object obj : list) {
            String str = (String) obj;  // Runtime ClassCastException!
            System.out.println(str.toUpperCase());
        }
    }
}
```

### With Generics (Java 5+)

This example shows how generics solve the type safety problem. By specifying `List<String>`, we tell the compiler that this list should only contain String objects. The compiler will prevent us from adding incompatible types and eliminates the need for casting when retrieving elements. This catches errors at compile-time rather than runtime, making our code safer and more reliable.

```java
import java.util.*;

public class WithGenerics {
    public static void main(String[] args) {
        List<String> list = new ArrayList<String>();  // Type-safe
        list.add("Hello");
        list.add("World");
        // list.add(42);  // Compile-time error - cannot add Integer
        
        for (String str : list) {  // No casting needed
            System.out.println(str.toUpperCase());
        }
    }
}
```

## ✅ Basic Generic Syntax

### Collections with Generics

This example demonstrates the basic syntax for using generics with common collection types. Each collection is parameterized with a specific type, ensuring type safety. The diamond operator (`<>`) introduced in Java 7 allows us to omit the type on the right side since it can be inferred from the left side declaration. This makes the code cleaner while maintaining the same type safety benefits.

```java
import java.util.*;

public class GenericCollections {
    public static void main(String[] args) {
        // List of Strings
        List<String> names = new ArrayList<String>();
        names.add("Alice");
        names.add("Bob");
        
        // Set of Integers
        Set<Integer> numbers = new HashSet<Integer>();
        numbers.add(1);
        numbers.add(2);
        numbers.add(3);
        
        // Map with String keys and Integer values
        Map<String, Integer> ages = new HashMap<String, Integer>();
        ages.put("Alice", 25);
        ages.put("Bob", 30);
        
        // Diamond operator (Java 7+)
        List<String> cities = new ArrayList<>();  // Type inferred
        Map<String, List<String>> countryToCities = new HashMap<>();
    }
}
```

### Nested Generics

This example shows how to use generics with complex nested data structures. These patterns are common in real-world applications where you need to organize data in hierarchical structures. For example, a matrix is a list of lists, student grades might be organized as a map where each subject maps to a list of scores, and configuration sets might contain multiple maps with different settings.

```java
import java.util.*;

public class NestedGenerics {
    public static void main(String[] args) {
        // List of Lists
        List<List<String>> matrix = new ArrayList<>();
        
        // Map where value is a List
        Map<String, List<Integer>> studentGrades = new HashMap<>();
        studentGrades.put("Math", Arrays.asList(85, 90, 88));
        studentGrades.put("Science", Arrays.asList(92, 87, 95));
        
        // Set of Maps
        Set<Map<String, String>> configurations = new HashSet<>();
    }
}
```

## ✅ Creating Generic Classes

### Simple Generic Class

This example demonstrates how to create a generic class that can work with any type. The `Box<T>` class uses a type parameter `T` which allows it to store and retrieve objects of any specified type while maintaining type safety. This is useful when you want to create reusable container classes that don't lose type information. The usage section shows how the same class can safely work with different types without requiring casting.

```java
public class Box<T> {
    private T content;
    
    public Box(T content) {
        this.content = content;
    }
    
    public T getContent() {
        return content;
    }
    
    public void setContent(T content) {
        this.content = content;
    }
    
    @Override
    public String toString() {
        return "Box containing: " + content;
    }
}

// Usage
public class GenericClassExample {
    public static void main(String[] args) {
        Box<String> stringBox = new Box<>("Hello");
        Box<Integer> intBox = new Box<>(42);
        Box<Double> doubleBox = new Box<>(3.14);
        
        System.out.println(stringBox.getContent().toUpperCase());  // Type-safe!
        System.out.println(intBox.getContent() + 10);              // Type-safe!
        System.out.println(doubleBox.getContent() * 2);            // Type-safe!
    }
}
```

### Multiple Type Parameters

This example shows how to create a generic class with multiple type parameters. The `Pair<T, U>` class can hold two values of potentially different types, making it useful for representing relationships like key-value pairs, coordinates, or any two related pieces of data. The multiple type parameters (`T` and `U`) allow each pair to have its own specific types while maintaining type safety for both elements.

```java
public class Pair<T, U> {
    private T first;
    private U second;
    
    public Pair(T first, U second) {
        this.first = first;
        this.second = second;
    }
    
    public T getFirst() { return first; }
    public U getSecond() { return second; }
    
    public void setFirst(T first) { this.first = first; }
    public void setSecond(U second) { this.second = second; }
    
    @Override
    public String toString() {
        return "(" + first + ", " + second + ")";
    }
}

// Usage
public class PairExample {
    public static void main(String[] args) {
        Pair<String, Integer> nameAge = new Pair<>("Alice", 25);
        Pair<Integer, String> idName = new Pair<>(100, "Bob");
        Pair<Double, Double> coordinates = new Pair<>(3.14, 2.71);
        
        System.out.println(nameAge);       // (Alice, 25)
        System.out.println(idName);        // (100, Bob)
        System.out.println(coordinates);   // (3.14, 2.71)
    }
}
```

## ✅ Generic Methods

### Static Generic Methods

This example demonstrates how to create generic methods that can work with different types without the class itself being generic. Each method declares its own type parameter `<T>` before the return type. These utility methods can be called on arrays of any type, making them highly reusable. The generic methods provide type safety while eliminating the need to write separate methods for each type.

```java
public class GenericMethods {
    
    // Generic method to swap array elements
    public static <T> void swap(T[] array, int i, int j) {
        T temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    
    // Generic method to find element in array
    public static <T> boolean contains(T[] array, T element) {
        for (T item : array) {
            if (item.equals(element)) {
                return true;
            }
        }
        return false;
    }
    
    // Generic method to print array
    public static <T> void printArray(T[] array) {
        for (T element : array) {
            System.out.print(element + " ");
        }
        System.out.println();
    }
    
    public static void main(String[] args) {
        String[] words = {"Hello", "World", "Java"};
        Integer[] numbers = {1, 2, 3, 4, 5};
        
        System.out.println("Before swap:");
        printArray(words);
        swap(words, 0, 2);
        System.out.println("After swap:");
        printArray(words);
        
        System.out.println("Contains 'Java': " + contains(words, "Java"));
        System.out.println("Contains 3: " + contains(numbers, 3));
    }
}
```

### Instance Generic Methods

This example shows how to create generic methods within a non-generic class. The `Calculator` class has methods that use bounded type parameters (`<T extends Number>`) to ensure the generic type is a subclass of Number. This allows the methods to work with any numeric type while providing access to numeric methods like `doubleValue()`. This is useful when you need methods that can handle different numeric types uniformly.

```java
public class Calculator {
    
    public <T extends Number> double add(T a, T b) {
        return a.doubleValue() + b.doubleValue();
    }
    
    public <T extends Number> double multiply(T a, T b) {
        return a.doubleValue() * b.doubleValue();
    }
    
    public static void main(String[] args) {
        Calculator calc = new Calculator();
        
        double result1 = calc.add(5, 3.14);           // Integer and Double
        double result2 = calc.multiply(2.5f, 4L);     // Float and Long
        
        System.out.println("Result 1: " + result1);  // 8.14
        System.out.println("Result 2: " + result2);  // 10.0
    }
}
```

## 🔒 Bounded Type Parameters

### Upper Bounds (extends)

This example demonstrates bounded type parameters using the `extends` keyword to restrict the types that can be used. The `average` method only accepts types that extend Number, ensuring we can call `doubleValue()` on the elements. The `findMax` method uses multiple bounds (`Number & Comparable<T>`), requiring the type to be both a Number and Comparable. This provides both numeric operations and comparison capabilities while maintaining type safety.

```java
import java.util.*;

public class BoundedGenerics {
    
    // Only accepts Number and its subclasses
    public static <T extends Number> double average(List<T> numbers) {
        double sum = 0.0;
        for (T num : numbers) {
            sum += num.doubleValue();
        }
        return sum / numbers.size();
    }
    
    // Multiple bounds
    public static <T extends Number & Comparable<T>> T findMax(List<T> list) {
        if (list.isEmpty()) return null;
        
        T max = list.get(0);
        for (T item : list) {
            if (item.compareTo(max) > 0) {
                max = item;
            }
        }
        return max;
    }
    
    public static void main(String[] args) {
        List<Integer> integers = Arrays.asList(1, 2, 3, 4, 5);
        List<Double> doubles = Arrays.asList(1.1, 2.2, 3.3, 4.4, 5.5);
        
        System.out.println("Integer average: " + average(integers));  // 3.0
        System.out.println("Double average: " + average(doubles));    // 3.3
        
        System.out.println("Max integer: " + findMax(integers));      // 5
        System.out.println("Max double: " + findMax(doubles));        // 5.5
    }
}
```

## 🔄 Wildcards

### Upper Bounded Wildcards (? extends)

This example demonstrates wildcards with upper bounds, which are used when you want to read from a collection but not modify it. The `? extends Number` wildcard means "any type that is Number or extends Number". This allows the method to accept lists of Integer, Double, Float, etc. The `copy` method shows a common pattern where you read from a source with `? extends T` and write to a destination with `? super T`, providing maximum flexibility for copying operations.

```java
import java.util.*;

public class WildcardExamples {
    
    // Read-only operations on collections
    public static double sumNumbers(List<? extends Number> numbers) {
        double sum = 0.0;
        for (Number num : numbers) {
            sum += num.doubleValue();
        }
        return sum;
    }
    
    // Copy elements from source to destination
    public static <T> void copy(List<? extends T> source, List<? super T> destination) {
        for (T item : source) {
            destination.add(item);
        }
    }
    
    public static void main(String[] args) {
        List<Integer> integers = Arrays.asList(1, 2, 3);
        List<Double> doubles = Arrays.asList(1.1, 2.2, 3.3);
        List<Float> floats = Arrays.asList(1.1f, 2.2f, 3.3f);
        
        // All work with ? extends Number
        System.out.println("Sum of integers: " + sumNumbers(integers));
        System.out.println("Sum of doubles: " + sumNumbers(doubles));
        System.out.println("Sum of floats: " + sumNumbers(floats));
        
        // Copy example
        List<Number> numbers = new ArrayList<>();
        copy(integers, numbers);  // Copy integers to numbers
        System.out.println("Copied numbers: " + numbers);
    }
}
```

### Lower Bounded Wildcards (? super)

This example demonstrates lower bounded wildcards, which are used when you want to add elements to a collection. The `? super Integer` wildcard means "any type that is Integer or a superclass of Integer". This allows the method to accept lists that can safely store Integer values, such as `List<Integer>`, `List<Number>`, or `List<Object>`. This pattern is useful when you need to add elements to a collection and want maximum flexibility in the target type.

```java
import java.util.*;

public class LowerBoundedWildcards {
    
    // Add elements to collection
    public static void addNumbers(List<? super Integer> list) {
        list.add(1);
        list.add(2);
        list.add(3);
    }
    
    public static void main(String[] args) {
        List<Integer> integers = new ArrayList<>();
        List<Number> numbers = new ArrayList<>();
        List<Object> objects = new ArrayList<>();
        
        // All accept ? super Integer
        addNumbers(integers);  // Integer is Integer
        addNumbers(numbers);   // Number is super of Integer
        addNumbers(objects);   // Object is super of Integer
        
        System.out.println("Integers: " + integers);
        System.out.println("Numbers: " + numbers);
        System.out.println("Objects: " + objects);
    }
}
```

### Unbounded Wildcards (?)

This example shows unbounded wildcards, which are used when you need to work with collections but don't care about the specific type. The `?` wildcard means "any type". This is useful for utility methods that perform generic operations like getting the size of a collection or printing its contents, where the specific type doesn't matter. These methods can work with collections of any type, making them highly reusable.

```java
import java.util.*;

public class UnboundedWildcards {
    
    public static void printList(List<?> list) {
        for (Object obj : list) {
            System.out.println(obj);
        }
    }
    
    public static int getSize(List<?> list) {
        return list.size();
    }
    
    public static void main(String[] args) {
        List<String> strings = Arrays.asList("Hello", "World");
        List<Integer> integers = Arrays.asList(1, 2, 3);
        List<Double> doubles = Arrays.asList(1.1, 2.2);
        
        printList(strings);   // Works with any type
        printList(integers);
        printList(doubles);
        
        System.out.println("Sizes: " + getSize(strings) + ", " + 
                          getSize(integers) + ", " + getSize(doubles));
    }
}
```

## ⚠️ OCA Pitfalls

### 1. Raw Types vs Generics

This example demonstrates the problems that can occur when mixing raw types (collections without generic parameters) with generic collections. Using raw types generates unchecked warnings and can lead to type safety issues. It's better to use consistent generic typing throughout your code to maintain type safety and avoid potential runtime errors.

```java
// WRONG - mixing raw types and generics
List rawList = new ArrayList();
List<String> stringList = rawList;  // Unchecked warning

// CORRECT - consistent generic usage
List<String> stringList = new ArrayList<String>();
```

### 2. Cannot Instantiate Generic Types

This example shows a common limitation of generics: you cannot directly create instances of generic type parameters because the actual type is not known at runtime due to type erasure. Instead, you need to use alternative approaches like passing a Class object to a factory method, which can then use reflection to create instances of the desired type.

```java
public class GenericClass<T> {
    // WRONG - cannot create instance of T
    // T instance = new T();  // Compile error
    
    // CORRECT - use factory method or Class parameter
    public static <T> T createInstance(Class<T> clazz) throws Exception {
        return clazz.newInstance();
    }
}
```

### 3. Generic Arrays Restrictions

This example illustrates the limitations around creating arrays of generic types. You cannot directly create arrays of parameterized types due to type safety concerns and type erasure. Instead, you should use collections like `List<List<String>>` for type-safe nested structures, or if you must use arrays, work with raw types (though this is not recommended due to reduced type safety).

```java
// WRONG - cannot create arrays of generic types
// List<String>[] arrayOfLists = new List<String>[10];  // Compile error

// CORRECT - use List of Lists or raw array
List<List<String>> listOfLists = new ArrayList<>();
List[] arrayOfLists = new List[10];  // Raw type array (not recommended)
```

### 4. Static Context Cannot Use Class Type Parameters

This example demonstrates that static methods cannot access the type parameters of their containing class because static members belong to the class itself, not to any particular instance. The class type parameter `T` is only available to instance members. Static methods that need generics must declare their own type parameters, as shown in the correct example with `<U>`.

```java
public class GenericClass<T> {
    // WRONG - static method cannot use T
    // public static T getDefault() { return null; }  // Compile error
    
    // CORRECT - declare own type parameter
    public static <U> U getDefault() { return null; }
}
```

## 🧪 Quick Quiz

**Question 1:** What will this code print?
```java
List<Integer> list = new ArrayList<>();
list.add(1);
list.add(2);
list.add(3);
System.out.println(list.get(0).getClass().getSimpleName());
```

<details>
<summary>Click for answer</summary>

**Answer:** `Integer`

Even though we added primitive `int` values, autoboxing converts them to `Integer` objects, which is what gets stored in the `List<Integer>`.

</details>

**Question 2:** Which declaration is valid?
- A) `List<int> numbers = new ArrayList<>();`
- B) `List<Integer> numbers = new ArrayList<>();`
- C) `List<String>[] arrays = new List<String>[10];`
- D) `List<> numbers = new ArrayList<Integer>();`

<details>
<summary>Click for answer</summary>

**Answer:** B) `List<Integer> numbers = new ArrayList<>();`

A is wrong (cannot use primitives in generics), C is wrong (cannot create arrays of generic types), D is wrong (invalid syntax).

</details>

## 🎯 OCA Exam Tips

1. **Primitives cannot be used** as generic type parameters (use wrapper classes)
2. **Diamond operator** `<>` can be used on the right side (Java 7+)
3. **Raw types** generate unchecked warnings but compile
4. **Type erasure** removes generic information at runtime
5. **Wildcards** are used for flexibility in method parameters
6. **Upper bounds** use `extends`, **lower bounds** use `super`

## 📚 Best Practices

1. **Always use generics** with collections
2. **Use diamond operator** for cleaner code
3. **Avoid raw types** to maintain type safety
4. **Use wildcards** for flexible method parameters
5. **Prefer `List<String>` over `ArrayList<String>`** for variables
6. **Use meaningful type parameter names** (T for Type, E for Element, K/V for Key/Value)

## Related Topics

- [22. List Object](22-list-object.md) - Generic collections
- [23. Set Object](23-set-object.md) - Generic sets
- [24. Map Object](24-map-object.md) - Generic maps
- [04. Variable](04-variable.md) - Variable types and declarations

---

*This tutorial covers Generics in Java, providing type safety and eliminating the need for casting in collections and other generic code.*

## Video learn more

[Generics In Java - Full Simple Tutorial - Coding with John](https://www.youtube.com/watch?v=OIozDnGYqIU)