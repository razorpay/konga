#!/usr/bin/env node

/**
 * Security Configuration Checker for Konga
 * 
 * This script helps verify that your Konga installation has proper security configuration.
 * Run this script before deploying to production.
 */

const crypto = require('crypto');

console.log('🔒 Konga Security Configuration Checker\n');

let hasErrors = false;
let hasWarnings = false;

// Check required environment variables
const requiredEnvVars = [
    'TOKEN_SECRET',
    'JWT_SECRET'
];

console.log('📋 Checking required environment variables...\n');

requiredEnvVars.forEach(envVar => {
    const value = process.env[envVar];
    
    if (!value) {
        console.log(`❌ ERROR: ${envVar} is not set`);
        hasErrors = true;
    } else if (value.includes('your_') || value.includes('_here') || value.includes('example')) {
        console.log(`⚠️  WARNING: ${envVar} appears to be using a placeholder value`);
        hasWarnings = true;
    } else if (value.length < 32) {
        console.log(`⚠️  WARNING: ${envVar} is shorter than recommended (32+ characters)`);
        hasWarnings = true;
    } else {
        console.log(`✅ ${envVar} is properly configured`);
    }
});

// Check for common weak secrets
const weakSecrets = [
    'secret',
    'password',
    '123456',
    'admin',
    'default',
    'oursecret',
    'some_secret_token',
    '8fe171f3-0046-4df5-9216-14099434339f'
];

console.log('\n🔍 Checking for weak secrets...\n');

requiredEnvVars.forEach(envVar => {
    const value = process.env[envVar];
    if (value && weakSecrets.some(weak => value.toLowerCase().includes(weak.toLowerCase()))) {
        console.log(`❌ ERROR: ${envVar} contains a weak or default secret`);
        hasErrors = true;
    }
});

// Check NODE_ENV
console.log('🌍 Checking environment configuration...\n');

if (process.env.NODE_ENV !== 'production') {
    console.log(`⚠️  WARNING: NODE_ENV is set to '${process.env.NODE_ENV || 'undefined'}' (should be 'production' for production deployments)`);
    hasWarnings = true;
} else {
    console.log('✅ NODE_ENV is set to production');
}

// Generate secure secrets if needed
console.log('\n🔧 Security recommendations...\n');

if (hasErrors) {
    console.log('📝 To generate secure secrets, run these commands:\n');
    console.log(`export TOKEN_SECRET="${crypto.randomBytes(64).toString('hex')}"`);
    console.log(`export JWT_SECRET="${crypto.randomBytes(64).toString('hex')}"`);
    console.log('\nOr add them to your .env file:\n');
    console.log(`TOKEN_SECRET=${crypto.randomBytes(64).toString('hex')}`);
    console.log(`JWT_SECRET=${crypto.randomBytes(64).toString('hex')}`);
}

// Summary
console.log('\n📊 Security Check Summary\n');

if (hasErrors) {
    console.log('❌ CRITICAL: Security configuration has errors that must be fixed before production deployment');
    process.exit(1);
} else if (hasWarnings) {
    console.log('⚠️  WARNING: Security configuration has warnings that should be addressed');
    process.exit(0);
} else {
    console.log('✅ SUCCESS: Security configuration looks good!');
    process.exit(0);
} 