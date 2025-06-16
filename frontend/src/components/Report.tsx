import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import ImprovementGraph from './ImprovementGraph';
import type { QuestionPerformance, PerformanceTrend, UserStats, TestSession, TopicStats, DetailedQuestionPerformance } from '../types';

export default function Report() {
  const [reportData, setReportData] = useState<{
    questionPerformance: QuestionPerformance[];
    performanceTrend: PerformanceTrend[];
  } | null>(null);
  
  const [userHistory, setUserHistory] = useState<{
    userStats: UserStats;
    testSessions: TestSession[];
    topicStats: TopicStats[];
  } | null>(null);

  const [detailedQuestions, setDetailedQuestions] = useState<{
    questionDetails: DetailedQuestionPerformance[];
  } | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'performance' | 'topics'>('overview');
  const [expandedQuestions, setExpandedQuestions] = useState<Set<number>>(new Set());
  const [expandedRecommendations, setExpandedRecommendations] = useState<Set<string>>(new Set());
  const [performanceFilter, setPerformanceFilter] = useState<'all' | 'green' | 'yellow' | 'red'>('all');
  const [documentationLinks, setDocumentationLinks] = useState<{ [key: string]: string }>({});

  const toggleRecommendationExpand = (topic: string) => {
    setExpandedRecommendations(prev => {
      const newSet = new Set(prev);
      if (newSet.has(topic)) {
        newSet.delete(topic);
      } else {
        newSet.add(topic);
      }
      return newSet;
    });
  };

  const getJavaDocumentationLink = (topic: string) => {
    // First check if we have fetched links from the database
    if (documentationLinks[topic]) {
      return documentationLinks[topic];
    }
    
    // Fallback to hard-coded mappings if not in the database (should not happen in normal operation)
    const topicMappings: { [key: string]: string } = {
      'Arrays': 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/arrays.html',
      'Loops': 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/for.html',
      'Conditionals': 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/if.html',
      'Methods': 'https://docs.oracle.com/javase/tutorial/java/javaOO/methods.html',
      'Classes': 'https://docs.oracle.com/javase/tutorial/java/javaOO/classes.html',
      'Objects': 'https://docs.oracle.com/javase/tutorial/java/javaOO/objects.html',
      'Inheritance': 'https://docs.oracle.com/javase/tutorial/java/IandI/subclasses.html',
      'Polymorphism': 'https://docs.oracle.com/javase/tutorial/java/IandI/polymorphism.html',
      'Encapsulation': 'https://docs.oracle.com/javase/tutorial/java/javaOO/accesscontrol.html',
      'Abstraction': 'https://docs.oracle.com/javase/tutorial/java/IandI/abstract.html',
      'Interfaces': 'https://docs.oracle.com/javase/tutorial/java/IandI/createinterface.html',
      'Exception Handling': 'https://docs.oracle.com/javase/tutorial/essential/exceptions/',
      'Collections': 'https://docs.oracle.com/javase/tutorial/collections/',
      'Generics': 'https://docs.oracle.com/javase/tutorial/java/generics/',
      'Streams': 'https://docs.oracle.com/javase/8/docs/api/java/util/stream/package-summary.html',
      'Lambda Expressions': 'https://docs.oracle.com/javase/tutorial/java/javaOO/lambdaexpressions.html',
      'Threads': 'https://docs.oracle.com/javase/tutorial/essential/concurrency/',
      'File I/O': 'https://docs.oracle.com/javase/tutorial/essential/io/',
      'String Manipulation': 'https://docs.oracle.com/javase/tutorial/java/data/strings.html',
      'Data Types': 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/datatypes.html',
      'Variables': 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/variables.html',
      'Operators': 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/operators.html',
      'Booleans': 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/datatypes.html',
      'Static': 'https://docs.oracle.com/javase/tutorial/java/javaOO/classvars.html',
      'Final': 'https://docs.oracle.com/javase/tutorial/java/IandI/final.html',
      'Packages': 'https://docs.oracle.com/javase/tutorial/java/package/',
      'Access Modifiers': 'https://docs.oracle.com/javase/tutorial/java/javaOO/accesscontrol.html',
      // Added missing topics from the database
      'Autoboxing': 'https://docs.oracle.com/javase/tutorial/java/data/autoboxing.html',
      'Autoboxing/Unboxing': 'https://docs.oracle.com/javase/tutorial/java/data/autoboxing.html',
      'Abstract Classes and Interfaces': 'https://docs.oracle.com/javase/tutorial/java/IandI/index.html',
      'ArrayList': 'https://docs.oracle.com/javase/8/docs/api/java/util/ArrayList.html',
      'StringBuilder': 'https://docs.oracle.com/javase/8/docs/api/java/lang/StringBuilder.html',
      'String': 'https://docs.oracle.com/javase/8/docs/api/java/lang/String.html',
      'Date and Time API': 'https://docs.oracle.com/javase/tutorial/datetime/index.html',
      'Lambda': 'https://docs.oracle.com/javase/tutorial/java/javaOO/lambdaexpressions.html',
      'Switch': 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/switch.html',
      'Varargs': 'https://docs.oracle.com/javase/tutorial/java/javaOO/arguments.html#varargs',
      'HashMap': 'https://docs.oracle.com/javase/8/docs/api/java/util/HashMap.html',
      'Exception Hierarchy': 'https://docs.oracle.com/javase/tutorial/essential/exceptions/hierarchy.html',
      'Method Overloading': 'https://docs.oracle.com/javase/tutorial/java/javaOO/methods.html',
      'Method Overriding': 'https://docs.oracle.com/javase/tutorial/java/IandI/override.html',
      'Constructors': 'https://docs.oracle.com/javase/tutorial/java/javaOO/constructors.html',
      
      // Additional topics from database
      'Abstract Class': 'https://docs.oracle.com/javase/tutorial/java/IandI/abstract.html',
      'Access Control': 'https://docs.oracle.com/javase/tutorial/java/javaOO/accesscontrol.html',
      'Array of Objects': 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/arrays.html',
      'Array of Primitives Default Values': 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/arrays.html',
      'ArrayList Capacity': 'https://docs.oracle.com/javase/8/docs/api/java/util/ArrayList.html',
      'ArrayList basic': 'https://docs.oracle.com/javase/8/docs/api/java/util/ArrayList.html',
      'ArrayList contains': 'https://docs.oracle.com/javase/8/docs/api/java/util/ArrayList.html',
      'ArrayList remove': 'https://docs.oracle.com/javase/8/docs/api/java/util/ArrayList.html',
      'Arrays and Exception Handling': 'https://docs.oracle.com/javase/tutorial/essential/exceptions/',
      'Bitwise Operators': 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/operators.html',
      'Bitwise vs Logical Operators': 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/operators.html',
      'Break Statement': 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/branch.html',
      'Casting Primitives': 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/datatypes.html',
      'Catch Order': 'https://docs.oracle.com/javase/tutorial/essential/exceptions/handling.html',
      'Catching Multiple Exceptions': 'https://docs.oracle.com/javase/tutorial/essential/exceptions/handling.html',
      'Checked vs Unchecked': 'https://docs.oracle.com/javase/tutorial/essential/exceptions/runtime.html',
      'Class Definition': 'https://docs.oracle.com/javase/tutorial/java/javaOO/classes.html',
      'Class Structure': 'https://docs.oracle.com/javase/tutorial/java/javaOO/classdecl.html',
      'Constructor Chaining': 'https://docs.oracle.com/javase/tutorial/java/javaOO/constructors.html',
      'Custom Exceptions': 'https://docs.oracle.com/javase/tutorial/essential/exceptions/creating.html',
      'DateTimeFormatter': 'https://docs.oracle.com/javase/8/docs/api/java/time/format/DateTimeFormatter.html',
      'Default Constructors': 'https://docs.oracle.com/javase/tutorial/java/javaOO/constructors.html',
      'Enhanced For Loop': 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/for.html',
      'Exceptions': 'https://docs.oracle.com/javase/tutorial/essential/exceptions/',
      'Finally Always Executes': 'https://docs.oracle.com/javase/tutorial/essential/exceptions/finally.html',
      'Float precision': 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/datatypes.html',
      'For Loop': 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/for.html',
      'HashMap put': 'https://docs.oracle.com/javase/8/docs/api/java/util/HashMap.html',
      'Identifiers': 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/variables.html',
      'Import Statements': 'https://docs.oracle.com/javase/tutorial/java/package/usepkgs.html',
      'Increment/Decrement': 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/op1.html',
      'Instanceof Operator': 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/op2.html',
      'Interface Evolution (Java 8)': 'https://docs.oracle.com/javase/tutorial/java/IandI/defaultmethods.html',
      'Java 8 Enhancements': 'https://docs.oracle.com/javase/8/docs/technotes/guides/language/enhancements.html',
      'Labeled Loops': 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/branch.html',
      'Lambda Predicate': 'https://docs.oracle.com/javase/8/docs/api/java/util/function/Predicate.html',
      'Lambda Syntax': 'https://docs.oracle.com/javase/tutorial/java/javaOO/lambdaexpressions.html',
      'LocalDate plusDays': 'https://docs.oracle.com/javase/8/docs/api/java/time/LocalDate.html',
      'Loop Control': 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/branch.html',
      'Main Method Arguments': 'https://docs.oracle.com/javase/tutorial/getStarted/application/index.html',
      'Method Arguments': 'https://docs.oracle.com/javase/tutorial/java/javaOO/arguments.html',
      'Multi-dimensional arrays': 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/arrays.html',
      'Narrowing Conversion': 'https://docs.oracle.com/javase/specs/jls/se8/html/jls-5.html',
      'Nested if/else': 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/if.html',
      'Numeric Literals': 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/datatypes.html',
      'Operator Precedence': 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/operators.html',
      'Pass by Value (object reference)': 'https://docs.oracle.com/javase/tutorial/java/javaOO/arguments.html',
      'Pass by Value (primitive)': 'https://docs.oracle.com/javase/tutorial/java/javaOO/arguments.html',
      'Period and Duration': 'https://docs.oracle.com/javase/tutorial/datetime/iso/period.html',
      'Primitive Casting': 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/datatypes.html',
      'Primitive Type Sizes': 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/datatypes.html',
      'Private Constructor': 'https://docs.oracle.com/javase/tutorial/java/javaOO/constructors.html',
      'Static Fields and Methods': 'https://docs.oracle.com/javase/tutorial/java/javaOO/classvars.html',
      'Static Method Call': 'https://docs.oracle.com/javase/tutorial/java/javaOO/classvars.html',
      'String equals': 'https://docs.oracle.com/javase/8/docs/api/java/lang/String.html#equals-java.lang.Object-',
      'String immutability': 'https://docs.oracle.com/javase/tutorial/java/data/strings.html',
      'StringBuilder Capacity': 'https://docs.oracle.com/javase/8/docs/api/java/lang/StringBuilder.html',
      'StringBuilder append': 'https://docs.oracle.com/javase/8/docs/api/java/lang/StringBuilder.html',
      'StringBuilder reverse': 'https://docs.oracle.com/javase/8/docs/api/java/lang/StringBuilder.html',
      'StringBuilder vs String': 'https://docs.oracle.com/javase/tutorial/java/data/buffers.html',
      'Strings': 'https://docs.oracle.com/javase/tutorial/java/data/strings.html',
      'Switch Statement Fall-Through': 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/switch.html',
      'Switch with Strings': 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/switch.html',
      'Ternary Operator': 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/op2.html',
      'Wrapper Caching': 'https://docs.oracle.com/javase/8/docs/api/java/lang/Integer.html#valueOf-int-',
      'char Arithmetic': 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/datatypes.html',
      'do-while Loop': 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/while.html',
      // More topics from database
      'Accessing Members': 'https://docs.oracle.com/javase/tutorial/java/javaOO/accesscontrol.html',
      'Array Reference Aliasing': 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/arrays.html',
      'Assignment in if condition': 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/if.html',
      'Autoboxing and NullPointerException': 'https://docs.oracle.com/javase/tutorial/java/data/autoboxing.html',
      'Basics': 'https://docs.oracle.com/javase/tutorial/java/index.html',
      'Catching RuntimeException': 'https://docs.oracle.com/javase/tutorial/essential/exceptions/handling.html',
      'Class Components': 'https://docs.oracle.com/javase/tutorial/java/javaOO/classdecl.html',
      'Comments': 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/index.html',
      'Comparison Operators': 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/op2.html',
      'Compound Assignment': 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/op1.html',
      'Constructors and super': 'https://docs.oracle.com/javase/tutorial/java/IandI/super.html',
      'Control Flow': 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/flow.html',
      'Covariant Return Types': 'https://docs.oracle.com/javase/tutorial/java/IandI/override.html',
      'Exception Handling Advantages': 'https://docs.oracle.com/javase/tutorial/essential/exceptions/advantages.html',
      'Features of Java': 'https://docs.oracle.com/javase/tutorial/getStarted/intro/definition.html',
      'Final Class': 'https://docs.oracle.com/javase/tutorial/java/IandI/final.html',
      'Finally Overrides Return': 'https://docs.oracle.com/javase/tutorial/essential/exceptions/finally.html',
      'Handling Exceptions': 'https://docs.oracle.com/javase/tutorial/essential/exceptions/handling.html',
      'Imports': 'https://docs.oracle.com/javase/tutorial/java/package/usepkgs.html',
      'Infinite Loop': 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/while.html',
      'Infinite loop with break': 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/branch.html',
      'Inheritance and Access Modifiers': 'https://docs.oracle.com/javase/tutorial/java/IandI/subclasses.html',
      'Java Compilation': 'https://docs.oracle.com/javase/tutorial/getStarted/application/index.html',
      'Loop Comparison': 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/for.html',
      'Loop Constructs and Variable Scope': 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/variables.html',
      'Method Signature and Throws': 'https://docs.oracle.com/javase/tutorial/java/javaOO/methods.html',
      'Method Throwing Exception': 'https://docs.oracle.com/javase/tutorial/essential/exceptions/declaring.html',
      'Object Lifecycle': 'https://docs.oracle.com/javase/tutorial/java/javaOO/objectcreation.html',
      'Object References': 'https://docs.oracle.com/javase/tutorial/java/javaOO/objects.html',
      'Overflow': 'https://docs.oracle.com/javase/specs/jls/se8/html/jls-4.html#jls-4.2.3',
      'Package Declaration': 'https://docs.oracle.com/javase/tutorial/java/package/createpkgs.html',
      'Pass-by-Value': 'https://docs.oracle.com/javase/tutorial/java/javaOO/arguments.html',
      'Pitfalls': 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/QandE/answers.html',
      'Platform Independence': 'https://docs.oracle.com/javase/tutorial/getStarted/intro/definition.html',
      'Polymorphism (Method Overriding)': 'https://docs.oracle.com/javase/tutorial/java/IandI/polymorphism.html',
      'Primitive Casting and Overflow': 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/datatypes.html',
      'Primitives': 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/datatypes.html',
      'Private Method Hiding': 'https://docs.oracle.com/javase/tutorial/java/IandI/override.html',
      'References': 'https://docs.oracle.com/javase/tutorial/java/javaOO/objects.html',
      'Static Keyword': 'https://docs.oracle.com/javase/tutorial/java/javaOO/classvars.html',
      'Static Method Hiding': 'https://docs.oracle.com/javase/tutorial/java/IandI/override.html',
      'Superclass Constructor Call': 'https://docs.oracle.com/javase/tutorial/java/IandI/super.html',
      'Switch Fall-Through with Loops': 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/switch.html',
      'Ternary': 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/op2.html',
      'Ternary Operator Nesting': 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/op2.html',
      'Ternary Operator Type': 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/op2.html',
      'Testing': 'https://docs.oracle.com/javase/tutorial/java/javaOO/QandE/creating-questions.html',
      'Unary Operators': 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/operators.html',
      'Variable Initialization': 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/variables.html',
      'Variable Scope': 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/variables.html',
      'Working With Java Data Types': 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/datatypes.html',
      'Working with Methods and Encapsulation': 'https://docs.oracle.com/javase/tutorial/java/javaOO/methods.html',
      'Working with Selected classes from the Java API': 'https://docs.oracle.com/javase/tutorial/essential/io/index.html'
    };

    // Try exact match first
    if (topicMappings[topic]) {
      return topicMappings[topic];
    }

    // Try partial matches for common patterns
    const lowerTopic = topic.toLowerCase();
    if (lowerTopic.includes('array')) return topicMappings['Arrays'];
    if (lowerTopic.includes('loop') || lowerTopic.includes('for') || lowerTopic.includes('while')) return topicMappings['Loops'];
    if (lowerTopic.includes('if') || lowerTopic.includes('condition')) return topicMappings['Conditionals'];
    if (lowerTopic.includes('method') || lowerTopic.includes('function')) return topicMappings['Methods'];
    if (lowerTopic.includes('class')) return topicMappings['Classes'];
    if (lowerTopic.includes('object')) return topicMappings['Objects'];
    if (lowerTopic.includes('inherit')) return topicMappings['Inheritance'];
    if (lowerTopic.includes('exception') || lowerTopic.includes('error')) return topicMappings['Exception Handling'];
    if (lowerTopic.includes('collection') || lowerTopic.includes('list') || lowerTopic.includes('set') || lowerTopic.includes('map')) return topicMappings['Collections'];
    if (lowerTopic.includes('string')) return topicMappings['String Manipulation'];
    if (lowerTopic.includes('thread') || lowerTopic.includes('concurrency')) return topicMappings['Threads'];
    if (lowerTopic.includes('file') || lowerTopic.includes('io')) return topicMappings['File I/O'];
    if (lowerTopic.includes('boolean')) return topicMappings['Booleans'];

    // Default to Java tutorial main page
    return 'https://docs.oracle.com/javase/tutorial/';
  };

  // Function to map study recommendation topics to tutorial slugs
  const getTutorialSlug = (topic: string) => {
    const topicToSlugMap: { [key: string]: string } = {
      // Direct mappings
      'Autoboxing': '57-autoboxing-unboxing',
      'Autoboxing/Unboxing': '57-autoboxing-unboxing',
      'Arrays': '21-arrays',
      'Array of Objects': '21-arrays',
      'Array of Primitives Default Values': '21-arrays',
      'ArrayList': '22-list-object',
      'ArrayList basic': '22-list-object',
      'ArrayList Capacity': '22-list-object',
      'ArrayList contains': '22-list-object',
      'ArrayList remove': '22-list-object',
      'Variables': '04-variable',
      'Variable': '04-variable',
      'Casting Primitives': '05-variable-casting-and-conversions',
      'Operators': '07-operators',
      'Comparison Operators': '08-comparison-operators',
      'Logical Operators': '09-logical-operators',
      'Bitwise Operators': '10-bitwise-operators',
      'Bitwise vs Logical Operators': '10-bitwise-operators',
      'If-Else': '12-if-else-statement',
      'Switch': '13-switch-statement',
      'Switch Statement': '13-switch-statement',
      'When to use if-else or switch': '14-when-to-use-if-else-or-switch',
      'Enum': '15-the-enum-field',
      'String': '18-string-class',
      'String Class': '18-string-class',
      'String equals': '18-string-class',
      'String immutability': '18-string-class',
      'StringBuilder': '54-stringbuilder',
      'StringBuilder append': '54-stringbuilder',
      'StringBuilder Capacity': '54-stringbuilder',
      'StringBuilder reverse': '54-stringbuilder',
      'Loops': '20-looping-constructs',
      'Loop Constructs': '20-looping-constructs',
      'Loop Control': '20-looping-constructs',
      'For Loop': '20-looping-constructs',
      'While Loop': '20-looping-constructs',
      'Break Statement': '20-looping-constructs',
      'Infinite Loop': '20-looping-constructs',
      'Exception Handling': '26-exception-handling',
      'Exceptions': '26-exception-handling',
      'Checked vs Unchecked': '26-exception-handling',
      'Catch Order': '26-exception-handling',
      'Catching Multiple Exceptions': '26-exception-handling',
      'Catching RuntimeException': '26-exception-handling',
      'Try-Catch': '26-exception-handling',
      'Classes': '28-classes-and-objects',
      'Objects': '28-classes-and-objects',
      'Classes and Objects': '28-classes-and-objects',
      'Class Components': '28-classes-and-objects',
      'Constructors': '31-constructors',
      'Constructor': '31-constructors',
      'Private Constructor': '31-constructors',
      'Methods': '32-methods',
      'Method': '32-methods',
      'Method Arguments': '32-methods',
      'Method Overloading': '36-method-overloading',
      'Method Overriding': '38-method-overriding',
      'Static': '37-static-vs-instance-methods',
      'Static Fields and Methods': '37-static-vs-instance-methods',
      'Static Method Call': '37-static-vs-instance-methods',
      'Inheritance': '45-inheritance',
      'Abstract Classes': '41-abstract-classes',
      'Abstract Class': '41-abstract-classes',
      'Abstract Methods': '42-abstract-methods',
      'Interfaces': '43-interfaces',
      'Lambda': '44-lambda-expressions',
      'Lambda Expressions': '44-lambda-expressions',
      'Lambda Syntax': '44-lambda-expressions',
      'Lambda Predicate': '44-lambda-expressions',
      'Polymorphism': '46-polymorphism',
      'Encapsulation': '48-encapsulation',
      'Packages': '49-packages',
      'Package Declaration': '49-packages',
      'File I/O': '50-file-io',
      'Generics': '51-generics',
      'Threads': '52-threads',
      'Streams': '53-streams-api',
      'Varargs': '55-varargs',
      'Final': '56-final-keyword',
      'Final Class': '56-final-keyword',
      'Access Modifiers': '58-access-modifiers',
      'Access Control': '58-access-modifiers',
      'Date and Time API': '25-date-time-api',
      'Working with Java API - Time and Date': '25-date-time-api',
      'Date/Time API': '25-date-time-api',
      'LocalDate': '25-date-time-api',
      'LocalTime': '25-date-time-api',
      'LocalDateTime': '25-date-time-api',
      'DateTimeFormatter': '25-date-time-api',
      'Period and Duration': '25-date-time-api',
      'ZonedDateTime': '25-date-time-api'
    };

    // Try exact match first
    if (topicToSlugMap[topic]) {
      return topicToSlugMap[topic];
    }

    // Try partial matches for common patterns
    const lowerTopic = topic.toLowerCase();
    if (lowerTopic.includes('array')) return '21-arrays';
    if (lowerTopic.includes('loop') || lowerTopic.includes('for') || lowerTopic.includes('while')) return '20-looping-constructs';
    if (lowerTopic.includes('if') || lowerTopic.includes('condition')) return '12-if-else-statement';
    if (lowerTopic.includes('method') || lowerTopic.includes('function')) return '32-methods';
    if (lowerTopic.includes('class')) return '28-classes-and-objects';
    if (lowerTopic.includes('object')) return '28-classes-and-objects';
    if (lowerTopic.includes('inherit')) return '45-inheritance';
    if (lowerTopic.includes('exception') || lowerTopic.includes('error')) return '26-exception-handling';
    if (lowerTopic.includes('string')) return '18-string-class';
    if (lowerTopic.includes('variable')) return '04-variable';
    if (lowerTopic.includes('operator')) return '07-operators';
    if (lowerTopic.includes('constructor')) return '31-constructors';
    if (lowerTopic.includes('static')) return '37-static-vs-instance-methods';
    if (lowerTopic.includes('abstract')) return '41-abstract-classes';
    if (lowerTopic.includes('interface')) return '43-interfaces';
    if (lowerTopic.includes('lambda')) return '44-lambda-expressions';
    if (lowerTopic.includes('autobox')) return '57-autoboxing-unboxing';
    if (lowerTopic.includes('date') || lowerTopic.includes('time') || lowerTopic.includes('local') || lowerTopic.includes('duration') || lowerTopic.includes('period')) return '25-date-time-api';

    // Return null if no match found
    return null;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [report, history, detailed, recommendations] = await Promise.all([
          apiService.getReport(),
          apiService.getUserHistory(),
          apiService.getDetailedQuestionPerformance(),
          apiService.getRecommendations()
        ]);
        setReportData(report);
        setUserHistory(history);
        setDetailedQuestions(detailed);
        setDocumentationLinks(recommendations);
      } catch (error) {
        console.error('Failed to fetch report data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getPerformanceColor = (color: string) => {
    switch (color) {
      case 'green': return '#10B981';
      case 'yellow': return '#F59E0B';
      case 'red': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getPerformanceEmoji = (color: string) => {
    switch (color) {
      case 'green': return '🟢';
      case 'yellow': return '🟡';
      case 'red': return '🔴';
      default: return '⚪';
    }
  };

  const toggleQuestionExpanded = (questionId: number) => {
    setExpandedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const getFilteredQuestions = () => {
    if (!detailedQuestions?.questionDetails) return [];
    
    if (performanceFilter === 'all') {
      return detailedQuestions.questionDetails;
    }
    
    return detailedQuestions.questionDetails.filter(question => 
      question.performance_color === performanceFilter
    );
  };

  const filteredQuestions = getFilteredQuestions();

  if (loading) {
    return <div className="loading">Loading report...</div>;
  }

  if (!reportData || !userHistory || !detailedQuestions) {
    return <div className="error">Failed to load report data</div>;
  }

  return (
    <div className="report-container">
      <div className="report-header">
        <h2>Performance Report</h2>
        <div className="tab-navigation">
          <button
            className={activeTab === 'overview' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={activeTab === 'performance' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('performance')}
          >
            Question Performance
          </button>
          <button
            className={activeTab === 'topics' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('topics')}
          >
            Topics Analysis
          </button>
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="overview-tab">
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Attempts</h3>
              <div className="stat-value">{userHistory.userStats.total_attempts}</div>
            </div>
            <div className="stat-card">
              <h3>Correct Answers</h3>
              <div className="stat-value green">{userHistory.userStats.correct_answers}</div>
            </div>
            <div className="stat-card">
              <h3>Success Rate</h3>
              <div className="stat-value">
                {userHistory.userStats.total_attempts > 0 
                  ? Math.round((userHistory.userStats.correct_answers / userHistory.userStats.total_attempts) * 100)
                  : 0}%
              </div>
            </div>
            <div className="stat-card">
              <h3>Questions Attempted</h3>
              <div className="stat-value">{userHistory.userStats.unique_questions_attempted}</div>
            </div>
          </div>

          <ImprovementGraph testSessions={userHistory.testSessions} />

          <div className="recent-tests">
            <h3>Recent Test Sessions</h3>
            <div className="test-sessions">
              {userHistory.testSessions.map((session) => (
                <div key={session.id} className="session-card">
                  <div className="session-score">
                    {session.score}/{session.total_questions}
                  </div>
                  <div className="session-percentage">
                    {Math.round((session.score / session.total_questions) * 100)}%
                  </div>
                  <div className="session-time">
                    {Math.round(session.time_taken / 60)} min
                  </div>
                  <div className="session-date">
                    {new Date(session.completed_at).toLocaleDateString()} {new Date(session.completed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'performance' && (
        <div className="performance-tab">
          <h3>Detailed Question Review</h3>
          <div className="performance-summary">
            <div className="performance-legend">
              <button 
                className={`performance-filter-btn ${performanceFilter === 'all' ? 'active' : ''}`}
                onClick={() => setPerformanceFilter('all')}
              >
                📋 All ({detailedQuestions.questionDetails.length})
              </button>
              <button 
                className={`performance-filter-btn green ${performanceFilter === 'green' ? 'active' : ''}`}
                onClick={() => setPerformanceFilter('green')}
                style={{ color: getPerformanceColor('green') }}
              >
                🟢 Green ({detailedQuestions.questionDetails.filter(q => q.performance_color === 'green').length})
              </button>
              <button 
                className={`performance-filter-btn yellow ${performanceFilter === 'yellow' ? 'active' : ''}`}
                onClick={() => setPerformanceFilter('yellow')}
                style={{ color: getPerformanceColor('yellow') }}
              >
                🟡 Yellow ({detailedQuestions.questionDetails.filter(q => q.performance_color === 'yellow').length})
              </button>
              <button 
                className={`performance-filter-btn red ${performanceFilter === 'red' ? 'active' : ''}`}
                onClick={() => setPerformanceFilter('red')}
                style={{ color: getPerformanceColor('red') }}
              >
                🔴 Red ({detailedQuestions.questionDetails.filter(q => q.performance_color === 'red').length})
              </button>
            </div>
          </div>
          <div className="detailed-questions-list">
            {filteredQuestions.length === 0 ? (
              <div className="no-questions-found">
                <p>No questions found for the selected filter.</p>
              </div>
            ) : (
              filteredQuestions.map((question) => {
                const isExpanded = expandedQuestions.has(question.id);
                return (
                <div key={question.id} className="detailed-question-card">
                  <div 
                    className="question-header clickable" 
                    onClick={() => toggleQuestionExpanded(question.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="question-meta">
                      <span className="performance-indicator">
                        {getPerformanceEmoji(question.performance_color)}
                      </span>
                      <span className="topic-badge">{question.topic}</span>
                      <span className="domain-badge">{question.domain}</span>
                      <span className="success-rate">{question.success_rate}%</span>
                    </div>
                    <div className="attempts-summary">
                      <span>✅ {question.correct_count}</span>
                      <span>❌ {question.wrong_count}</span>
                      <span>Total: {question.total_attempts}</span>
                    </div>
                    <div className="expand-indicator">
                      {isExpanded ? '▼' : '▶'}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="question-content">
                      <div className="question-text">
                        <h4>Question:</h4>
                        <p>{question.question_text}</p>
                      </div>

                      <div className="answer-options">
                        <h4>Answer Options:</h4>
                        <div className="options-grid">
                          <div className={`option ${question.correct_answer === 'A' ? 'correct' : ''}`}>
                            <span className="option-label">A)</span>
                            <span className="option-text">{question.option_a}</span>
                            {question.correct_answer === 'A' && <span className="correct-indicator">✓ Correct</span>}
                          </div>
                          <div className={`option ${question.correct_answer === 'B' ? 'correct' : ''}`}>
                            <span className="option-label">B)</span>
                            <span className="option-text">{question.option_b}</span>
                            {question.correct_answer === 'B' && <span className="correct-indicator">✓ Correct</span>}
                          </div>
                          <div className={`option ${question.correct_answer === 'C' ? 'correct' : ''}`}>
                            <span className="option-label">C)</span>
                            <span className="option-text">{question.option_c}</span>
                            {question.correct_answer === 'C' && <span className="correct-indicator">✓ Correct</span>}
                          </div>
                          {question.option_d && (
                            <div className={`option ${question.correct_answer === 'D' ? 'correct' : ''}`}>
                              <span className="option-label">D)</span>
                              <span className="option-text">{question.option_d}</span>
                              {question.correct_answer === 'D' && <span className="correct-indicator">✓ Correct</span>}
                            </div>
                          )}
                          {question.option_e && (
                            <div className={`option ${question.correct_answer === 'E' ? 'correct' : ''}`}>
                              <span className="option-label">E)</span>
                              <span className="option-text">{question.option_e}</span>
                              {question.correct_answer === 'E' && <span className="correct-indicator">✓ Correct</span>}
                            </div>
                          )}
                        </div>
                      </div>

                      {question.explanation && (
                        <div className="explanation">
                          <h4>Explanation:</h4>
                          <p>{question.explanation}</p>
                        </div>
                      )}

                      {question.user_attempts.length > 0 && (
                        <div className="user-attempts">
                          <h4>Your Attempts:</h4>
                          <div className="attempts-list">
                            {question.user_attempts.map((attempt, index) => (
                              <div key={index} className={`attempt-item ${attempt.is_correct ? 'correct' : 'incorrect'}`}>
                                <div className="attempt-details">
                                  <span className="attempt-answer">
                                    You selected: <strong>{attempt.selected_answer}</strong>
                                  </span>
                                  <span className={`attempt-result ${attempt.is_correct ? 'correct' : 'incorrect'}`}>
                                    {attempt.is_correct ? '✅ Correct' : '❌ Incorrect'}
                                  </span>
                                </div>
                                <div className="attempt-time">
                                  {new Date(attempt.attempt_timestamp).toLocaleDateString()} {new Date(attempt.attempt_timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
            )}
          </div>
        </div>
      )}

      {activeTab === 'topics' && (
        <div className="topics-tab">
          <div className="recommendations">
            <h3>Study Recommendations</h3>
            <div className="recommendations-list">
              {userHistory.topicStats
                .filter(topic => topic.success_rate < 70)
                .sort((a, b) => a.success_rate - b.success_rate)
                .map((topic) => {
                  const isExpanded = expandedRecommendations.has(topic.topic);
                  return (
                    <div key={topic.topic} className={`recommendation-item ${isExpanded ? 'expanded' : 'collapsed'}`}>
                      <div 
                        className="recommendation-header"
                        onClick={() => toggleRecommendationExpand(topic.topic)}
                      >
                        <span className="priority">🎯</span>
                        <span className="recommendation-title">Focus on: {topic.topic}</span>
                        <span className={`expand-icon ${isExpanded ? 'expanded' : ''}`}>
                          {isExpanded ? '▼' : '▶'}
                        </span>
                      </div>
                      {isExpanded && (
                        <div className="recommendation-content">
                          <p>Current success rate: {topic.success_rate}%. Consider reviewing this topic.</p>
                          <div className="recommendation-details">
                            <span>Attempts: {topic.total_attempts}</span>
                            <span>Correct: {topic.correct_answers}</span>
                            <span>Needs improvement</span>
                          </div>
                          <div className="recommendation-link">
                            <a 
                              href={getJavaDocumentationLink(topic.topic)} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="java-doc-link"
                            >
                              📚 Study {topic.topic} in Java Documentation
                            </a>
                            {getTutorialSlug(topic.topic) && (
                              <a 
                                href={`/tutorial?tutorial=${getTutorialSlug(topic.topic)}`}
                                className="tutorial-link"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                📖 Study {topic.topic} Tutorial
                              </a>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              }
            </div>
          </div>
          
          <h3>Performance by Topic</h3>
          <div className="topics-analysis">
            {userHistory.topicStats.map((topic) => (
              <div key={topic.topic} className="topic-item">
                <div className="topic-header">
                  <h4>{topic.topic}</h4>
                  <div className={`topic-rate ${topic.success_rate >= 80 ? 'green' : topic.success_rate >= 50 ? 'yellow' : 'red'}`}>
                    {topic.success_rate}%
                  </div>
                </div>
                <div className="topic-stats">
                  <div className="topic-stat">
                    <span>Attempts: {topic.total_attempts}</span>
                  </div>
                  <div className="topic-stat">
                    <span>Correct: {topic.correct_answers}</span>
                  </div>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ 
                      width: `${topic.success_rate}%`,
                      backgroundColor: getPerformanceColor(
                        topic.success_rate >= 80 ? 'green' : 
                        topic.success_rate >= 50 ? 'yellow' : 'red'
                      )
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
