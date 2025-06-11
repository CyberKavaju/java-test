# 56. Final Keyword

**Related:** [04. Variable](04-variable.md) | [28. Classes and Objects](28-classes-and-objects.md) | [32. Methods](32-methods.md)

---

## 🧠 What is the Final Keyword?

The `final` keyword in Java is a modifier that can be applied to variables, methods, and classes to restrict their modification or extension. It ensures immutability, prevents inheritance, or stops method overriding depending on the context.

**Real-world analogy:** Think of `final` like a seal on an envelope. Once sealed (marked as final), the contents cannot be changed. For variables, the value is sealed; for methods, the implementation is sealed; for classes, the inheritance is sealed.

## 🎯 Final Variables

### Final Local Variables
```java
public class FinalVariables {
    public static void main(String[] args) {
        // Final primitive variable
        final int x = 10;
        // x = 20;  // Compile error - cannot reassign final variable
        
        System.out.println("Final int: " + x);
        
        // Final can be initialized later (blank final)
        final String message;
        if (true) {
            message = "Hello World";  // Must be assigned exactly once
        }
        // message = "Different";  // Compile error - already assigned
        
        System.out.println("Final string: " + message);
        
        // Final reference variable
        final List<String> list = new ArrayList<>();
        list.add("Item 1");     // OK - modifying content, not reference
        list.add("Item 2");     // OK
        // list = new ArrayList<>();  // Compile error - cannot reassign reference
        
        System.out.println("Final list: " + list);
        
        // Final array
        final int[] numbers = {1, 2, 3, 4, 5};
        numbers[0] = 10;        // OK - modifying content
        // numbers = new int[10]; // Compile error - cannot reassign array reference
        
        System.out.println("Final array: " + Arrays.toString(numbers));
    }
}
```

### Final Instance Variables (Final Fields)
```java
public class Person {
    // Final field - must be initialized
    private final String name;
    private final int birthYear;
    
    // Final field with default value
    private final String species = "Homo sapiens";
    
    // Final static field (constant)
    public static final String PLANET = "Earth";
    public static final double PI = 3.14159;
    
    // Constructor must initialize all final fields
    public Person(String name, int birthYear) {
        this.name = name;           // Must assign final field exactly once
        this.birthYear = birthYear; // Must assign final field exactly once
    }
    
    // Getter methods (no setters for final fields)
    public String getName() {
        return name;
    }
    
    public int getBirthYear() {
        return birthYear;
    }
    
    public int getAge() {
        return 2024 - birthYear;  // Can use final fields in calculations
    }
    
    @Override
    public String toString() {
        return name + " (born " + birthYear + ", age " + getAge() + ")";
    }
    
    public static void main(String[] args) {
        Person person = new Person("Alice", 1990);
        System.out.println(person);
        System.out.println("Species: " + person.species);
        System.out.println("Planet: " + Person.PLANET);
        
        // person.name = "Bob";  // Compile error - final field cannot be changed
    }
}
```

### Final Static Variables (Constants)
```java
public class MathConstants {
    // Public constants - naming convention: ALL_UPPERCASE
    public static final double PI = 3.141592653589793;
    public static final double E = 2.718281828459045;
    public static final int SECONDS_IN_HOUR = 3600;
    public static final String COMPANY_NAME = "Tech Corp";
    
    // Final static block for complex initialization
    public static final Map<String, Integer> MONTH_DAYS;
    
    static {
        Map<String, Integer> temp = new HashMap<>();
        temp.put("January", 31);
        temp.put("February", 28);
        temp.put("March", 31);
        temp.put("April", 30);
        temp.put("May", 31);
        temp.put("June", 30);
        temp.put("July", 31);
        temp.put("August", 31);
        temp.put("September", 30);
        temp.put("October", 31);
        temp.put("November", 30);
        temp.put("December", 31);
        MONTH_DAYS = Collections.unmodifiableMap(temp);
    }
    
    public static double circleArea(double radius) {
        return PI * radius * radius;
    }
    
    public static void main(String[] args) {
        System.out.println("Circle area (radius 5): " + circleArea(5));
        System.out.println("Hours to seconds: " + SECONDS_IN_HOUR);
        System.out.println("Days in March: " + MONTH_DAYS.get("March"));
    }
}
```

## 🎯 Final Methods

### Preventing Method Overriding
```java
class Vehicle {
    private String brand;
    
    public Vehicle(String brand) {
        this.brand = brand;
    }
    
    // Regular method - can be overridden
    public void start() {
        System.out.println(brand + " vehicle starting...");
    }
    
    // Final method - cannot be overridden
    public final void serialNumber() {
        System.out.println("Serial: " + brand + "-" + hashCode());
    }
    
    // Final method with implementation that subclasses must use
    public final void safety() {
        System.out.println("Running mandatory safety checks...");
        customSafetyChecks();  // Hook for subclasses
        System.out.println("Safety checks completed.");
    }
    
    // Template method pattern - subclasses can override this
    protected void customSafetyChecks() {
        System.out.println("Basic safety checks");
    }
}

class Car extends Vehicle {
    public Car(String brand) {
        super(brand);
    }
    
    @Override
    public void start() {
        System.out.println("Car engine starting with key...");
    }
    
    // Cannot override final method
    // public void serialNumber() { }  // Compile error
    
    @Override
    protected void customSafetyChecks() {
        System.out.println("Checking airbags, brakes, and lights");
    }
}

public class FinalMethodExample {
    public static void main(String[] args) {
        Car car = new Car("Toyota");
        car.start();           // Overridden method
        car.serialNumber();    // Final method from parent
        car.safety();          // Final method using template pattern
    }
}
```

### Final Methods in Utility Classes
```java
public class StringUtils {
    
    // Final utility method - implementation should not change
    public static final boolean isEmpty(String str) {
        return str == null || str.length() == 0;
    }
    
    public static final boolean isNotEmpty(String str) {
        return !isEmpty(str);
    }
    
    public static final String capitalize(String str) {
        if (isEmpty(str)) return str;
        return str.substring(0, 1).toUpperCase() + str.substring(1).toLowerCase();
    }
    
    public static final String reverse(String str) {
        if (isEmpty(str)) return str;
        return new StringBuilder(str).reverse().toString();
    }
    
    public static void main(String[] args) {
        System.out.println("isEmpty(''): " + isEmpty(""));
        System.out.println("capitalize('hello'): " + capitalize("hello"));
        System.out.println("reverse('Java'): " + reverse("Java"));
    }
}
```

## 🎯 Final Classes

### Preventing Class Inheritance
```java
// Final class - cannot be extended
public final class ImmutablePoint {
    private final int x;
    private final int y;
    
    public ImmutablePoint(int x, int y) {
        this.x = x;
        this.y = y;
    }
    
    public int getX() {
        return x;
    }
    
    public int getY() {
        return y;
    }
    
    public double distanceFromOrigin() {
        return Math.sqrt(x * x + y * y);
    }
    
    public ImmutablePoint translate(int dx, int dy) {
        return new ImmutablePoint(x + dx, y + dy);  // Returns new instance
    }
    
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        ImmutablePoint point = (ImmutablePoint) obj;
        return x == point.x && y == point.y;
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(x, y);
    }
    
    @Override
    public String toString() {
        return "Point(" + x + ", " + y + ")";
    }
}

// This would cause compile error:
// class ExtendedPoint extends ImmutablePoint { }  // Cannot inherit from final class

public class FinalClassExample {
    public static void main(String[] args) {
        ImmutablePoint p1 = new ImmutablePoint(3, 4);
        ImmutablePoint p2 = p1.translate(2, 1);  // New instance
        
        System.out.println("Original point: " + p1);
        System.out.println("Translated point: " + p2);
        System.out.println("Distance from origin: " + p1.distanceFromOrigin());
    }
}
```

### Real-World Example: Value Objects
```java
public final class Money {
    private final double amount;
    private final String currency;
    
    public Money(double amount, String currency) {
        if (amount < 0) {
            throw new IllegalArgumentException("Amount cannot be negative");
        }
        if (currency == null || currency.trim().isEmpty()) {
            throw new IllegalArgumentException("Currency cannot be null or empty");
        }
        this.amount = amount;
        this.currency = currency.toUpperCase();
    }
    
    public double getAmount() {
        return amount;
    }
    
    public String getCurrency() {
        return currency;
    }
    
    public Money add(Money other) {
        if (!this.currency.equals(other.currency)) {
            throw new IllegalArgumentException("Cannot add different currencies");
        }
        return new Money(this.amount + other.amount, this.currency);
    }
    
    public Money subtract(Money other) {
        if (!this.currency.equals(other.currency)) {
            throw new IllegalArgumentException("Cannot subtract different currencies");
        }
        return new Money(this.amount - other.amount, this.currency);
    }
    
    public Money multiply(double factor) {
        return new Money(this.amount * factor, this.currency);
    }
    
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        Money money = (Money) obj;
        return Double.compare(money.amount, amount) == 0 && 
               Objects.equals(currency, money.currency);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(amount, currency);
    }
    
    @Override
    public String toString() {
        return String.format("%.2f %s", amount, currency);
    }
    
    public static void main(String[] args) {
        Money price1 = new Money(25.50, "USD");
        Money price2 = new Money(10.25, "USD");
        
        Money total = price1.add(price2);
        Money discounted = total.multiply(0.9);  // 10% discount
        
        System.out.println("Price 1: " + price1);
        System.out.println("Price 2: " + price2);
        System.out.println("Total: " + total);
        System.out.println("After discount: " + discounted);
    }
}
```

## 🔧 Practical Examples

### Configuration Class
```java
public final class AppConfig {
    // Final static configuration values
    public static final String APP_NAME = "MyApplication";
    public static final String VERSION = "1.0.0";
    public static final int MAX_CONNECTIONS = 100;
    public static final long TIMEOUT_MS = 30000L;
    
    // Final instance configuration
    private final String environment;
    private final String databaseUrl;
    private final boolean debugMode;
    
    public AppConfig(String environment, String databaseUrl, boolean debugMode) {
        this.environment = environment;
        this.databaseUrl = databaseUrl;
        this.debugMode = debugMode;
    }
    
    public String getEnvironment() { return environment; }
    public String getDatabaseUrl() { return databaseUrl; }
    public boolean isDebugMode() { return debugMode; }
    
    // Final method for logging configuration
    public final void logConfiguration() {
        System.out.println("=== Application Configuration ===");
        System.out.println("App: " + APP_NAME + " v" + VERSION);
        System.out.println("Environment: " + environment);
        System.out.println("Database: " + databaseUrl);
        System.out.println("Debug Mode: " + debugMode);
        System.out.println("Max Connections: " + MAX_CONNECTIONS);
        System.out.println("Timeout: " + TIMEOUT_MS + "ms");
    }
    
    public static void main(String[] args) {
        AppConfig config = new AppConfig("production", "jdbc:mysql://localhost:3306/mydb", false);
        config.logConfiguration();
    }
}
```

### Immutable Collections
```java
import java.util.*;

public class ImmutableCollections {
    
    // Final list - reference cannot change, but content can
    private final List<String> mutableList = new ArrayList<>();
    
    // Truly immutable list
    private final List<String> immutableList;
    
    public ImmutableCollections(String... items) {
        List<String> temp = new ArrayList<>();
        for (String item : items) {
            temp.add(item);
        }
        this.immutableList = Collections.unmodifiableList(temp);
        
        // Initialize mutable list
        Collections.addAll(mutableList, items);
    }
    
    // Final method to get immutable view
    public final List<String> getItems() {
        return immutableList;  // Already immutable
    }
    
    // Method that modifies mutable list
    public void addItem(String item) {
        mutableList.add(item);  // This is allowed
    }
    
    // Final method for safe access to mutable list
    public final List<String> getMutableItems() {
        return new ArrayList<>(mutableList);  // Return copy
    }
    
    public static void main(String[] args) {
        ImmutableCollections collection = new ImmutableCollections("Apple", "Banana", "Cherry");
        
        List<String> items = collection.getItems();
        System.out.println("Immutable items: " + items);
        
        // items.add("Date");  // UnsupportedOperationException
        
        collection.addItem("Date");  // This works on internal mutable list
        
        List<String> mutableItems = collection.getMutableItems();
        System.out.println("Mutable copy: " + mutableItems);
        
        mutableItems.add("Elderberry");  // This only affects the copy
        System.out.println("Modified copy: " + mutableItems);
        System.out.println("Original still: " + collection.getMutableItems());
    }
}
```

## ⚠️ OCA Pitfalls

### 1. Final Reference vs Final Content
```java
public class FinalReferencePitfall {
    public static void main(String[] args) {
        // Final reference - can modify content
        final List<String> list = new ArrayList<>();
        list.add("Item 1");     // OK - modifying content
        list.add("Item 2");     // OK
        // list = new ArrayList<>();  // Compile error - cannot reassign reference
        
        // Final array - can modify elements
        final int[] array = {1, 2, 3};
        array[0] = 10;          // OK - modifying content
        // array = new int[5];  // Compile error - cannot reassign reference
        
        System.out.println("List: " + list);
        System.out.println("Array: " + Arrays.toString(array));
    }
}
```

### 2. Final Variables Must Be Initialized
```java
public class FinalInitialization {
    private final int x = 10;           // OK - initialized at declaration
    private final int y;                // OK - will be initialized in constructor
    // private final int z;             // Compile error - never initialized
    
    public FinalInitialization() {
        y = 20;  // Must initialize all final fields exactly once
    }
    
    public static void main(String[] args) {
        final int a = 5;                // OK - initialized
        final int b;                    // OK - blank final
        b = 10;                         // OK - assigned exactly once
        // b = 15;                      // Compile error - already assigned
        
        // final int c;                 // Compile error if not assigned before use
        // System.out.println(c);       // Would cause compile error
    }
}
```

### 3. Final in Loops
```java
public class FinalInLoops {
    public static void main(String[] args) {
        // Final in enhanced for loop - OK, new variable each iteration
        String[] words = {"Hello", "World", "Java"};
        for (final String word : words) {
            System.out.println(word.toUpperCase());
            // word = "Different";  // Compile error - final variable
        }
        
        // Final in regular for loop - tricky
        for (int i = 0; i < 3; i++) {
            final int value = i * 2;    // OK - new variable each iteration
            System.out.println("Value: " + value);
            // value = 10;              // Compile error - final variable
        }
        
        // Cannot make loop variable final in traditional for loop
        // for (final int i = 0; i < 3; i++) { }  // Compile error - cannot modify i
    }
}
```

## 🧪 Quick Quiz

**Question 1:** What will happen with this code?
```java
final List<String> list = new ArrayList<>();
list.add("Hello");
list = new ArrayList<>();  // What happens here?
```

<details>
<summary>Click for answer</summary>

**Answer:** Compile error

The reference `list` is final, so it cannot be reassigned to a new ArrayList. You can modify the contents of the list, but not reassign the reference itself.

</details>

**Question 2:** Which statements about final classes are true?
- A) Final classes cannot have constructors
- B) Final classes cannot be extended
- C) Final classes cannot have static methods
- D) Final classes cannot be instantiated

<details>
<summary>Click for answer</summary>

**Answer:** B) Final classes cannot be extended

Final classes can have constructors, static methods, and can be instantiated. The only restriction is that they cannot be subclassed.

</details>

## 🎯 OCA Exam Tips

1. **Final variables must be initialized** exactly once
2. **Final reference doesn't mean immutable content** - you can modify object content
3. **Final methods cannot be overridden** in subclasses
4. **Final classes cannot be extended** (no inheritance)
5. **Final static variables are constants** - use ALL_UPPERCASE naming
6. **Blank finals** must be initialized in constructor or instance block

## 📚 Best Practices

1. **Use final for constants** - especially static final fields
2. **Make fields final when possible** - promotes immutability
3. **Use final for method parameters** - prevents accidental modification
4. **Consider final classes for value objects** - like Money, Point, etc.
5. **Use final methods for template patterns** - when implementation shouldn't change
6. **Final + private constructor** for utility classes to prevent instantiation

## Related Topics

- [04. Variable](04-variable.md) - Variable declaration and initialization
- [28. Classes and Objects](28-classes-and-objects.md) - Class design and immutability
- [32. Methods](32-methods.md) - Method overriding and final methods
- [39. Encapsulation](39-encapsulation.md) - Data protection and immutability

---

*This tutorial covers the final keyword in Java, which provides immutability for variables, prevents method overriding, and stops class inheritance.*
