#!/usr/bin/env node

// Simple test runner to debug Jest hanging issues
console.log('Starting debug test runner...');

// Test basic functionality
try {
    console.log('Testing require paths...');
    
    // Test if basic modules load
    const path = require('path');
    const fs = require('fs');
    console.log('✓ Basic Node modules loaded');
    
    // Test if project modules load
    const dbPath = path.join(__dirname, 'src', 'database', 'Database.js');
    console.log('Testing Database module at:', dbPath);
    
    if (fs.existsSync(dbPath)) {
        console.log('✓ Database file exists');
        try {
            const Database = require('./src/database/Database.js');
            console.log('✓ Database module loaded');
        } catch (err) {
            console.error('✗ Error loading Database:', err.message);
        }
    }
    
    // Test testServer
    const testServerPath = path.join(__dirname, 'tests', 'testServer.js');
    console.log('Testing testServer module at:', testServerPath);
    
    if (fs.existsSync(testServerPath)) {
        console.log('✓ testServer file exists');
        try {
            const testServer = require('./tests/testServer.js');
            console.log('✓ testServer module loaded');
        } catch (err) {
            console.error('✗ Error loading testServer:', err.message);
        }
    }
    
    console.log('Debug test completed successfully');
    
} catch (error) {
    console.error('Debug test failed:', error);
    process.exit(1);
}
