# jsonclip 📋

> Zero-config JSON formatter and inspector for your clipboard data.

**jsonclip** is a CLI tool that reads JSON from your system clipboard, validates it, formats it beautifully, and provides quick data inspection. Perfect for API testing, debugging, and quick data analysis without switching contexts.

## Why jsonclip?

You've been there: you copy a JSON response from an API, a browser DevTools panel, or a log file. Now you want to:
- ✅ Validate that it's actually valid JSON
- 📖 Read it without squinting at minified text
- 🔍 Extract a specific value quickly
- 📤 Copy the formatted result back to clipboard

**jsonclip** does all of this in one command—no piping, no config files, no setup.

## Features

- 📋 **Clipboard-aware**: Automatically reads from your system clipboard
- ✅ **Validation**: Clear error messages when JSON is invalid
- 🎨 **Syntax highlighting**: Colorized output with `chalk`
- 🔍 **Quick extraction**: Get specific paths with `--path`
- 📤 **Write back**: Save formatted JSON to clipboard with `--copy`
- 📥 **stdin support**: Use with pipes (`cat file.json | jsonclip`)
- 🌐 **Cross-platform**: Works on macOS, Linux, and Windows
- 🪶 **Zero dependencies**: Only uses Node.js built-ins and clipboardy
- ⚡ **Lightweight**: Single file, ~150 lines of clean code

## Installation

### Global (recommended)

```bash
npm install -g jsonclip
```

### Local

```bash
npm install jsonclip
npx jsonclip
```

## Usage

### Basic: Format clipboard JSON

```bash
# Copy some JSON to clipboard, then run:
jsonclip

# Output: Beautifully formatted JSON with syntax highlighting
{
  "name": "jsonclip",
  "version": "1.0.0",
  "features": ["validation", "formatting", "extraction"]
}
```

### Extract specific values

```bash
# Get a nested value
jsonclip --path user.name
jsonclip --path data.items[0].price

# Output: Just the value, no JSON
"John Doe"
```

### Write formatted JSON back to clipboard

```bash
# Validate, format, and copy back
jsonclip --copy
```

### Use with pipes

```bash
# Format JSON from a file
cat response.json | jsonclip

# Format from curl output
curl -s https://api.github.com/repos/zethrus/jsonclip | jsonclip

# Extract from a file
cat data.json | jsonclip --path users[0].email
```

### Compact mode (no colors)

```bash
jsonclip --no-color
```

## Examples

### API Debugging Workflow

```bash
# 1. Make a request (output is minified JSON)
curl -s https://api.github.com/users/zethrus

# 2. Copy to clipboard, format and inspect
jsonclip --path public_repos
# Output: 42

# 3. Get the full formatted data
jsonclip --copy
```

### Quick Data Extraction

```bash
# Extract multiple values at once
jsonclip --path user.name && jsonclip --path user.email
```

### Validate JSON

```bash
# Copy text to clipboard, run:
jsonclip

# If invalid:
# ❌ Invalid JSON: Unexpected token } in JSON at position 45
#    Line 3: "name": "test", }
#                        ^
```

## Error Handling

jsonclip provides helpful error messages:

```
❌ Invalid JSON: Unexpected token } in JSON at position 45
   Line 3: "name": "test", }
                       ^

💡 Common fixes:
   - Check for trailing commas
   - Ensure quotes around keys and string values
   - Verify brackets and braces are balanced
```

## API Reference

| Option | Description |
|--------|-------------|
| `-p, --path <path>` | Extract value at JSONPath (e.g., `data.items[0]`) |
| `-c, --copy` | Write formatted JSON back to clipboard |
| `--no-color` | Disable syntax highlighting |
| `-h, --help` | Show help message |
| `-v, --version` | Show version number |

## Path Syntax

The `--path` option uses simple dot notation:

- `user.name` → `data.user.name`
- `items[0]` → First element of `items` array
- `data.users[2].email` → Email of third user

## Platform Support

| Platform | Clipboard |
|----------|-----------|
| macOS | ✅ Native |
| Linux | ✅ xclip/xsel fallback |
| Windows | ✅ Native |

## Development

```bash
# Clone and link
git clone https://github.com/zethrus/jsonclip.git
cd jsonclip
npm link

# Run tests (if added)
npm test
```

## Contributing

Contributions welcome! Please keep it:
- 🪶 Minimal and focused
- 🧹 Clean and readable
- 📖 Well-documented

## License

MIT © BootKode Technologies

## Author

Created by **Ava** (@BootKode) - BootKode's AI Executive Assistant

---

**Stop squinting at minified JSON. Format it in one command.**

`jsonclip` — because your clipboard deserves better.
