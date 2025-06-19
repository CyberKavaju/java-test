const fs = require('fs');
const path = require('path');

class TopicQuestionMapper {
    constructor() {
        // Map tutorial topic IDs to database topic/domain patterns
        this.topicMapping = {
            '01-main-characteristics-of-java': ['Java Basics', 'Language Features', 'Main Characteristics of Java'],
            '02-simple-execution-of-java-program': ['Java Basics', 'Program Execution'],
            '03-multiple-classes-in-one-java-file': ['Java Basics', 'Classes'],
            '04-variable': ['Working With Java Data Types', 'Variable', 'Data Types'],
            '05-variable-casting-and-conversions': ['Working With Java Data Types', 'Variable', 'Type Casting'],
            '06-scanner-input-object': ['Input/Output', 'Scanner'],
            '07-operators': ['Operators', 'Arithmetic Operators'],
            '08-comparison-operators': ['Operators', 'Comparison Operators'],
            '09-logical-operators': ['Operators', 'Logical Operators'],
            '10-bitwise-operators': ['Operators', 'Bitwise Operators'],
            '11-operator-precedence': ['Operators', 'Operator Precedence'],
            '12-if-else-statement': ['Flow Control', 'Decision Making', 'Conditional Statements'],
            '13-switch-statement': ['Flow Control', 'Switch Statement'],
            '14-when-to-use-if-else-or-switch': ['Flow Control', 'Decision Making'],
            '15-the-enum-field': ['Enums', 'Data Types'],
            '16-random-object': ['API Classes', 'Random'],
            '17-numeric-method': ['API Classes', 'Math', 'Numeric Methods'],
            '18-string-class': ['API Classes', 'String'],
            '19-printf-method': ['Input/Output', 'Formatting'],
            '20-looping-constructs': ['Flow Control', 'Loops'],
            '21-arrays': ['Arrays', 'API Classes'],
            '22-list-object': ['Collections', 'List'],
            '23-set-object': ['Collections', 'Set'],
            '24-map-object': ['Collections', 'Map'],
            '25-date-time-api': ['API Classes', 'Date/Time'],
            '26-exception-handling': ['Exception Handling', 'Error Handling'],
            '27-oop-overview': ['Object-Oriented Programming', 'OOP Concepts'],
            '28-classes-and-objects': ['Object-Oriented Programming', 'Classes', 'Objects'],
            '29-fields-vs-attributes': ['Object-Oriented Programming', 'Class Members'],
            '30-getters-and-setters': ['Object-Oriented Programming', 'Encapsulation'],
            '31-constructors': ['Object-Oriented Programming', 'Constructors'],
            '32-methods': ['Object-Oriented Programming', 'Methods'],
            '33-this-and-super-calls': ['Object-Oriented Programming', 'Keywords'],
            '34-this-reference-variable': ['Object-Oriented Programming', 'this keyword'],
            '35-super-reference-variable': ['Object-Oriented Programming', 'super keyword'],
            '36-method-overloading': ['Object-Oriented Programming', 'Method Overloading'],
            '37-static-vs-instance-methods': ['Object-Oriented Programming', 'Static Methods'],
            '38-method-overriding': ['Object-Oriented Programming', 'Method Overriding'],
            '39-pass-by-value-vs-reference': ['Object-Oriented Programming', 'Parameter Passing'],
            '40-virtual-vs-non-virtual-methods': ['Object-Oriented Programming', 'Virtual Methods'],
            '41-abstract-classes': ['Object-Oriented Programming', 'Abstract Classes'],
            '42-abstract-methods': ['Object-Oriented Programming', 'Abstract Methods'],
            '43-interfaces': ['Object-Oriented Programming', 'Interfaces'],
            '44-lambda-expressions': ['Advanced Features', 'Lambda Expressions'],
            '45-inheritance': ['Object-Oriented Programming', 'Inheritance'],
            '46-polymorphism': ['Object-Oriented Programming', 'Polymorphism'],
            '47-abstraction': ['Object-Oriented Programming', 'Abstraction'],
            '48-encapsulation': ['Object-Oriented Programming', 'Encapsulation'],
            '49-packages': ['Advanced Features', 'Packages'],
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
