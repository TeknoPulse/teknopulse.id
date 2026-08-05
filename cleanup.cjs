const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const junkFiles = [
  "anthropic-news.md",
  "cloud-gpus-for-deep-learning-availability-price-performance.md",
  "csv-cisa.md",
  "cve.md",
  "fei-fei-lis-1b-ai-startup-anthropics-new-ai-fund-and-metas.md",
  "introducing-claude-4.md",
  "langchain.md",
  "language-model-specification-v1-for-langchain-vercel-ai.md",
  "latest-news-mistral-ai.md",
  "mistral-ai.md",
  "posts-hugging-face.md",
  "reach-vb-on-hugging-face-massive-week-for-open-ai-ml-mistral-pixtral-instruct-large-123b-1.md",
  "should-i-repurpose-my-code-into-a-simple-agent-framework-for-vercelai-sdk-vercelai-discuss.md",
  "simon-willison-on-mistral.md",
  "surat-edaran-menteri-komunikasi-dan-informatika-nomor-9.md",
  "the-10-best-large-language-models-llms-in-2025.md",
  "the-llama-4-herd-the-beginning-of-a-new-era-of-natively.md",
  "top-9-large-language-models-as-of-october-2025-shakudowwwshakudoio-blog-top-9-large-langua.md"
];

const sampleFiles = [
  "sample-post-2.md",
  "sample-post-3.md",
  "sample-post-4.md",
  "sample-post-5.md",
  "sample-post-6.md"
];

const postsDir = path.join(__dirname, 'src', 'content', 'posts');
const imagesDir = path.join(__dirname, 'src', 'assets', 'images');

const toDelete = [];
const kept = [];
const imagesToDelete = [];

function checkReferences(slug) {
  // Use ripgrep or node grep. Node grep is safer.
  // We can just use git grep or similar. Let's use git grep.
  try {
    const res = execSync(`git grep -l "${slug}" -- ":!src/content/posts/*"`, { encoding: 'utf-8' });
    if (res.trim().length > 0) {
      return true;
    }
  } catch (e) {
    // git grep exits with 1 if no match
  }
  return false;
}

for (const file of junkFiles) {
  const filePath = path.join(postsDir, file);
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${file}`);
    continue;
  }
  
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Check pattern
  const hasEqualImage = /coverImage:\s*['"]?.*\/\=.*?['"]?/.test(content) || /og_image:\s*['"]?.*\/\=.*?['"]?/.test(content);
  // It could also be that draft is false (or not true)
  const isDraftTrue = /draft:\s*true/.test(content);
  
  if (hasEqualImage && !isDraftTrue) {
    const slugMatch = content.match(/slug:\s*['"](.*?)['"]/);
    const slug = slugMatch ? slugMatch[1] : file.replace('.md', '');
    
    if (checkReferences(slug)) {
      kept.push({ file, reason: 'referenced elsewhere' });
    } else {
      toDelete.push(filePath);
      // find image paths
      const coverMatch = content.match(/coverImage:\s*['"]?(.*\/(\=.*?))['"]?/);
      if (coverMatch && coverMatch[2]) {
        imagesToDelete.push(coverMatch[2]);
      }
      const ogMatch = content.match(/og_image:\s*['"]?(.*\/(\=.*?))['"]?/);
      if (ogMatch && ogMatch[2]) {
        imagesToDelete.push(ogMatch[2]);
      }
    }
  } else {
    kept.push({ file, reason: 'does not match junk pattern (no "=" in image or is draft: true)' });
  }
}

for (const file of sampleFiles) {
  const filePath = path.join(postsDir, file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const slugMatch = content.match(/slug:\s*['"](.*?)['"]/);
    const slug = slugMatch ? slugMatch[1] : file.replace('.md', '');
    
    if (checkReferences(slug)) {
      kept.push({ file, reason: 'sample post referenced elsewhere' });
    } else {
      toDelete.push(filePath);
      // find images just in case
      const coverMatch = content.match(/coverImage:\s*['"]?(.*\/(.*?))['"]?/);
      if (coverMatch && coverMatch[2] && coverMatch[2].includes('placeholder')) {
         // optionally handle sample images, but requirement only mentioned junk images
      }
    }
  }
}

console.log("To Delete:");
console.log(toDelete);
console.log("\nKept:");
console.log(kept);
console.log("\nImages to delete:");
const uniqueImages = [...new Set(imagesToDelete)];
console.log(uniqueImages);

// Do the deletion
for (const file of toDelete) {
  fs.unlinkSync(file);
  console.log(`Deleted ${file}`);
}

for (const img of uniqueImages) {
  const imgPath = path.join(imagesDir, img);
  if (fs.existsSync(imgPath)) {
    fs.unlinkSync(imgPath);
    console.log(`Deleted image ${imgPath}`);
  }
}

console.log(`\nRemaining posts count: ${fs.readdirSync(postsDir).filter(f => f.endsWith('.md')).length}`);
