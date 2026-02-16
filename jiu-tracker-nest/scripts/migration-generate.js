#!/usr/bin/env node
'use strict';

const path = require('path');
const { spawnSync } = require('child_process');

// First non-option argument is the migration path; options (e.g. --check) are passed through
const args = process.argv.slice(2);
const pathIndex = args.findIndex((a) => !a.startsWith('-'));
const migrationPath = pathIndex >= 0 ? args[pathIndex] : 'src/migrations/GeneratedMigration';
const extraArgs = pathIndex >= 0 ? [...args.slice(0, pathIndex), ...args.slice(pathIndex + 1)] : args;

const cliPath = require.resolve('typeorm/cli.js');
const node = process.execPath;
const cwd = path.resolve(__dirname, '..');

const result = spawnSync(
  node,
  [
    '-r', 'tsconfig-paths/register',
    '-r', 'ts-node/register',
    cliPath,
    'migration:generate',
    migrationPath,
    '-d', 'src/data-source.ts',
    ...extraArgs,
  ],
  { cwd, stdio: 'inherit' }
);

process.exit(result.status ?? 1);
