# Scanner Input Object

---

To get an input you need a Scanner object to use it we need to import it like this `import java.util.Scanner;` you have to have this at the top of your class to be able to use it.

so now that we imported the scanner object we need to assign the object like so:

```java
Scanner sc = new Scanner(System.in);

```

once you assign your object a good practice is to close the it when you finish using it like so:

```java

sc.close();

```

if you don't close you scanner object you could end up with some bugs.

To get and input you have use the following code:

```java
sc.nextLine();
```

To use the input you have to assing it to a variable like so:

```java
String name = sc.nextLine(); // for String input
int age = sc.nextInt(); // for a interger input
```

the method `.nextLine()` gets String inputs and `.nextInt()` gets you interger inputs for diferent type of values use the correct method read more about it here [Scanner (Java SE 24 &amp; JDK 24)](https://docs.oracle.com/en/java/javase/24/docs/api/java.base/java/util/Scanner.html)

**Tip:** When mixing different types of input (`nextInt()`, `nextDouble()`, etc. with `nextLine()`), always be cautious of the newline character `\n` and consume it appropriately like so:

```java
int age = input.nextInt();
sc.nextLine(); // ← Consume the leftover newline
```

When you enter a number like `42` and press Enter, what **actually** goes into the input buffer is:

```java
4 2 \n
```

The `\n` is the newline character that comes from **pressing the Enter key**. It's **not consumed** by `nextInt()`, `nextDouble()`, or `next()`.

Java's `Scanner.nextDouble()` is **locale-sensitive**. In **some system locales (like many European ones)**, `,` is used as the decimal separator **instead of `.`**.

you can change the system locales like so;

```java

import java.util.Locale;
import java.util.Scanner;

public class Main {

    public static void main(String[] arg){

        Scanner sc = new Scanner(System.in);
        sc.useLocale(Locale.US); // force dot as decimal

    }

}

```

Or is you want to avoid the error no mater the locale configuration you can use this;

```java

double width = Double.parseDouble(sc.nextLine());

```

but in any case is recomended to validate the data if a try catch stament like so;

```java

try {

   double height = Double.parseDouble(sc.nextLine());

} catch (NumberFormatException e) {

    System.out.println("Invalid input! Please enter a number.");

}

```

There's no direct method like `nextChar()` in the `Scanner` class. But you can **read a line or token and extract the first character** from it.

Here's how you can do it:

## Get a `char` value using `Scanner`:

```java
import java.util.Scanner;

public class CharInputExample {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.print("Enter a character: ");
        char c = sc.nextLine().charAt(0);

        System.out.println("You entered: " + c);
    }
}
```

### Explanation:

- `sc.nextLine()` reads the whole line as a `String`.
- `.charAt(0)` gets the **first character** of that line.

### Watch out:

Make sure the user actually inputs something! If the line is empty, `.charAt(0)` will throw a `StringIndexOutOfBoundsException`.

You can add safety like this:

```java
String input = sc.nextLine();
if (!input.isEmpty()) {
    char c = input.charAt(0);
    System.out.println("You entered: " + c);
} else {
    System.out.println("No character entered!");
}
```
