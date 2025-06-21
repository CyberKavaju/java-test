# Question Generation Rules for Java Test Application

## Overview
This document provides comprehensive rules and guidelines for creating questions for the Java SE 8 Programmer I (1Z0-808) Mock Test Application. Follow these rules to ensure consistency, quality, and proper formatting of questions in the system.

## 📋 CSV Template Structure

All questions must follow the exact CSV template format:
```csv
domain,topic,question_text,option_a,option_b,option_c,option_d,option_e,correct_answer,explanation
```

## 🔧 Required Fields

### Mandatory Fields (Must be filled)
- **domain**: The main subject area (e.g., "Java Basics", "Data Types", "Operators and Decision Constructs")
- **topic**: Specific topic within the domain (e.g., "Import Statements", "Primitive Casting", "Switch Statement")
- **question_text**: The actual question content
- **option_a**: First answer option (always required)
- **option_b**: Second answer option (always required)
- **option_c**: Third answer option (always required)
- **correct_answer**: Must be A, B, C, D, or E (uppercase)

### Optional Fields
- **option_d**: Fourth answer option (can be empty)
- **option_e**: Fifth answer option (can be empty)
- **explanation**: Detailed explanation of the correct answer (recommended but optional)

## 📝 Domain Classification

### Primary Domains (Based on 1Z0-808 Exam Objectives)
1. **Java Basics**
   - Class Structure, Main Method, Import Statements, Package Declarations

2. **Working With Java Data Types**
   - Primitive Types, Wrapper Classes, Variable Initialization, Object Lifecycle

3. **Using Operators and Decision Constructs**
   - Operator Precedence, Comparison Operators, Logical Operators, If-Else, Switch, Ternary Operator

4. **Creating and Using Arrays**
   - Array Declaration, Initialization, Multi-dimensional Arrays, ArrayList

5. **Using Loop Constructs**
   - For Loops, Enhanced For, While, Do-While, Break, Continue

6. **Working with Methods and Encapsulation**
   - Method Declaration, Parameters, Return Types, Access Modifiers, Static Methods

7. **Working with Inheritance**
   - Inheritance, Polymorphism, Method Overriding, Abstract Classes, Interfaces

8. **Handling Exceptions**
   - Try-Catch-Finally, Checked vs Unchecked Exceptions, Exception Hierarchy

9. **Working with Selected classes from the Java API**
   - String, StringBuilder, Date/Time API, Collections Framework (List, Set, Map)

10. **Java 8 Features**
    - Lambda Expressions, Functional Interfaces, Date/Time API

### Important Domain Mapping Notes
- **Collections questions** (List, Set, Map, etc.) should use domain: `"Working with Selected classes from the Java API"`
- **Do NOT use** `"Collections Framework"` as a domain - it's a topic category only
- **ArrayList questions** can use either `"Creating and Using Arrays"` or `"Working with Selected classes from the Java API"` depending on focus

## 📚 Topic Classification

no question can be "others" it has to be one of the following topics:

### Java Basics
- Main Characteristics of Java
- Simple Execution of Java Program
- Multiple Classes in One Java File
- Package Declarations
- Import Statements
- Class Structure

### Working With Java Data Types
- Variable Declaration and Initialization
- Variable Casting and Conversions
- Primitive Data Types
- Wrapper Classes
- Autoboxing and Unboxing
- Working with Java Data Types

### Input/Output and Utility Classes
- Scanner Input Object
- Random Object
- Numeric Methods
- String Class
- StringBuilder Class
- Printf Method

### Using Operators and Decision Constructs
- Operators
- Comparison Operators
- Logical Operators
- Bitwise Operators
- Operator Precedence
- If-Else Statement
- Switch Statement
- When to Use If-Else or Switch
- The Enum Field
- Ternary Operator

### Using Loop Constructs
- Looping Constructs
- For Loops
- Enhanced For Loops
- While Loops
- Do-While Loops
- Break and Continue Statements

### Creating and Using Arrays
- Arrays
- Array Declaration and Initialization
- Multi-dimensional Arrays
- Array Manipulation

### Collections Framework (Use domain: "Working with Selected classes from the Java API")
- List Object
- Set Object
- Map Object
- Collections API

### Working with Methods and Encapsulation
- Methods
- Method Declaration and Parameters
- Method Overloading
- Static vs Instance Methods
- Pass by Value vs Reference
- Access Modifiers
- Varargs
- Final Keyword

### Working with Inheritance
- OOP Overview
- Classes and Objects
- Fields vs Attributes
- Getters and Setters
- Constructors
- This and Super Calls
- This Reference Variable
- Super Reference Variable
- Method Overriding
- Virtual vs Non-Virtual Methods
- Inheritance
- Polymorphism
- Abstraction
- Encapsulation

### Advanced Object-Oriented Programming
- Abstract Classes
- Abstract Methods
- Interfaces
- Lambda Expressions

### Handling Exceptions
- Exception Handling
- Try-Catch-Finally
- Checked vs Unchecked Exceptions
- Exception Hierarchy

### Working with Selected Classes from Java API
- Date Time API
- Streams API
- Generics
- File I/O

### Advanced Java Features
- Packages
- Threads
- Java 8 Features
- Functional Programming Concepts

## ✍️ Question Text Guidelines

### Code-Based Questions
- Always use proper Java syntax and formatting
- Include complete, compilable code snippets when possible
- Use realistic variable names and scenarios
- For incomplete code, clearly indicate what's missing

### Code Block Formatting
The system automatically formats code blocks. You can write code in several ways:

**Method 1: Inline with question (for short code)**
```
What is the output of the following code? ```java int i = 258; byte b = (byte) i; System.out.println(b); ```
```

**Method 2: Using code blocks (recommended for longer code)**
```
What happens when compiling and running the following code? 

```java
import java.util.Date;
import java.sql.Date;
class Test {
    public static void main(String[] args) {
        Date d = new Date();
    }
}
```
```

**Method 3: Numbered lines for reference (when line numbers matter)**
```java
What is the problem with this code?
1. public class Test {
2.     public static void main(String[] args) {
3.         int sum = 0;
4.         for(int x = 0; x < 10; x++)
5.             sum += x;
6.         System.out.println("sum = " + x);
7.     }
8. }
```

### When to Use Each Method:
- **Method 1**: Simple expressions, single statements, short snippets (1-2 lines)
- **Method 2**: Complete classes, multiple statements, complex logic (3+ lines)
- **Method 3**: When referencing specific line numbers in explanations or when line positioning is important

### Multi-Part Questions
- Use clear separators between question parts
- Each part should be answerable independently
- **Note: System only supports single-choice selection** - users can only select one answer (A, B, C, D, or E)

## 📋 Answer Options Guidelines

### Option Content
- Keep options concise but descriptive
- Use consistent formatting across options
- For code output questions, show exact output including quotes and formatting
- Use "Compilation error" for compile-time issues
- Use "Runtime exception" for runtime issues

### Option Ordering
- Order logically when possible (numerical, alphabetical, or by likelihood)
- Place "Compilation error" and "Runtime exception" typically as later options
- Don't make correct answers obviously different in length or style

### Examples of Good Options:
```csv
option_a,true true
option_b,true false  
option_c,false true
option_d,false false
option_e,Compilation error
```

## ✅ Correct Answer Guidelines

### Single-Choice System
- **The system supports only single-choice questions** - users can select exactly one answer
- Each question must have exactly one correct answer (A, B, C, D, or E)
- Multiple correct answers are not supported by the system

### Format
- Must be exactly one letter: A, B, C, D, or E (uppercase)
- Must correspond to an existing option
- Cannot be empty

### Validation
- The system validates that correct_answer matches available options
- If you only have 3 options (A, B, C), correct_answer must be A, B, or C

## 📖 Explanation Guidelines

### Content Requirements
- Explain WHY the correct answer is right
- Explain WHY incorrect options are wrong (when relevant)
- Use technical terminology appropriately
- Reference Java language specifications when helpful

### Formatting Rules
The system automatically formats explanations with:
- Sentence breaks for readability
- Backticks around exception names (e.g., `NullPointerException`)
- Backticks around Java API references (e.g., `java.lang.String`)
- Proper spacing and line breaks

### Example Explanations:
```
"Casting an int to a byte results in overflow. The value 258 modulo 256 is 2, so the byte value is 2. The output is 2."

"Two imports bring in classes named Date from different packages, making the reference to Date ambiguous. The code fails to compile because the compiler cannot determine which Date class to use."
```

## 🎯 Question Types and Patterns

### Code Output Questions (Most Common)
- Present a code snippet
- Ask for the output or behavior
- Test edge cases and corner cases

**Template:**
```
What is the output of the following code?
[code snippet]
```

### Compilation Error Questions
- Show code with compilation issues
- Test understanding of Java syntax rules

**Template:**
```
What happens when compiling the following code?
[code snippet]
```

### Conceptual Questions
- Test understanding of Java concepts without code
- Focus on OOP principles, language features

**Template:**
```
Which of the following statements about [concept] is true?
```

### Multiple Concept Questions (Single-Choice Only)
- Test understanding of multiple related concepts in one question
- **System only supports single-choice selection** (A, B, C, D, or E)
- Combine multiple concepts into single answer options
- Use phrases like "Which option contains X valid statements?"

**Template:**
```
Which option contains two valid Java identifiers?
A) _name and 2name
B) $value and class  
C) name2 and _value
D) interface and 123name
```

**Important:** Don't use "Select all that apply" or "Select X options" - users can only choose one answer.

### Code Completion Questions
- Present incomplete code
- Ask what should fill the blanks

**Template:**
```
Choose the correct option to complete the following code:
[code with blanks]
```

## 🔍 Quality Assurance Rules

### Technical Accuracy
- All code must be syntactically correct (unless testing compilation errors)
- Answers must be technically accurate according to Java SE 8 specification
- Test with actual Java compiler when in doubt

### Difficulty Levels
- **Beginner**: Basic syntax, simple concepts
- **Intermediate**: Combined concepts, edge cases
- **Advanced**: Subtle language features, complex interactions

### Common Pitfalls to Test
- Operator precedence issues
- Variable scope problems
- Exception handling flow
- Object vs primitive behavior
- Inheritance and polymorphism subtleties
- Autoboxing/unboxing edge cases

### Java API Accuracy Checklist
- **Collections**: Verify method names and return types (e.g., `values()` returns `Collection<V>`, not `List<V>`)
- **Exception Names**: Use exact names (`NullPointerException`, not `NullException`)
- **Import Statements**: Verify correct package names (`java.util.concurrent.ConcurrentHashMap`)
- **Method Signatures**: Ensure parameter types and return types are correct
- **Java 8 Features**: Only include features available in Java SE 8 (no Java 9+ features like `Map.of()`)

### Code Compilation Verification
Before finalizing questions with code:
1. Copy code into a Java file
2. Compile with `javac` 
3. Run if applicable
4. Verify the actual output matches your expected answer
5. Test edge cases mentioned in options

## 📊 CSV Formatting Rules

### Field Escaping
- Use double quotes around fields containing commas: `"Hello, World"`
- Escape internal quotes by doubling them: `"He said ""Hello"""`
- Avoid unnecessary quotes around simple text

### Line Breaks in Fields
- Use `\n` for intentional line breaks within fields
- The import system will handle proper formatting

### Special Characters
- Avoid special characters that might break CSV parsing
- Use standard ASCII characters when possible
- Test import functionality with your CSV before finalizing

### CSV Formatting Examples

**Correct escaping for commas:**
```csv
"Which method returns a Collection<V>?","values()","keySet()","entrySet()","get(), put()","clear()"
```

**Correct escaping for quotes in explanations:**
```csv
"Method put() replaces existing values. When we call put(""A"", 1) then put(""A"", 2), the second call overwrites the first."
```

**Correct line breaks in code questions:**
```csv
"What is the output?\nMap<String, Integer> map = new HashMap<>();\nmap.put(""key"", 42);\nSystem.out.println(map.get(""key""));"
```

## 🚀 Auto-Formatting Features

The system automatically applies these formatting improvements:

### Question Text
- Proper code block formatting with line breaks
- Spacing after question marks for multi-part questions
- Clean formatting of parenthetical instructions
- Whitespace cleanup while preserving intentional spacing

### Options
- Code formatting in options when detected
- Consistent spacing and cleanup

### Explanations
- Sentence breaks for readability
- Automatic backticks around exception names
- Automatic backticks around Java API references
- Proper spacing and paragraph breaks

## ✅ Validation Checklist

Before submitting questions, verify:

### Content Validation
- [ ] All required fields are filled
- [ ] Domain and topic are from approved lists and properly matched
- [ ] Question text is clear and unambiguous
- [ ] All options are well-formed and plausible
- [ ] Correct answer corresponds to an existing option
- [ ] Explanation is accurate, helpful, and educational

### Technical Validation  
- [ ] Code examples compile (unless testing compilation errors)
- [ ] CSV formatting is correct
- [ ] Question tests relevant 1Z0-808 exam objectives

## 🔧 Testing Your Questions

### Import Testing
1. Save questions in CSV format following the template
2. Use the application's import preview feature
3. Check for validation errors or formatting issues
4. Verify questions display correctly in the interface

### Content Testing
1. Manually trace through code examples
2. Test with Java compiler when applicable
3. Verify explanations match the correct answers
4. Check that distractors (wrong answers) are plausible but incorrect

## 📚 Example Question Templates

### Template 1: Code Output
```csv
Java Basics,Variable Scope,"What is the output of the following code?
public class Test {
    public static void main(String[] args) {
        int x = 5;
        {
            int x = 10;
            System.out.println(x);
        }
        System.out.println(x);
    }
}",10 5,5 10,10 10,5 5,Compilation error,E,"You cannot declare a variable with the same name in a nested scope. This causes a compilation error because 'x' is already defined in the enclosing scope."
```

### Template 2: Conceptual
```csv
Working with Inheritance,Polymorphism,"Which statement about method overriding in Java is correct?",Overridden methods must have the same return type,Overridden methods can have a more restrictive access modifier,The @Override annotation is mandatory for overriding,Overridden methods can return a subtype of the original return type,Static methods can be overridden,D,"In Java, overridden methods can have covariant return types - they can return a subtype of the return type declared in the parent class method."
```

### Template 3: Multiple Selection
```csv
Java Basics,Variable Scope,"What happens when compiling the following code?

```java
public class Test {
    public static void main(String[] args) {
        int x = 5;
        {
            int x = 10;
            System.out.println(x);
        }
    }
}
```",Prints 10,Prints 5,Prints 10 then 5,Runtime exception,Compilation error,E,"You cannot declare a variable with the same name in a nested scope when the outer scope already has a variable with that name. This causes a compilation error because variable 'x' is already defined in the enclosing scope."
```

## 🎓 Best Practices Summary

1. **Focus on 1Z0-808 exam objectives** - Ensure every question tests relevant knowledge
2. **Test edge cases** - Don't just test happy path scenarios
3. **Write clear explanations** - Help learners understand the concepts
4. **Use realistic code** - Avoid contrived examples that wouldn't appear in real code
5. **Validate thoroughly** - Test your questions before submitting
6. **Follow formatting rules** - Let the system handle formatting automatically
7. **Be consistent** - Use similar patterns and terminology across questions
8. **Think like a test-taker** - Ensure questions are fair and unambiguous

Following these rules will ensure your questions integrate seamlessly with the Java Test Application and provide valuable learning experiences for users preparing for the 1Z0-808 certification exam.
