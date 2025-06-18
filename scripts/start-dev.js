#!/usr/bin/env node
/* eslint-disable no-console */

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting development server...');
console.log('📁 Working directory:', process.cwd());
console.log('🔧 Node version:', process.version);
console.log('🌍 Environment:', process.env.NODE_ENV || 'development');

// Set environment variables
process.env.NODE_ENV = 'development';
process.env.PORT = process.env.PORT || '3000';

// Load .env file
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

console.log('\n📋 Configuration:');
console.log('  NEO4J_URI:', process.env.NEO4J_URI);
console.log('  PORT:', process.env.PORT);
console.log('  NODE_ENV:', process.env.NODE_ENV);

// Check if Neo4j is accessible
const neo4j = require('neo4j-driver');
const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

console.log('\n🔍 Checking Neo4j connection...');
driver
  .verifyConnectivity()
  .then(() => {
    console.log('✅ Neo4j connection successful!');
    driver.close();

    // Start Next.js
    console.log('\n🚀 Starting Next.js...\n');
    const next = spawn('npx', ['next', 'dev'], {
      stdio: 'inherit',
      env: process.env,
    });

    next.on('close', (code) => {
      console.log(`\n❌ Next.js exited with code ${code}`);
      process.exit(code);
    });

    // Handle process termination
    process.on('SIGINT', () => {
      console.log('\n⏹️  Shutting down...');
      next.kill('SIGINT');
      process.exit(0);
    });
  })
  .catch((error) => {
    console.error('❌ Neo4j connection failed:', error.message);
    console.error('\n💡 Tips:');
    console.error('  1. Check if Neo4j is running: docker ps | grep neo4j');
    console.error('  2. Start Neo4j: docker start grafopptak-neo4j');
    console.error('  3. Check .env file configuration');
    driver.close();
    process.exit(1);
  });
