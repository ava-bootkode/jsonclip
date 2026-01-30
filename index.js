#!/usr/bin/env node

/**
 * jsonclip - Zero-config JSON formatter and inspector for clipboard data
 *
 * A clean, minimal CLI tool that reads JSON from clipboard or stdin,
 * validates it, formats it beautifully, and enables quick data extraction.
 *
 * @author BootKode Technologies <ava@bootkode.com>
 * @license MIT
 */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const clipboardy = require('clipboardy');

// ============================================================================
// PARSING & VALIDATION
// ============================================================================

/**
 * Parse JSON with helpful error messages
 * @param {string} str - JSON string to parse
 * @returns {Object} - Parsed JSON object
 * @throws {Error} - With detailed error context
 */
function safeParse(str) {
  try {
    return JSON.parse(str);
  } catch (err) {
    const lines = str.split('\n');
    const pos = err.message.match(/position (\d+)/);
    if (pos) {
      const position = parseInt(pos[1]);
      let line = 1, col = 1;
      let chars = 0;
      for (let i = 0; i < lines.length; i++) {
        if (chars + lines[i].length >= position) {
          line = i + 1;
          col = position - chars + 1;
          break;
        }
        chars += lines[i].length + 1;
      }

      const errorLine = lines[line - 1] || '';
      const pointer = ' '.repeat(col - 1) + '^';

      throw new Error(
        `${err.message.split('JSON at position')[0]}\n` +
        `   Line ${line}: ${errorLine}\n` +
        `            ${pointer}\n\n` +
        `💡 Common fixes:\n` +
        `   - Check for trailing commas\n` +
        `   - Ensure quotes around keys and string values\n` +
        `   - Verify brackets and braces are balanced`
      );
    }
    throw err;
  }
}

// ============================================================================
// SYNTAX HIGHLIGHTING
// ============================================================================

/**
 * Highlight JSON syntax with colors
 * @param {any} value - Value to highlight
 * @param {number} indent - Current indentation level
 * @returns {string} - Colorized string
 */
function highlightJson(value, indent = 0) {
  const pad = '  '.repeat(indent);

  if (value === null) {
    return chalk.red('null');
  }

  if (typeof value === 'string') {
    return chalk.green(`"${value}"`);
  }

  if (typeof value === 'number') {
    return chalk.blue(String(value));
  }

  if (typeof value === 'boolean') {
    return chalk.yellow(String(value));
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return '[]';
    }
    const items = value.map(item => highlightJson(item, indent + 1));
    return `[\n${pad}  ${items.join(`,\n${pad}  `)}\n${pad}]`;
  }

  if (typeof value === 'object') {
    const keys = Object.keys(value);
    if (keys.length === 0) {
      return '{}';
    }
    const entries = keys.map(key =>
      `${chalk.cyan(`"${key}"`)}: ${highlightJson(value[key], indent + 1)}`
    );
    return `{\n${pad}  ${entries.join(`,\n${pad}  `)}\n${pad}}`;
  }

  return String(value);
}

// ============================================================================
// PATH EXTRACTION
// ============================================================================

/**
 * Extract value from object using dot notation
 * @param {Object} obj - Source object
 * @param {string} path - Dot notation path (e.g., "users[0].name")
 * @returns {any} - Extracted value or undefined
 */
function extractPath(obj, path) {
  const parts = path.split(/\.|\[|\]/).filter(p => p !== '');
  let current = obj;

  for (const part of parts) {
    if (current == null) {
      return undefined;
    }
    if (Array.isArray(current) && /^\d+$/.test(part)) {
      current = current[parseInt(part)];
    } else if (typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      return undefined;
    }
  }

  return current;
}

// ============================================================================
// CLI
// ============================================================================

async function main() {
  const args = process.argv.slice(2);
  const options = {
    path: null,
    copy: false,
    color: true
  };

  // Parse arguments
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '-p' || arg === '--path') {
      options.path = args[++i];
    } else if (arg === '-c' || arg === '--copy') {
      options.copy = true;
    } else if (arg === '--no-color') {
      options.color = false;
    } else if (arg === '-h' || arg === '--help') {
      console.log(`
jsonclip - Zero-config JSON formatter and inspector

USAGE:
  jsonclip [OPTIONS]

OPTIONS:
  -p, --path <path>    Extract value at JSONPath (e.g., user.name)
  -c, --copy           Write formatted JSON back to clipboard
  --no-color           Disable syntax highlighting
  -h, --help           Show this help message
  -v, --version        Show version number

EXAMPLES:
  jsonclip                           Format clipboard JSON
  jsonclip --path user.name          Extract nested value
  jsonclip --copy                    Format and copy back to clipboard
  cat data.json | jsonclip           Format from stdin
  curl -s api.example.com | jsonclip Format API response

Read more at: https://github.com/zethrus/jsonclip
      `.trim());
      process.exit(0);
    } else if (arg === '-v' || arg === '--version') {
      const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
      console.log(`jsonclip v${pkg.version}`);
      process.exit(0);
    }
  }

  // Read JSON from stdin or clipboard
  let jsonStr;
  if (!process.stdin.isTTY) {
    jsonStr = await new Promise(resolve => {
      let data = '';
      process.stdin.on('data', chunk => data += chunk);
      process.stdin.on('end', () => resolve(data.trim()));
    });
  } else {
    try {
      jsonStr = await clipboardy.read();
    } catch (err) {
      console.error(chalk.red('❌ Failed to read clipboard. Please copy JSON first.'));
      console.error(chalk.gray(`   ${err.message}`));
      process.exit(1);
    }
  }

  if (!jsonStr) {
    console.error(chalk.red('❌ No JSON data found.'));
    console.error(chalk.gray('   Copy JSON to clipboard or pipe via stdin.'));
    process.exit(1);
  }

  // Parse and validate
  let data;
  try {
    data = safeParse(jsonStr);
  } catch (err) {
    console.error(chalk.red('❌ Invalid JSON:'));
    console.error(chalk.gray(err.message));
    process.exit(1);
  }

  // Extract path if specified
  if (options.path) {
    const value = extractPath(data, options.path);
    if (value === undefined) {
      console.error(chalk.red(`❌ Path not found: ${options.path}`));
      process.exit(1);
    }
    const formatted = options.color
      ? highlightJson(value)
      : JSON.stringify(value, null, 2);
    console.log(formatted);
    if (options.copy) {
      await clipboardy.write(typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value));
      console.log(chalk.gray('✓ Copied to clipboard'));
    }
    return;
  }

  // Format and output
  const formatted = options.color
    ? highlightJson(data)
    : JSON.stringify(data, null, 2);

  console.log(formatted);

  // Copy back if requested
  if (options.copy) {
    await clipboardy.write(JSON.stringify(data, null, 2));
    console.log(chalk.gray('✓ Formatted JSON copied to clipboard'));
  }
}

// Run
main().catch(err => {
  console.error(chalk.red('❌ Unexpected error:'));
  console.error(chalk.gray(err.message));
  process.exit(1);
});
