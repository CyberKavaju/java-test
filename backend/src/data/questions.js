const initialQuestions = [
    {
        domain: "Other",
        topic: "Arrays and Exception Handling",
        question_text: "What will be the output of following program code?\n\n<code>\nimport java.io.*;\npublic class Main{\n    public static void main(String args[]){\n        int[] array = new int[10];\n        System.out.println(\"Accessing Element Eleven: \" + array[10]);\n    }\n}\n</code>",
        option_a: "Compilation Fails.",
        option_b: "Oops. Identified Exception : java.lang.ArrayIndexOutOfBoundsException: 10",
        option_c: "Accessing Element Eleven: 0",
        option_d: "Oops. Identified Exception java.lang.NoDataFoundException.",
        option_e: null,
        correct_answer: "B",
        explanation: "Array is declared with 10 elements. Then the code tries to access the 11th index element of the array which throws a standard exception java.lang.ArrayIndexOutOfBoundsException."
    },
    {
        domain: "Other",
        topic: "Exception Handling",
        question_text: "Choose the correct options to complete the following program code. (Select 2 options.)\n\n<code>\n1. public void method() _____ Exception {\n2. _____ Exception();\n}\n</code>",
        option_a: "Fill throws in line 1",
        option_b: "Fill throws new in Line 1",
        option_c: "Fill throw new in line 2",
        option_d: "Fill throws in line 2",
        option_e: "Fill throws new in line 2",
        correct_answer: "A,C",
        explanation: "In method declaration, the keyword throws is used. So here at line 1 we have to use option A. To actually throw an exception, the keyword throw is used and a new exception is created, so at line 2 we have to use throw and new keywords, which is option C."
    },
    {
        domain: "Other",
        topic: "Arrays and Exception Handling",
        question_text: "Which exception will the following statement generate?\n\n<code>\nint array[] = new int[-2];\n</code>",
        option_a: "NullPointerException",
        option_b: "NegativeArraySizeException",
        option_c: "ArrayIndexOutOfBoundsException",  
        option_d: "IndexOutOfBoundsException",
        option_e: "The statement executes without any exception.",
        correct_answer: "B",
        explanation: "In the given statement we can see that we have passed a negative value for creating int array, which results in a NegativeArraySizeException."
    },
    {
        domain: "Other",
        topic: "Loop Constructs and Variable Scope",
        question_text: "What will be the output of following program code?\n\n<code>\n1. public class Main {\n2.     public static void main(String[] args) {\n3.         int sum = 0;\n4.         \n5.         for(int x = 0; x < 10; x++)\n6.             sum += x;\n7.         System.out.print(\"sum for 0 to \" + x);\n8.         System.out.println(\" = \" + sum);\n9.     }\n10. }\n</code>",
        option_a: "sum for 0 to 9 = 45",
        option_b: "sum for 0 to 10 = 45", 
        option_c: "Compilation fails due to an error in line 6.",
        option_d: "Compilation fails due to an error in line 7.",
        option_e: "Runtime Exception",
        correct_answer: "D",
        explanation: "The scope of loop variables remains within the loop only. The code is trying to access that variable in line 7, which is out of the scope of the variable x causing a compile time error."
    },
    {
        domain: "Other",
        topic: "Java Compilation",
        question_text: "Which of the following is valid for compiling java source file with the name \"Main.java\"?",
        option_a: "javac Main.java",
        option_b: "java Main.class",
        option_c: "java Main.java",
        option_d: "javac Main",
        option_e: "java Main",
        correct_answer: "A",
        explanation: "The compiler is invoked by the javac command. When compiling a java class, you must include the file name which houses the main class including the java extension."
    },
    {
        domain: "Handling Exceptions",
        topic: "Exception Handling",
        question_text: "Code:\n\n<code>\npublic static void main(String[] args){\n    Float number = Float.valueOf(args[0]);\n}\n</code>\n\nWhich of the following exceptions possible with above statement? (Choose three)",
        option_a: "IllegalArgumentException",
        option_b: "NumberFormatException", 
        option_c: "ArrayIndexOutOfBoundsException",
        option_d: "NullPointerException",
        option_e: "ClassCastException",
        correct_answer: "A,B,C",
        explanation: "IllegalArgumentException can occur with invalid input, NumberFormatException for non-numeric strings, and ArrayIndexOutOfBoundsException if no arguments are provided."
    },
    {
        domain: "Working With Java Data Types",
        topic: "Identifiers",
        question_text: "Which of the following is valid identifier?",
        option_a: "_2DPoint",
        option_b: "$ocajp",
        option_c: "2DPoint",
        option_d: "java@elabs", 
        option_e: "$*coffee",
        correct_answer: "A,B",
        explanation: "Valid identifiers can start with letter, underscore, or dollar sign. _2DPoint and $ocajp are valid. 2DPoint starts with digit (invalid), java@elabs contains @ (invalid), $*coffee contains * (invalid)."
    },
    {
        domain: "Working with Methods and Encapsulation",
        topic: "Inheritance and Access Modifiers",
        question_text: "Code:\n\n<code>\n1. package epracticelabs;\n2.\n3. public class A {\n4.     protected int y = 15;\n5. }\n6. package elab;\n7.\n8. import epracticelabs.A;\n9.\n10. public class B extends A{\n11.     int y = 10;\n12.     public void print(){\n13.         A a = new A();\n14.         System.out.println(a.y + y);\n15.     }\n16. }\n</code>\n\nWhat is the output?",
        option_a: "20",
        option_b: "25",
        option_c: "30", 
        option_d: "Compilation fails due to error at line 14",
        option_e: "Compilation fails due to multiple errors",
        correct_answer: "D",
        explanation: "In class B, we cannot access protected member y of class A through an instance of A from a different package, even though B extends A."
    },
    {
        domain: "Imports",
        topic: "Import Statements",
        question_text: "Code:\n\n<code>\n1. import java.util.Random;\n2. import java.lang.System;\n3. import java.util.*;\n4. import java.lang.*;\n5.\n6. public class MyExamCloudOcajps {\n7.\n8.     public static void main(String[] args) {\n9.         Random r = new Random();\n10.        System.out.println(r.nextInt(10));\n11.    }\n12. }\n</code>\n\nWhich lines contains redundant imports that not necessary for this code to compile?",
        option_a: "Only lines 1 and 2",
        option_b: "Only lines 1,2 and 3",
        option_c: "Only lines 2,3 and 4",
        option_d: "Only lines 1,3 and 4",
        option_e: "All",
        correct_answer: "C",
        explanation: "Line 2 is redundant (java.lang.* imported by default), line 3 is redundant (line 1 already imports Random), line 4 is redundant (java.lang.* imported by default)."
    },
    {
        domain: "Working with Selected classes from the Java API",
        topic: "Date and Time API",
        question_text: "Code:\n\n<code>\n1. import java.time.LocalDate;\n2.\n3. public class MyExamCloudOCajps{\n4.     public static void main(String[] args) {\n5.         LocalDate date = LocalDate.parse(\"2014-12-30\");\n6.         date = date.plusDays(2);\n7.         date.plusHours(12);\n8.         System.out.println(date.getYear() +\" \"+ date.getMonth() +\" \"+ date.getDayOfMonth());\n9.     }\n10. }\n</code>\n\nWhat is the output?",
        option_a: "2015 JANUARY 1",
        option_b: "2015 JANUARY 2",
        option_c: "2014 JANUARY 3",
        option_d: "An exception is thrown",
        option_e: "Compilation fails",
        correct_answer: "E",
        explanation: "LocalDate doesn't have plusHours method, so compilation fails."
    },
    {
        domain: "Working with Inheritance",
        topic: "Interfaces",
        question_text: "Which of the following method can include in an interface?",
        option_a: "static void print(){ System.out.println(\"interface\"); }",
        option_b: "static abstract void print()",
        option_c: "default abstract void print()",
        option_d: "default String toString(){ return \"a\"; }",
        option_e: "None of above",
        correct_answer: "A,D",
        explanation: "Interfaces can have static methods with implementation and default methods with implementation. Abstract methods cannot be static, and default methods cannot be abstract."
    },
    {
        domain: "Java 8 Features",
        topic: "Java 8 Enhancements",
        question_text: "Which of the followings can be considered as enhancements in java 8?\n\n1. Support for the Lambda Expression.\n2. Multiple inheritances.\n3. Default methods in abstract classes.\n4. Date and Time API",
        option_a: "Only 1",
        option_b: "1 and 4",
        option_c: "1, 2 and 4",
        option_d: "1, 3 and 4",
        option_e: "All of the above",
        correct_answer: "B",
        explanation: "Java 8 introduced Lambda Expressions and new Date/Time API. Java doesn't support multiple inheritance, and default methods are in interfaces, not abstract classes."
    }
];

module.exports = initialQuestions;
