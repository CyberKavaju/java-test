# Main characteristics of JAVA


Java is a powerful, versatile, and widely-used programming language with several characteristics that set it apart from other languages:

- **Write Once, Run Anywhere (WORA):** Java code is compiled into platform-independent bytecode, which runs on the Java Virtual Machine (JVM). This means you can write your code once and run it on any device or operating system that has a JVM, making Java highly portable.
- **Object-Oriented:** Java is a fully object-oriented language, supporting concepts like classes, objects, inheritance, encapsulation, polymorphism, and abstraction. This promotes modular, reusable, and maintainable code.
- **Strongly Typed and Statically Typed:** Java enforces strict type checking at compile time, reducing runtime errors and making code more robust.
- **Automatic Memory Management:** Java uses an automatic garbage collector to manage memory, freeing up unused objects and helping prevent memory leaks.
- **Rich Standard Library:** Java provides a comprehensive standard library (Java API) that includes utilities for data structures, networking, file I/O, GUI development, concurrency, and more.
- **Multithreading Support:** Java has built-in support for multithreaded programming, allowing developers to write highly concurrent and responsive applications.
- **Security:** Java was designed with security in mind. The JVM provides a secure execution environment, and features like the Java sandbox and bytecode verification help protect against malicious code.
- **Robustness:** Java emphasizes early error checking, runtime checking, and exception handling, making programs more reliable.
- **Platform Independence:** Unlike languages that compile to native machine code, Java compiles to bytecode, which is interpreted or JIT-compiled by the JVM on any platform.
- **Network-Centric:** Java has extensive libraries for networking, making it easy to develop distributed and networked applications.
- **Community and Ecosystem:** Java has a large, active community and a vast ecosystem of libraries, frameworks, and tools for everything from web development to scientific computing.

## What sets Java apart from other programming languages?

- **JVM and Bytecode:** The use of the JVM and bytecode makes Java uniquely portable and secure compared to languages that compile directly to machine code (like C/C++).
- **Backward Compatibility:** Java maintains strong backward compatibility, so code written years ago can often run on the latest JVMs without modification.
- **Enterprise Adoption:** Java is a dominant language in enterprise environments, powering large-scale systems, Android apps, and server-side applications.
- **Verbose but Explicit:** Java's syntax is more verbose than some modern languages, but this explicitness can make code easier to read and maintain in large projects.

## You need to have one main() method in your program

Java will look for the `main()` method to initiate the program. It will not compile if you don't have a main method, and you should have only one main() method in your program. You can call the class whatever you want, but you have to call the file name the same as your class.

file name: `MyClass.java`

```java

public class MyClass{ //same as the file name

	public static void main(String[] args){//my program starts here
		
		System.out.println("Hello World!");
	
	}

}

```
