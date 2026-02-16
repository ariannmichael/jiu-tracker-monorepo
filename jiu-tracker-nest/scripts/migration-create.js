#!/usr/bin/env node
'use strict';

const path = require('path');
const { spawnSync } = require('child_process');

// First argument is the migration path (optional)
const args = process.argv.slice(2);
const migrationPath = args[0] || 'src/migrations/NewMigration';

const cliPath = require.resolve('typeorm/cli.js');
const node = process.execPath;
const cwd = path.resolve(__dirname, '..');

const result = spawnSync(
  node,
  [
    '-r', 'tsconfig-paths/register',
    '-r', 'ts-node/register',
    cliPath,
    'migration:create',
    migrationPath,
  ],
  { cwd, stdio: 'inherit' }
);

process.exit(result.status ?? 1);
