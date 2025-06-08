# Java Test Questions Collection

## Main Questions

### Question 1

**Domain:** Other  
**Question:** What will be the output of following program code?

<code>
import java.io.*;
public class Main{
    public static void main(String args[]){
        try{
            int whizData[] = new int[10];
            System.out.println("Accessing Element Eleven" + whizData[10]);
        }catch(ArrayIndexOutOfBoundsException e){
            System.out.println("Oops. Identified Exception ::" + e);
        }
    }
}
</code>

**Options:**

- A. Compilation Fails.
- B. Oops. Identified Exception : java.lang.ArrayIndexOutOfBoundsException: 10 ✓
- C. Accessing Element Eleven: 0
- D. Oops. Identified Exception java.lang.NoDataFoundException.

**Explanation:** Array is declared with 10 elements. Then the code tries to access the 11th index element of the array which throws a standard exception java.lang.ArrayIndexOutOfBoundsException.

---

### Question 2

**Domain:** Other  
**Question:** Choose the correct options to complete the following program code. (Select 2 options.)

<code>
1. public void method() _____ Exception {
2. _____ Exception();
}
</code>

**Options:**

- A. Fill throws in line 1 ✓
- B. Fill throws new in Line 1
- C. Fill throw new in line 2 ✓
- D. Fill throws in line 2
- E. Fill throws new in line 2

**Explanation:** In method declaration, the keyword throws is used. So here at line 1 we have to use option A. To actually throw an exception, the keyword throw is used and a new exception is created, so at line 2 we have to use throw and new keywords, which is option C.

---

### Question 3

**Domain:** Other  
**Question:** Which exception will the following statement generate?

<code>
int array[] = new int[-2];
</code>

**Options:**

- A. NullPointerException
- B. NegativeArraySizeException ✓
- C. ArrayIndexOutOfBoundsException
- D. IndexOutOfBoundsException
- E. The statement executes without any exception.

**Explanation:** In the given statement we can see that we have passed a negative value for creating int array, which results in a NegativeArraySizeException.

---

### Question 4

**Domain:** Other  
**Question:** What will be the output of following program code?

<code>
1. public class Main {
2.     public static void main(String[] args) {
3.         int sum = 0;
4.         
5.         for(int x = 0; x < 10; x++)
6.             sum += x;
7.         System.out.print("sum for 0 to " + x);
8.         System.out.println(" = " + sum);
9.     }
10. }
</code>

**Options:**

- A. sum for 0 to 9 = 45
- B. sum for 0 to 10 = 45
- C. Compilation fails due to an error in line 6.
- D. Compilation fails due to an error in line 7. ✓
- E. Runtime Exception

**Explanation:** The scope of loop variables remains within the loop only. The code is trying to access that variable in line 7, which is out of the scope of the variable x causing a compile time error.

---

### Question 5

**Domain:** Other  
**Question:** Which of the following is valid for compiling java source file with the name "Main.java"?

**Options:**

- A. javac Main.java ✓
- B. java Main.class
- C. java Main.java
- D. javac Main
- E. java Main

**Explanation:** The compiler is invoked by the javac command. When compiling a java class, you must include the file name which houses the main class including the java extension.

---

### Question 6

**Domain:** Other  
**Question:** What will be the output of this program code?

<code>
import java.lang.*;
public class Main{
    public static void main(String[] args){
        try{
            double number = Double.valueOf("1200");
        }catch(NumberFormatException ex){
            System.out.println(ex);
        }
        System.out.println(number);
    }
}
</code>

**Options:**

- A. 0
- B. 1200
- C. Runtime exception NumberFormatException is generated.
- D. Compilation fails due to an error at line 6.
- E. Compilation fails due to an error at line 9. ✓

---

### Question 7

**Domain:** Other  
**Question:** Choose the options that can replace the text "abc" in the above code. (Select 2 options)

<code>
public class Main {
    public static void main(String[] args){
        int[] testData = {1,2,3};
        for (abc) {
            
        }
    }
}
</code>

**Options:**

- A. int i : testData ✓
- B. int i = 0; i < 3; i++ ✓
- C. i = 0; i < 3; i++
- D. int i
- E. i < 3

**Explanation:** Option A: for each loop condition. Option B: generic for loop condition.

---

## MyExamCloud Questions

### MyExamCloud Question 3

**Topic:** Handling Exceptions  
**Question:** Code:

<code>
public static void main(String[] args){
    Float number = Float.valueOf(args[0]);
}
</code>

Which of the following exceptions possible with above statement? (Choose two)

**Options:**

- A. IllegalArgumentException ✓
- B. NumberFormatException ✓
- C. ArrayIndexOutOfBoundsException ✓

---

### MyExamCloud Question 4

**Topic:** Working With Java Data Types  
**Question:** Which of the following is valid identifier?

**Options:**

- A. _2DPoint ✓
- B. $ocajp ✓
- C. 2DPoint
- D. java@elabs
- E. $*coffee

---

### MyExamCloud Question 5

**Topic:** Working with Methods and Encapsulation  
**Question:** Code:

<code>
1. package epracticelabs;
2.
3. public class A {
4.     protected int y = 15;
5. }
6. package elab;
7.
8. import epracticelabs.A;
9.
10. public class B extends A{
11.     int y = 10;
12.     public void print(){
13.         A a = new A();
14.         System.out.println(a.y + y);
15.     }
16. }
</code>

What is the output?

**Options:**

- A. 20
- B. 25 ✓
- C. 30
- D. Compilation fails due to error at line 14
- E. Compilation fails due to multiple errors

---

### MyExamCloud Question 6

**Topic:** Imports  
**Question:** Code:

<code>
1. import java.util.Random;
2. import java.lang.System;
3. import java.util.*;
4. import java.lang.*;
5.
6. public class MyExamCloudOcajps {
7.
8.     public static void main(String[] args) {
9.         Random r = new Random();
10.        System.out.println(r.nextInt(10));
11.    }
12. }
</code>

Which lines contains redundant imports that not necessary for this code to compile?

**Options:**

- A. Only lines 1 and 2
- B. Only lines 1,2 and 3  
- C. Only lines 2,3 and 4 ✓
- D. Only lines 1,3 and 4
- E. All

---

### MyExamCloud Question 7

**Topic:** Working with Selected classes from the Java API  
**Question:** Code:

<code>
1. import java.time.LocalDate;
2.
3. public class MyExamCloudOCajps{
4.     public static void main(String[] args) {
5.         LocalDate date = LocalDate.parse("2014-12-30");
6.         date = date.plusDays(2);
7.         date.plusHours(12);
8.         System.out.println(date.getYear() +" "+ date.getMonth() +" "+ date.getDayOfMonth());
9.     }
10. }
</code>

What is the output?

**Options:**

- A. 2015 JANUARY 1 ✓
- B. 2015 JANUARY 2
- C. 2014 JANUARY 3
- D. An exception is thrown
- E. Compilation fails ✓

**Note:** LocalDate doesn't have plusHours method, so compilation fails.

---

### Question 8

**Topic:** Working with Inheritance  
**Question:** Which of the following method can include in an interface?

**Options:**

- A. static void print(){ System.out.println("interface"); } ✓
- B. static abstract void print()
- C. default abstract void print()  
- D. default String toString(){ return "a"; } ✓
- E. None of above

---

### Question 9

**Topic:** Java 8 Features  
**Question:** Which of the followings can be considered as enhancements in java 8?

1. Support for the Lambda Expression.
2. Multiple inheritances.
3. Default methods in abstract classes.
4. Date and Time API

**Options:**

- A. Only I
- B. Only II.
- C. Only I and III
- D. Only I and IV. ✓
- E. Only II and IV.

---

### Question 10

**Topic:** Working With Java Data Types  
**Question:** Code:

<code>
1. public class MyExamCloudOCAIPs {
2.
3.     static int y = 10;
4.
5.     public static void main(String[] args){
6.         int y;
7.         System.out.println(y + MyExamCloudOCAIPs.y);
8.     }
9. }
</code>

What is the output?

**Options:**

- A. 10
- B. 11
- C. 20
- D. NullPointerException
- E. Compilation error ✓

**Explanation:** Local variable y is not initialized, causing compilation error.

---

### Question 11

**Topic:** Working With Java Data Types  
**Question:** Which of the following will convert following string to a primitive float?

<code>
String str = "1.2";
</code>

**Options:**

- A. Float.parseFloat(str); ✓
- B. Float.valueOf(str);
- C. new Float(str);
- D. (float) str;

---

**1. What is the output of the following code?**

<code>
public class Test {
    public static void main(String[] args) {
        int x = 5;
        int y = ++x * 2;
        System.out.println(y);
    }
}
</code>

A. 10
B. 11
C. 12
D. 13
✅ **Answer: C**

---

**2. Which of the following is a valid `main` method?**
A. `public static int main(String[] args)`
B. `public void main(String args[])`
C. `public static void main(String[] args)`
D. `static void main(String args)`
✅ **Answer: C**

---

**3. What will be the result of the following code?**

<code>
String s = "Hello";
s.concat(" World");
System.out.println(s);
</code>

A. Hello
B. Hello World
C. World
D. Compilation Error
✅ **Answer: A**

---

**4. What is the default value of a `boolean` variable in a class?**
A. true
B. false
C. 0
D. null
✅ **Answer: B**

---

**5. Which one is not a Java keyword?**
A. static
B. Integer
C. void
D. if
✅ **Answer: B**

---

**6. Which statement is true about Java arrays?**
A. Arrays are dynamically sized.
B. Arrays can store different data types.
C. The size of an array must be specified at declaration.
D. Arrays are objects in Java.
✅ **Answer: D**

---

**7. Which operator is used to perform a short-circuit AND?**
A. `&`
B. `|`
C. `&&`
D. `||`
✅ **Answer: C**

---

**8. Which of the following classes is immutable?**
A. StringBuilder
B. String
C. StringBuffer
D. All of the above
✅ **Answer: B**

---

**9. What is printed?**

<code>
int i = 10;
int j = 5;
int result = i++ + ++j;
System.out.println(result);
</code>

A. 15
B. 16
C. 17
D. 18
✅ **Answer: C**

---

**10. What is the return type of the `main()` method?**
A. void
B. int
C. String
D. Object
✅ **Answer: A**

---

**11. Which keyword is used to inherit a class?**
A. implement
B. interface
C. inherits
D. extends
✅ **Answer: D**

---

**12. Which of these access specifiers allows access only within the same class?**
A. private
B. public
C. protected
D. default
✅ **Answer: A**

---

**13. Which of the following is not a primitive type?**
A. int
B. float
C. char
D. String
✅ **Answer: D**

---

**14. Which exception is thrown when dividing by zero in Java?**
A. NullPointerException
B. ArithmeticException
C. IllegalArgumentException
D. NumberFormatException
✅ **Answer: B**

---

**15. How do you declare an abstract method?**
A. `public void doIt();`
B. `public void doIt() {}`
C. `abstract void doIt();`
D. `void abstract doIt();`
✅ **Answer: C**

---

**16. Which collection class maintains insertion order?**
A. HashMap
B. TreeSet
C. LinkedHashSet
D. HashSet
✅ **Answer: C**

---

**17. What is the size of a `char` in Java?**
A. 4 bytes
B. 2 bytes
C. 1 byte
D. Depends on JVM
✅ **Answer: B**

---

**18. Which of the following is not allowed in a `switch` statement?**
A. int
B. String
C. boolean
D. char
✅ **Answer: C**

---

**19. Which interface must be implemented to create a thread in Java?**
A. Runnable
B. Thread
C. Callable
D. Executor
✅ **Answer: A**

---

**20. Which method is used to get the length of a string in Java?**
A. length()
B. size()
C. getSize()
D. count()
✅ **Answer: A**

---

**21. What will it print?**

<code>
public class Q21 {
    public static void main(String[] args) {
        int x = 10;
        System.out.println(x++ + ++x);
    }
}
</code>

A. 21
B. 22
C. 20
D. 19
✅ **Answer: A**

---

**22. What will it print?**

<code>
public class Q22 {
    public static void main(String[] args) {
        boolean b = false;
        if(b = true)
            System.out.println("True");
        else
            System.out.println("False");
    }
}
</code>

A. True
B. False
C. Compilation Error
D. Runtime Exception
✅ **Answer: A**

---

**23. What will it print?**

<code>
public class Q23 {
    public static void main(String[] args) {
        String s1 = "java";
        String s2 = "java";
        System.out.println(s1 == s2);
    }
}
</code>

A. true
B. false
C. Compilation Error
D. Runtime Exception
✅ **Answer: A**

---

**24. What will it print?**

<code>
public class Q24 {
    public static void main(String[] args) {
        int x = 5;
        System.out.println((x > 2) ? (x < 4) ? 10 : 8 : 7);
    }
}
</code>

A. 10
B. 8
C. 7
D. Compilation Error
✅ **Answer: B**

---

**25. What will it print?**

<code>
public class Q25 {
    public static void main(String[] args) {
        int[] arr = {1, 2, 3};
        for(int i = 0; i < arr.length; i++) {
            System.out.print(arr[i] + " ");
        }
    }
}
</code>

A. 1 2 3
B. 3 2 1
C. 1 2 3 4
D. Compilation Error
✅ **Answer: A**

---

**26. What will it print?**

<code>
public class Q26 {
    public static void main(String[] args) {
        String s = null;
        System.out.println(s + "world");
    }
}
</code>

A. world
B. nullworld
C. Compilation Error
D. NullPointerException
✅ **Answer: B**

---

**27. What will it print?**

<code>
public class Q27 {
    public static void main(String[] args) {
        String s1 = new String("OCA");
        String s2 = "OCA";
        System.out.println(s1 == s2);
    }
}
</code>

A. true
B. false
C. Compilation Error
D. NullPointerException
✅ **Answer: B**

---

**28. What will it print?**

<code>
public class Q28 {
    public static void main(String[] args) {
        int x = 7;
        int y = 3;
        System.out.println(x % y);
    }
}
</code>

A. 2
B. 1
C. 3
D. 0
✅ **Answer: A**

---

**29. What will it print?**

<code>
public class Q29 {
    public static void main(String[] args) {
        int x = 2;
        int y = 5;
        x *= y + 3;
        System.out.println(x);
    }
}
</code>

A. 16
B. 13
C. 10
D. 8
✅ **Answer: A**

---

**30. What will it print?**

<code>
public class Q30 {
    public static void main(String[] args) {
        int[] arr = new int[2];
        System.out.println(arr[0]);
    }
}
</code>

A. 0
B. null
C. Compilation Error
D. Exception
✅ **Answer: A**

---

**31. What will it print?**

<code>
public class Q31 {
    public static void main(String[] args) {
        String str = "abc";
        str.toUpperCase();
        System.out.println(str);
    }
}
</code>

A. abc
B. ABC
C. Compilation Error
D. NullPointerException
✅ **Answer: A**

---

**32. What will it print?**

<code>
public class Q32 {
    public static void main(String[] args) {
        int i = 0;
        do {
            System.out.print(i + " ");
        } while(i++ < 2);
    }
}
</code>

A. 0 1 2
B. 0 1 2 3
C. 1 2 3
D. Infinite loop
✅ **Answer: A**

---

**33. What will it print?**

<code>
public class Q33 {
    public static void main(String[] args) {
        int x = 5;
        int y = 10;
        System.out.println(x > 2 && y < 15);
    }
}
</code>

A. true
B. false
C. Compilation Error
D. Exception
✅ **Answer: A**

---

**34. What will it print?**

<code>
public class Q34 {
    public static void main(String[] args) {
        String str = "Java";
        System.out.println(str.charAt(2));
    }
}
</code>

A. v
B. a
C. J
D. Compilation Error
✅ **Answer: A**

---

**35. What will it print?**

<code>
public class Q35 {
    public static void main(String[] args) {
        int a = 10, b = 20;
        int max = (a > b) ? a : b;
        System.out.println(max);
    }
}
</code>

A. 10
B. 20
C. 0
D. Compilation Error
✅ **Answer: B**

---

**36. What will it print?**

<code>
public class Q36 {
    public static void main(String[] args) {
        int x = 0;
        if(x) {
            System.out.println("Zero");
        }
    }
}
</code>

A. Zero
B. Nothing
C. Compilation Error
D. Runtime Exception
✅ **Answer: C**

---

**37. What will it print?**

<code>
public class Q37 {
    public static void main(String[] args) {
        byte b = 127;
        b++;
        System.out.println(b);
    }
}
</code>

A. 127
B. 128
C. -128
D. Compilation Error
✅ **Answer: C**

---

**38. What will it print?**

<code>
public class Q38 {
    public static void main(String[] args) {
        System.out.println(10 + 20 + "30");
    }
}
</code>

A. 30
B. 1030
C. 3030
D. 3030.0
✅ **Answer: B**

---

**39. What will it print?**

<code>
public class Q39 {
    public static void main(String[] args) {
        String a = "Hello";
        String b = "Hel" + "lo";
        System.out.println(a == b);
    }
}
</code>

A. true
B. false
C. Compilation Error
D. Runtime Exception
✅ **Answer: A**

---

**40. What will it print?**

<code>
public class Q40 {
    public static void main(String[] args) {
        final int x = 100;
        byte b = x;
        System.out.println(b);
    }
}
</code>

A. 100
B. Compilation Error
C. 0
D. Runtime Exception
✅ **Answer: A**

---

**41. What will it print?**

<code>
public class Q41 {
    public static void main(String[] args) {
        int[][] matrix = new int[2][];
        matrix[0] = new int[3];
        matrix[1] = new int[2];
        System.out.println(matrix[0].length + matrix[1].length);
    }
}
</code>

A. 4
B. 5
C. 6
D. Compilation Error
✅ **Answer: B**

---

**42. What will it print?**

<code>
public class Q42 {
    public static void main(String[] args) {
        int[] arr = {1, 2, 3};
        System.out.println(arr[3]);
    }
}
</code>

A. 3
B. IndexOutOfBoundsException
C. Compilation Error
D. null
✅ **Answer: B**

---

**43. What will it print?**

<code>
public class Q43 {
    public static void main(String[] args) {
        int[] a = {1, 2, 3};
        int[] b = a;
        b[0] = 10;
        System.out.println(a[0]);
    }
}
</code>

A. 1
B. 10
C. 0
D. Compilation Error
✅ **Answer: B**

---

**44. What will it print?**

<code>
public class Q44 {
    public static void main(String[] args) {
        String[] names = new String[2];
        System.out.println(names[0].length());
    }
}
</code>

A. 0
B. null
C. Compilation Error
D. NullPointerException
✅ **Answer: D**

---

**45. What will it print?**

<code>
public class Q45 {
    public static void main(String[] args) {
        try {
            int[] nums = new int[5];
            nums[10] = 3;
        } catch (Exception e) {
            System.out.println("Caught: " + e);
        }
    }
}
</code>

A. Caught: java.lang.Exception
B. Caught: java.lang.ArrayIndexOutOfBoundsException
C. Compilation Error
D. Runtime Error
✅ **Answer: B**

---

**46. What will it print?**

<code>
public class Q46 {
    public static void main(String[] args) {
        try {
            int x = Integer.parseInt("abc");
        } catch (NumberFormatException e) {
            System.out.println("Invalid format");
        }
    }
}
</code>

A. Invalid format
B. abc
C. Compilation Error
D. Runtime Error
✅ **Answer: A**

---

**47. What will it print?**

<code>
public class Q47 {
    public static void main(String[] args) {
        String[] vals = new String[]{"one", "two", "three"};
        for(String s : vals)
            System.out.print(s + " ");
    }
}
</code>

A. one two three
B. three two one
C. Compilation Error
D. Runtime Error
✅ **Answer: A**

---

**48. What will it print?**

<code>
public class Q48 {
    public static void main(String[] args) {
        int[][] grid = new int[1][2];
        System.out.println(grid.length + " " + grid[0].length);
    }
}
</code>

A. 1 2
B. 2 1
C. Compilation Error
D. 1 0
✅ **Answer: A**

---

**49. What will happen?**

<code>
public class Q49 {
    public static void main(String[] args) {
        int[] arr = new int[-2];
        System.out.println("Length: " + arr.length);
    }
}
</code>

A. Length: -2
B. Compilation Error
C. NegativeArraySizeException
D. 0
✅ **Answer: C**

---

**50. What will it print?**

<code>
public class Q50 {
    public static void main(String[] args) {
        try {
            int x = 10 / 0;
        } catch (ArithmeticException ex) {
            System.out.println("Divide by zero!");
        }
    }
}
</code>

A. Divide by zero!
B. 0
C. Compilation Error
D. Runtime Exception
✅ **Answer: A**

---

**51. What will it print?**

<code>
public class Q51 {
    public static void main(String[] args) {
        int[] data = {10, 20, 30};
        for (int i = 0; i <= data.length; i++) {
            System.out.print(data[i] + " ");
        }
    }
}
</code>

A. 10 20 30
B. 10 20 30 0
C. Compilation Error
D. ArrayIndexOutOfBoundsException
✅ **Answer: D**

---

**52. What will it print?**

<code>
public class Q52 {
    public static void main(String[] args) {
        String[][] text = new String[2][];
        text[0] = new String[]{"A", "B"};
        text[1] = new String[]{"C"};
        System.out.println(text[1][0]);
    }
}
</code>

A. A
B. B
C. C
D. null
✅ **Answer: C**

---

**53. What will it print?**

<code>
public class Q53 {
    public static void main(String[] args) {
        int[] nums = new int[0];
        System.out.println(nums.length);
    }
}
</code>

A. 0
B. 1
C. Compilation Error
D. Exception
✅ **Answer: A**

---

**54. What will it print?**

<code>
public class Q54 {
    public static void main(String[] args) {
        String[] list = null;
        try {
            System.out.println(list[0]);
        } catch (NullPointerException e) {
            System.out.println("Caught NPE");
        }
    }
}
</code>

A. null
B. Caught NPE
C. Compilation Error
D. Runtime Error
✅ **Answer: B**

---

**55. What will it print?**

<code>
public class Q55 {
    public static void main(String[] args) {
        try {
            throw new IllegalArgumentException("Bad input");
        } catch (RuntimeException e) {
            System.out.println("Caught: " + e.getMessage());
        }
    }
}
</code>

A. Bad input
B. Caught: Bad input
C. Compilation Error
D. IllegalArgumentException
✅ **Answer: B**

---

**56. What will it print?**

<code>
public class Q56 {
    public static void main(String[] args) {
        int[] values = {1, 2, 3, 4};
        for (int i = values.length - 1; i >= 0; i--) {
            System.out.print(values[i] + " ");
        }
    }
}
</code>

A. 4 3 2 1
B. 1 2 3 4
C. Compilation Error
D. Runtime Error
✅ **Answer: A**

---

**57. What will it print?**

<code>
public class Q57 {
    public static void main(String[] args) {
        try {
            int a = Integer.parseInt("10.5");
        } catch (NumberFormatException e) {
            System.out.println("Format error");
        }
    }
}
</code>

A. Format error
B. 10.5
C. Compilation Error
D. Runtime Error
✅ **Answer: A**

---

**58. What will it print?**

<code>
public class Q58 {
    public static void main(String[] args) {
        Object[] obj = new String[2];
        obj[0] = 10;
        System.out.println("Done");
    }
}
</code>

A. Done
B. Compilation Error
C. ArrayStoreException
D. null
✅ **Answer: C**

---

**59. What will it print?**

<code>
public class Q59 {
    public static void main(String[] args) {
        String[] arr = {"one", "two", "three"};
        System.out.println(arr[arr.length]);
    }
}
</code>

A. three
B. Compilation Error
C. IndexOutOfBoundsException
D. Runtime Error
✅ **Answer: C**

---

**60. What will it print?**

<code>
public class Q60 {
    public static void main(String[] args) {
        try {
            throw new Exception("Boom");
        } catch (RuntimeException e) {
            System.out.println("Caught runtime");
        } catch (Exception e) {
            System.out.println("Caught exception");
        }
    }
}
</code>

A. Caught runtime
B. Boom
C. Caught exception
D. Compilation Error
✅ **Answer: C**

---

**61. What will it print?**

<code>
public class Q61 {
    public static void main(String[] args) {
        int i = 10;
        if (i = 5) {
            System.out.println("Equal");
        }
    }
}
</code>

A. Equal
B. Nothing
C. Compilation Error
D. Runtime Error
✅ **Answer: C**

> ❗ Assignment `i = 5` is not allowed in an `if` condition expecting a boolean.

---

**62. What will it print?**

<code>
public class Q62 {
    static int x;
    public static void main(String[] args) {
        int x;
        System.out.println(x);
    }
}
</code>

A. 0
B. Compilation Error
C. Runtime Exception
D. null
✅ **Answer: B**

> ❗ Local variables must be initialized before use.

---

**63. What will it print?**

<code>
public class Q63 {
    public static void main(String[] args) {
        byte b = 10;
        b = b + 1;
        System.out.println(b);
    }
}
</code>

A. 11
B. Compilation Error
C. 10
D. Runtime Error
✅ **Answer: B**

> ❗ `b + 1` results in an `int`, must be cast back to `byte`.

---

**64. What will it print?**

<code>
public class Q64 {
    public static void main(String[] args) {
        long x = 10_000;
        System.out.println(x);
    }
}
</code>

A. 10000
B. Compilation Error
C. 10\_000
D. 10,000
✅ **Answer: A**

> ✅ Underscores in numeric literals are legal for readability.

---

**65. What will it print?**

<code>
public class Q65 {
    public static void main(String[] args) {
        String s1 = "Hello";
        String s2 = new String("Hello");
        System.out.println(s1 == s2);
    }
}
</code>

A. true
B. false
C. Compilation Error
D. Runtime Error
✅ **Answer: B**

> ❗ `==` compares object references; these point to different objects.

---

**66. What will it print?**

<code>
public class Q66 {
    public static void main(String[] args) {
        System.out.println("1" + 2 + 3);
    }
}
</code>

A. 123
B. 6
C. 33
D. 15
✅ **Answer: A**

> ➕ String concatenation happens left-to-right: `"1" + 2 → "12"`, `"12" + 3 → "123"`

---

**67. What will it print?**

<code>
public class Q67 {
    public static void main(String[] args) {
        char c = 65;
        System.out.println(c);
    }
}
</code>

A. A
B. 65
C. Compilation Error
D. null
✅ **Answer: A**

> ✅ `char` can be assigned an integer ASCII value.

---

**68. What will it print?**

<code>
public class Q68 {
    public static void main(String[] args) {
        double d = 5 / 2;
        System.out.println(d);
    }
}
</code>

A. 2.0
B. 2.5
C. Compilation Error
D. Runtime Exception
✅ **Answer: A**

> ❗ Integer division occurs first: `5/2 = 2`, then widened to double.

---

**69. What will it print?**

<code>
public class Q69 {
    public static void main(String[] args) {
        System.out.println(10 + 20 + "30");
    }
}
</code>

A. 30
B. 1030
C. 3030
D. 3020
✅ **Answer: B**

> ➕ Integer addition first → then string concat: `30 + "30" = "3030"`

---

**70. What will it print?**

<code>
public class Q70 {
    public static void main(String[] args) {
        int[] arr = new int[]{1, 2, 3};
        System.out.println(arr.length());
    }
}
</code>

A. 3
B. Compilation Error
C. Runtime Error
D. 0
✅ **Answer: B**

> ❗ `length` is a field, not a method. Should be `arr.length`

---

**71. What will it print?**

<code>
public class Q71 {
    public static void main(String[] args) {
        Object o = new int[]{1, 2, 3};
        System.out.println(o instanceof Object);
    }
}
</code>

A. true
B. false
C. Compilation Error
D. Runtime Exception
✅ **Answer: A**

> ✅ Arrays are objects, even if type-cast to Object.

---

**72. What will it print?**

<code>
public class Q72 {
    public static void main(String[] args) {
        int a = 5;
        a += 3.5;
        System.out.println(a);
    }
}
</code>

A. 8
B. 8.5
C. Compilation Error
D. Runtime Error
✅ **Answer: C**

> ❗ `a += 3.5` tries to implicitly cast double to int.

---

**73. What will it print?**

<code>
public class Q73 {
    static int x = 10;
    public static void main(String[] args) {
        int x = 20;
        System.out.println(x);
    }
}
</code>

A. 10
B. 20
C. Compilation Error
D. Runtime Error
✅ **Answer: B**

> ✅ Local variable shadows class variable.

---

**74. What will it print?**

<code>
public class Q74 {
    public static void main(String[] args) {
        int[] a = new int[3];
        System.out.println(a[3]);
    }
}
</code>

A. 0
B. 3
C. Compilation Error
D. ArrayIndexOutOfBoundsException
✅ **Answer: D**

---

**75. What will it print?**

<code>
public class Q75 {
    public static void main(String[] args) {
        final int x = 100;
        byte b = x;
        System.out.println(b);
    }
}
</code>

A. 100
B. Compilation Error
C. 0
D. Runtime Error
✅ **Answer: A**

> ✅ Compile-time constant fits in byte range.

---

**76. What will it print?**

<code>
public class Q76 {
    public static void main(String[] args) {
        short s = 10;
        s = s * 5;
        System.out.println(s);
    }
}
</code>

A. 50
B. Compilation Error
C. Runtime Error
D. 10
✅ **Answer: B**

> ❗ `s * 5` promotes to int. Needs explicit cast back to `short`.

---

**77. What will it print?**

<code>
public class Q77 {
    public static void main(String[] args) {
        System.out.println(true ? "yes" : 10);
    }
}
</code>

A. yes
B. 10
C. Compilation Error
D. Runtime Error
✅ **Answer: C**

> ❗ Ternary must resolve to compatible types. `"yes"` vs `int` is invalid.

---

**78. What will it print?**

<code>
public class Q78 {
    public static void main(String[] args) {
        int i = 0;
        for (System.out.print("A"); i < 1; i++)
            System.out.print("B");
        System.out.print("C");
    }
}
</code>

A. ABC
B. BAC
C. ACB
D. Compilation Error
✅ **Answer: A**

---

**79. What will it print?**

<code>
public class Q79 {
    public static void main(String[] args) {
        int x = 5;
        switch(x) {
            case 5: System.out.println("Five");
            default: System.out.println("Default");
        }
    }
}
</code>

A. Five
B. Default
C. Five Default
D. Compilation Error
✅ **Answer: C**

> ❗ No `break`, so fall-through occurs.

---

**80. What will it print?**

<code>
public class Q80 {
    public static void main(String[] args) {
        String str = "null";
        System.out.println(str == null);
    }
}
</code>

A. true
B. false
C. null
D. Compilation Error
✅ **Answer: B**

> ⚠️ Literal `"null"` is just a string, not `null`.

---
