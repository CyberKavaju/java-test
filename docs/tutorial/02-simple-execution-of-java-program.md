# Simple execution of the java program without an IDE

To compile Java code, save your file with the class name and the extension `.java`. The file name must match the public class name. Navigate to the folder where you saved the file and compile it with:

```bash
javac ClassName.java
```

If compilation is successful, it will create a file named `ClassName.class` in the same directory. You can then execute the program with:

```bash
java ClassName
```

**Note:** Do not add the `.class` extension when running the program—use only the class name.

**Since Java 11:** You can run a simple, single-file Java program directly without compiling first:

```bash
java ClassName.java
```

This will compile and run the program in one step (as long as all code is in a single file).

For more details, see the [official Java tutorial](https://dev.java/learn/getting-started/) and [single-file program guide](https://dev.java/learn/single-file-program/).
