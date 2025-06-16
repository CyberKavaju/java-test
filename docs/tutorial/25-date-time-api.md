# Date/Time API

## ✅ Why the New Date/Time API?

Before Java 8, developers used `java.util.Date`, `java.util.Calendar`, and `SimpleDateFormat`. These were:

* ❌ Not thread-safe
* ❌ Hard to read and maintain
* ❌ Mutability caused bugs

### Java 8 introduced:

> `java.time` — a **modern, immutable**, and **thread-safe** Date/Time API modeled after Joda-Time.

---

## 🧩 Main Classes in `java.time`

| Class             | Purpose                            | Example                                     |
| ----------------- | ---------------------------------- | ------------------------------------------- |
| `LocalDate`     | Date only (no time, no zone)       | `2025-05-16`                              |
| `LocalTime`     | Time only (no date, no zone)       | `13:45:30`                                |
| `LocalDateTime` | Date + Time (no time zone)         | `2025-05-16T13:45:30`                     |
| `ZonedDateTime` | Date + Time + Zone                 | `2025-05-16T13:45:30+01:00[Europe/Paris]` |
| `Period`        | Date-based amount (years, months)  | `P2Y3M5D`                                 |
| `Duration`      | Time-based amount (seconds, nanos) | `PT20M` (20 minutes)                      |
| `Instant`       | Timestamp (machine time)           | `2025-05-16T11:15:30Z`                    |

---

## 🧪 Creating Dates and Times

```java
LocalDate date = LocalDate.now();              // current date
LocalTime time = LocalTime.of(14, 30);         // 14:30
LocalDateTime dateTime = LocalDateTime.of(2025, 5, 16, 14, 30);
```

---

## 📅 Common Factory Methods

| Method            | Description                    | Example                           |
| ----------------- | ------------------------------ | --------------------------------- |
| `now()`         | Current date/time              | `LocalDate.now()`               |
| `of(...)`       | Specify year, month, day, etc. | `LocalTime.of(10, 15)`          |
| `parse(String)` | Parse from ISO-8601 string     | `LocalDate.parse("2025-05-16")` |

---

## 🔧 Common Methods (Immutable API)

```java
LocalDate today = LocalDate.now();
LocalDate tomorrow = today.plusDays(1);       // returns new LocalDate
LocalDate lastWeek = today.minusWeeks(1);
int year = today.getYear();
DayOfWeek day = today.getDayOfWeek();         // e.g., MONDAY
```

📌 All these methods return **new objects** — original is unchanged.

---

## 🧮 Period vs Duration

| Type         | Use For                 | Example                 |
| ------------ | ----------------------- | ----------------------- |
| `Period`   | Years, months, days     | `Period.ofMonths(2)`  |
| `Duration` | Hours, minutes, seconds | `Duration.ofHours(5)` |

### Example:

```java
Period p = Period.between(LocalDate.of(2020, 1, 1), LocalDate.now());
Duration d = Duration.ofMinutes(90);
```

---

## 🌍 Zoned Date and Time

```java
ZonedDateTime zdt = ZonedDateTime.now();
ZonedDateTime nyTime = ZonedDateTime.now(ZoneId.of("America/New_York"));
```

---

## 📤 Formatting & Parsing (`DateTimeFormatter`)

```java
DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
LocalDate date = LocalDate.of(2025, 5, 16);
String formatted = date.format(formatter); // "16-05-2025"
```

---

## ✅ 1. **Formatting a LocalDate or LocalDateTime using a pattern**

```java
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class Main {
    public static void main(String[] args) {
        LocalDateTime now = LocalDateTime.now();

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        String formatted = now.format(formatter);

        System.out.println("Formatted date-time: " + formatted);
    }
}
```

## 🧠 Common Patterns:

| Pattern         | Output example  | Meaning                     |
| --------------- | --------------- | --------------------------- |
| `yyyy-MM-dd`    | 2025-06-05      | Year-Month-Day              |
| `dd/MM/yyyy`    | 05/06/2025      | Day/Month/Year              |
| `HH:mm:ss`      | 14:30:59        | 24-hour format time         |
| `hh:mm a`       | 02:30 PM        | 12-hour time with AM/PM     |
| `E, MMM d yyyy` | Thu, Jun 5 2025 | Day of week, Month day year |

---

## ✅ 2. **Parsing a string to LocalDateTime**

```java
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class Main {
    public static void main(String[] args) {
        String input = "2025-06-05 14:45:00";
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

        LocalDateTime parsedDateTime = LocalDateTime.parse(input, formatter);

        System.out.println("Parsed LocalDateTime: " + parsedDateTime);
    }
}
```

---

## 🔥 Bonus Tip:

`DateTimeFormatter.ISO_LOCAL_DATE` and similar constants are built-in formatters you can use if you want ISO 8601 compliant formatting without defining custom patterns.

---

## ⚠️ OCA Pitfalls

### ❗ Date/Time objects are **immutable**

```java
LocalDate date = LocalDate.of(2025, 5, 16);
date.plusDays(1); // ❌ doesn't change `date`
```

✅ Must reassign:

```java
date = date.plusDays(1); // ✅ now it's May 17
```

---

### ❗ Mixing Period and Duration types incorrectly

```java
LocalDate d1 = LocalDate.now();
Duration duration = Duration.ofDays(1);  // ❌ LocalDate doesn't support Duration
d1.plus(duration); // Compile error
```

✅ Use `Period` for `LocalDate` and `Duration` for `LocalDateTime` or `Instant`

---

### ❗ Using months incorrectly (they start from `1`, not `0`)

```java
LocalDate.of(2023, 13, 1); // ❌ IllegalArgumentException
```

---

## 🧠 Summary Table

| Concept          | Class/Method                      | Notes                |
| ---------------- | --------------------------------- | -------------------- |
| Current date     | `LocalDate.now()`               | No time or zone      |
| Current time     | `LocalTime.now()`               | No date or zone      |
| Current datetime | `LocalDateTime.now()`           | Date and time        |
| Zoned datetime   | `ZonedDateTime.now()`           | Includes timezone    |
| Period           | `Period.ofYears(1)`             | Date-based amounts   |
| Duration         | `Duration.ofHours(2)`           | Time-based amounts   |
| Parse            | `LocalDate.parse(...)`          | ISO or pattern-based |
| Format           | `DateTimeFormatter.ofPattern()` | Custom formatting    |

---

## 🧪 Quick Quiz

### Q: What does this print?

```java
LocalDate date = LocalDate.of(2024, 12, 31);
date.plusDays(1);
System.out.println(date);
```

❌ **Answer:** Still `2024-12-31` — `plusDays(1)` returns a new object, original is unchanged!

---

## 🎯 Final Rule of Thumb

> Use `java.time` classes for all new code:
> They're **immutable**, **thread-safe**, and much **easier to reason about** than the old APIs.

## 🎥 Learn More

[Bro Code - Learn DATES & TIMES with Java in 8 minutes!](https://www.youtube.com/watch?v=F2bZ1fkAQx0&pp=ygUSamF2YS50aW1lIHR1dG9yaWFs)

[Java Code Geeks - Java Date and Calendar Tutorial](https://www.youtube.com/watch?v=il7eVsDPFoA)

[Maaike Bright Boost - Java basics of the LocalDate, LocalTime, LocalDateTime, ZonedDateTime and the DateTimeFormatter](https://www.youtube.com/watch?v=0XgdX5hDL4U)
