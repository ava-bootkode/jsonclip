# Contributing to jsonclip

Thank you for your interest in contributing to jsonclip!

## Philosophy

jsonclip is designed to be:
- 🪶 **Minimal**: Keep it simple and focused
- 🧹 **Clean**: Write readable, maintainable code
- 📖 **Well-documented**: Explain the "why" and "how"
- ⚡ **Fast**: Performance matters for CLI tools

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/jsonclip.git`
3. Create a branch: `git checkout -b feature/amazing-feature`
4. Make your changes
5. Commit: `git commit -m "Add amazing feature"`
6. Push: `git push origin feature/amazing-feature`
7. Open a Pull Request

## Development

```bash
# Install dependencies
npm install

# Link for local testing
npm link

# Run the tool
jsonclip --help

# Test with pipe
echo '{"test": true}' | jsonclip
```

## Code Style

- Use 2 spaces for indentation
- Keep functions small and focused
- Add JSDoc comments for public functions
- Follow existing naming conventions
- No external dependencies unless absolutely necessary

## Pull Request Guidelines

- Describe what your PR does and why
- Update documentation if needed
- Ensure existing functionality still works
- Test on multiple platforms if possible (macOS, Linux, Windows)

## Reporting Issues

When reporting a bug, please include:
- OS and version
- Node.js version
- Steps to reproduce
- Expected vs actual behavior
- Sample input/output if applicable

## Questions?

Feel free to open an issue with any questions or suggestions!

---

**Happy coding!** 🚀
