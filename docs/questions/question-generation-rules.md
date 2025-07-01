# Question Generation Rules for Java Test Application

## Overview
This document provides comprehensive rules and guidelines for creating questions for the Java SE 8 Programmer I (1Z0-808) Mock Test Application. The system supports both **single-choice** and **multi-selection** questions, allowing for comprehensive testing of Java concepts. Follow these rules to ensure consistency, quality, and proper formatting of questions in the system.

### Key Features
- **Dual question types**: Single-choice (one correct answer) and multi-selection (multiple correct answers)
- **Smart UI**: Automatic radio buttons for single-choice, checkboxes for multi-selection
- **Flexible scoring**: Supports both exact match and categorical knowledge testing
- **Backward compatibility**: All existing questions continue to work unchanged

## 📋 CSV Template Structure

All questions must follow the exact CSV template format:
```csv
domain,topic,question_text,option_a,option_b,option_c,option_d,option_e,correct_answer,explanation,question_type
```

**Important**: The `question_type` field is now required and must be either `single` or `multiple`.

## 🔧 Required Fields

### Mandatory Fields (Must be filled)
- **domain**: The main subject area (e.g., "Java Basics", "Data Types", "Operators and Decision Constructs")
- **topic**: Specific topic within the domain (e.g., "Import Statements", "Primitive Casting", "Switch Statement")
- **question_text**: The actual question content
- **option_a**: First answer option (always required)
- **option_b**: Second answer option (always required)
- **option_c**: Third answer option (always required)
- **correct_answer**: 
  - For single-choice: Must be A, B, C, D, or E (uppercase)
  - For multi-selection: Comma-separated list (e.g., "A,B,D")
- **question_type**: Must be "single" or "multiple"

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
- Variable Scope
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
- **IMPORTANT**: Always include complete boilerplate code structure (class declaration, main method, etc.)
- Never show partial code without proper class structure - all code must be executable as-is
- Include `public class ClassName {}` and `public static void main(String[] args) {}` when applicable

### Code Block Formatting
The system automatically formats code blocks. You can write code in several ways:

### Complete Code Structure Requirement
**CRITICAL RULE**: All code examples must include complete, executable Java structure:
- Always include class declaration: `public class Test {}`
- Always include main method: `public static void main(String[] args) {}`
- Never show isolated code snippets without proper class/method context
- Code must be compilable and runnable as presented
- Exception: Only when testing specific syntax elements in isolation (like expressions)

**Method 1: Inline with question (for short code)**
```
What is the output of the following code? 
```java
public class Test {
    public static void main(String[] args) {
        int i = 258; 
        byte b = (byte) i; 
        System.out.println(b);
    }
}
```
```

**Method 2: Using code blocks (recommended for longer code)**
```
What happens when compiling and running the following code? 

```java
import java.util.Date;
import java.sql.Date;

public class Test {
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
- **Support both question types**: Can be single-choice or multi-selection
- For multi-selection: Each part can have multiple correct answers
- Make question type clear in the question text

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

### Question Answer System
The system supports both single-choice and multi-selection questions:

#### Single-Choice Questions
- Users can select exactly one answer (A, B, C, D, or E)
- Each question has exactly one correct answer
- Use `question_type: "single"`

#### Multi-Selection Questions  
- Users can select multiple answers simultaneously
- Questions can have 2-5 correct answers
- All correct answers must be selected for full credit (no partial credit)
- Use `question_type: "multiple"`

### Format Requirements

#### Single-Choice Format
- Must be exactly one letter: A, B, C, D, or E (uppercase)
- Must correspond to an existing option
- Cannot be empty

**Example:**
```csv
correct_answer,A
question_type,single
```

#### Multi-Selection Format
- Comma-separated letters with no spaces: A,B,D
- Must correspond to existing options
- Minimum 2 correct answers, maximum 5
- Cannot be empty

**Example:**
```csv
correct_answer,"A,B,D"
question_type,multiple
```

### Validation Rules
- System validates that all correct_answer letters correspond to existing options
- If you only have 3 options (A, B, C), correct_answer cannot include D or E
- Multi-selection questions require at least 2 correct answers
- Single-choice questions require exactly 1 correct answer

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

## 🎯 Question Type Classification

The system supports two types of questions: **single-choice** and **multi-selection**. Understanding when to use each type is crucial for creating effective questions.

### Single-Choice Questions (`question_type: "single"`)

**Use single-choice when:**
- There is exactly one correct answer
- The question tests a single concept or rule
- Options are mutually exclusive
- Testing knowledge of a specific fact or output

**Examples:**
- "What is the output of this code?" (specific output)
- "What is the default value of an int?" (one correct answer)
- "Which access modifier makes a member visible only within the same class?" (one specific modifier)
- "What happens when this code compiles?" (compilation error vs success)

**Correct Answer Format:** Single letter (A, B, C, D, or E)
```csv
correct_answer,A
question_type,single
```

### Multi-Selection Questions (`question_type: "multiple"`)

**Use multi-selection when:**
- Multiple answers are correct simultaneously
- Testing knowledge of groups, sets, or categories
- Question asks "Which of the following..." or "Select all that apply"
- Testing identification of multiple valid options

**Examples:**
- "Which of the following are valid Java keywords?" (multiple keywords exist)
- "Which access modifiers allow access from subclasses?" (public, protected)
- "Which primitive types can hold negative values?" (byte, short, int, long, float, double)
- "Which statements about interfaces are true?" (multiple true statements)

**Correct Answer Format:** Comma-separated letters (A,B,D)
```csv
correct_answer,"A,B,D"
question_type,multiple
```

### Question Type Decision Matrix

| Question Scenario | Question Type | Reasoning |
|------------------|---------------|-----------|
| "What is the output?" | Single | One specific output |
| "Which are primitive types?" | Multiple | Several exist |
| "Does this code compile?" | Single | Yes/No answer |
| "Which keywords are access modifiers?" | Multiple | Several exist |
| "What exception is thrown?" | Single | One specific exception |
| "Which methods are inherited?" | Multiple | Several may be inherited |
| "Which operator has highest precedence?" | Single | One specific operator |
| "Which loops can use break?" | Multiple | Several loop types |

### Important Multi-Selection Rules

1. **Minimum Options**: Multi-selection questions should have at least 2 correct answers
2. **Maximum Selections**: System automatically calculates based on correct answers
3. **Partial Credit**: No partial credit - all correct answers must be selected
4. **Order Independence**: Order of selection doesn't matter (A,B = B,A)
5. **Clear Instructions**: Question text should indicate multiple selection is expected

### Question Type Validation

#### Multi-Selection Validation:**
- Exactly one option must be correct
- `correct_answer` must be single letter
- `question_type` must be "single"

**Multi-Selection Validation:**
- At least 2 options must be correct
- `correct_answer` must be comma-separated (A,B,C)
- `question_type` must be "multiple"
- No spaces in correct_answer field (use A,B not A, B)

## 📋 Multi-Selection Question Guidelines

### When to Use Multi-Selection

**Perfect for multi-selection:**
- Questions about categories or groups (access modifiers, primitive types)
- "Which of the following are..." questions
- Testing knowledge of multiple valid options
- Concepts where several items belong to the same category

**Examples of good multi-selection questions:**
- "Which are valid access modifiers?" (public, private, protected)
- "Which primitive types can store decimal values?" (float, double)
- "Which loop types support continue statements?" (for, while, do-while)

### Multi-Selection Best Practices

1. **Clear Instructions**: Make it obvious that multiple answers are expected
   - Use "Which of the following are..." 
   - Use "Select all that apply"
   - Use "Which statements are true"

2. **Logical Grouping**: All correct answers should belong to the same logical category
   - Bad: Mix unrelated concepts in correct answers
   - Good: All correct answers are the same type (e.g., all keywords, all operators)

3. **Reasonable Number**: Include 2-4 correct answers out of 4-5 total options
   - Minimum: 2 correct answers
   - Maximum: 4 correct answers (leave at least 1 incorrect option)

4. **Plausible Distractors**: Incorrect options should be plausible but clearly wrong
   - Use commonly confused concepts
   - Use items from similar but different categories

### Multi-Selection Answer Format Rules

**Correct CSV format:**
```csv
correct_answer,"A,B,D"
question_type,multiple
```

**Common mistakes to avoid:**
```csv
# Wrong - spaces after commas
correct_answer,"A, B, D"

# Wrong - missing quotes when using commas
correct_answer,A,B,D

# Wrong - wrong question type
correct_answer,"A,B,D"
question_type,single
```

### Multi-Selection Question Examples

**Good multi-selection question:**
```
Which of the following are valid Java primitive types?
A) int
B) String  
C) boolean
D) char
E) Object

Correct: A,C,D (int, boolean, char are primitives)
```

**Bad multi-selection question (should be single-choice):**
```
What is the default value of an int variable?
A) 0
B) 1  
C) null
D) undefined

# This has only one correct answer, should be single-choice
```

### User Interface Behavior

The system automatically handles the UI based on question type:

**Single-choice questions:**
- Display radio buttons (○)
- Allow selection of exactly one option
- Show "Single Choice" badge

**Multi-selection questions:**
- Display checkboxes (☐)
- Allow selection of multiple options up to max_selections
- Show "Multiple Choice" badge and selection count
- Disable additional selections when limit reached

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

### Multiple Concept Questions

The system supports both single-choice and multi-selection questions for testing multiple concepts:

#### Single-Choice Multiple Concepts
- Test understanding of multiple related concepts combined in single options
- Use when concepts are bundled together in answer choices
- Use phrases like "Which option contains X valid statements?"

**Template:**
```
Which option contains two valid Java identifiers?
A) _name and 2name
B) $value and class  
C) name2 and _value
D) interface and 123name
```

#### Multi-Selection Multiple Concepts
- Test understanding of multiple concepts that can be independently correct
- Use when individual concepts should be evaluated separately
- Use phrases like "Which of the following are valid..." or "Select all that apply"

**Template:**
```
Which of the following are valid Java identifiers?
A) _name
B) 2name
C) name2
D) $value
E) class
```
*Correct answer: A,C,D (question_type: "multiple")*

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
- **Code must include complete structure**: Always include class declaration and main method
- No partial code snippets without proper Java boilerplate structure

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

**Correct escaping for commas in single-choice:**
```csv
"Which method returns a Collection<V>?","values()","keySet()","entrySet()","get(), put()","clear()","A","values() returns a Collection<V> containing all values","single"
```

**Correct escaping for commas in multi-selection:**
```csv
"Which methods return collections?","values()","keySet()","entrySet()","get()","put()","A,B,C","values(), keySet(), and entrySet() all return collections","multiple"
```

**Correct escaping for quotes in explanations:**
```csv
"Method put() replaces existing values. When we call put(""A"", 1) then put(""A"", 2), the second call overwrites the first.","single"
```

**Correct line breaks in code questions:**
```csv
"What is the output?\nMap<String, Integer> map = new HashMap<>();\nmap.put(""key"", 42);\nSystem.out.println(map.get(""key""));","42","null","0","Exception","Compilation error","A","The map stores and retrieves the integer value 42","single"
```

**Multi-selection correct answer format:**
```csv
"Which are primitive types?","int","String","boolean","char","Object","A,C,D","int, boolean, and char are primitive types","multiple"
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
- [ ] All required fields are filled (including `question_type`)
- [ ] Domain and topic are from approved lists and properly matched
- [ ] Question text is clear and unambiguous
- [ ] All options are well-formed and plausible
- [ ] Correct answer corresponds to an existing option
- [ ] Explanation is accurate, helpful, and educational
- [ ] Question type is appropriate for the content (single vs multiple)

### Question Type Validation
- [ ] **Single-choice**: Exactly one correct answer (A, B, C, D, or E)
- [ ] **Multi-selection**: At least 2 correct answers, comma-separated format
- [ ] **Multi-selection**: No spaces in correct_answer field (A,B,D not A, B, D)
- [ ] **Multi-selection**: Question text indicates multiple selection expected
- [ ] **Multi-selection**: All correct answers belong to the same logical category

### Technical Validation  
- [ ] Code examples compile (unless testing compilation errors)
- [ ] **Code includes complete structure** (class declaration, main method, etc.)
- [ ] No partial code snippets without proper Java boilerplate
- [ ] CSV formatting is correct (proper escaping, question_type field included)
- [ ] Question tests relevant 1Z0-808 exam objectives
- [ ] Answer format matches question type

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
}",10 5,5 10,10 10,5 5,Compilation error,E,"You cannot declare a variable with the same name in a nested scope. This causes a compilation error because 'x' is already defined in the enclosing scope.",single
```

### Template 2: Conceptual
```csv
Working with Inheritance,Polymorphism,"Which statement about method overriding in Java is correct?",Overridden methods must have the same return type,Overridden methods can have a more restrictive access modifier,The @Override annotation is mandatory for overriding,Overridden methods can return a subtype of the original return type,Static methods can be overridden,D,"In Java, overridden methods can have covariant return types - they can return a subtype of the return type declared in the parent class method.",single
```

### Template 3: Multi-Selection Question
```csv
Working With Java Data Types,Primitive Data Types,"Which of the following are primitive data types in Java?",int,String,boolean,char,Object,"A,C,D","int, boolean, and char are primitive data types. String and Object are reference types.",multiple
```

### Template 4: Single-Choice Compilation Error
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
```",Prints 10,Prints 5,Prints 10 then 5,Runtime exception,Compilation error,E,"You cannot declare a variable with the same name in a nested scope when the outer scope already has a variable with that name. This causes a compilation error because variable 'x' is already defined in the enclosing scope.",single
```

## 🆕 Multi-Selection Feature Update (July 2025)

### What's New
The Java Test Application now supports **multi-selection questions** in addition to single-choice questions. This major update allows for more comprehensive testing of categorical knowledge and better alignment with real exam scenarios.

### Key Changes
- **New question type**: `question_type` field now supports "single" and "multiple"
- **Enhanced CSV template**: Added `question_type` as a required field
- **Multi-selection UI**: Checkboxes for multiple choice, radio buttons for single choice
- **Advanced validation**: Supports comma-separated correct answers (e.g., "A,B,D")
- **Smart scoring**: All correct answers must be selected for full credit

### Backward Compatibility
- **Existing questions remain unchanged**: All current questions work exactly as before
- **Default behavior**: Questions without `question_type` default to "single"
- **Legacy CSV support**: Old CSV format still works with automatic single-choice assignment
- **No breaking changes**: All existing functionality preserved

### Migration Guide for Question Authors

**For new questions:**
1. Always include `question_type` field in your CSV
2. Use "single" for one correct answer, "multiple" for several correct answers
3. Format multi-selection answers as comma-separated without spaces: "A,B,D"

**For existing CSV files:**
1. Add `question_type` column to your CSV header
2. Add "single" for existing questions (or leave blank for auto-assignment)
3. Consider converting appropriate questions to multi-selection format

**Example conversion:**
```csv
# Old format (still works)
domain,topic,question_text,option_a,option_b,option_c,option_d,correct_answer,explanation

# New format (recommended)
domain,topic,question_text,option_a,option_b,option_c,option_d,correct_answer,explanation,question_type
```

### Impact on Question Writing
- **More question types possible**: Can now test categorical knowledge effectively
- **Better exam alignment**: Matches real certification exam question variety
- **Enhanced learning**: Students experience both question formats
- **Improved coverage**: Can test "select all that apply" scenarios

---

*Document updated July 1, 2025 - Multi-selection support implemented and tested**
