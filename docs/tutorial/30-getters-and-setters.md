# Getters and Setters

## 🧠 What are Getters and Setters?

- A **getter** is a method that **returns the value** of a private field.
- A **setter** is a method that **modifies the value** of a private field.
- They're used to **access and control class fields** from outside the class while keeping those fields **private**.

---

## 🔒 Why Use Getters and Setters?

This is the heart of **encapsulation**:

> Keep fields `private`, but allow controlled access using public methods.

✔️ Protects internal state
✔️ Allows validation (e.g., checking if an age is valid before setting it)
✔️ Makes your code future-proof and maintainable

---

## 🧱 Syntax Example

```java
public class Person {
    // private field (data hidden from outside)
    private String name;

    // Getter method
    public String getName() {
        return name;
    }

    // Setter method
    public void setName(String newName) {
        name = newName;
    }
}
```

### 💡 Usage

```java
Person p = new Person();
p.setName("Alice");              // Set the value
System.out.println(p.getName()); // Get the value → Output: Alice
```

---

## 🔍 Naming Convention

Follows **JavaBeans standard**:

| Type   | Prefix + Field Name        | Example for field `age` |
| ------ | -------------------------- | ------------------------- |
| Getter | `get` + Capitalized Name | `getAge()`              |
| Setter | `set` + Capitalized Name | `setAge(int age)`       |

> ✅ If the field is boolean, the getter can also be `isSomething()`
> Example:

```java
private boolean active;
public boolean isActive() { return active; }
public void setActive(boolean active) { this.active = active; }
```

---

## ✅ Adding Validation (Bonus Use)

```java
public void setAge(int age) {
    if (age > 0) {
        this.age = age;
    } else {
        System.out.println("Age must be positive");
    }
}
```

---

## ⚠️ OCA Pitfalls

### ❌ Modifying private fields directly

```java
p.age = -5; // ❌ Won't compile if field is private
```

✅ Should always go through a setter if encapsulated:

```java
p.setAge(-5); // allows validation inside method
```

---

## 🧪 Real-World Example

```java
public class BankAccount {
    private double balance;

    public double getBalance() {
        return balance;
    }

    public void setBalance(double amount) {
        if (amount >= 0) {
            this.balance = amount;
        }
    }
}
```

When we want to use one of the fields inside our class the best practice is to use the getter of the field and not the field for example:

```java
public class BankAccount{
    private double balance;

    public double getBalance(){
        return balance;
    }
    public void setBalance(double amount){
        this.balance = amount;
    }
    // a method in my class that uses the private field
    public double myBalanceInterest( double rate, double time){
        return (getBalance() * rate * time) / 100; // call the getter and not the field directly
    }
}
```

So in this case if I change something in my code like in the getter the code will update to this change.

---

## 📌 Summary Table

| Concept        | Visibility           | Purpose                       |
| -------------- | -------------------- | ----------------------------- |
| Field          | `private`          | Store data, hide from outside |
| Getter method  | `public`           | Return field value            |
| Setter method  | `public`           | Update field value            |
| Naming pattern | get/set + field name | Follows JavaBeans rules       |

---

## 🎓 Quick Quiz

### Q: What's the output?

```java
public class User {
    private String username;

    public void setUsername(String u) {
        username = u;
    }

    public String getUsername() {
        return username;
    }

    public static void main(String[] args) {
        User user = new User();
        user.setUsername("JavaFan");
        System.out.println(user.getUsername());
    }
}
```

✔️ **A:** `JavaFan`
