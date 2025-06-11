# 53. Streams API

**Related:** [22. List Object](22-list-object.md) | [23. Set Object](23-set-object.md) | [45. Lambda Expressions](45-lambda-expressions.md)

---

## 🧠 What is the Streams API?

The Streams API, introduced in Java 8, provides a powerful and expressive way to process collections of data using functional programming concepts. Streams allow you to perform complex data processing operations in a declarative and readable manner.

**Real-world analogy:** Think of a stream like an assembly line in a factory. Data flows through the line, and at each station (operation), something is done to transform, filter, or collect the data. Unlike collections, streams don't store data - they process it on-demand.

## 🎯 Why Use Streams?

### Benefits
- **Declarative**: Focus on what to do, not how to do it
- **Composable**: Chain operations together naturally
- **Parallel processing**: Easy parallelization with `.parallelStream()`
- **Lazy evaluation**: Operations are only performed when needed
- **Functional style**: Immutable operations, no side effects

### Traditional vs Streams Approach
```java
import java.util.*;
import java.util.stream.*;

public class StreamsComparison {
    public static void main(String[] args) {
        List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
        
        // Traditional approach - filter even numbers and square them
        List<Integer> traditionalResult = new ArrayList<>();
        for (Integer num : numbers) {
            if (num % 2 == 0) {
                traditionalResult.add(num * num);
            }
        }
        System.out.println("Traditional: " + traditionalResult);
        
        // Streams approach - same operation
        List<Integer> streamResult = numbers.stream()
            .filter(n -> n % 2 == 0)     // Filter even numbers
            .map(n -> n * n)             // Square them
            .collect(Collectors.toList()); // Collect to list
        
        System.out.println("Streams: " + streamResult);
        // Both output: [4, 16, 36, 64, 100]
    }
}
```

## ✅ Creating Streams

### From Collections
```java
import java.util.*;
import java.util.stream.*;

public class CreatingStreams {
    public static void main(String[] args) {
        // From List
        List<String> names = Arrays.asList("Alice", "Bob", "Charlie");
        Stream<String> nameStream = names.stream();
        
        // From Set
        Set<Integer> numbers = Set.of(1, 2, 3, 4, 5);
        Stream<Integer> numberStream = numbers.stream();
        
        // From Array
        String[] colors = {"Red", "Green", "Blue"};
        Stream<String> colorStream = Arrays.stream(colors);
        
        // Using Stream.of()
        Stream<String> fruitStream = Stream.of("Apple", "Banana", "Orange");
        
        // Using Stream.generate() - infinite stream
        Stream<Double> randomStream = Stream.generate(Math::random).limit(5);
        
        // Using Stream.iterate() - infinite stream
        Stream<Integer> evenNumbers = Stream.iterate(0, n -> n + 2).limit(10);
        
        // Range streams
        IntStream range = IntStream.range(1, 11);      // 1 to 10
        IntStream rangeClosed = IntStream.rangeClosed(1, 10); // 1 to 10 inclusive
        
        // Parallel streams
        Stream<String> parallelStream = names.parallelStream();
    }
}
```

## ✅ Intermediate Operations

### Filter
```java
import java.util.*;
import java.util.stream.*;

public class FilterExamples {
    public static void main(String[] args) {
        List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
        
        // Filter even numbers
        List<Integer> evenNumbers = numbers.stream()
            .filter(n -> n % 2 == 0)
            .collect(Collectors.toList());
        System.out.println("Even numbers: " + evenNumbers);
        
        // Filter numbers greater than 5
        List<Integer> greaterThanFive = numbers.stream()
            .filter(n -> n > 5)
            .collect(Collectors.toList());
        System.out.println("Greater than 5: " + greaterThanFive);
        
        // Multiple filters
        List<Integer> filteredNumbers = numbers.stream()
            .filter(n -> n % 2 == 0)     // Even
            .filter(n -> n > 4)          // Greater than 4
            .collect(Collectors.toList());
        System.out.println("Even and > 4: " + filteredNumbers);
    }
}
```

### Map
```java
import java.util.*;
import java.util.stream.*;

public class MapExamples {
    public static void main(String[] args) {
        List<String> words = Arrays.asList("hello", "world", "java", "streams");
        
        // Transform to uppercase
        List<String> upperCase = words.stream()
            .map(String::toUpperCase)
            .collect(Collectors.toList());
        System.out.println("Uppercase: " + upperCase);
        
        // Transform to lengths
        List<Integer> lengths = words.stream()
            .map(String::length)
            .collect(Collectors.toList());
        System.out.println("Lengths: " + lengths);
        
        // Transform numbers
        List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);
        List<Integer> squares = numbers.stream()
            .map(n -> n * n)
            .collect(Collectors.toList());
        System.out.println("Squares: " + squares);
        
        // Transform objects
        List<Person> people = Arrays.asList(
            new Person("Alice", 25),
            new Person("Bob", 30),
            new Person("Charlie", 35)
        );
        
        List<String> personNames = people.stream()
            .map(Person::getName)
            .collect(Collectors.toList());
        System.out.println("Names: " + personNames);
    }
}

class Person {
    private String name;
    private int age;
    
    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }
    
    public String getName() { return name; }
    public int getAge() { return age; }
}
```

### FlatMap
```java
import java.util.*;
import java.util.stream.*;

public class FlatMapExamples {
    public static void main(String[] args) {
        // Flatten list of lists
        List<List<Integer>> listOfLists = Arrays.asList(
            Arrays.asList(1, 2, 3),
            Arrays.asList(4, 5, 6),
            Arrays.asList(7, 8, 9)
        );
        
        List<Integer> flattenedList = listOfLists.stream()
            .flatMap(List::stream)
            .collect(Collectors.toList());
        System.out.println("Flattened: " + flattenedList);
        
        // Split strings into words
        List<String> sentences = Arrays.asList(
            "Hello world",
            "Java streams",
            "Are powerful"
        );
        
        List<String> allWords = sentences.stream()
            .flatMap(sentence -> Arrays.stream(sentence.split(" ")))
            .collect(Collectors.toList());
        System.out.println("All words: " + allWords);
        
        // Get all characters
        List<String> words = Arrays.asList("hello", "world");
        List<String> allCharacters = words.stream()
            .flatMap(word -> word.chars()
                .mapToObj(c -> String.valueOf((char) c)))
            .collect(Collectors.toList());
        System.out.println("All characters: " + allCharacters);
    }
}
```

### Distinct, Sorted, Limit, Skip
```java
import java.util.*;
import java.util.stream.*;

public class StreamOperations {
    public static void main(String[] args) {
        List<Integer> numbers = Arrays.asList(3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5);
        
        // Remove duplicates
        List<Integer> distinctNumbers = numbers.stream()
            .distinct()
            .collect(Collectors.toList());
        System.out.println("Distinct: " + distinctNumbers);
        
        // Sort
        List<Integer> sortedNumbers = numbers.stream()
            .distinct()
            .sorted()
            .collect(Collectors.toList());
        System.out.println("Sorted: " + sortedNumbers);
        
        // Sort in reverse order
        List<Integer> reverseSorted = numbers.stream()
            .distinct()
            .sorted(Comparator.reverseOrder())
            .collect(Collectors.toList());
        System.out.println("Reverse sorted: " + reverseSorted);
        
        // Limit to first 5
        List<Integer> limited = numbers.stream()
            .distinct()
            .sorted()
            .limit(5)
            .collect(Collectors.toList());
        System.out.println("Limited to 5: " + limited);
        
        // Skip first 3
        List<Integer> skipped = numbers.stream()
            .distinct()
            .sorted()
            .skip(3)
            .collect(Collectors.toList());
        System.out.println("Skipped first 3: " + skipped);
        
        // Combine operations
        List<Integer> processed = numbers.stream()
            .distinct()          // Remove duplicates
            .sorted()           // Sort ascending
            .skip(2)            // Skip first 2
            .limit(4)           // Take next 4
            .collect(Collectors.toList());
        System.out.println("Processed: " + processed);
    }
}
```

## ✅ Terminal Operations

### Collect
```java
import java.util.*;
import java.util.stream.*;

public class CollectExamples {
    public static void main(String[] args) {
        List<String> words = Arrays.asList("apple", "banana", "cherry", "date");
        
        // Collect to List
        List<String> upperWords = words.stream()
            .map(String::toUpperCase)
            .collect(Collectors.toList());
        
        // Collect to Set
        Set<Integer> lengths = words.stream()
            .map(String::length)
            .collect(Collectors.toSet());
        
        // Collect to Map
        Map<String, Integer> wordLengths = words.stream()
            .collect(Collectors.toMap(
                word -> word,           // Key mapper
                String::length         // Value mapper
            ));
        
        // Joining strings
        String joined = words.stream()
            .collect(Collectors.joining(", "));
        System.out.println("Joined: " + joined);
        
        // Joining with prefix and suffix
        String joinedWithBrackets = words.stream()
            .collect(Collectors.joining(", ", "[", "]"));
        System.out.println("With brackets: " + joinedWithBrackets);
        
        // Grouping by length
        Map<Integer, List<String>> groupedByLength = words.stream()
            .collect(Collectors.groupingBy(String::length));
        System.out.println("Grouped by length: " + groupedByLength);
        
        // Partitioning (true/false grouping)
        Map<Boolean, List<String>> partitioned = words.stream()
            .collect(Collectors.partitioningBy(word -> word.length() > 5));
        System.out.println("Partitioned: " + partitioned);
    }
}
```

### Reduce
```java
import java.util.*;
import java.util.stream.*;

public class ReduceExamples {
    public static void main(String[] args) {
        List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);
        
        // Sum using reduce
        Optional<Integer> sum = numbers.stream()
            .reduce((a, b) -> a + b);
        System.out.println("Sum: " + sum.orElse(0));
        
        // Sum with identity
        Integer sumWithIdentity = numbers.stream()
            .reduce(0, (a, b) -> a + b);
        System.out.println("Sum with identity: " + sumWithIdentity);
        
        // Product
        Integer product = numbers.stream()
            .reduce(1, (a, b) -> a * b);
        System.out.println("Product: " + product);
        
        // Find maximum
        Optional<Integer> max = numbers.stream()
            .reduce(Integer::max);
        System.out.println("Max: " + max.orElse(0));
        
        // Find minimum
        Optional<Integer> min = numbers.stream()
            .reduce(Integer::min);
        System.out.println("Min: " + min.orElse(0));
        
        // Concatenate strings
        List<String> words = Arrays.asList("Hello", " ", "World", "!");
        String concatenated = words.stream()
            .reduce("", String::concat);
        System.out.println("Concatenated: " + concatenated);
    }
}
```

### Find and Match Operations
```java
import java.util.*;
import java.util.stream.*;

public class FindMatchExamples {
    public static void main(String[] args) {
        List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
        
        // Find first
        Optional<Integer> firstEven = numbers.stream()
            .filter(n -> n % 2 == 0)
            .findFirst();
        System.out.println("First even: " + firstEven.orElse(-1));
        
        // Find any (useful in parallel streams)
        Optional<Integer> anyEven = numbers.stream()
            .filter(n -> n % 2 == 0)
            .findAny();
        System.out.println("Any even: " + anyEven.orElse(-1));
        
        // Check if all match
        boolean allPositive = numbers.stream()
            .allMatch(n -> n > 0);
        System.out.println("All positive: " + allPositive);
        
        // Check if any match
        boolean anyGreaterThan5 = numbers.stream()
            .anyMatch(n -> n > 5);
        System.out.println("Any > 5: " + anyGreaterThan5);
        
        // Check if none match
        boolean noneNegative = numbers.stream()
            .noneMatch(n -> n < 0);
        System.out.println("None negative: " + noneNegative);
        
        // Count
        long evenCount = numbers.stream()
            .filter(n -> n % 2 == 0)
            .count();
        System.out.println("Even count: " + evenCount);
    }
}
```

## 🔧 Practical Examples

### Processing Employee Data
```java
import java.util.*;
import java.util.stream.*;

class Employee {
    private String name;
    private String department;
    private int salary;
    
    public Employee(String name, String department, int salary) {
        this.name = name;
        this.department = department;
        this.salary = salary;
    }
    
    // Getters
    public String getName() { return name; }
    public String getDepartment() { return department; }
    public int getSalary() { return salary; }
    
    @Override
    public String toString() {
        return name + " (" + department + ", $" + salary + ")";
    }
}

public class EmployeeStreamExample {
    public static void main(String[] args) {
        List<Employee> employees = Arrays.asList(
            new Employee("Alice", "Engineering", 75000),
            new Employee("Bob", "Marketing", 65000),
            new Employee("Charlie", "Engineering", 80000),
            new Employee("Diana", "Sales", 70000),
            new Employee("Eve", "Engineering", 85000),
            new Employee("Frank", "Marketing", 60000)
        );
        
        // Find all engineers with salary > 75000
        List<Employee> highPaidEngineers = employees.stream()
            .filter(emp -> emp.getDepartment().equals("Engineering"))
            .filter(emp -> emp.getSalary() > 75000)
            .collect(Collectors.toList());
        
        System.out.println("High-paid engineers:");
        highPaidEngineers.forEach(System.out::println);
        
        // Average salary by department
        Map<String, Double> avgSalaryByDept = employees.stream()
            .collect(Collectors.groupingBy(
                Employee::getDepartment,
                Collectors.averagingInt(Employee::getSalary)
            ));
        
        System.out.println("\nAverage salary by department:");
        avgSalaryByDept.forEach((dept, avg) -> 
            System.out.println(dept + ": $" + String.format("%.2f", avg)));
        
        // Highest paid employee
        Optional<Employee> highestPaid = employees.stream()
            .max(Comparator.comparing(Employee::getSalary));
        
        System.out.println("\nHighest paid: " + 
            highestPaid.map(Employee::toString).orElse("None"));
        
        // Total salary expense
        int totalSalary = employees.stream()
            .mapToInt(Employee::getSalary)
            .sum();
        
        System.out.println("\nTotal salary expense: $" + totalSalary);
    }
}
```

### File Processing Example
```java
import java.io.*;
import java.nio.file.*;
import java.util.*;
import java.util.stream.*;

public class FileProcessingExample {
    public static void main(String[] args) {
        try {
            // Read all lines from a file and process them
            List<String> lines = Arrays.asList(
                "apple,5,2.50",
                "banana,10,1.20",
                "cherry,3,4.00",
                "date,8,3.50",
                "elderberry,2,6.00"
            );
            
            // Parse CSV data and calculate total value
            double totalValue = lines.stream()
                .map(line -> line.split(","))
                .filter(parts -> parts.length == 3)
                .mapToDouble(parts -> 
                    Integer.parseInt(parts[1]) * Double.parseDouble(parts[2]))
                .sum();
            
            System.out.println("Total value: $" + String.format("%.2f", totalValue));
            
            // Find items with quantity > 5
            List<String> highQuantityItems = lines.stream()
                .map(line -> line.split(","))
                .filter(parts -> parts.length == 3)
                .filter(parts -> Integer.parseInt(parts[1]) > 5)
                .map(parts -> parts[0])
                .collect(Collectors.toList());
            
            System.out.println("High quantity items: " + highQuantityItems);
            
            // Group by price range
            Map<String, List<String>> priceGroups = lines.stream()
                .map(line -> line.split(","))
                .filter(parts -> parts.length == 3)
                .collect(Collectors.groupingBy(
                    parts -> {
                        double price = Double.parseDouble(parts[2]);
                        return price < 3.0 ? "Low" : price < 5.0 ? "Medium" : "High";
                    },
                    Collectors.mapping(parts -> parts[0], Collectors.toList())
                ));
            
            System.out.println("Price groups: " + priceGroups);
            
        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
        }
    }
}
```

## ⚠️ OCA Pitfalls

### 1. Streams are One-Time Use
```java
Stream<Integer> stream = Stream.of(1, 2, 3, 4, 5);
long count = stream.count();           // Terminal operation
// List<Integer> list = stream.collect(Collectors.toList()); // IllegalStateException!

// CORRECT - create new stream
Stream<Integer> stream1 = Stream.of(1, 2, 3, 4, 5);
Stream<Integer> stream2 = Stream.of(1, 2, 3, 4, 5);
long count2 = stream1.count();
List<Integer> list = stream2.collect(Collectors.toList());
```

### 2. Streams Don't Modify Original Collection
```java
List<Integer> numbers = new ArrayList<>(Arrays.asList(1, 2, 3));
numbers.stream()
    .filter(n -> n > 1)
    .forEach(n -> numbers.remove(n));  // DON'T DO THIS - concurrent modification

// CORRECT - create new collection
List<Integer> filtered = numbers.stream()
    .filter(n -> n > 1)
    .collect(Collectors.toList());
```

### 3. Lazy Evaluation
```java
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);

// This doesn't execute until terminal operation
Stream<Integer> processed = numbers.stream()
    .filter(n -> {
        System.out.println("Filtering " + n);  // Won't print
        return n % 2 == 0;
    })
    .map(n -> {
        System.out.println("Mapping " + n);    // Won't print
        return n * 2;
    });

// Only now does the processing happen
List<Integer> result = processed.collect(Collectors.toList());
```

## 🧪 Quick Quiz

**Question 1:** What will this code output?
```java
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);
int result = numbers.stream()
    .filter(n -> n % 2 == 0)
    .mapToInt(n -> n * n)
    .sum();
System.out.println(result);
```

<details>
<summary>Click for answer</summary>

**Answer:** `20`

The stream filters even numbers (2, 4), squares them (4, 16), then sums them (4 + 16 = 20).

</details>

**Question 2:** What happens if you try to use a stream twice?
- A) It processes the data twice
- B) It throws an IllegalStateException
- C) It returns cached results
- D) It creates a new stream automatically

<details>
<summary>Click for answer</summary>

**Answer:** B) It throws an IllegalStateException

Streams can only be used once. After a terminal operation, the stream is consumed and cannot be reused.

</details>

## 🎯 OCA Exam Tips

1. **Streams are one-time use** - after terminal operation, stream is consumed
2. **Intermediate operations are lazy** - only execute when terminal operation is called
3. **Streams don't modify source** - they create new streams/collections
4. **Use Optional** for operations that might not return a value
5. **Parallel streams** available with `.parallelStream()`
6. **Collectors** provide many useful terminal operations

## 📚 Best Practices

1. **Use method references** when possible for readability
2. **Keep lambda expressions simple** - extract complex logic to methods
3. **Choose appropriate terminal operations** - don't always collect to List
4. **Consider performance** - parallel streams for large datasets
5. **Use meaningful variable names** in lambdas
6. **Chain operations logically** - filter before map when possible

## Related Topics

- [45. Lambda Expressions](45-lambda-expressions.md) - Functional programming in Java
- [22. List Object](22-list-object.md) - Working with collections
- [23. Set Object](23-set-object.md) - Set operations
- [24. Map Object](24-map-object.md) - Map operations

---

*This tutorial covers the Streams API in Java 8+, providing powerful functional programming capabilities for processing collections of data.*
