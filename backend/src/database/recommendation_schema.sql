-- Java Topics Recommendations Table Schema

-- Recommendations table to store Java documentation links
CREATE TABLE IF NOT EXISTS recommendations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    topic TEXT NOT NULL UNIQUE,
    documentation_url TEXT NOT NULL,
    description TEXT,
    category TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_recommendations_topic ON recommendations(topic);

-- Insert all the Java documentation links
INSERT OR IGNORE INTO recommendations (topic, documentation_url) VALUES
('Arrays', 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/arrays.html'),
('Loops', 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/for.html'),
('Conditionals', 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/if.html'),
('Methods', 'https://docs.oracle.com/javase/tutorial/java/javaOO/methods.html'),
('Classes', 'https://docs.oracle.com/javase/tutorial/java/javaOO/classes.html'),
('Objects', 'https://docs.oracle.com/javase/tutorial/java/javaOO/objects.html'),
('Inheritance', 'https://docs.oracle.com/javase/tutorial/java/IandI/subclasses.html'),
('Polymorphism', 'https://docs.oracle.com/javase/tutorial/java/IandI/polymorphism.html'),
('Encapsulation', 'https://docs.oracle.com/javase/tutorial/java/javaOO/accesscontrol.html'),
('Abstraction', 'https://docs.oracle.com/javase/tutorial/java/IandI/abstract.html'),
('Interfaces', 'https://docs.oracle.com/javase/tutorial/java/IandI/createinterface.html'),
('Exception Handling', 'https://docs.oracle.com/javase/tutorial/essential/exceptions/'),
('Collections', 'https://docs.oracle.com/javase/tutorial/collections/'),
('Generics', 'https://docs.oracle.com/javase/tutorial/java/generics/'),
('Streams', 'https://docs.oracle.com/javase/8/docs/api/java/util/stream/package-summary.html'),
('Lambda Expressions', 'https://docs.oracle.com/javase/tutorial/java/javaOO/lambdaexpressions.html'),
('Threads', 'https://docs.oracle.com/javase/tutorial/essential/concurrency/'),
('File I/O', 'https://docs.oracle.com/javase/tutorial/essential/io/'),
('String Manipulation', 'https://docs.oracle.com/javase/tutorial/java/data/strings.html'),
('Data Types', 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/datatypes.html'),
('Variables', 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/variables.html'),
('Operators', 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/operators.html'),
('Booleans', 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/datatypes.html'),
('Static', 'https://docs.oracle.com/javase/tutorial/java/javaOO/classvars.html'),
('Final', 'https://docs.oracle.com/javase/tutorial/java/IandI/final.html'),
('Packages', 'https://docs.oracle.com/javase/tutorial/java/package/'),
('Access Modifiers', 'https://docs.oracle.com/javase/tutorial/java/javaOO/accesscontrol.html'),
('Autoboxing', 'https://docs.oracle.com/javase/tutorial/java/data/autoboxing.html'),
('Autoboxing/Unboxing', 'https://docs.oracle.com/javase/tutorial/java/data/autoboxing.html'),
('Abstract Classes and Interfaces', 'https://docs.oracle.com/javase/tutorial/java/IandI/index.html'),
('ArrayList', 'https://docs.oracle.com/javase/8/docs/api/java/util/ArrayList.html'),
('StringBuilder', 'https://docs.oracle.com/javase/8/docs/api/java/lang/StringBuilder.html'),
('String', 'https://docs.oracle.com/javase/8/docs/api/java/lang/String.html'),
('Date and Time API', 'https://docs.oracle.com/javase/tutorial/datetime/index.html'),
('Lambda', 'https://docs.oracle.com/javase/tutorial/java/javaOO/lambdaexpressions.html'),
('Switch', 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/switch.html'),
('Varargs', 'https://docs.oracle.com/javase/tutorial/java/javaOO/arguments.html#varargs'),
('HashMap', 'https://docs.oracle.com/javase/8/docs/api/java/util/HashMap.html'),
('Exception Hierarchy', 'https://docs.oracle.com/javase/tutorial/essential/exceptions/hierarchy.html'),
('Method Overloading', 'https://docs.oracle.com/javase/tutorial/java/javaOO/methods.html'),
('Method Overriding', 'https://docs.oracle.com/javase/tutorial/java/IandI/override.html'),
('Constructors', 'https://docs.oracle.com/javase/tutorial/java/javaOO/constructors.html'),
('Abstract Class', 'https://docs.oracle.com/javase/tutorial/java/IandI/abstract.html'),
('Access Control', 'https://docs.oracle.com/javase/tutorial/java/javaOO/accesscontrol.html'),
('Array of Objects', 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/arrays.html'),
('Array of Primitives Default Values', 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/arrays.html'),
('ArrayList Capacity', 'https://docs.oracle.com/javase/8/docs/api/java/util/ArrayList.html'),
('ArrayList basic', 'https://docs.oracle.com/javase/8/docs/api/java/util/ArrayList.html'),
('ArrayList contains', 'https://docs.oracle.com/javase/8/docs/api/java/util/ArrayList.html'),
('ArrayList remove', 'https://docs.oracle.com/javase/8/docs/api/java/util/ArrayList.html'),
('Arrays and Exception Handling', 'https://docs.oracle.com/javase/tutorial/essential/exceptions/'),
('Bitwise Operators', 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/operators.html'),
('Bitwise vs Logical Operators', 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/operators.html'),
('Break Statement', 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/branch.html'),
('Casting Primitives', 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/datatypes.html'),
('Catch Order', 'https://docs.oracle.com/javase/tutorial/essential/exceptions/handling.html'),
('Catching Multiple Exceptions', 'https://docs.oracle.com/javase/tutorial/essential/exceptions/handling.html'),
('Checked vs Unchecked', 'https://docs.oracle.com/javase/tutorial/essential/exceptions/runtime.html'),
('Class Definition', 'https://docs.oracle.com/javase/tutorial/java/javaOO/classes.html'),
('Class Structure', 'https://docs.oracle.com/javase/tutorial/java/javaOO/classdecl.html'),
('Constructor Chaining', 'https://docs.oracle.com/javase/tutorial/java/javaOO/constructors.html'),
('Custom Exceptions', 'https://docs.oracle.com/javase/tutorial/essential/exceptions/creating.html'),
('DateTimeFormatter', 'https://docs.oracle.com/javase/8/docs/api/java/time/format/DateTimeFormatter.html'),
('Default Constructors', 'https://docs.oracle.com/javase/tutorial/java/javaOO/constructors.html'),
('Enhanced For Loop', 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/for.html'),
('Exceptions', 'https://docs.oracle.com/javase/tutorial/essential/exceptions/'),
('Finally Always Executes', 'https://docs.oracle.com/javase/tutorial/essential/exceptions/finally.html'),
('Float precision', 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/datatypes.html'),
('For Loop', 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/for.html'),
('HashMap', 'https://docs.oracle.com/javase/8/docs/api/java/util/HashMap.html'),
('HashMap put', 'https://docs.oracle.com/javase/8/docs/api/java/util/HashMap.html'),
('Identifiers', 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/variables.html'),
('Import Statements', 'https://docs.oracle.com/javase/tutorial/java/package/usepkgs.html'),
('Increment/Decrement', 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/op1.html'),
('Instanceof Operator', 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/op2.html'),
('Interface Evolution (Java 8)', 'https://docs.oracle.com/javase/tutorial/java/IandI/defaultmethods.html'),
('Java 8 Enhancements', 'https://docs.oracle.com/javase/8/docs/technotes/guides/language/enhancements.html'),
('Labeled Loops', 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/branch.html'),
('Lambda Predicate', 'https://docs.oracle.com/javase/8/docs/api/java/util/function/Predicate.html'),
('Lambda Syntax', 'https://docs.oracle.com/javase/tutorial/java/javaOO/lambdaexpressions.html'),
('LocalDate plusDays', 'https://docs.oracle.com/javase/8/docs/api/java/time/LocalDate.html'),
('Loop Control', 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/branch.html'),
('Main Method Arguments', 'https://docs.oracle.com/javase/tutorial/getStarted/application/index.html'),
('Method Arguments', 'https://docs.oracle.com/javase/tutorial/java/javaOO/arguments.html'),
('Multi-dimensional arrays', 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/arrays.html'),
('Narrowing Conversion', 'https://docs.oracle.com/javase/specs/jls/se8/html/jls-5.html'),
('Nested if/else', 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/if.html'),
('Numeric Literals', 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/datatypes.html'),
('Operator Precedence', 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/operators.html'),
('Pass by Value (object reference)', 'https://docs.oracle.com/javase/tutorial/java/javaOO/arguments.html'),
('Pass by Value (primitive)', 'https://docs.oracle.com/javase/tutorial/java/javaOO/arguments.html'),
('Period and Duration', 'https://docs.oracle.com/javase/tutorial/datetime/iso/period.html'),
('Primitive Casting', 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/datatypes.html'),
('Primitive Type Sizes', 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/datatypes.html'),
('Private Constructor', 'https://docs.oracle.com/javase/tutorial/java/javaOO/constructors.html'),
('Static Fields and Methods', 'https://docs.oracle.com/javase/tutorial/java/javaOO/classvars.html'),
('Static Method Call', 'https://docs.oracle.com/javase/tutorial/java/javaOO/classvars.html'),
('String equals', 'https://docs.oracle.com/javase/8/docs/api/java/lang/String.html#equals-java.lang.Object-'),
('String immutability', 'https://docs.oracle.com/javase/tutorial/java/data/strings.html'),
('StringBuilder Capacity', 'https://docs.oracle.com/javase/8/docs/api/java/lang/StringBuilder.html'),
('StringBuilder append', 'https://docs.oracle.com/javase/8/docs/api/java/lang/StringBuilder.html'),
('StringBuilder reverse', 'https://docs.oracle.com/javase/8/docs/api/java/lang/StringBuilder.html'),
('StringBuilder vs String', 'https://docs.oracle.com/javase/tutorial/java/data/buffers.html'),
('Strings', 'https://docs.oracle.com/javase/tutorial/java/data/strings.html'),
('Switch Statement Fall-Through', 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/switch.html'),
('Switch with Strings', 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/switch.html'),
('Ternary Operator', 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/op2.html'),
('Wrapper Caching', 'https://docs.oracle.com/javase/8/docs/api/java/lang/Integer.html#valueOf-int-'),
('char Arithmetic', 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/datatypes.html'),
('do-while Loop', 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/while.html'),
('Accessing Members', 'https://docs.oracle.com/javase/tutorial/java/javaOO/accesscontrol.html'),
('Array Reference Aliasing', 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/arrays.html'),
('Assignment in if condition', 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/if.html'),
('Autoboxing and NullPointerException', 'https://docs.oracle.com/javase/tutorial/java/data/autoboxing.html'),
('Basics', 'https://docs.oracle.com/javase/tutorial/java/index.html'),
('Catching RuntimeException', 'https://docs.oracle.com/javase/tutorial/essential/exceptions/handling.html'),
('Class Components', 'https://docs.oracle.com/javase/tutorial/java/javaOO/classdecl.html'),
('Comments', 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/index.html'),
('Comparison Operators', 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/op2.html'),
('Compound Assignment', 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/op1.html'),
('Constructors and super', 'https://docs.oracle.com/javase/tutorial/java/IandI/super.html'),
('Control Flow', 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/flow.html'),
('Covariant Return Types', 'https://docs.oracle.com/javase/tutorial/java/IandI/override.html'),
('Exception Handling Advantages', 'https://docs.oracle.com/javase/tutorial/essential/exceptions/advantages.html'),
('Features of Java', 'https://docs.oracle.com/javase/tutorial/getStarted/intro/definition.html'),
('Final Class', 'https://docs.oracle.com/javase/tutorial/java/IandI/final.html'),
('Finally Overrides Return', 'https://docs.oracle.com/javase/tutorial/essential/exceptions/finally.html'),
('Handling Exceptions', 'https://docs.oracle.com/javase/tutorial/essential/exceptions/handling.html'),
('Imports', 'https://docs.oracle.com/javase/tutorial/java/package/usepkgs.html'),
('Infinite Loop', 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/while.html'),
('Infinite loop with break', 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/branch.html'),
('Inheritance and Access Modifiers', 'https://docs.oracle.com/javase/tutorial/java/IandI/subclasses.html'),
('Java Compilation', 'https://docs.oracle.com/javase/tutorial/getStarted/application/index.html'),
('Loop Comparison', 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/for.html'),
('Loop Constructs and Variable Scope', 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/variables.html'),
('Method Signature and Throws', 'https://docs.oracle.com/javase/tutorial/java/javaOO/methods.html'),
('Method Throwing Exception', 'https://docs.oracle.com/javase/tutorial/essential/exceptions/declaring.html'),
('Object Lifecycle', 'https://docs.oracle.com/javase/tutorial/java/javaOO/objectcreation.html'),
('Object References', 'https://docs.oracle.com/javase/tutorial/java/javaOO/objects.html'),
('Overflow', 'https://docs.oracle.com/javase/specs/jls/se8/html/jls-4.html#jls-4.2.3'),
('Package Declaration', 'https://docs.oracle.com/javase/tutorial/java/package/createpkgs.html'),
('Pass-by-Value', 'https://docs.oracle.com/javase/tutorial/java/javaOO/arguments.html'),
('Pitfalls', 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/QandE/answers.html'),
('Platform Independence', 'https://docs.oracle.com/javase/tutorial/getStarted/intro/definition.html'),
('Polymorphism (Method Overriding)', 'https://docs.oracle.com/javase/tutorial/java/IandI/polymorphism.html'),
('Primitive Casting and Overflow', 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/datatypes.html'),
('Primitives', 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/datatypes.html'),
('Private Method Hiding', 'https://docs.oracle.com/javase/tutorial/java/IandI/override.html'),
('References', 'https://docs.oracle.com/javase/tutorial/java/javaOO/objects.html'),
('Static Keyword', 'https://docs.oracle.com/javase/tutorial/java/javaOO/classvars.html'),
('Static Method Hiding', 'https://docs.oracle.com/javase/tutorial/java/IandI/override.html'),
('Superclass Constructor Call', 'https://docs.oracle.com/javase/tutorial/java/IandI/super.html'),
('Switch Fall-Through with Loops', 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/switch.html'),
('Ternary', 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/op2.html'),
('Ternary Operator Nesting', 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/op2.html'),
('Ternary Operator Type', 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/op2.html'),
('Testing', 'https://docs.oracle.com/javase/tutorial/java/javaOO/QandE/creating-questions.html'),
('Unary Operators', 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/operators.html'),
('Variable Initialization', 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/variables.html'),
('Variable Scope', 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/variables.html'),
('Working With Java Data Types', 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/datatypes.html'),
('Working with Methods and Encapsulation', 'https://docs.oracle.com/javase/tutorial/java/javaOO/methods.html'),
('Working with Selected classes from the Java API', 'https://docs.oracle.com/javase/tutorial/essential/io/index.html');
