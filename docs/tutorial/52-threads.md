# 52. Threads

**Related:** [26. Exception Handling](26-exception-handling.md) | [32. Methods](32-methods.md)

---

## 🧠 What are Threads?

Threads in Java allow multiple tasks to run concurrently within a single program. A thread is a lightweight unit of execution that can run independently and simultaneously with other threads.

**Real-world analogy:** Think of threads like multiple workers in a kitchen. Each worker (thread) can perform different tasks simultaneously - one chopping vegetables, another cooking pasta, and another preparing sauce. The main program is like the head chef coordinating all activities.

## 🎯 Why Use Threads?

### Benefits of Multithreading
- **Concurrency**: Multiple tasks can execute simultaneously
- **Performance**: Better resource utilization, especially on multi-core systems
- **Responsiveness**: User interfaces remain responsive during long operations
- **Parallelism**: Divide work among multiple threads for faster completion

### Use Cases
- User interface applications (keeping UI responsive)
- Server applications (handling multiple client requests)
- Background processing (file downloads, data processing)
- Producer-consumer scenarios (data processing pipelines)

## ✅ Creating Threads

### Method 1: Extending Thread Class
```java
public class MyThread extends Thread {
    private String threadName;
    
    public MyThread(String name) {
        this.threadName = name;
    }
    
    @Override
    public void run() {
        for (int i = 1; i <= 5; i++) {
            System.out.println(threadName + ": " + i);
            try {
                Thread.sleep(1000);  // Sleep for 1 second
            } catch (InterruptedException e) {
                System.out.println(threadName + " interrupted");
                return;
            }
        }
        System.out.println(threadName + " finished");
    }
}

public class ThreadExample1 {
    public static void main(String[] args) {
        MyThread thread1 = new MyThread("Worker-1");
        MyThread thread2 = new MyThread("Worker-2");
        
        thread1.start();  // Start thread execution
        thread2.start();
        
        System.out.println("Main thread continues...");
    }
}
```

### Method 2: Implementing Runnable Interface (Preferred)
```java
public class MyRunnable implements Runnable {
    private String taskName;
    
    public MyRunnable(String name) {
        this.taskName = name;
    }
    
    @Override
    public void run() {
        for (int i = 1; i <= 5; i++) {
            System.out.println(taskName + ": " + i + 
                " [Thread: " + Thread.currentThread().getName() + "]");
            try {
                Thread.sleep(800);
            } catch (InterruptedException e) {
                System.out.println(taskName + " interrupted");
                return;
            }
        }
        System.out.println(taskName + " completed");
    }
}

public class ThreadExample2 {
    public static void main(String[] args) {
        MyRunnable task1 = new MyRunnable("Task-A");
        MyRunnable task2 = new MyRunnable("Task-B");
        
        Thread thread1 = new Thread(task1, "Thread-1");
        Thread thread2 = new Thread(task2, "Thread-2");
        
        thread1.start();
        thread2.start();
        
        System.out.println("Main thread: " + Thread.currentThread().getName());
    }
}
```

### Method 3: Anonymous Classes and Lambda Expressions
```java
public class ThreadExample3 {
    public static void main(String[] args) {
        // Anonymous Runnable
        Thread thread1 = new Thread(new Runnable() {
            @Override
            public void run() {
                for (int i = 1; i <= 3; i++) {
                    System.out.println("Anonymous thread: " + i);
                    try { Thread.sleep(500); } catch (InterruptedException e) {}
                }
            }
        });
        
        // Lambda expression (Java 8+)
        Thread thread2 = new Thread(() -> {
            for (int i = 1; i <= 3; i++) {
                System.out.println("Lambda thread: " + i);
                try { Thread.sleep(500); } catch (InterruptedException e) {}
            }
        });
        
        thread1.start();
        thread2.start();
    }
}
```

## ✅ Thread Lifecycle and States

### Thread States
```java
public class ThreadStates {
    public static void main(String[] args) throws InterruptedException {
        Thread worker = new Thread(() -> {
            System.out.println("Worker thread started");
            try {
                Thread.sleep(2000);  // TIMED_WAITING state
            } catch (InterruptedException e) {
                System.out.println("Worker interrupted");
            }
            System.out.println("Worker thread finished");
        });
        
        System.out.println("Initial state: " + worker.getState());  // NEW
        
        worker.start();
        System.out.println("After start: " + worker.getState());    // RUNNABLE
        
        Thread.sleep(100);  // Let worker start
        System.out.println("During sleep: " + worker.getState());   // TIMED_WAITING
        
        worker.join();  // Wait for worker to complete
        System.out.println("After join: " + worker.getState());     // TERMINATED
    }
}
```

### Thread Priority
```java
public class ThreadPriority {
    public static void main(String[] args) {
        Thread highPriority = new Thread(() -> {
            for (int i = 1; i <= 5; i++) {
                System.out.println("High priority: " + i);
                try { Thread.sleep(100); } catch (InterruptedException e) {}
            }
        });
        
        Thread lowPriority = new Thread(() -> {
            for (int i = 1; i <= 5; i++) {
                System.out.println("Low priority: " + i);
                try { Thread.sleep(100); } catch (InterruptedException e) {}
            }
        });
        
        highPriority.setPriority(Thread.MAX_PRIORITY);  // 10
        lowPriority.setPriority(Thread.MIN_PRIORITY);   // 1
        
        System.out.println("Normal priority: " + Thread.NORM_PRIORITY);  // 5
        
        lowPriority.start();
        highPriority.start();
    }
}
```

## 🔄 Thread Synchronization

### Race Condition Problem
```java
public class RaceConditionExample {
    private static int counter = 0;
    
    public static void main(String[] args) throws InterruptedException {
        Runnable incrementTask = () -> {
            for (int i = 0; i < 1000; i++) {
                counter++;  // Not thread-safe!
            }
        };
        
        Thread thread1 = new Thread(incrementTask);
        Thread thread2 = new Thread(incrementTask);
        
        thread1.start();
        thread2.start();
        
        thread1.join();
        thread2.join();
        
        System.out.println("Final counter value: " + counter);
        // Expected: 2000, but often less due to race condition
    }
}
```

### Synchronized Methods
```java
public class SynchronizedCounter {
    private int count = 0;
    
    // Synchronized method - only one thread can execute at a time
    public synchronized void increment() {
        count++;
    }
    
    public synchronized void decrement() {
        count--;
    }
    
    public synchronized int getCount() {
        return count;
    }
}

public class SynchronizedExample {
    public static void main(String[] args) throws InterruptedException {
        SynchronizedCounter counter = new SynchronizedCounter();
        
        Runnable incrementTask = () -> {
            for (int i = 0; i < 1000; i++) {
                counter.increment();
            }
        };
        
        Thread thread1 = new Thread(incrementTask);
        Thread thread2 = new Thread(incrementTask);
        
        thread1.start();
        thread2.start();
        
        thread1.join();
        thread2.join();
        
        System.out.println("Final count: " + counter.getCount());  // Should be 2000
    }
}
```

### Synchronized Blocks
```java
public class SynchronizedBlocks {
    private final Object lock1 = new Object();
    private final Object lock2 = new Object();
    private int value1 = 0;
    private int value2 = 0;
    
    public void updateValue1() {
        synchronized (lock1) {  // Only synchronize what's necessary
            value1++;
            System.out.println("Value1: " + value1);
        }
    }
    
    public void updateValue2() {
        synchronized (lock2) {  // Different lock for better concurrency
            value2++;
            System.out.println("Value2: " + value2);
        }
    }
    
    public void updateBoth() {
        synchronized (lock1) {
            synchronized (lock2) {  // Nested synchronization
                value1++;
                value2++;
                System.out.println("Both updated: " + value1 + ", " + value2);
            }
        }
    }
}
```

## 🔧 Thread Communication

### Wait and Notify
```java
public class ProducerConsumerExample {
    private final Object lock = new Object();
    private int value = 0;
    private boolean hasValue = false;
    
    public void produce(int newValue) throws InterruptedException {
        synchronized (lock) {
            while (hasValue) {  // Wait while there's already a value
                lock.wait();
            }
            
            value = newValue;
            hasValue = true;
            System.out.println("Produced: " + value);
            lock.notify();  // Notify waiting consumer
        }
    }
    
    public int consume() throws InterruptedException {
        synchronized (lock) {
            while (!hasValue) {  // Wait while there's no value
                lock.wait();
            }
            
            int result = value;
            hasValue = false;
            System.out.println("Consumed: " + result);
            lock.notify();  // Notify waiting producer
            return result;
        }
    }
}

public class ProducerConsumerTest {
    public static void main(String[] args) {
        ProducerConsumerExample pc = new ProducerConsumerExample();
        
        // Producer thread
        Thread producer = new Thread(() -> {
            try {
                for (int i = 1; i <= 5; i++) {
                    pc.produce(i);
                    Thread.sleep(1000);
                }
            } catch (InterruptedException e) {
                System.out.println("Producer interrupted");
            }
        });
        
        // Consumer thread
        Thread consumer = new Thread(() -> {
            try {
                for (int i = 1; i <= 5; i++) {
                    pc.consume();
                    Thread.sleep(1500);
                }
            } catch (InterruptedException e) {
                System.out.println("Consumer interrupted");
            }
        });
        
        producer.start();
        consumer.start();
    }
}
```

## 🛠️ Practical Examples

### File Download Simulation
```java
import java.util.Random;

public class FileDownloader {
    private String fileName;
    private int fileSize;
    
    public FileDownloader(String fileName, int fileSize) {
        this.fileName = fileName;
        this.fileSize = fileSize;
    }
    
    public void download() {
        System.out.println("Starting download: " + fileName + " (" + fileSize + " MB)");
        
        Random random = new Random();
        int downloaded = 0;
        
        while (downloaded < fileSize) {
            try {
                Thread.sleep(200);  // Simulate network delay
                int chunk = random.nextInt(5) + 1;  // Download 1-5 MB chunks
                downloaded += chunk;
                
                if (downloaded > fileSize) {
                    downloaded = fileSize;
                }
                
                int progress = (downloaded * 100) / fileSize;
                System.out.println(fileName + ": " + progress + "% (" + 
                                 downloaded + "/" + fileSize + " MB)");
                
            } catch (InterruptedException e) {
                System.out.println("Download interrupted: " + fileName);
                return;
            }
        }
        
        System.out.println("Download completed: " + fileName);
    }
}

public class ConcurrentDownloads {
    public static void main(String[] args) throws InterruptedException {
        FileDownloader[] downloads = {
            new FileDownloader("video.mp4", 100),
            new FileDownloader("music.mp3", 50),
            new FileDownloader("document.pdf", 25)
        };
        
        Thread[] threads = new Thread[downloads.length];
        
        // Start all downloads
        for (int i = 0; i < downloads.length; i++) {
            final int index = i;
            threads[i] = new Thread(() -> downloads[index].download());
            threads[i].start();
        }
        
        // Wait for all downloads to complete
        for (Thread thread : threads) {
            thread.join();
        }
        
        System.out.println("All downloads completed!");
    }
}
```

## ⚠️ OCA Pitfalls

### 1. Always Call start(), Not run()
```java
// WRONG - calling run() directly
Thread thread = new Thread(() -> System.out.println("Hello"));
thread.run();    // Executes in current thread, not new thread

// CORRECT - calling start()
thread.start();  // Creates new thread and calls run()
```

### 2. Handle InterruptedException Properly
```java
// GOOD - proper exception handling
public void workerMethod() {
    try {
        Thread.sleep(1000);
    } catch (InterruptedException e) {
        System.out.println("Thread interrupted");
        Thread.currentThread().interrupt();  // Restore interrupt status
        return;
    }
}
```

### 3. Avoid Calling stop(), suspend(), resume()
```java
// WRONG - deprecated methods
Thread thread = new Thread(() -> {});
thread.start();
thread.stop();     // Deprecated and dangerous

// CORRECT - use interrupt mechanism
thread.interrupt();
```

### 4. Synchronize Access to Shared Data
```java
public class SharedData {
    private int value = 0;
    
    // WRONG - not synchronized
    public void increment() {
        value++;  // Race condition possible
    }
    
    // CORRECT - synchronized
    public synchronized void safeIncrement() {
        value++;
    }
}
```

## 🧪 Quick Quiz

**Question 1:** What's the difference between `start()` and `run()`?
- A) No difference
- B) `start()` creates a new thread, `run()` executes in current thread
- C) `run()` creates a new thread, `start()` executes in current thread
- D) Both create new threads

<details>
<summary>Click for answer</summary>

**Answer:** B) `start()` creates a new thread, `run()` executes in current thread

`start()` creates a new thread and calls `run()` in that thread. Calling `run()` directly executes the code in the current thread.

</details>

**Question 2:** What happens to a thread after calling `start()` twice?
```java
Thread thread = new Thread(() -> System.out.println("Hello"));
thread.start();
thread.start();  // What happens here?
```

<details>
<summary>Click for answer</summary>

**Answer:** `IllegalThreadStateException` is thrown

A thread can only be started once. Calling `start()` on an already started thread throws `IllegalThreadStateException`.

</details>

## 🎯 OCA Exam Tips

1. **Use `start()` not `run()`** to execute threads
2. **Handle `InterruptedException`** in thread code
3. **Synchronize access to shared data** to avoid race conditions
4. **A thread can only be started once** - calling `start()` twice throws exception
5. **Thread states**: NEW → RUNNABLE → BLOCKED/WAITING/TIMED_WAITING → TERMINATED
6. **`join()` waits for thread completion**

## 📚 Best Practices

1. **Prefer `Runnable` over extending `Thread`**: Better design flexibility
2. **Use meaningful thread names**: Easier debugging
3. **Handle interruption properly**: Check interrupt status and clean up
4. **Minimize synchronized blocks**: Better performance
5. **Avoid shared mutable state**: Reduces need for synchronization
6. **Use thread-safe collections**: Like `ConcurrentHashMap` when needed

## Related Topics

- [26. Exception Handling](26-exception-handling.md) - Handling InterruptedException
- [32. Methods](32-methods.md) - Understanding method synchronization
- [22. List Object](22-list-object.md) - Thread-safe collections
- [51. Generics](51-generics.md) - Type-safe concurrent collections

---

*This tutorial covers Threads in Java, enabling concurrent execution and parallel programming for better performance and responsiveness.*
