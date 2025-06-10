-- Insert SQL script for recommendations

-- First, make sure we have the recommendations table
CREATE TABLE IF NOT EXISTS recommendations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    topic TEXT NOT NULL UNIQUE,
    documentation_url TEXT NOT NULL,
    description TEXT,
    category TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Clear existing data (optional, uncomment if needed)
-- DELETE FROM recommendations;

-- Insert basic Java topics
INSERT OR REPLACE INTO recommendations (topic, documentation_url) VALUES
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
('Streams', 'https://docs.oracle.com/javase/8/docs/api/java/util/stream/package-summary.html');

-- Insert more advanced topics
INSERT OR REPLACE INTO recommendations (topic, documentation_url) VALUES
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
('Access Modifiers', 'https://docs.oracle.com/javase/tutorial/java/javaOO/accesscontrol.html');

-- Insert missing topics requested by the user
INSERT OR REPLACE INTO recommendations (topic, documentation_url) VALUES
('Autoboxing', 'https://docs.oracle.com/javase/tutorial/java/data/autoboxing.html'),
('Autoboxing/Unboxing', 'https://docs.oracle.com/javase/tutorial/java/data/autoboxing.html'),
('Abstract Classes and Interfaces', 'https://docs.oracle.com/javase/tutorial/java/IandI/index.html');

-- Insert collection-related topics
INSERT OR REPLACE INTO recommendations (topic, documentation_url) VALUES
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
('Constructors', 'https://docs.oracle.com/javase/tutorial/java/javaOO/constructors.html');

-- Additional topics
INSERT OR REPLACE INTO recommendations (topic, documentation_url) VALUES
('Abstract Class', 'https://docs.oracle.com/javase/tutorial/java/IandI/abstract.html'),
('Access Control', 'https://docs.oracle.com/javase/tutorial/java/javaOO/accesscontrol.html'),
('Array of Objects', 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/arrays.html'),
('Array of Primitives Default Values', 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/arrays.html'),
('ArrayList Capacity', 'https://docs.oracle.com/javase/8/docs/api/java/util/ArrayList.html'),
('ArrayList basic', 'https://docs.oracle.com/javase/8/docs/api/java/util/ArrayList.html'),
('ArrayList contains', 'https://docs.oracle.com/javase/8/docs/api/java/util/ArrayList.html'),
('ArrayList remove', 'https://docs.oracle.com/javase/8/docs/api/java/util/ArrayList.html');

-- Add more topic batches as needed...
