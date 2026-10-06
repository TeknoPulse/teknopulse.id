## 2026-10-24 - DOM-based XSS in Pagefind search component
**Vulnerability:** String concatenation of `data.meta.title` and `data.url` inside `innerHTML` assignment in the search component.
**Learning:** Using template literals to inject dynamically retrieved data directly into HTML can lead to XSS if the data isn't properly sanitized. It's safer to use DOM APIs like `document.createElement()` and `textContent` for dynamic values.
**Prevention:** Use DOM manipulation functions (`createElement`, `textContent`) over `innerHTML`, especially for rendering untrusted or dynamic content. Only use `innerHTML` when strictly required and the content is known to be pre-sanitized (like Pagefind's excerpt).
