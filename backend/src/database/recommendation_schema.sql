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
('Exception Handling', '/docs/tutorial/26-exception-handling.md'),
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
('Array Reference Aliasing', 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/arrays.html'),
('Assignment in if condition', 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/if.html'),
('Autoboxing and NullPointerException', 'https://docs.oracle.com/javase/tutorial/java/data/autoboxing.html'),
('Basics', 'https://docs.oracle.com/javase/tutorial/java/index.html'),
('Class Components', 'https://docs.oracle.com/javase/tutorial/java/javaOO/classdecl.html'),
('Comments', 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/index.html'),
('Comparison Operators', 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/op2.html'),
('Compound Assignment', 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/op1.html'),
('Constructors and super', 'https://docs.oracle.com/javase/tutorial/java/IandI/super.html'),
('Control Flow', 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/flow.html'),
('Covariant Return Types', 'https://docs.oracle.com/javase/tutorial/java/IandI/override.html'),
('Features of Java', 'https://docs.oracle.com/javase/tutorial/getStarted/intro/definition.html'),
('Final Class', 'https://docs.oracle.com/javase/tutorial/java/IandI/final.html'),
('Imports', 'https://docs.oracle.com/javase/tutorial/java/package/usepkgs.html'),
('Infinite Loop', 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/while.html'),
('Infinite loop with break', 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/branch.html'),
('Inheritance and Access Modifiers', 'https://docs.oracle.com/javase/tutorial/java/IandI/subclasses.html'),
('Java Compilation', 'https://docs.oracle.com/javase/tutorial/getStarted/application/index.html'),
('Loop Comparison', 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/for.html'),
('Loop Constructs and Variable Scope', 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/variables.html'),
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
