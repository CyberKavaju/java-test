# 48. Encapsulation

**Related:** [47. Abstraction](47-abstraction.md) | [30. Getters and Setters](30-getters-and-setters.md)

---

> **Encapsulation** is the practice of **hiding the internal state** (data) of an object and **controlling access** to it through **methods**.

📦 Think of it as wrapping your data (fields) in a box and giving users controlled access through buttons (methods).

---

## 🧠 Why Use Encapsulation?

✅ To **protect** internal data from unauthorized access
✅ To **control how fields are modified** (e.g., validation)
✅ To **maintain data integrity**
✅ To **hide implementation details**
✅ To make code **easier to maintain** and **refactor**

---

## 🧱 How Do You Achieve Encapsulation in Java?

✅ 1. Make fields **`private`**

✅ 2. Provide **`public getter and setter`** methods

✅ 3. Add **validation or logic** in setters if needed

---

## 🔧 Example: Encapsulation in Action

```java
public class Person {
    // Step 1: Private fields
    private String name;
    private int age;

    // Step 2: Public getter
    public String getName() {
        return name;
    }

    // Step 3: Public setter
    public void setName(String name) {
        this.name = name;
    }

    // Add validation
    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        if (age > 0) {
            this.age = age;
        } else {
            System.out.println("Invalid age!");
        }
    }
}
```

### Usage:

```java
Person p = new Person();
p.setName("Alice");
p.setAge(25);

System.out.println(p.getName()); // Alice
System.out.println(p.getAge());  // 25
```

---

## 🧠 Real-World Analogy

Think of a **bank ATM**:

- Your **account balance** is private data (you can't directly access the bank's database)
- The **ATM interface** provides controlled access (withdraw, deposit, check balance)
- The ATM **validates** your PIN and transaction limits
- You **don't need to know** how the bank stores your data internally

That's encapsulation! 🏧

---

## Benefits of Encapsulation

### 1. **Data Protection**
- Prevents unauthorized direct access to object data
- Controls how data can be modified

### 2. **Validation**
- Can add checks before setting values
- Ensures data integrity

### 3. **Flexibility**
- Can change internal implementation without affecting external code
- Easier to maintain and update

### 4. **Security**
- Sensitive data remains hidden
- Only intended operations are allowed

---

## Common Encapsulation Patterns

### Read-Only Properties
```java
public class Product {
    private final String id;
    private String name;
    
    public Product(String id) {
        this.id = id;
    }
    
    public String getId() {
        return id; // No setter - read-only
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
}
```

### Calculated Properties
```java
public class Rectangle {
    private double width;
    private double height;
    
    public double getWidth() { return width; }
    public void setWidth(double width) { this.width = width; }
    
    public double getHeight() { return height; }
    public void setHeight(double height) { this.height = height; }
    
    // Calculated property - no field needed
    public double getArea() {
        return width * height;
    }
}
```

---

## Best Practices

1. **Make fields private by default**
2. **Provide getters/setters only when needed**
3. **Add validation in setters**
4. **Use meaningful method names**
5. **Consider immutable objects** (all fields final, no setters)

---

## Final Rule of Thumb

> **Encapsulation = Data Hiding + Controlled Access**
> 
> Make your fields private, provide public methods for access, and add validation where needed to protect your object's integrity.

---

## 🎯 OCA Exam Tips

1. **Always make fields private** - this is the foundation of encapsulation
2. **Provide public getter/setter methods** for controlled access
3. **Add validation in setters** to maintain data integrity
4. **Use meaningful method names** (getName(), setAge(), etc.)
5. **Understand access modifiers** - private, protected, public, package-private
6. **Know when to make classes immutable** - final fields, no setters

---

## Related Topics

- [30. Getters and Setters](30-getters-and-setters.md) - Accessor methods for encapsulation
- [28. Classes and Objects](28-classes-and-objects.md) - Basic class structure
- [32. Methods](32-methods.md) - Method fundamentals and access modifiers
- [47. Abstraction](47-abstraction.md) - Hiding complexity and implementation details
- [31. Constructors](31-constructors.md) - Object initialization
