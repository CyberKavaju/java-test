# 50. File I/O

**Related:** [49. Packages](49-packages.md) | [26. Exception Handling](26-exception-handling.md)

---

## 🧠 What is File I/O?

File I/O (Input/Output) in Java allows programs to read from and write to files on the file system. Java provides comprehensive classes in the `java.io` package for file operations.

**Real-world analogy:** Think of file I/O like reading a book (input) or writing in a diary (output). Java provides different "tools" for different types of reading and writing operations.

## 🧱 Core File I/O Classes

### Main Categories
| Category | Purpose | Example Classes |
|----------|---------|-----------------|
| **File Management** | File/directory operations | File, Path |
| **Byte Streams** | Binary data (images, executables) | FileInputStream, FileOutputStream |
| **Character Streams** | Text data | FileReader, FileWriter |
| **Buffered Streams** | Efficient I/O with buffering | BufferedReader, BufferedWriter |

## ✅ The File Class

### Basic File Operations
```java
import java.io.File;
import java.io.IOException;

public class FileBasics {
    public static void main(String[] args) {
        // Create File object
        File file = new File("example.txt");
        
        // Check file properties
        System.out.println("Exists: " + file.exists());
        System.out.println("Is file: " + file.isFile());
        System.out.println("Is directory: " + file.isDirectory());
        System.out.println("Can read: " + file.canRead());
        System.out.println("Can write: " + file.canWrite());
        
        // Get file information
        System.out.println("Name: " + file.getName());
        System.out.println("Path: " + file.getPath());
        System.out.println("Absolute path: " + file.getAbsolutePath());
        System.out.println("Size: " + file.length() + " bytes");
        
        // Create new file
        try {
            if (file.createNewFile()) {
                System.out.println("File created: " + file.getName());
            } else {
                System.out.println("File already exists");
            }
        } catch (IOException e) {
            System.out.println("Error creating file: " + e.getMessage());
        }
        
        // Delete file
        if (file.delete()) {
            System.out.println("File deleted");
        }
    }
}
```

### Directory Operations
```java
import java.io.File;

public class DirectoryOperations {
    public static void main(String[] args) {
        File dir = new File("myDirectory");
        
        // Create directory
        if (dir.mkdir()) {
            System.out.println("Directory created");
        }
        
        // Create directories (including parent directories)
        File nestedDir = new File("parent/child/grandchild");
        if (nestedDir.mkdirs()) {
            System.out.println("Nested directories created");
        }
        
        // List directory contents
        File currentDir = new File(".");
        String[] contents = currentDir.list();
        if (contents != null) {
            System.out.println("Directory contents:");
            for (String item : contents) {
                System.out.println("  " + item);
            }
        }
        
        // List with File objects
        File[] files = currentDir.listFiles();
        if (files != null) {
            for (File f : files) {
                System.out.println(f.getName() + 
                    (f.isDirectory() ? " (directory)" : " (file)"));
            }
        }
    }
}
```

## ✅ Writing to Files

### Using FileWriter
```java
import java.io.FileWriter;
import java.io.IOException;

public class WriteWithFileWriter {
    public static void main(String[] args) {
        try (FileWriter writer = new FileWriter("output.txt")) {
            writer.write("Hello, World!\n");
            writer.write("This is line 2\n");
            writer.write("Java File I/O is powerful!");
            
            System.out.println("Successfully wrote to file");
        } catch (IOException e) {
            System.out.println("Error writing to file: " + e.getMessage());
        }
    }
}
```

### Using BufferedWriter (More Efficient)
```java
import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;

public class WriteWithBufferedWriter {
    public static void main(String[] args) {
        try (BufferedWriter writer = new BufferedWriter(new FileWriter("buffered_output.txt"))) {
            writer.write("Line 1");
            writer.newLine();  // Platform-independent line separator
            writer.write("Line 2");
            writer.newLine();
            writer.write("Line 3");
            
            // Buffer is automatically flushed when closed
            System.out.println("File written successfully");
        } catch (IOException e) {
            System.out.println("Error: " + e.getMessage());
        }
    }
}
```

### Appending to Files
```java
import java.io.FileWriter;
import java.io.IOException;

public class AppendToFile {
    public static void main(String[] args) {
        try (FileWriter writer = new FileWriter("log.txt", true)) {  // true = append mode
            writer.write("New log entry: " + new java.util.Date() + "\n");
            System.out.println("Log entry added");
        } catch (IOException e) {
            System.out.println("Error: " + e.getMessage());
        }
    }
}
```

## ✅ Reading from Files

### Using FileReader
```java
import java.io.FileReader;
import java.io.IOException;

public class ReadWithFileReader {
    public static void main(String[] args) {
        try (FileReader reader = new FileReader("input.txt")) {
            int character;
            while ((character = reader.read()) != -1) {
                System.out.print((char) character);
            }
        } catch (IOException e) {
            System.out.println("Error reading file: " + e.getMessage());
        }
    }
}
```

### Using BufferedReader (More Efficient)
```java
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;

public class ReadWithBufferedReader {
    public static void main(String[] args) {
        try (BufferedReader reader = new BufferedReader(new FileReader("input.txt"))) {
            String line;
            int lineNumber = 1;
            
            while ((line = reader.readLine()) != null) {
                System.out.println(lineNumber + ": " + line);
                lineNumber++;
            }
        } catch (IOException e) {
            System.out.println("Error reading file: " + e.getMessage());
        }
    }
}
```

### Reading Entire File
```java
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class ReadEntireFile {
    public static void main(String[] args) {
        List<String> lines = readFileLines("data.txt");
        for (String line : lines) {
            System.out.println(line);
        }
    }
    
    public static List<String> readFileLines(String filename) {
        List<String> lines = new ArrayList<>();
        try (BufferedReader reader = new BufferedReader(new FileReader(filename))) {
            String line;
            while ((line = reader.readLine()) != null) {
                lines.add(line);
            }
        } catch (IOException e) {
            System.out.println("Error reading file: " + e.getMessage());
        }
        return lines;
    }
}
```

## 🧪 Binary File Operations

### Writing Binary Data
```java
import java.io.FileOutputStream;
import java.io.IOException;

public class WriteBinaryFile {
    public static void main(String[] args) {
        byte[] data = {65, 66, 67, 68, 69};  // ASCII values for ABCDE
        
        try (FileOutputStream fos = new FileOutputStream("binary.dat")) {
            fos.write(data);
            System.out.println("Binary data written");
        } catch (IOException e) {
            System.out.println("Error: " + e.getMessage());
        }
    }
}
```

### Reading Binary Data
```java
import java.io.FileInputStream;
import java.io.IOException;

public class ReadBinaryFile {
    public static void main(String[] args) {
        try (FileInputStream fis = new FileInputStream("binary.dat")) {
            int data;
            while ((data = fis.read()) != -1) {
                System.out.println("Byte value: " + data + " (char: " + (char)data + ")");
            }
        } catch (IOException e) {
            System.out.println("Error: " + e.getMessage());
        }
    }
}
```

## 🔧 Practical Examples

### CSV File Processing
```java
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;

public class CSVProcessor {
    public static void main(String[] args) {
        processCSV("input.csv", "output.csv");
    }
    
    public static void processCSV(String inputFile, String outputFile) {
        try (BufferedReader reader = new BufferedReader(new FileReader(inputFile));
             BufferedWriter writer = new BufferedWriter(new FileWriter(outputFile))) {
            
            String line;
            while ((line = reader.readLine()) != null) {
                String[] fields = line.split(",");
                
                // Process each field (e.g., convert to uppercase)
                for (int i = 0; i < fields.length; i++) {
                    fields[i] = fields[i].trim().toUpperCase();
                }
                
                // Write processed line
                writer.write(String.join(",", fields));
                writer.newLine();
            }
            
            System.out.println("CSV processing complete");
        } catch (IOException e) {
            System.out.println("Error processing CSV: " + e.getMessage());
        }
    }
}
```

### File Copy Utility
```java
import java.io.*;

public class FileCopyUtility {
    public static void main(String[] args) {
        copyFile("source.txt", "destination.txt");
    }
    
    public static void copyFile(String source, String destination) {
        try (BufferedInputStream bis = new BufferedInputStream(new FileInputStream(source));
             BufferedOutputStream bos = new BufferedOutputStream(new FileOutputStream(destination))) {
            
            byte[] buffer = new byte[8192];  // 8KB buffer
            int bytesRead;
            
            while ((bytesRead = bis.read(buffer)) != -1) {
                bos.write(buffer, 0, bytesRead);
            }
            
            System.out.println("File copied successfully");
        } catch (IOException e) {
            System.out.println("Error copying file: " + e.getMessage());
        }
    }
}
```

## ⚠️ OCA Pitfalls

### 1. Always Close Resources
```java
// WRONG - resource leak
FileWriter writer = new FileWriter("file.txt");
writer.write("data");
// If exception occurs, file is never closed!

// CORRECT - use try-with-resources
try (FileWriter writer = new FileWriter("file.txt")) {
    writer.write("data");
} // Automatically closed
```

### 2. Handle FileNotFoundException
```java
try (FileReader reader = new FileReader("nonexistent.txt")) {
    // This will throw FileNotFoundException
} catch (IOException e) {  // FileNotFoundException is subclass of IOException
    System.out.println("File not found: " + e.getMessage());
}
```

### 3. Check File Existence Before Operations
```java
File file = new File("data.txt");
if (file.exists() && file.canRead()) {
    try (BufferedReader reader = new BufferedReader(new FileReader(file))) {
        // Safe to read
    } catch (IOException e) {
        System.out.println("Error: " + e.getMessage());
    }
} else {
    System.out.println("File doesn't exist or cannot be read");
}
```

### 4. Platform-Independent Path Separators
```java
// WRONG - Windows only
File file = new File("folder\\file.txt");

// CORRECT - platform independent
File file = new File("folder" + File.separator + "file.txt");
// OR
File file = new File("folder", "file.txt");  // Constructor handles separator
```

## 🧪 Quick Quiz

**Question 1:** What's the output of this code?
```java
File file = new File("test.txt");
System.out.println(file.exists());
file.createNewFile();
System.out.println(file.exists());
```

<details>
<summary>Click for answer</summary>

**Answer:** 
```
false
true
```

Initially, the file doesn't exist so `exists()` returns false. After `createNewFile()`, the file is created, so `exists()` returns true.

</details>

**Question 2:** Which is more efficient for reading large text files?
- A) FileReader
- B) BufferedReader
- C) FileInputStream
- D) Scanner

<details>
<summary>Click for answer</summary>

**Answer:** B) BufferedReader

BufferedReader reads chunks of data into memory, reducing the number of system calls and improving performance for large files.

</details>

## 🎯 OCA Exam Tips

1. **Always use try-with-resources** for automatic resource management
2. **FileNotFoundException** is a subclass of IOException
3. **File.separator** for platform-independent paths
4. **BufferedReader/Writer** are more efficient than FileReader/Writer
5. **File.exists()** checks existence, not readability
6. **createNewFile()** returns false if file already exists

## 📚 Best Practices

1. **Use try-with-resources**: Automatic resource management
2. **Use buffered streams**: Better performance for large files
3. **Check file existence**: Before operations to avoid exceptions
4. **Handle exceptions properly**: FileNotFoundException, IOException
5. **Use appropriate stream type**: Character streams for text, byte streams for binary
6. **Close resources**: Always ensure proper cleanup

## Related Topics

- [26. Exception Handling](26-exception-handling.md) - Handling I/O exceptions
- [49. Packages](49-packages.md) - Understanding java.io package
- [18. String Class](18-string-class.md) - String operations for file content
- [22. List Object](22-list-object.md) - Storing file data in collections

---

*This tutorial covers File I/O in Java, essential for reading from and writing to files in real-world applications.*
