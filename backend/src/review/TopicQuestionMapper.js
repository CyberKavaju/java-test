const fs = require('fs');
const path = require('path');

class TopicQuestionMapper {
    constructor() {
        // Map tutorial topic IDs to database topic/domain patterns
        this.topicMapping = {
            '01-main-characteristics-of-java': ['Java Basics'],
            '02-simple-execution-of-java-program': ['Java Basics'],
            '03-multiple-classes-in-one-java-file': ['Java Basics'],
            '04-variable': ['Working With Java Data Types'],
            '05-variable-casting-and-conversions': ['Working With Java Data Types', 'Primitive Casting and Overflow', 'Narrowing Conversion'],
            '06-scanner-input-object': ['Java Basics'],
            '07-operators': ['Operators', 'Operator Precedence'],
            '08-comparison-operators': ['Using Operators and Decision Constructs'],
            '09-logical-operators': ['Using Operators and Decision Constructs', 'Bitwise vs Logical Operators'],
            '10-bitwise-operators': ['Bitwise vs Logical Operators', 'Bitwise', 'Bitwise Operators'],
            '11-operator-precedence': ['Using Operators and Decision Constructs'],
            '12-if-else-statement': ['Using Operators and Decision Constructs', 'Nested if/else', 'Assignment in if condition'],
            '13-switch-statement': ['Switch Statement Fall-Through', 'Switch with Strings'],
            '14-when-to-use-if-else-or-switch': ['Using Operators and Decision Constructs'],
            '15-the-enum-field': ['Working With Java Data Types'],
            '16-random-object': ['Working with Selected classes from the Java API'],
            '17-numeric-method': ['Working With Java Data Types', 'Numeric Literals'],
            '18-string-class': ['String equals', 'String immutability', 'String', 'String Class', 'StringBuilder Class', 'StringBuffer', 'StringBuilder',
                'StringBuffer Class', 'StringBuilder append', 'StringBuilder reverse'
            ],
            '19-printf-method': ['Java Basics'],
            '20-looping-constructs': ['Using Loop Constructs'],
            '21-arrays': ['Creating and Using Arrays'],
            '22-list-object': ['Working with Selected classes from the Java API', 'ArrayList basic', 'ArrayList contains', 'ArrayList remove'],
            '23-set-object': ['Working with Selected classes from the Java API'],
            '24-map-object': ['HashMap put', 'HashMap get', 'HashMap containsKey', 'HashMap size', 'HashMap remove', 'HashMap null key', 'Map', 'Map Object'],
            '25-date-time-api': ['Working with Selected classes from the Java API', 'DateTimeFormatter', 'LocalDate plusDays'],
            '26-exception-handling': ['Handling Exceptions', 'Exception Handling', 'Try-Catch-Finally', 'Checked vs Unchecked Exceptions', 'Exception Hierarchy'],
            '27-oop-overview': ['Working with Methods and Encapsulation'],
            '28-classes-and-objects': ['Working with Methods and Encapsulation'],
            '29-fields-vs-attributes': ['Working with Methods and Encapsulation'],
            '30-getters-and-setters': ['Working with Methods and Encapsulation'],
            '31-constructors': ['Working with Inheritance', 'Constructor Chaining', 'Constructors and super', 'Private Constructor'],
            '32-methods': ['Working with Methods and Encapsulation','Methods', 'Method Declaration and Parameters'],
            '33-this-and-super-calls': ['Working with Inheritance'],
            '34-this-reference-variable': ['Working with Methods and Encapsulation'],
            '35-super-reference-variable': ['Working with Inheritance'],
            '36-method-overloading': ['Working with Methods and Encapsulation', 'Method Overloading'],
            '37-static-vs-instance-methods': ['Working with Methods and Encapsulation', 'Static Method Hiding'],
            '38-method-overriding': ['Working with Inheritance', 'Polymorphism (Method Overriding)'],
            '39-pass-by-value-vs-reference': ['Working with Methods and Encapsulation', 'Pass by Value (object reference)', 'Pass by Value (primitive)'],
            '40-virtual-vs-non-virtual-methods': ['Working with Inheritance',  'Virtual vs Non-Virtual Methods'],
            '41-abstract-classes': ['Abstract Class', 'Abstract Classes'],
            '42-abstract-methods': ['Working with Inheritance'],
            '43-interfaces': ['Working with Inheritance'],
            '44-lambda-expressions': ['Advanced Features', 'Lambda Expressions'],
            '45-inheritance': ['Object-Oriented Programming', 'Inheritance'],
            '46-polymorphism': ['Object-Oriented Programming', 'Polymorphism'],
            '47-abstraction': ['Object-Oriented Programming', 'Abstraction'],
            '48-encapsulation': ['Object-Oriented Programming', 'Encapsulation'],
            '49-packages': ['Advanced Features', 'Packages', 'Package Declarations', 'Static Imports', 
                'Access Modifiers', 
                'Import Statements', 
            ],
            '50-file-io': ['Input/Output', 'File I/O'],
            '51-generics': ['Advanced Features', 'Generics'],
            '52-threads': ['Advanced Features', 'Multithreading'],
            '53-streams-api': ['Advanced Features', 'Streams API'],
            '54-stringbuilder': ['API Classes', 'StringBuilder'],
            '55-varargs': ['Advanced Features', 'Variable Arguments'],
            '56-final-keyword': ['Keywords', 'final keyword'],
            '57-autoboxing-unboxing': ['Advanced Features', 'Autoboxing'],
            '58-access-modifiers': ['Object-Oriented Programming', 'Access Modifiers'],
            '58-working-with-java-data-types': ['Working With Java Data Types', 'Data Types']
        };

        // Load topic metadata from tutorial files
        this.topicMetadata = this.loadTopicMetadata();
    }

    loadTopicMetadata() {
        const tutorialDir = path.join(__dirname, '../../../docs/tutorial');
        const topics = {};

        try {
            const files = fs.readdirSync(tutorialDir);
            
            files.forEach(file => {
                if (file.endsWith('.md') && file !== 'README.md') {
                    const topicId = file.replace('.md', '');
                    const filePath = path.join(tutorialDir, file);
                    
                    try {
                        const content = fs.readFileSync(filePath, 'utf8');
                        const title = this.extractTitleFromMarkdown(content) || this.formatTitle(topicId);
                        const description = this.extractDescriptionFromMarkdown(content) || `Tutorial on ${title}`;
                        
                        topics[topicId] = {
                            id: topicId,
                            title,
                            description
                        };
                    } catch (error) {
                        console.warn(`Warning: Could not read tutorial file ${file}:`, error.message);
                        topics[topicId] = {
                            id: topicId,
                            title: this.formatTitle(topicId),
                            description: `Tutorial on ${this.formatTitle(topicId)}`
                        };
                    }
                }
            });
        } catch (error) {
            console.warn('Warning: Could not load tutorial metadata:', error.message);
        }

        return topics;
    }

    extractTitleFromMarkdown(content) {
        const titleMatch = content.match(/^#\s+(.+)$/m);
        return titleMatch ? titleMatch[1].trim() : null;
    }

    extractDescriptionFromMarkdown(content) {
        const lines = content.split('\n');
        let description = '';
        let foundTitle = false;

        for (const line of lines) {
            if (line.startsWith('# ')) {
                foundTitle = true;
                continue;
            }
            if (foundTitle && line.trim() && !line.startsWith('#')) {
                description = line.trim();
                break;
            }
        }

        return description || null;
    }

    formatTitle(topicId) {
        return topicId
            .replace(/^\d+-/, '') // Remove number prefix
            .replace(/-/g, ' ')   // Replace hyphens with spaces
            .replace(/\b\w/g, c => c.toUpperCase()); // Capitalize words
    }

    getAllTopics() {
        return Object.values(this.topicMetadata);
    }

    getTopicById(topicId) {
        return this.topicMetadata[topicId] || null;
    }

    getQuestionsForTopic(topicId, database) {
        const topicPatterns = this.topicMapping[topicId];
        if (!topicPatterns) {
            return Promise.resolve([]);
        }

        // Build query to find questions matching any of the topic patterns
        const placeholders = topicPatterns.map(() => '?').join(',');
        const query = `
            SELECT * FROM questions 
            WHERE topic IN (${placeholders}) 
            OR domain IN (${placeholders})
            ORDER BY id
        `;
        const params = [...topicPatterns, ...topicPatterns];

        return new Promise((resolve, reject) => {
            database.db.all(query, params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows || []);
                }
            });
        });
    }

    async getTopicWithQuestionCount(topicId, database) {
        const topic = this.getTopicById(topicId);
        if (!topic) {
            return null;
        }

        const questions = await this.getQuestionsForTopic(topicId, database);
        return {
            ...topic,
            questionCount: questions.length
        };
    }

    async getAllTopicsWithQuestionCounts(database) {
        const topics = this.getAllTopics();
        const topicsWithCounts = [];

        for (const topic of topics) {
            const questions = await this.getQuestionsForTopic(topic.id, database);
            topicsWithCounts.push({
                ...topic,
                questionCount: questions.length
            });
        }

        return topicsWithCounts;
    }
}

module.exports = TopicQuestionMapper;
