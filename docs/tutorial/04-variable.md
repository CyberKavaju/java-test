# Variable

---

its a reusable container for values, a variable behaves as the value it contains

- Primitive: simple value stored in memory (stack), you access the value directly.

  - Examples: `int, double, char, boolean`
- Reference: memory address (stack) that points to the (heap), you get an address where to look for the value.

  - Examples: `String, Array, Object`

## Creating a variable

There are 2 steps to create a variable:

1. Declaration: `variable type, variable name`  example;  `int age;`
2. Assignment:  `variable name, variable value` example; `age = 21;`

You can do it all in one line `variable type, variable name and variable value` like this: `int age = 21`

**Example of declaration and values:**

Primitive data types:

- Integers: `int age = 35;` you use it when you want to save a whole value.
- Doubles: `double price = 99.99;` you use it when you need to save a decimal value.
- Characters: `char grade = 'A';` you use it when you want to save one character, you have to use single quotes for char `' '`.
- Boolean: `boolean active = true;` you use it when you want to define a value to be `true` or `false`
- See more [here](https://docs.oracle.com/javase/tutorial/java/nutsandbolts/datatypes.html)

Reference data types

- String: `String name = "William";` you use this type for text, you have to use double quotes for strings `" "`
- Array:
- Object:

## Default values

int: `0`

double: `0.0d`

String: `null`

char: `'\u0000'`

boolean: `false`

Array: the defaults of its elements depending on the type you give the array

> the default value only applies to fields not local variable, in a local variable you have to declare its value so you don't get and compile error.

**What is a local variable?** I am glad you asked, a local variable is variable that u use in block of code like method or a loop etc. a field is a varible created in the class to be used in methods.

## Concatenate

To concatenate values or variables you use the symbol plus `+` example `"my age is: " + age` it will print out; `my age is 35`

## ⚠️ OCA Pitfalls

### 1 Uninitialized Local Variables

> Local Variables must be explicitly initialized before use.

```java

public class Test{
    public static void main(String[] args) {
        int x;
        System.out.println(x); // ❌ Error: Variable 'x' might not have been initialized
    }
}

```

This doesn't apply to fields (they get default values automatically), only local variables.

---

### 2 Thinking Fields Get No Default Values

> Fields (instance and static variables) are automatically initialized.

```java

public class Test{
    int x;
    public static void main(String[] args) {
        System.out.println(x); // ❌ Error: Variable 'x' might not have been initialized
    }
}

```

Local variables = ❌ no default
Fields = ✅ defaulted

---

### 3 Confusing Variable Scope

> Variables declared inside a block are not visible outside it.

```java

public class ScopeTest {

    public static void main(String[] args) {
        int x = 5;
    }
    
    // System.out.println(x); // ❌ x is not visible here
}

```

---

### 4 Final Variables Must Be Assigned Exactly Once

> Final variables must be assigned exactly once.
> Final variables cannot be reassigned.

```java

public class FinalTest {
    public static void main(String[] args) {
        final int x;
        x = 10;        // ✔️ OK: first assignment
        x = 20;        // ❌ Error: cannot assign a value to final variable 'x'
    }
}

```

---

### 5 Literal Assignments Must Be in Range

> Literal values must be in range for their type.
> For example, `byte` must be in range of -128 to 127.

```java
byte b = 127;   // ✅ OK
byte b = 128;   // ❌ Compile error: out of byte range
```

---

### 6 Field Shadowing — `this` is Required

> Field names can **shadow** local variables.
> Local variables **hide** fields.

```java

class Car {
    String model;
    Car(String model) {
        model = model;       // ❌ does nothing — assigns param to itself
        this.model = model;  // ✅ assigns param to instance field
    }
}


```

Use `this.field` to distinguish instance variables from parameters when they share the same name.
