// Test the formatting functions
const formatQuestionText = (questionText) => {
    if (!questionText) return questionText;
    
    let formatted = questionText;
    
    // Ensure proper code block formatting
    formatted = formatted.replace(/```java\s*/g, '\n```java\n');
    formatted = formatted.replace(/```\s*(?!\w)/g, '\n```\n');
    
    // Add line breaks after question marks followed by capital letters (new questions/parts)
    formatted = formatted.replace(/\?\s*(?=[A-Z][a-z])/g, '?\n\n');
    
    // Add line breaks before parenthetical instructions
    formatted = formatted.replace(/\.\s*(\([^)]+\))/g, '.\n$1');
    
    // Format "Select X options" instructions
    formatted = formatted.replace(/(\(Select \d+ options?\.\))/g, '\n$1');
    
    // Clean up multiple newlines but preserve intentional spacing
    formatted = formatted.replace(/\n{3,}/g, '\n\n');
    formatted = formatted.trim();
    
    return formatted;
};

const formatExplanation = (explanation) => {
    if (!explanation) return explanation;
    
    let formatted = explanation;
    
    // Add line breaks after sentences for better readability
    formatted = formatted.replace(/\.\s+(?=[A-Z])/g, '.\n\n');
    
    // Format code references and exceptions
    formatted = formatted.replace(/(java\.lang\.\w+)/g, '`$1`');
    formatted = formatted.replace(/(\w+Exception)/g, '`$1`');
    
    // Fix double backticks and malformed code formatting
    formatted = formatted.replace(/`{2,}/g, '`');
    formatted = formatted.replace(/`java\.lang\.`(\w+)`/g, '`java.lang.$1`');
    formatted = formatted.replace(/(\w+)Exception`{2,}/g, '$1Exception`');
    
    // Clean up extra whitespace
    formatted = formatted.replace(/\n{3,}/g, '\n\n');
    formatted = formatted.trim();
    
    return formatted;
};

// Test cases
const testQuestion = "What will be the output of following program code? ```java import java.io.*; public class Whizlabs{ public static void main(String args[]){ int[] array = new int[10]; System.out.println(\"Accessing Element Eleven: \" + array[10]); } }```";

const testExplanation = "Array is declared with 10 elements. Then the code tries to access the 11th index element of the array which throws a standard exception java.lang.ArrayIndexOutOfBoundsException.";

console.log('=== ORIGINAL QUESTION ===');
console.log(testQuestion);
console.log('\n=== FORMATTED QUESTION ===');
console.log(formatQuestionText(testQuestion));

console.log('\n=== ORIGINAL EXPLANATION ===');
console.log(testExplanation);
console.log('\n=== FORMATTED EXPLANATION ===');
console.log(formatExplanation(testExplanation));

console.log('\nFormatting test complete!');
