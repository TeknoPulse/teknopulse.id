#!/usr/bin/env node

import { writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const args = process.argv.slice(2);
const title = args[0];

if (!title) {
  console.error('Usage: pnpm post:new "Your Post Title"');
  process.exit(1);
}

const slug = title
  .toLowerCase()
  .replace(/[^a-z0-9\s-]/g, '')
  .replace(/\s+/g, '-')
  .replace(/-+/g, '-')
  .trim('-');

const now = new Date();
const publishedAt = now.toISOString();

const categories = ['AI', 'Cloud', 'Security', 'DevTools', 'Policy'];
console.log('Available categories:', categories.join(', '));
const category = 'AI'; // Default category, can be changed manually

const frontmatter = `---
title: "${title}"
slug: "${slug}"
summary: "Add a brief summary of your post here."
publishedAt: ${publishedAt}
updatedAt: ${publishedAt}
tags: ["tag1", "tag2"]
category: ${category}
author: "Your Name"
coverImage: "https://via.placeholder.com/1200x630/FF5733/FFFFFF?text=${encodeURIComponent(title)}"
draft: true
---

Write your post content here using Markdown.

## Section 1

Your content goes here...

## Section 2

More content...
`;

const filename = `${slug}.md`;
const filepath = join(__dirname, '..', 'src', 'content', 'posts', filename);

try {
  writeFileSync(filepath, frontmatter);
  console.log(`✅ New post created: ${filepath}`);
  console.log(`📝 Don't forget to:`);
  console.log(`   - Update the summary`);
  console.log(`   - Add appropriate tags`);
  console.log(`   - Set the correct category`);
  console.log(`   - Add your author name`);
  console.log(`   - Set draft: false when ready to publish`);
} catch (error) {
  console.error('❌ Error creating post:', error.message);
  process.exit(1);
}
