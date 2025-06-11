# Operators

the operators are like all C base languages nothing special there

- `+` for adding
- `-` for substracting
- `*` for multiplying
- `/` for dividing
- `%` for the leftover of a division

## Augmented assigment

now there are 2 ways use an operator the regular and augmented assigment way

regular would  be like so;

```java
int x = 4;
int y = 5;
x = x + y;
```

and the augmented assigment way will be;

```java
int x = 4;
int y = 5;
x += y;
```

the augmented assigments are the following

- `+=` for adding
- `-=` for substracting
- `*=` for multiplying
- `/=` for dividing
- `%=` for leftover

## Increment and decrement operators

We use this o add 1 to a variable like loop counter or substract 1 like countdown

for adding we will use; `x++;`.

for substracting we will use `x--`.

we use this a shortcut instead of writing `x = x + 1;` or `x = x - 1;`

## Order of operations (P-E-M-D-A-S)

all math operations have this order

1. Parentesis `()`
2. Exponents (unary plus/minus) `+5` `-5`
3. Multiplication `*`
4. Division `/`
5. Addition `+`
6. Substration `-`

Java follows **standard mathematical order of operations**, often remembered by the acronym **PEMDAS**:

```text
P – Parentheses  
E – Exponents (unary plus/minus)
MD – Multiplication & Division (left to right)  
AS – Addition & Subtraction (left to right)
```

## Example Demonstrating PEMDAS

```java
public class OrderOfOperations {
    public static void main(String[] args) {
        double result = 5 + 2 * 3 - (4 / 2 + Math.pow(2, 3));

        System.out.println("Result: " + result);
    }
}
```

## Step-by-step breakdown:

```text
Expression: 5 + 2 * 3 - (4 / 2 + Math.pow(2, 3))

Step 1: Parentheses:
         (4 / 2 + Math.pow(2, 3)) → (2 + 8) → 10

Step 2: Outside:
         5 + 2 * 3 - 10

Step 3: Multiplication:
         2 * 3 → 6

Step 4: Final:
         5 + 6 - 10 → 11 - 10 → 1

Result: 1.0
```

## Key Java Notes

- Java does **left-to-right evaluation** for operators of equal precedence:

  - `5 + 6 - 10` is evaluated as `((5 + 6) - 10)`
- Exponentiation is **not an operator**, it's a **method**:

  ```java
  Math.pow(base, exponent);
  ```

## Common Mistakes

- Thinking `^` is exponent → nope! It's **bitwise XOR**
- Forgetting that `Math.pow()` returns a `double`
- Integer division truncates:

  ```java
  System.out.println(5 / 2); // prints 2, not 2.5
  ```
