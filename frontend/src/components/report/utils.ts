// Utility functions for the Report component

export const getJavaDocumentationLink = (topic: string, documentationLinks: { [key: string]: string }) => {
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
    // Additional topics
    'Autoboxing': 'https://docs.oracle.com/javase/tutorial/java/data/autoboxing.html',
    'ArrayList': 'https://docs.oracle.com/javase/8/docs/api/java/util/ArrayList.html',
    'StringBuilder': 'https://docs.oracle.com/javase/8/docs/api/java/lang/StringBuilder.html',
    'String': 'https://docs.oracle.com/javase/8/docs/api/java/lang/String.html',
    'Date and Time API': 'https://docs.oracle.com/javase/tutorial/datetime/index.html',
    'Lambda': 'https://docs.oracle.com/javase/tutorial/java/javaOO/lambdaexpressions.html',
    'Switch': 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/switch.html',
    'HashMap': 'https://docs.oracle.com/javase/8/docs/api/java/util/HashMap.html'
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
export const getTutorialSlug = (topic: string) => {
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
    'HashMap': '24-map-object',
    'HashMap put': '24-map-object',
    'Variables': '04-variable',
    'Variable': '04-variable',
    'Casting Primitives': '05-variable-casting-and-conversions',
    'Operators': '07-operators',
    'Overflow': '05-variable-casting-and-conversions',
    'Integer Overflow': '05-variable-casting-and-conversions',
    'Arithmetic Overflow': '05-variable-casting-and-conversions',
    'Increment/Decrement': '07-operators',
    'Comparison Operators': '08-comparison-operators',
    'Logical Operators': '09-logical-operators',
    'Bitwise Operators': '10-bitwise-operators',
    'Bitwise vs Logical Operators': '10-bitwise-operators',
    'Ternary Operator': '12-if-else-statement',
    'Ternary': '12-if-else-statement',
    'Ternary Operator Nesting': '12-if-else-statement',
    'Ternary Operator Type': '12-if-else-statement',
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
    'ZonedDateTime': '25-date-time-api',
    'Working With Java Data Types': '58-working-with-java-data-types'
  };

  // Try exact match first
  if (topicToSlugMap[topic]) {
    return topicToSlugMap[topic];
  }

  // Try partial matches for common patterns
  const lowerTopic = topic.toLowerCase();
  if (lowerTopic.includes('array')) return '21-arrays';
  if (lowerTopic.includes('map') || lowerTopic.includes('hashmap')) return '24-map-object';
  if (lowerTopic.includes('set')) return '23-set-object';
  if (lowerTopic.includes('list')) return '22-list-object';
  if (lowerTopic.includes('loop') || lowerTopic.includes('for') || lowerTopic.includes('while')) return '20-looping-constructs';
  if (lowerTopic.includes('if') || lowerTopic.includes('condition')) return '12-if-else-statement';
  if (lowerTopic.includes('ternary')) return '12-if-else-statement';
  if (lowerTopic.includes('method') || lowerTopic.includes('function')) return '32-methods';
  if (lowerTopic.includes('class')) return '28-classes-and-objects';
  if (lowerTopic.includes('object')) return '28-classes-and-objects';
  if (lowerTopic.includes('inherit')) return '45-inheritance';
  if (lowerTopic.includes('exception') || lowerTopic.includes('error')) return '26-exception-handling';
  if (lowerTopic.includes('string')) return '18-string-class';
  if (lowerTopic.includes('variable')) return '04-variable';
  if (lowerTopic.includes('operator') || lowerTopic.includes('overflow')) return '07-operators';
  if (lowerTopic.includes('constructor')) return '31-constructors';
  if (lowerTopic.includes('static')) return '37-static-vs-instance-methods';
  if (lowerTopic.includes('abstract')) return '41-abstract-classes';
  if (lowerTopic.includes('interface')) return '43-interfaces';
  if (lowerTopic.includes('lambda')) return '44-lambda-expressions';
  if (lowerTopic.includes('autobox')) return '57-autoboxing-unboxing';
  if (lowerTopic.includes('date') || lowerTopic.includes('time') || lowerTopic.includes('local') || lowerTopic.includes('duration') || lowerTopic.includes('period')) return '25-date-time-api';
  if (lowerTopic.includes('data type') || lowerTopic.includes('working with java data types')) return '58-working-with-java-data-types';

  // Return null if no match found
  return null;
};

export const getTutorialDisplayName = (tutorialSlug: string) => {
  const slugToNameMap: { [key: string]: string } = {
    '57-autoboxing-unboxing': 'Autoboxing/Unboxing',
    '21-arrays': 'Arrays',
    '22-list-object': 'ArrayList',
    '24-map-object': 'HashMap/Map Objects',
    '04-variable': 'Variables',
    '05-variable-casting-and-conversions': 'Variable Casting & Conversions',
    '07-operators': 'Operators',
    '08-comparison-operators': 'Comparison Operators',
    '09-logical-operators': 'Logical Operators',
    '10-bitwise-operators': 'Bitwise Operators',
    '12-if-else-statement': 'If-Else & Ternary Operator',
    '13-switch-statement': 'Switch Statement',
    '14-when-to-use-if-else-or-switch': 'When to Use If-Else or Switch',
    '15-the-enum-field': 'Enum',
    '18-string-class': 'String Class',
    '54-stringbuilder': 'StringBuilder',
    '20-looping-constructs': 'Loops',
    '26-exception-handling': 'Exception Handling',
    '28-classes-and-objects': 'Classes and Objects',
    '31-constructors': 'Constructors',
    '32-methods': 'Methods',
    '36-method-overloading': 'Method Overloading',
    '38-method-overriding': 'Method Overriding',
    '37-static-vs-instance-methods': 'Static vs Instance Methods',
    '45-inheritance': 'Inheritance',
    '41-abstract-classes': 'Abstract Classes',
    '42-abstract-methods': 'Abstract Methods',
    '43-interfaces': 'Interfaces',
    '44-lambda-expressions': 'Lambda Expressions',
    '46-polymorphism': 'Polymorphism',
    '48-encapsulation': 'Encapsulation',
    '49-packages': 'Packages',
    '50-file-io': 'File I/O',
    '51-generics': 'Generics',
    '52-threads': 'Threads',
    '53-streams-api': 'Streams API',
    '55-varargs': 'Varargs',
    '56-final-keyword': 'Final Keyword',
    '58-access-modifiers': 'Access Modifiers',
    '25-date-time-api': 'Date and Time API',
    '58-working-with-java-data-types': 'Java Data Types'
  };

  return slugToNameMap[tutorialSlug] || tutorialSlug;
};

export const getPerformanceColor = (color: string) => {
  switch (color) {
    case 'green': return '#10B981';
    case 'yellow': return '#F59E0B';
    case 'red': return '#EF4444';
    default: return '#6B7280';
  }
};

export const getPerformanceEmoji = (color: string) => {
  switch (color) {
    case 'green': return '🟢';
    case 'yellow': return '🟡';
    case 'red': return '🔴';
    default: return '⚪';
  }
};
