# 51. Generics

**Related:** [22. List Object](22-list-object.md) | [23. Set Object](23-set-object.md) | [24. Map Object](24-map-object.md)

---

## 🧠 What are Generics?

Generics in Java allow you to write code that works with different types while providing compile-time type safety. They enable you to create classes, interfaces, and methods that operate on a parameterized type.

**Real-world analogy:** Think of generics like a generic prescription bottle. The bottle (container) is the same, but you can specify what type of medicine (data type) goes inside it. A `List<String>` is like a bottle specifically for storing strings.

## 🎯 Why Use Generics?

### Before Generics (Java 1.4 and earlier)
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
```java
// WRONG - mixing raw types and generics
List rawList = new ArrayList();
List<String> stringList = rawList;  // Unchecked warning

// CORRECT - consistent generic usage
List<String> stringList = new ArrayList<String>();
```

### 2. Cannot Instantiate Generic Types
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
```java
// WRONG - cannot create arrays of generic types
// List<String>[] arrayOfLists = new List<String>[10];  // Compile error

// CORRECT - use List of Lists or raw array
List<List<String>> listOfLists = new ArrayList<>();
List[] arrayOfLists = new List[10];  // Raw type array (not recommended)
```

### 4. Static Context Cannot Use Class Type Parameters
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
