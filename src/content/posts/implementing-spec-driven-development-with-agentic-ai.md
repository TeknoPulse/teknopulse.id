---
title: 'Implementing Spec-Driven Development with Agentic AI'
summary: 'Learn how to implement spec-driven AI development with structured specs, tool comparisons, and a step-by-step API tutorial.'
publishedAt: 2026-07-24T13:03:31+07:00
tags:
  - 'Agentic AI'
  - 'Spec-Driven Development'
  - 'AI Coding Assistants'
  - 'Developer Productivity'
  - 'Vibe Coding'
category: Developer
author: 'TeknoPulse'
draft: false
format: panduan-pembaca
source:
  - name: 'GitHub Copilot documentation'
    url: 'https://docs.github.com/en/copilot'
    primary: true
  - name: 'Amazon Kiro documentation'
    url: 'https://kiro.dev/docs/'
  - name: 'Cursor documentation'
    url: 'https://docs.cursor.com/'
---

# Implementing Spec-Driven Development with Agentic AI

In the rapidly evolving world of software development, the rise of Agentic AI — autonomous coding assistants capable of generating entire applications from natural language prompts — has introduced both incredible opportunities and new pitfalls. One of the most common pitfalls is "vibe coding": the practice of giving an AI agent a loose idea or vague description and letting it run wild. While this approach can work for small prototypes, it quickly leads to inconsistent, unmaintainable, and non-compliant codebases.

This tutorial will walk you through **spec-driven AI development**, a disciplined approach where structured specifications guide every step of your AI-assisted workflow. By the end, you'll know how to write effective specs, choose the right tools, and build a small API with explicit validation and error behavior. The example is an educational starting point, not a guarantee of regulatory compliance.

---

## The Problem with Vibe Coding: Why Agentic AI Needs Structured Specs

Agentic AI systems like GitHub Copilot, Amazon Kiro, and Cursor are powerful — but they're also highly suggestible. Without clear direction, they tend to:

- **Hallucinate features** not requested or needed.
- **Ignore best practices** such as input validation, error handling, and security standards.
- **Produce inconsistent code** across modules due to lack of shared context.
- **Miss required controls** because security, privacy, and compliance requirements were never explicitly defined.

Vibe coding may seem fast, but it trades speed for reliability. In contrast, **spec-driven development** ensures that every line of code aligns with a documented plan. It gives your AI agent a blueprint to follow, reducing ambiguity and increasing output quality.

Structured specs serve three key roles:

1. **Blueprint**: A precise definition of what to build.
2. **Contract**: A reference point for testing and validation.
3. **Documentation**: A living artifact that evolves alongside the project.

---

## Anatomy of a Spec: Structuring Your `.spec.md` and `.prompt.md` Files

To implement spec-driven development effectively, you need two core files:

### `.spec.md`

This file defines the technical requirements and constraints. It should include:

- **Overview**: High-level summary of the system or feature.
- **Requirements**: Functional and non-functional requirements listed clearly.
- **API Endpoints**: For APIs, define routes, methods, parameters, and response formats.
- **Data Models**: Schema definitions for databases or data structures.

For a small greeting API, a useful specification might look like this:

```text
# Greeting API

## Requirements
- GET /greet?name=... returns a JSON greeting.
- The name must contain between 1 and 50 non-whitespace characters.
- Missing or invalid names return HTTP 400 with a JSON error object.
- The server returns JSON and does not store the request data.

## Acceptance criteria
- GET /greet?name=Ada returns 200 and includes "Hello, Ada!".
- GET /greet without a name returns 400.
- GET /greet?name=%20 returns 400.
```

### `.prompt.md`

The prompt turns the specification into an executable instruction for an AI agent. It should define the task, boundaries, files the agent may change, and how the result will be checked. Keep it specific enough that the agent does not need to invent product decisions.

```text
Implement the Greeting API described in .spec.md.

Constraints:
- Use Node.js built-in modules only.
- Keep the implementation in server.mjs.
- Validate and trim the name before constructing the response.
- Return JSON for both success and error responses.
- Do not add persistence, authentication, or endpoints not listed in the spec.

Before finishing:
1. Run node server.mjs.
2. Test a valid request and an invalid request with curl.
3. Explain how each acceptance criterion is satisfied.
```

The specification states what the system must do; the prompt tells the agent how to work without expanding the scope. Treat both as reviewable artifacts. If the implementation needs a new behavior, update the spec first rather than silently changing the contract.

## Choosing a Tool

The tools below support different workflows, so the right choice depends on how your team works:

- **GitHub Copilot** fits teams already working in GitHub and supported editors. Its documentation covers editor assistance, chat, and repository-oriented workflows. It is a natural choice when pull requests and existing repository permissions are central to the process.
- **Amazon Kiro** is designed around specifications, steering files, and task-oriented development. It may be a good fit when you want requirements and implementation tasks to be visible parts of the workflow.
- **Cursor** is an AI-focused editor with codebase context and project rules. It can be useful when developers want to keep repository-specific instructions close to the code while iterating in an editor.

These products change quickly and their features and pricing vary. Evaluate them against the same checklist: how they load repository context, how they handle sensitive code, whether generated changes are reviewable, and how well they support your test and approval process. A tool does not replace the specification or the human review step.

## Step-by-Step API Example

The following implementation uses only Node.js built-in modules. Save it as `server.mjs` next to the specification:

```js
import { createServer } from 'node:http';
import { URL } from 'node:url';

const port = 3000;

function sendJson(response, status, body) {
  response.writeHead(status, { 'content-type': 'application/json; charset=utf-8' });
  response.end(JSON.stringify(body));
}

const server = createServer((request, response) => {
  const requestUrl = new URL(request.url ?? '/', `http://${request.headers.host ?? 'localhost'}`);

  if (request.method !== 'GET' || requestUrl.pathname !== '/greet') {
    sendJson(response, 404, { error: 'Not found' });
    return;
  }

  const name = requestUrl.searchParams.get('name')?.trim() ?? '';
  if (name.length === 0 || name.length > 50) {
    sendJson(response, 400, { error: 'name must contain 1 to 50 characters' });
    return;
  }

  sendJson(response, 200, { message: `Hello, ${name}!` });
});

server.listen(port, () => {
  console.log(`Greeting API listening on http://localhost:${port}`);
});
```

Run and check it:

```bash
node server.mjs
curl 'http://localhost:3000/greet?name=Ada'
# {"message":"Hello, Ada!"}

curl -i 'http://localhost:3000/greet'
# HTTP/1.1 400 Bad Request
```

The implementation maps directly to the specification: the route and method are constrained, input is trimmed and length-checked, success returns status 200, and invalid input returns status 400. In a real project, add automated tests, authentication, rate limiting, logging policies, and privacy controls when the requirements call for them. Do not claim compliance merely because those controls appear in a prompt.

## Review the Agent's Output

After the agent proposes a change, review it against the specification rather than judging it only by whether it runs. Check each acceptance criterion, inspect the diff for unrequested files or behavior, and run the tests yourself. Ask the agent to identify any requirement it could not verify. This creates a useful audit trail and makes omissions visible before they reach production.

If a requirement is ambiguous, stop and clarify it. A short question in the specification is cheaper than a hidden assumption in the code. Once the API passes the acceptance criteria, update the specification if the final design intentionally differs from the original plan.

## Conclusion

Spec-driven development gives agentic AI a smaller, clearer target. A good `.spec.md` defines the contract, a focused `.prompt.md` defines the implementation boundaries, and acceptance criteria make the result testable. Tool choice matters, but disciplined review matters more. Start with a small feature, make every requirement explicit, and require evidence that the generated code satisfies the contract before merging it.
