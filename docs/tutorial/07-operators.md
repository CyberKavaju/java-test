# Java Operators

Java operators are symbols that perform operations on variables and values. Understanding operator precedence, associativity, and behavior is crucial for the OCA exam.

## Arithmetic Operators

Java provides several arithmetic operators for mathematical operations:

- `+` for addition
- `-` for subtraction  
- `*` for multiplication
- `/` for division
- `%` for modulus (remainder of division)

### Basic Examples

```java
public class ArithmeticOperators {
    public static void main(String[] args) {
        int a = 10, b = 3;
        
        System.out.println("Addition: " + (a + b));      // 13
        System.out.println("Subtraction: " + (a - b));   // 7
        System.out.println("Multiplication: " + (a * b)); // 30
        System.out.println("Division: " + (a / b));      // 3 (integer division!)
        System.out.println("Modulus: " + (a % b));       // 1
    }
}
```

### 🚨 OCA Pitfall: Integer Division
Integer division truncates the decimal part, it does NOT round!

```java
System.out.println(5 / 2);    // 2, not 2.5
System.out.println(9 / 4);    // 2, not 2.25
System.out.println(-5 / 2);   // -2, not -2.5
```

## Assignment Operators

Java provides both simple assignment and compound assignment operators.

### Simple Assignment
```java
int x = 10;  // assigns 10 to x
```

### Compound Assignment Operators
These operators perform an operation and assign the result back to the variable:

- `+=` addition assignment
- `-=` subtraction assignment  
- `*=` multiplication assignment
- `/=` division assignment
- `%=` modulus assignment

### Regular vs Compound Assignment

Regular assignment:
```java
int x = 4;
int y = 5;
x = x + y;  // x becomes 9
```

Compound assignment (equivalent):
```java
int x = 4;
int y = 5;
x += y;     // x becomes 9
```

### 🚨 OCA Pitfall: Implicit Casting in Compound Assignment
Compound assignment operators perform implicit casting!

```java
short s = 10;
s = s + 5;    // COMPILATION ERROR: cannot convert int to short
s += 5;       // COMPILES: implicit cast from int to short
```

```java
byte b = 10;
b = b * 2;    // COMPILATION ERROR
b *= 2;       // COMPILES: result is cast back to byte
```

## Increment and Decrement Operators

These unary operators increment or decrement a variable by 1:

- `++` increment operator
- `--` decrement operator

### Pre-increment vs Post-increment

**Pre-increment (`++x`)**: Increments first, then returns the new value
**Post-increment (`x++`)**: Returns the current value first, then increments

```java
public class IncrementDemo {
    public static void main(String[] args) {
        int x = 5;
        int y = 5;
        
        System.out.println("Pre-increment: " + (++x));  // 6 (x is now 6)
        System.out.println("Post-increment: " + (y++)); // 5 (y becomes 6 after)
        
        System.out.println("x = " + x);  // 6
        System.out.println("y = " + y);  // 6
    }
}
```

### 🚨 OCA Pitfall: Pre vs Post in Expressions
The difference matters in complex expressions:

```java
int a = 5;
int b = 2 * a++;    // b = 2 * 5 = 10, then a becomes 6
System.out.println("a = " + a + ", b = " + b);  // a = 6, b = 10

int c = 5;
int d = 2 * ++c;    // c becomes 6 first, then d = 2 * 6 = 12
System.out.println("c = " + c + ", d = " + d);  // c = 6, d = 12
```

### 🚨 OCA Pitfall: Multiple Operations on Same Variable
```java
int x = 5;
x = x++ + ++x;  // UNDEFINED BEHAVIOR - avoid this!
```

### Shorthand vs Explicit
```java
x++;        // shorthand for x = x + 1
x--;        // shorthand for x = x - 1
++x;        // shorthand for x = x + 1
--x;        // shorthand for x = x - 1
```

## Operator Precedence and Associativity

Understanding operator precedence is crucial for the OCA exam. Java follows standard mathematical order of operations.

### Precedence Levels (High to Low)

1. **Postfix**: `x++`, `x--`
2. **Unary**: `++x`, `--x`, `+x`, `-x`, `!`, `~`
3. **Multiplicative**: `*`, `/`, `%`
4. **Additive**: `+`, `-`
5. **Shift**: `<<`, `>>`, `>>>`
6. **Relational**: `<`, `>`, `<=`, `>=`, `instanceof`
7. **Equality**: `==`, `!=`
8. **Bitwise AND**: `&`
9. **Bitwise XOR**: `^`
10. **Bitwise OR**: `|`
11. **Logical AND**: `&&`
12. **Logical OR**: `||`
13. **Ternary**: `? :`
14. **Assignment**: `=`, `+=`, `-=`, `*=`, `/=`, `%=`

### Associativity Rules

- **Left-to-right**: Most operators (`+`, `-`, `*`, `/`, `%`)
- **Right-to-left**: Assignment operators (`=`, `+=`, etc.) and unary operators

### 🚨 OCA Pitfall: Common Precedence Mistakes

```java
// Mistake 1: Thinking addition happens before multiplication
int result1 = 2 + 3 * 4;        // 14, not 20
System.out.println(result1);    // Multiplication first: 2 + (3 * 4)

// Mistake 2: Forgetting parentheses change precedence
int result2 = (2 + 3) * 4;      // 20
System.out.println(result2);    // Addition first: (2 + 3) * 4

// Mistake 3: Assignment vs equality
int x = 5;
if (x = 10) {  // COMPILATION ERROR: assignment returns int, not boolean
    System.out.println("Wrong!");
}
```

## Comprehensive Precedence Example

```java
public class OperatorPrecedence {
    public static void main(String[] args) {
        int a = 5, b = 2, c = 3;
        
        // Complex expression demonstrating precedence
        int result = a + b * c++ - --a / b;
        
        // Step by step:
        // 1. c++ (post-increment): uses 3, then c becomes 4
        // 2. --a (pre-decrement): a becomes 4, uses 4  
        // 3. b * 3 = 6
        // 4. 4 / 2 = 2
        // 5. 5 + 6 - 2 = 9
        
        System.out.println("Result: " + result);  // 9
        System.out.println("a = " + a);           // 4
        System.out.println("b = " + b);           // 2
        System.out.println("c = " + c);           // 4
    }
}
```

### Breaking Down Complex Expressions

```java
// Original expression: 5 + 2 * 3 - (4 / 2 + Math.pow(2, 3))
double result = 5 + 2 * 3 - (4 / 2 + Math.pow(2, 3));

// Step 1: Parentheses (highest precedence)
//         Math.pow(2, 3) = 8.0
//         4 / 2 = 2
//         (2 + 8.0) = 10.0

// Step 2: Multiplication (before addition/subtraction)
//         2 * 3 = 6

// Step 3: Left-to-right for addition/subtraction
//         5 + 6 = 11
//         11 - 10.0 = 1.0

System.out.println("Result: " + result);  // 1.0
```

## Unary Operators

Unary operators work on a single operand:

- `+` unary plus (rarely used)
- `-` unary minus (negation)
- `++` increment
- `--` decrement  
- `!` logical NOT
- `~` bitwise complement

### Examples

```java
public class UnaryOperators {
    public static void main(String[] args) {
        int x = 5;
        
        System.out.println(+x);   // 5 (unary plus)
        System.out.println(-x);   // -5 (unary minus)
        System.out.println(++x);  // 6 (pre-increment)
        System.out.println(x++);  // 6 (post-increment, x becomes 7)
        System.out.println(x);    // 7
        
        boolean flag = true;
        System.out.println(!flag); // false (logical NOT)
        
        byte b = 5;  // 00000101 in binary
        System.out.println(~b);    // -6 (bitwise complement: 11111010)
    }
}
```

## String Concatenation with + Operator

The `+` operator is overloaded for String concatenation:

```java
public class StringConcatenation {
    public static void main(String[] args) {
        String str1 = "Hello";
        String str2 = "World";
        
        // String concatenation
        String result = str1 + " " + str2;
        System.out.println(result);  // "Hello World"
        
        // Mixed types
        int age = 25;
        String message = "I am " + age + " years old";
        System.out.println(message);  // "I am 25 years old"
    }
}
```

### 🚨 OCA Pitfall: String Concatenation Order

```java
System.out.println("Result: " + 2 + 3);      // "Result: 23" (not "Result: 5")
System.out.println("Result: " + (2 + 3));    // "Result: 5"
System.out.println(2 + 3 + " Result");       // "5 Result"
```

When String is involved, operations proceed left-to-right, and once a String is encountered, everything becomes String concatenation.

## Numeric Promotion Rules

### 🚨 OCA Pitfall: Automatic Promotion

Java automatically promotes smaller numeric types in expressions:

```java
public class NumericPromotion {
    public static void main(String[] args) {
        byte b1 = 10;
        byte b2 = 20;
        
        // byte b3 = b1 + b2;  // COMPILATION ERROR!
        // Addition promotes bytes to int
        
        int result = b1 + b2;   // Correct
        
        // Or explicit cast
        byte b3 = (byte)(b1 + b2);  // Correct but risky
        
        System.out.println("Result: " + result);  // 30
    }
}
```

### Promotion Rules:
1. `byte`, `short`, and `char` are promoted to `int`
2. If one operand is `long`, the other is promoted to `long`
3. If one operand is `float`, the other is promoted to `float`
4. If one operand is `double`, the other is promoted to `double`

## Division by Zero

### 🚨 OCA Pitfall: Integer vs Floating-Point Division by Zero

```java
public class DivisionByZero {
    public static void main(String[] args) {
        // Integer division by zero throws ArithmeticException
        try {
            int result = 10 / 0;
        } catch (ArithmeticException e) {
            System.out.println("Integer division by zero: " + e.getMessage());
        }
        
        // Floating-point division by zero returns Infinity
        double result1 = 10.0 / 0.0;
        System.out.println("10.0 / 0.0 = " + result1);  // Infinity
        
        double result2 = -10.0 / 0.0;
        System.out.println("-10.0 / 0.0 = " + result2); // -Infinity
        
        double result3 = 0.0 / 0.0;
        System.out.println("0.0 / 0.0 = " + result3);   // NaN
    }
}
```

## Modulus Operator Deep Dive

### 🚨 OCA Pitfall: Modulus with Negative Numbers

```java
public class ModulusOperator {
    public static void main(String[] args) {
        // Positive numbers
        System.out.println(10 % 3);   // 1
        System.out.println(10 % 4);   // 2
        
        // Negative numbers - result has same sign as dividend
        System.out.println(-10 % 3);  // -1 (not 2!)
        System.out.println(10 % -3);  // 1
        System.out.println(-10 % -3); // -1
        
        // Floating-point modulus
        System.out.println(10.5 % 3.0);  // 1.5
    }
}
```

## Key Java Operator Notes

### Important Points for OCA Exam:

1. **Java does left-to-right evaluation** for operators of equal precedence
2. **Exponentiation is NOT an operator** - use `Math.pow(base, exponent)`
3. **`^` is bitwise XOR**, not exponentiation
4. **`Math.pow()` returns a `double`**
5. **Integer division truncates** (doesn't round)
6. **Compound assignment operators perform implicit casting**
7. **String concatenation changes the behavior of `+`**

### 🚨 Major OCA Pitfalls Summary:

```java
// 1. Integer division truncation
System.out.println(5 / 2);        // 2, not 2.5

// 2. Compound assignment implicit casting
short s = 10;
s += 5;  // OK - implicit cast
s = s + 5;  // COMPILATION ERROR

// 3. Pre vs post increment in expressions
int a = 5;
int b = ++a + a++;  // 6 + 6 = 12, a becomes 7

// 4. String concatenation order
System.out.println("Sum: " + 1 + 2);    // "Sum: 12"
System.out.println("Sum: " + (1 + 2));  // "Sum: 3"

// 5. Bitwise XOR, not exponentiation
System.out.println(2 ^ 3);  // 1 (XOR), not 8

// 6. Division by zero behavior
System.out.println(10 / 0);      // ArithmeticException
System.out.println(10.0 / 0.0);  // Infinity

// 7. Modulus with negative numbers
System.out.println(-10 % 3);  // -1, not 2
```

Remember: **Practice these pitfalls extensively** - they are favorite topics for OCA exam questions!

## video learn more

[The Assignment Operator in Java - Neso Academy](https://www.youtube.com/watch?v=QSsjB1tMPhA)

[Arithmetic Operators in Java - Neso Academy](https://www.youtube.com/watch?v=_XZ6i7cjdH8)

[Increment and Decrement Operators in Java - Neso Academy](https://www.youtube.com/watch?v=BuMbVAN0_-8)