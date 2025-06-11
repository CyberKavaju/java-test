# 54. StringBuilder

**Related:** [18. String Class](18-string-class.md) | [04. Variable](04-variable.md)

---

## 🧠 What is StringBuilder?

StringBuilder is a mutable class in Java that provides an efficient way to manipulate strings. Unlike the String class, which is immutable, StringBuilder allows you to modify its content without creating new objects every time.

**Real-world analogy:** Think of String as writing with a pen on paper - once written, you can't change it and need a new piece of paper for any modification. StringBuilder is like writing with a pencil on an eraser board - you can erase, modify, and add content on the same surface.

## 🎯 Why Use StringBuilder?

### Performance Comparison
```java
public class StringVsStringBuilder {
    public static void main(String[] args) {
        
        // INEFFICIENT - String concatenation
        long startTime = System.currentTimeMillis();
        String result = "";
        for (int i = 0; i < 10000; i++) {
            result += "Hello ";  // Creates new String object each time!
        }
        long stringTime = System.currentTimeMillis() - startTime;
        
        // EFFICIENT - StringBuilder
        startTime = System.currentTimeMillis();
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 10000; i++) {
            sb.append("Hello ");  // Modifies existing buffer
        }
        String sbResult = sb.toString();
        long sbTime = System.currentTimeMillis() - startTime;
        
        System.out.println("String concatenation time: " + stringTime + "ms");
        System.out.println("StringBuilder time: " + sbTime + "ms");
        System.out.println("StringBuilder is " + (stringTime / sbTime) + "x faster");
    }
}
```

### Memory Efficiency
```java
public class MemoryComparison {
    public static void main(String[] args) {
        // String concatenation creates many temporary objects
        String str = "Hello";
        str = str + " World";    // Creates new String object
        str = str + "!";         // Creates another new String object
        // Original "Hello" and "Hello World" objects become garbage
        
        // StringBuilder reuses the same buffer
        StringBuilder sb = new StringBuilder("Hello");
        sb.append(" World");     // Modifies existing buffer
        sb.append("!");          // Still using same buffer
        String result = sb.toString();  // Only creates final String
        
        System.out.println("Final result: " + result);
    }
}
```

## ✅ Creating StringBuilder

### Constructors
```java
public class StringBuilderConstructors {
    public static void main(String[] args) {
        // Default constructor - capacity 16
        StringBuilder sb1 = new StringBuilder();
        System.out.println("Default capacity: " + sb1.capacity());
        
        // Constructor with initial capacity
        StringBuilder sb2 = new StringBuilder(50);
        System.out.println("Custom capacity: " + sb2.capacity());
        
        // Constructor with initial string
        StringBuilder sb3 = new StringBuilder("Hello World");
        System.out.println("From string: '" + sb3 + "'");
        System.out.println("Length: " + sb3.length());
        System.out.println("Capacity: " + sb3.capacity());
        
        // Constructor from CharSequence
        StringBuilder sb4 = new StringBuilder("Initial Text");
        StringBuilder sb5 = new StringBuilder(sb4);  // Copy constructor
        System.out.println("Copied: '" + sb5 + "'");
    }
}
```

## ✅ Common StringBuilder Methods

### Append Methods
```java
public class AppendMethods {
    public static void main(String[] args) {
        StringBuilder sb = new StringBuilder();
        
        // Append different types
        sb.append("Hello ");          // String
        sb.append(123);               // int
        sb.append(' ');               // char
        sb.append(45.67);             // double
        sb.append(true);              // boolean
        sb.append(new char[]{'!', '!'}); // char array
        
        System.out.println("Result: " + sb);  // "Hello 123 45.67true!!"
        
        // Method chaining
        StringBuilder chained = new StringBuilder()
            .append("Java ")
            .append("is ")
            .append("awesome")
            .append("!");
        
        System.out.println("Chained: " + chained);  // "Java is awesome!"
        
        // Append with offset
        char[] chars = {'A', 'B', 'C', 'D', 'E'};
        StringBuilder sb2 = new StringBuilder();
        sb2.append(chars, 1, 3);  // Append BCD (offset 1, length 3)
        System.out.println("Partial array: " + sb2);  // "BCD"
    }
}
```

### Insert Methods
```java
public class InsertMethods {
    public static void main(String[] args) {
        StringBuilder sb = new StringBuilder("Hello World");
        
        // Insert at specific position
        sb.insert(5, " Beautiful");
        System.out.println("After insert: " + sb);  // "Hello Beautiful World"
        
        // Insert different types
        StringBuilder sb2 = new StringBuilder("Java Programming");
        sb2.insert(5, 8);           // Insert number
        sb2.insert(0, "Advanced "); // Insert at beginning
        sb2.insert(sb2.length(), "!"); // Insert at end
        
        System.out.println("Multiple inserts: " + sb2);
        
        // Insert char array
        char[] chars = {'*', '*', '*'};
        StringBuilder sb3 = new StringBuilder("Important");
        sb3.insert(0, chars);
        System.out.println("With chars: " + sb3);  // "***Important"
    }
}
```

### Delete and Replace Methods
```java
public class DeleteReplaceMethods {
    public static void main(String[] args) {
        // Delete methods
        StringBuilder sb = new StringBuilder("Hello Beautiful World");
        
        // Delete substring
        sb.delete(5, 15);  // Delete " Beautiful"
        System.out.println("After delete: " + sb);  // "Hello World"
        
        // Delete single character
        sb.deleteCharAt(5);  // Delete space
        System.out.println("After deleteCharAt: " + sb);  // "HelloWorld"
        
        // Replace substring
        StringBuilder sb2 = new StringBuilder("Hello World");
        sb2.replace(6, 11, "Java");  // Replace "World" with "Java"
        System.out.println("After replace: " + sb2);  // "Hello Java"
        
        // Reverse
        StringBuilder sb3 = new StringBuilder("Hello");
        sb3.reverse();
        System.out.println("Reversed: " + sb3);  // "olleH"
        
        // Set character at index
        StringBuilder sb4 = new StringBuilder("Hello");
        sb4.setCharAt(1, 'a');
        System.out.println("After setCharAt: " + sb4);  // "Hallo"
    }
}
```

### Capacity Management
```java
public class CapacityManagement {
    public static void main(String[] args) {
        StringBuilder sb = new StringBuilder();
        
        System.out.println("Initial capacity: " + sb.capacity());
        System.out.println("Initial length: " + sb.length());
        
        // Add content
        sb.append("Hello World");
        System.out.println("After append - length: " + sb.length() + 
                          ", capacity: " + sb.capacity());
        
        // Trigger capacity expansion
        for (int i = 0; i < 10; i++) {
            sb.append("More text ");
        }
        System.out.println("After expansion - length: " + sb.length() + 
                          ", capacity: " + sb.capacity());
        
        // Manually ensure capacity
        sb.ensureCapacity(100);
        System.out.println("After ensureCapacity(100): " + sb.capacity());
        
        // Trim to size
        sb.trimToSize();
        System.out.println("After trimToSize - length: " + sb.length() + 
                          ", capacity: " + sb.capacity());
        
        // Set length (can truncate or pad with null chars)
        sb.setLength(5);
        System.out.println("After setLength(5): '" + sb + "'");
        System.out.println("Length: " + sb.length() + ", capacity: " + sb.capacity());
    }
}
```

## 🔧 Practical Examples

### Building HTML Content
```java
public class HTMLBuilder {
    public static void main(String[] args) {
        StringBuilder html = new StringBuilder();
        
        // Build HTML document
        html.append("<!DOCTYPE html>\n")
            .append("<html>\n")
            .append("<head>\n")
            .append("    <title>My Page</title>\n")
            .append("</head>\n")
            .append("<body>\n");
        
        // Add content
        String[] items = {"Apple", "Banana", "Cherry", "Date"};
        html.append("    <h1>Fruit List</h1>\n")
            .append("    <ul>\n");
        
        for (String item : items) {
            html.append("        <li>").append(item).append("</li>\n");
        }
        
        html.append("    </ul>\n")
            .append("</body>\n")
            .append("</html>");
        
        System.out.println(html.toString());
    }
}
```

### CSV Data Processing
```java
import java.util.Arrays;
import java.util.List;

public class CSVBuilder {
    public static void main(String[] args) {
        List<String[]> data = Arrays.asList(
            new String[]{"Name", "Age", "City"},
            new String[]{"Alice", "25", "New York"},
            new String[]{"Bob", "30", "Los Angeles"},
            new String[]{"Charlie", "35", "Chicago"}
        );
        
        StringBuilder csv = new StringBuilder();
        
        for (String[] row : data) {
            for (int i = 0; i < row.length; i++) {
                csv.append(row[i]);
                if (i < row.length - 1) {
                    csv.append(",");
                }
            }
            csv.append("\n");
        }
        
        System.out.println("CSV Output:");
        System.out.println(csv.toString());
        
        // Alternative using String.join (Java 8+)
        StringBuilder csv2 = new StringBuilder();
        for (String[] row : data) {
            csv2.append(String.join(",", row)).append("\n");
        }
        
        System.out.println("CSV Output (using join):");
        System.out.println(csv2.toString());
    }
}
```

### Log Message Builder
```java
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class LogBuilder {
    private StringBuilder logBuffer;
    
    public LogBuilder() {
        this.logBuffer = new StringBuilder();
    }
    
    public LogBuilder addTimestamp() {
        String timestamp = LocalDateTime.now()
            .format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        logBuffer.append("[").append(timestamp).append("] ");
        return this;
    }
    
    public LogBuilder addLevel(String level) {
        logBuffer.append("[").append(level.toUpperCase()).append("] ");
        return this;
    }
    
    public LogBuilder addMessage(String message) {
        logBuffer.append(message);
        return this;
    }
    
    public LogBuilder addException(Exception e) {
        logBuffer.append(" - Exception: ").append(e.getClass().getSimpleName())
                 .append(": ").append(e.getMessage());
        return this;
    }
    
    public LogBuilder newLine() {
        logBuffer.append("\n");
        return this;
    }
    
    public String build() {
        return logBuffer.toString();
    }
    
    public void clear() {
        logBuffer.setLength(0);  // Efficient way to clear
    }
    
    public static void main(String[] args) {
        LogBuilder logger = new LogBuilder();
        
        // Build various log messages
        String infoLog = logger
            .addTimestamp()
            .addLevel("info")
            .addMessage("Application started successfully")
            .build();
        
        logger.clear();
        
        String errorLog = logger
            .addTimestamp()
            .addLevel("error")
            .addMessage("Failed to connect to database")
            .addException(new RuntimeException("Connection timeout"))
            .build();
        
        System.out.println(infoLog);
        System.out.println(errorLog);
    }
}
```

## 🔄 StringBuilder vs StringBuffer

### Thread Safety Comparison
```java
public class StringBuilderVsStringBuffer {
    public static void main(String[] args) {
        // StringBuilder - NOT thread-safe, but faster
        StringBuilder sb = new StringBuilder();
        
        // StringBuffer - thread-safe (synchronized), but slower
        StringBuffer sbf = new StringBuffer();
        
        // Same methods available in both
        sb.append("Hello ").append("World");
        sbf.append("Hello ").append("World");
        
        System.out.println("StringBuilder: " + sb);
        System.out.println("StringBuffer: " + sbf);
        
        // Performance comparison
        long startTime = System.currentTimeMillis();
        StringBuilder sb1 = new StringBuilder();
        for (int i = 0; i < 100000; i++) {
            sb1.append("test");
        }
        long sbTime = System.currentTimeMillis() - startTime;
        
        startTime = System.currentTimeMillis();
        StringBuffer sbf1 = new StringBuffer();
        for (int i = 0; i < 100000; i++) {
            sbf1.append("test");
        }
        long sbfTime = System.currentTimeMillis() - startTime;
        
        System.out.println("StringBuilder time: " + sbTime + "ms");
        System.out.println("StringBuffer time: " + sbfTime + "ms");
    }
}
```

## ⚠️ OCA Pitfalls

### 1. StringBuilder is Mutable
```java
public void demonstrateMutability() {
    StringBuilder sb = new StringBuilder("Hello");
    modifyStringBuilder(sb);
    System.out.println(sb);  // "Hello World" - sb was modified!
}

public void modifyStringBuilder(StringBuilder sb) {
    sb.append(" World");  // Modifies the original StringBuilder
}
```

### 2. Index Out of Bounds
```java
StringBuilder sb = new StringBuilder("Hello");
// sb.charAt(10);     // StringIndexOutOfBoundsException
// sb.insert(10, "x"); // StringIndexOutOfBoundsException

// Always check bounds
if (index >= 0 && index < sb.length()) {
    char c = sb.charAt(index);
}
```

### 3. Capacity vs Length Confusion
```java
StringBuilder sb = new StringBuilder(20);  // Capacity 20
System.out.println(sb.length());    // 0 (no content)
System.out.println(sb.capacity());  // 20 (allocated space)

sb.append("Hello");
System.out.println(sb.length());    // 5 (content length)
System.out.println(sb.capacity());  // 20 (still same capacity)
```

### 4. toString() Returns String
```java
StringBuilder sb = new StringBuilder("Hello");
String str = sb.toString();  // Creates new String object
sb.append(" World");         // Doesn't affect str
System.out.println(str);     // "Hello" (unchanged)
System.out.println(sb);      // "Hello World"
```

## 🧪 Quick Quiz

**Question 1:** What will be the output?
```java
StringBuilder sb = new StringBuilder("Java");
sb.insert(2, "XX").delete(1, 3);
System.out.println(sb);
```

<details>
<summary>Click for answer</summary>

**Answer:** `JXXva`

1. Start with "Java"
2. Insert "XX" at position 2: "JaXXva"
3. Delete from position 1 to 3 (exclusive): "J" + "Xva" = "JXva"

Wait, let me recalculate:
1. "Java" → insert "XX" at position 2 → "JaXXva"
2. Delete from 1 to 3 → removes "aX" → "JXXva"

Actually: "JXXva"

</details>

**Question 2:** Which is more efficient for concatenating many strings?
- A) String concatenation with +
- B) StringBuilder.append()
- C) StringBuffer.append()
- D) All are equally efficient

<details>
<summary>Click for answer</summary>

**Answer:** B) StringBuilder.append()

StringBuilder is most efficient for single-threaded operations because it's mutable and not synchronized. String concatenation creates many temporary objects.

</details>

## 🎯 OCA Exam Tips

1. **StringBuilder is mutable** - changes affect the original object
2. **Capacity != Length** - capacity is allocated space, length is actual content
3. **Method chaining** - most methods return StringBuilder for chaining
4. **Index-based methods** can throw StringIndexOutOfBoundsException
5. **toString()** creates a new String object
6. **Use StringBuilder for multiple concatenations** in loops

## 📚 Best Practices

1. **Use StringBuilder for multiple concatenations** - especially in loops
2. **Set initial capacity** if you know approximate final size
3. **Use method chaining** for readability
4. **Consider StringBuffer** only if thread safety is needed
5. **Clear buffer efficiently** with `setLength(0)`
6. **Convert to String only when needed** with `toString()`

## Related Topics

- [18. String Class](18-string-class.md) - String fundamentals and immutability
- [04. Variable](04-variable.md) - Variable types and declarations
- [20. Looping Constructs](20-looping-constructs.md) - Using StringBuilder in loops
- [26. Exception Handling](26-exception-handling.md) - Handling StringIndexOutOfBoundsException

---

*This tutorial covers StringBuilder in Java, providing efficient string manipulation capabilities for building and modifying strings.*
