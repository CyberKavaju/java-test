# 58. Access Modifiers

**Related:** [28. Classes and Objects](28-classes-and-objects.md) | [32. Methods](32-methods.md) | [49. Packages](49-packages.md)

---

## 🧠 What are Access Modifiers?

Access modifiers in Java are keywords that control the visibility and accessibility of classes, methods, variables, and constructors. They determine which parts of your code can access and use specific members, providing encapsulation and security for your applications.

**Real-world analogy:** Think of access modifiers like different levels of security clearance in a building. `public` is like a public lobby anyone can enter, `private` is like a personal office only you can access, `protected` is like a department area accessible to family members and colleagues, and package-private is like a company floor accessible to coworkers in the same company.

## 🎯 The Four Access Levels

### Access Level Overview
| Modifier | Same Class | Same Package | Subclass (Different Package) | Different Package |
|----------|------------|--------------|------------------------------|-------------------|
| `private` | ✅ | ❌ | ❌ | ❌ |
| package-private (default) | ✅ | ✅ | ❌ | ❌ |
| `protected` | ✅ | ✅ | ✅ | ❌ |
| `public` | ✅ | ✅ | ✅ | ✅ |

## ✅ Private Access

### Private Fields and Methods
```java
package com.example.banking;

public class BankAccount {
    // Private fields - only accessible within this class
    private String accountNumber;
    private double balance;
    private String pin;
    
    public BankAccount(String accountNumber, String pin) {
        this.accountNumber = accountNumber;
        this.pin = pin;
        this.balance = 0.0;
    }
    
    // Private method - internal implementation detail
    private boolean validatePin(String inputPin) {
        return this.pin.equals(inputPin);
    }
    
    // Private helper method
    private void logTransaction(String operation, double amount) {
        System.out.println("LOG: " + operation + " of $" + amount + 
                          " on account " + accountNumber);
    }
    
    // Public methods provide controlled access to private data
    public boolean deposit(double amount, String pin) {
        if (!validatePin(pin)) {
            System.out.println("Invalid PIN");
            return false;
        }
        
        if (amount > 0) {
            balance += amount;
            logTransaction("DEPOSIT", amount);
            return true;
        }
        return false;
    }
    
    public boolean withdraw(double amount, String pin) {
        if (!validatePin(pin)) {
            System.out.println("Invalid PIN");
            return false;
        }
        
        if (amount > 0 && amount <= balance) {
            balance -= amount;
            logTransaction("WITHDRAWAL", amount);
            return true;
        }
        return false;
    }
    
    public double getBalance(String pin) {
        if (validatePin(pin)) {
            return balance;
        }
        System.out.println("Invalid PIN");
        return -1;  // Error indicator
    }
    
    public static void main(String[] args) {
        BankAccount account = new BankAccount("12345", "1234");
        
        // These work - using public methods
        account.deposit(100.0, "1234");
        System.out.println("Balance: $" + account.getBalance("1234"));
        
        // These would cause compile errors:
        // System.out.println(account.balance);      // Cannot access private field
        // account.validatePin("1234");              // Cannot access private method
        // account.accountNumber = "54321";          // Cannot access private field
    }
}
```

### Private Constructors
```java
// Utility class with private constructor to prevent instantiation
public class MathUtils {
    
    // Private constructor - cannot instantiate this class
    private MathUtils() {
        throw new UnsupportedOperationException("Utility class cannot be instantiated");
    }
    
    // All methods are static
    public static int add(int a, int b) {
        return a + b;
    }
    
    public static double multiply(double a, double b) {
        return a * b;
    }
    
    public static boolean isPrime(int number) {
        if (number < 2) return false;
        for (int i = 2; i <= Math.sqrt(number); i++) {
            if (number % i == 0) return false;
        }
        return true;
    }
}

// Singleton pattern using private constructor
class DatabaseConnection {
    private static DatabaseConnection instance;
    private String connectionString;
    
    // Private constructor
    private DatabaseConnection() {
        connectionString = "jdbc:mysql://localhost:3306/mydb";
        System.out.println("Database connection created");
    }
    
    public static DatabaseConnection getInstance() {
        if (instance == null) {
            instance = new DatabaseConnection();
        }
        return instance;
    }
    
    public void executeQuery(String query) {
        System.out.println("Executing: " + query + " on " + connectionString);
    }
}
```

## ✅ Package-Private (Default) Access

### Same Package Access
```java
// File: com/example/school/Student.java
package com.example.school;

public class Student {
    // Package-private fields (no access modifier)
    String name;           // Accessible within package
    int age;              // Accessible within package
    String studentId;     // Accessible within package
    
    // Package-private constructor
    Student(String name, int age, String studentId) {
        this.name = name;
        this.age = age;
        this.studentId = studentId;
    }
    
    // Package-private method
    void displayInfo() {
        System.out.println("Student: " + name + ", Age: " + age + ", ID: " + studentId);
    }
    
    // Package-private helper method
    boolean isAdult() {
        return age >= 18;
    }
}

// File: com/example/school/Teacher.java
package com.example.school;

public class Teacher {
    private String name;
    private String subject;
    
    public Teacher(String name, String subject) {
        this.name = name;
        this.subject = subject;
    }
    
    public void gradeStudent(Student student, int grade) {
        // Can access package-private members of Student
        System.out.println("Teacher " + name + " grades " + student.name + 
                          " (ID: " + student.studentId + "): " + grade);
        
        if (student.isAdult()) {  // Can call package-private method
            System.out.println(student.name + " is an adult student");
        }
    }
    
    // Package-private method accessible to other classes in same package
    void attendMeeting() {
        System.out.println(name + " is attending a staff meeting");
    }
}

// File: com/example/school/School.java
package com.example.school;

import java.util.*;

public class School {
    private List<Student> students = new ArrayList<>();
    private List<Teacher> teachers = new ArrayList<>();
    
    public void addStudent(String name, int age, String studentId) {
        // Can use package-private constructor
        Student student = new Student(name, age, studentId);
        students.add(student);
    }
    
    public void addTeacher(String name, String subject) {
        teachers.add(new Teacher(name, subject));
    }
    
    public void displayAllStudents() {
        for (Student student : students) {
            student.displayInfo();  // Can call package-private method
        }
    }
    
    public void conductStaffMeeting() {
        for (Teacher teacher : teachers) {
            teacher.attendMeeting();  // Can call package-private method
        }
    }
    
    public static void main(String[] args) {
        School school = new School();
        school.addStudent("Alice", 20, "S001");
        school.addStudent("Bob", 17, "S002");
        school.addTeacher("Dr. Smith", "Mathematics");
        
        school.displayAllStudents();
        school.conductStaffMeeting();
    }
}
```

## ✅ Protected Access

### Inheritance and Same Package Access
```java
// File: com/example/animals/Animal.java
package com.example.animals;

public class Animal {
    protected String name;        // Accessible to subclasses and same package
    protected int age;           // Accessible to subclasses and same package
    private String species;      // Only accessible within this class
    
    public Animal(String name, int age, String species) {
        this.name = name;
        this.age = age;
        this.species = species;
    }
    
    // Protected method - accessible to subclasses and same package
    protected void sleep() {
        System.out.println(name + " is sleeping");
    }
    
    protected void eat(String food) {
        System.out.println(name + " is eating " + food);
    }
    
    // Protected method that subclasses can override
    protected String makeSound() {
        return "Some generic animal sound";
    }
    
    public void displayInfo() {
        System.out.println("Animal: " + name + ", Age: " + age + ", Species: " + species);
        System.out.println("Sound: " + makeSound());
    }
}

// File: com/example/animals/Dog.java
package com.example.animals;

public class Dog extends Animal {
    private String breed;
    
    public Dog(String name, int age, String breed) {
        super(name, age, "Canine");  // Call parent constructor
        this.breed = breed;
    }
    
    @Override
    protected String makeSound() {
        return "Woof! Woof!";
    }
    
    public void playFetch() {
        // Can access protected members from parent class
        System.out.println(name + " is playing fetch");
        eat("dog treats");  // Call protected method from parent
    }
    
    public void napTime() {
        System.out.println(name + " the " + breed);
        sleep();  // Call protected method from parent
    }
}

// File: com/example/pets/Cat.java (Different package)
package com.example.pets;

import com.example.animals.Animal;

public class Cat extends Animal {
    private boolean isIndoor;
    
    public Cat(String name, int age, boolean isIndoor) {
        super(name, age, "Feline");
        this.isIndoor = isIndoor;
    }
    
    @Override
    protected String makeSound() {
        return "Meow! Meow!";
    }
    
    public void climbTree() {
        // Can access protected members even from different package (inheritance)
        System.out.println(name + " is climbing a tree");
        eat("cat food");  // Protected method accessible to subclass
    }
    
    public void rest() {
        sleep();  // Protected method accessible to subclass
    }
}

// File: com/example/zoo/Zoo.java (Different package)
package com.example.zoo;

import com.example.animals.*;
import com.example.pets.Cat;

public class Zoo {
    public static void main(String[] args) {
        // Same package access to protected members
        Dog dog = new Dog("Buddy", 3, "Golden Retriever");
        dog.playFetch();
        dog.napTime();
        
        // Can access protected members of Dog (same package as Animal)
        System.out.println("Dog's name: " + dog.name);  // Protected field accessible
        
        // Different package - no direct access to protected members
        Cat cat = new Cat("Whiskers", 2, true);
        cat.climbTree();
        // System.out.println(cat.name);  // Compile error - cannot access protected field directly
        
        // But can access through public methods
        cat.displayInfo();  // This works
    }
}
```

## ✅ Public Access

### Universal Access
```java
// File: com/example/library/Book.java
package com.example.library;

public class Book {
    // Public fields (generally not recommended, but shown for example)
    public String title;
    public String author;
    public String isbn;
    
    // Private fields for sensitive data
    private double price;
    private int availableCopies;
    
    // Public constructor
    public Book(String title, String author, String isbn, double price, int copies) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
        this.price = price;
        this.availableCopies = copies;
    }
    
    // Public getter methods
    public double getPrice() {
        return price;
    }
    
    public int getAvailableCopies() {
        return availableCopies;
    }
    
    // Public setter methods with validation
    public void setPrice(double price) {
        if (price >= 0) {
            this.price = price;
        } else {
            throw new IllegalArgumentException("Price cannot be negative");
        }
    }
    
    // Public business methods
    public boolean borrowBook() {
        if (availableCopies > 0) {
            availableCopies--;
            System.out.println("Book borrowed: " + title);
            return true;
        } else {
            System.out.println("Sorry, " + title + " is not available");
            return false;
        }
    }
    
    public void returnBook() {
        availableCopies++;
        System.out.println("Book returned: " + title);
    }
    
    // Public utility method
    public String getBookInfo() {
        return String.format("'%s' by %s (ISBN: %s) - $%.2f [%d copies available]",
                title, author, isbn, price, availableCopies);
    }
    
    @Override
    public String toString() {
        return getBookInfo();
    }
}

// File: com/example/store/BookStore.java (Different package)
package com.example.store;

import com.example.library.Book;  // Can import public class
import java.util.*;

public class BookStore {
    private List<Book> inventory = new ArrayList<>();
    
    public void addBook(Book book) {
        inventory.add(book);
        System.out.println("Added to inventory: " + book.title);  // Public field access
    }
    
    public void displayInventory() {
        System.out.println("=== Book Store Inventory ===");
        for (Book book : inventory) {
            System.out.println(book.getBookInfo());  // Public method access
        }
    }
    
    public boolean sellBook(String title) {
        for (Book book : inventory) {
            if (book.title.equals(title)) {  // Public field access
                return book.borrowBook();    // Public method access
            }
        }
        System.out.println("Book not found: " + title);
        return false;
    }
    
    public static void main(String[] args) {
        BookStore store = new BookStore();
        
        // Can create objects of public class from any package
        Book book1 = new Book("Java Programming", "John Doe", "978-1234567890", 49.99, 5);
        Book book2 = new Book("Python Basics", "Jane Smith", "978-0987654321", 39.99, 3);
        
        store.addBook(book1);
        store.addBook(book2);
        
        store.displayInventory();
        
        // Can call public methods from any package
        store.sellBook("Java Programming");
        store.displayInventory();
    }
}
```

## 🔧 Access Modifiers with Different Elements

### Class-Level Access Modifiers
```java
// File: com/example/shapes/Shape.java
package com.example.shapes;

// Public class - can be accessed from any package
public class Shape {
    protected double area;
    
    public double getArea() {
        return area;
    }
}

// Package-private class - only accessible within same package
class GeometryUtils {
    static double calculateCircumference(double radius) {
        return 2 * Math.PI * radius;
    }
    
    static double calculateVolume(double radius, double height) {
        return Math.PI * radius * radius * height;
    }
}

// File: com/example/shapes/Circle.java
package com.example.shapes;

public class Circle extends Shape {
    private double radius;
    
    public Circle(double radius) {
        this.radius = radius;
        calculateArea();
    }
    
    private void calculateArea() {
        // Can use package-private class from same package
        this.area = Math.PI * radius * radius;
    }
    
    public double getCircumference() {
        // Can use package-private class methods
        return GeometryUtils.calculateCircumference(radius);
    }
}
```

### Interface Access Modifiers
```java
// File: com/example/payment/PaymentProcessor.java
package com.example.payment;

// Public interface - accessible from any package
public interface PaymentProcessor {
    // Interface methods are implicitly public
    boolean processPayment(double amount);
    String getPaymentMethod();
    
    // Default method (Java 8+) - also public
    default void logPayment(double amount) {
        System.out.println("Payment processed: $" + amount + " via " + getPaymentMethod());
    }
}

// Package-private interface - only accessible within same package
interface InternalAudit {
    void auditTransaction(String transactionId);
}

// File: com/example/payment/CreditCardProcessor.java
package com.example.payment;

public class CreditCardProcessor implements PaymentProcessor, InternalAudit {
    private String cardNumber;
    private String cardHolderName;
    
    public CreditCardProcessor(String cardNumber, String cardHolderName) {
        this.cardNumber = cardNumber;
        this.cardHolderName = cardHolderName;
    }
    
    @Override
    public boolean processPayment(double amount) {
        System.out.println("Processing credit card payment of $" + amount);
        auditTransaction("CC-" + System.currentTimeMillis());
        return true;
    }
    
    @Override
    public String getPaymentMethod() {
        return "Credit Card";
    }
    
    @Override
    public void auditTransaction(String transactionId) {
        System.out.println("Audit: Transaction " + transactionId + 
                          " for card ending in " + cardNumber.substring(cardNumber.length() - 4));
    }
}
```

## ⚠️ OCA Pitfalls

### 1. Access Modifier Conflicts
```java
public class Parent {
    protected void method1() {
        System.out.println("Parent method1");
    }
    
    public void method2() {
        System.out.println("Parent method2");
    }
}

public class Child extends Parent {
    // WRONG - cannot reduce visibility
    // private void method1() { }        // Compile error
    // void method2() { }                // Compile error - package-private is less visible than public
    
    // CORRECT - can maintain or increase visibility
    protected void method1() {           // Same visibility - OK
        System.out.println("Child method1");
    }
    
    public void method2() {              // Same visibility - OK
        System.out.println("Child method2");
    }
    
    // CORRECT - can increase visibility
    public void method3() {              // More visible than protected parent - OK if parent had protected
        System.out.println("Child method3");
    }
}
```

### 2. Package-Private Confusion
```java
// File: com/example/test/TestClass.java
package com.example.test;

public class TestClass {
    int packageField = 10;               // Package-private
    public int publicField = 20;         // Public
    
    void packageMethod() {               // Package-private
        System.out.println("Package method");
    }
}

// File: com/example/other/OtherClass.java
package com.example.other;

import com.example.test.TestClass;

public class OtherClass {
    public static void main(String[] args) {
        TestClass test = new TestClass();
        
        // This works - public access
        System.out.println(test.publicField);
        
        // These DON'T work - package-private from different package
        // System.out.println(test.packageField);  // Compile error
        // test.packageMethod();                    // Compile error
    }
}
```

### 3. Protected Access from Different Package
```java
// File: com/example/parent/Parent.java
package com.example.parent;

public class Parent {
    protected int protectedField = 100;
    
    protected void protectedMethod() {
        System.out.println("Protected method");
    }
}

// File: com/example/child/Child.java
package com.example.child;

import com.example.parent.Parent;

public class Child extends Parent {
    public void test() {
        // This works - accessing through inheritance
        System.out.println(this.protectedField);
        this.protectedMethod();
        
        // This also works - direct access in subclass
        System.out.println(protectedField);
        protectedMethod();
        
        // This DOESN'T work - accessing through different instance
        Parent parent = new Parent();
        // System.out.println(parent.protectedField);  // Compile error
        // parent.protectedMethod();                    // Compile error
    }
}
```

## 🧪 Quick Quiz

**Question 1:** Which access modifier allows access from subclasses in different packages?
- A) private
- B) package-private (default)
- C) protected
- D) public

<details>
<summary>Click for answer</summary>

**Answer:** C) protected

Protected access allows access from the same package and from subclasses, even if they're in different packages.

</details>

**Question 2:** What happens if you try to override a public method with a private method?
- A) It compiles successfully
- B) It compiles with a warning
- C) It causes a compile error
- D) It works but the method becomes private

<details>
<summary>Click for answer</summary>

**Answer:** C) It causes a compile error

You cannot reduce the visibility when overriding a method. A public method cannot be overridden with a private method.

</details>

## 🎯 OCA Exam Tips

1. **Cannot reduce visibility** when overriding methods
2. **Protected allows subclass access** even from different packages
3. **Package-private (default) restricts to same package** only
4. **Private is most restrictive** - same class only
5. **Public is least restrictive** - accessible everywhere
6. **Top-level classes can only be public or package-private**

## 📚 Best Practices

1. **Use most restrictive access possible** - start with private, open up as needed
2. **Prefer private fields with public getters/setters** for encapsulation
3. **Use protected for inheritance-related members** that subclasses need
4. **Make utility classes package-private** if they're internal implementation
5. **Use public for API methods** that external code needs to call
6. **Document access decisions** - why something is public vs protected

## Related Topics

- [28. Classes and Objects](28-classes-and-objects.md) - Class design and encapsulation
- [32. Methods](32-methods.md) - Method declaration and access
- [39. Encapsulation](39-encapsulation.md) - Data hiding principles
- [49. Packages](49-packages.md) - Package organization and access

---

*This tutorial covers Access Modifiers in Java, which control the visibility and accessibility of classes, methods, and fields to ensure proper encapsulation and security.*
