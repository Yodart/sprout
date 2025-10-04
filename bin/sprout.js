#!/usr/bin/env node

const { run } = require('../src/cli');

run().catch(error => {
  console.error('Unexpected error:', error);
  process.exit(1);
});