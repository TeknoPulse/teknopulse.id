# Contributing to TeknoPulse

Thank you for your interest in contributing to TeknoPulse! This document provides guidelines and information for contributors.

## Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/your-username/teknopulse.git
   cd teknopulse
   ```
3. Install dependencies:
   ```bash
   pnpm install
   ```
4. Create a new branch for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Running the Project

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Run linting
pnpm lint

# Fix linting issues
pnpm lint:fix
```

### Code Style

We use ESLint and Prettier to maintain consistent code style:

- **ESLint**: Enforces code quality rules
- **Prettier**: Handles code formatting
- **EditorConfig**: Ensures consistent editor settings

Before committing, run:

```bash
pnpm lint:fix
```

### Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

#### Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools

#### Examples

```bash
feat: add search functionality to header
fix: resolve mobile navigation toggle issue
docs: update installation instructions
style: format code with prettier
refactor: extract reusable button component
```

## Content Guidelines

### Writing Blog Posts

When contributing blog posts:

1. Use the post creation script:

   ```bash
   pnpm post:new "Your Post Title"
   ```

2. Follow the content structure:
   - **Title**: Clear and descriptive
   - **Summary**: 1-2 sentences explaining the post
   - **Tags**: Relevant keywords (3-5 tags)
   - **Category**: One of: AI, Cloud, Security, DevTools, Policy
   - **Content**: Well-structured with headings and paragraphs

3. Content quality standards:
   - Write in Indonesian (primary language)
   - Use clear, concise language
   - Include relevant examples and links
   - Ensure technical accuracy
   - Add appropriate images with alt text

### Content Categories

- **AI**: Artificial Intelligence, Machine Learning, Neural Networks
- **Cloud**: Cloud Computing, AWS, Azure, GCP, Infrastructure
- **Security**: Cybersecurity, Data Protection, Privacy, Compliance
- **DevTools**: Development Tools, IDEs, Frameworks, Libraries
- **Policy**: Technology Policy, Regulations, Legal, Ethics

## Component Development

### Creating Components

1. Place components in `src/components/`
2. Use TypeScript for type safety
3. Follow Astro component conventions
4. Include proper props interfaces
5. Add accessibility attributes
6. Ensure responsive design

### Component Example

```astro
---
interface Props {
  title: string;
  description?: string;
  variant?: 'primary' | 'secondary';
}

const { title, description, variant = 'primary' } = Astro.props;
---

<div class={`component ${variant}`}>
  <h2>{title}</h2>
  {description && <p>{description}</p>}
</div>

<style>
  .component {
    /* Component styles */
  }
</style>
```

## Testing

### Manual Testing

Before submitting a PR:

1. Test on different screen sizes
2. Verify dark/light theme switching
3. Check accessibility with screen readers
4. Test search functionality
5. Verify all links work correctly

### Performance Testing

Run Lighthouse audits to ensure:

- Performance: 95+
- Accessibility: 100
- Best Practices: 100
- SEO: 100

## Pull Request Process

1. **Create a descriptive PR title** following conventional commits
2. **Fill out the PR template** with:
   - Description of changes
   - Type of change (feature, bugfix, etc.)
   - Testing performed
   - Screenshots (if applicable)
3. **Ensure all checks pass**:
   - Linting passes
   - Build succeeds
   - No TypeScript errors
4. **Request review** from maintainers
5. **Address feedback** promptly

### PR Template

```markdown
## Description

Brief description of changes made.

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Code refactoring

## Testing

- [ ] Tested locally
- [ ] Responsive design verified
- [ ] Accessibility checked
- [ ] Performance tested

## Screenshots

If applicable, add screenshots to help explain your changes.
```

## Issue Reporting

When reporting issues:

1. **Use issue templates** when available
2. **Provide clear reproduction steps**
3. **Include environment information**:
   - Browser and version
   - Operating system
   - Node.js version
4. **Add screenshots** if relevant
5. **Check for existing issues** first

## Documentation

### Updating Documentation

- Update README.md for significant changes
- Add JSDoc comments for functions
- Update component prop interfaces
- Include examples in documentation

### Writing Style

- Use clear, concise language
- Include code examples
- Add links to relevant resources
- Keep documentation up-to-date

## Community Guidelines

### Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Respect different viewpoints and experiences

### Communication

- Use GitHub issues for bug reports and feature requests
- Use GitHub discussions for questions and general discussion
- Be patient and helpful in code reviews
- Provide context in your communications

## Getting Help

If you need help:

1. Check the documentation
2. Search existing issues
3. Ask in GitHub discussions
4. Contact maintainers via email

## Recognition

Contributors will be recognized in:

- GitHub contributors list
- Release notes for significant contributions
- Special mentions for outstanding contributions

Thank you for contributing to TeknoPulse! 🚀
