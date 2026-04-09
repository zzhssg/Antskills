#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

function ensureString(value, key) {
  if (typeof value !== 'string' || value.trim() === '') {
    fail(`Expected non-empty string for "${key}"`);
  }
}

function ensureObject(value, key) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    fail(`Expected object for "${key}"`);
  }
}

function ensureNumber(value, key) {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    fail(`Expected number for "${key}"`);
  }
}

function validate(payload) {
  ensureString(payload.description, 'description');
  ensureObject(payload.nicknames, 'nicknames');
  ensureString(payload.consensus, 'consensus');
  ensureObject(payload._selfScore, '_selfScore');
  ensureNumber(payload._selfScore.score, '_selfScore.score');
  ensureString(payload._selfScore.reason, '_selfScore.reason');
}

function main() {
  const [, , filePath] = process.argv;
  if (!filePath) fail('Usage: node scripts/validate-ai-output.js <file>');
  const resolved = path.resolve(filePath);
  const payload = JSON.parse(fs.readFileSync(resolved, 'utf8'));
  validate(payload);
  console.log('OK: scanner output is structurally valid');
}

main();
