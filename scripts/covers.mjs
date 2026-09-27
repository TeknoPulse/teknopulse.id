#!/usr/bin/env node
// scripts/covers.mjs — utilitas cover image TeknoPulse.
//
// Mengubah rutinitas manual "audit → generate → apply → verifikasi → publish"
// menjadi subperintah yang deterministik. Substansi gaya (prompt) tetap
// diisi manusia/agent; script ini mengurus semua bagian mekanis.
//
//   node scripts/covers.mjs audit  [--strict] [--json]   (termasuk cek kemiripan visual)
//   node scripts/covers.mjs plan   [--from-pr <branch>] [--out covers.plan.json] [--limit N]
//   node scripts/covers.mjs fetch  <plan.json> [--concurrency 3]
//   node scripts/covers.mjs apply  <plan.json>
//   node scripts/covers.mjs verify [--build] [--live <slug>]
//   node scripts/covers.mjs publish --branch <nama> [--pr] [--merge] [--message "..."]
//
// Aturan yang dikodekan di sini (semuanya pernah jadi bug nyata):
//   - file cover wajib berekstensi sesuai isinya (JPEG bernama .png = error);
//   - ukuran 1280x720 PNG, unik per artikel (nama file DAN md5);
//   - `category` wajib ada di enum skema src/content/config.ts;
//   - frontmatter dipatch tanpa merusak BOM & line ending;
//   - cover yang MIRIP secara visual (foto sama, crop/encode beda) juga dilaporkan,
//     bukan hanya yang identik byte — md5 saja tidak menangkap kasus itu.
//
// ENV:
//   COVERS_IMAGE_CMD  path skrip generator gambar (default: skill seedream AutoClaw)
//   COVERS_STYLE      suffix prompt gaya; default = standar editorial TeknoPulse

import { execFileSync } from 'child_process';
import { createHash } from 'crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'fs';
import { basename, dirname, join } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const POSTS_DIR = join(ROOT, 'src', 'content', 'posts');
const ASSETS_DIR = join(ROOT, 'src', 'assets', 'images');
const CONFIG_FILE = join(ROOT, 'src', 'content', 'config.ts');

const COVER_SIZE = { width: 1280, height: 720 };
// Ambang deteksi "foto yang sama, crop/encode berbeda". Nilai dari pengukuran di repo ini:
// pasangan identik/re-encode -> dHash < 60 dan RMSE < 15; foto berbeda -> dHash > 300, RMSE > 45.
const SIMILAR = { hashBits: 100, rmse: 22 };
const DEFAULT_IMAGE_CMD =
  process.env.COVERS_IMAGE_CMD ||
  join(
    process.env.HOME || '',
    '.openclaw-autoclaw/skills/autoglm-generate-image-seedream/generate-image-seedream.py'
  );

const COVERS_STYLE =
  process.env.COVERS_STYLE ||
  ' Photographic editorial quality, like a professional stock photograph but specific to this story: ' +
    'real-world documentary photograph, 35mm lens, natural available light, muted realistic colour, ' +
    'deep depth of field, believable real-world imperfection and ordinary clutter (scuffs, dust, ' +
    'uneven surfaces, cable ties, wear and tear, slightly messy), natural asymmetry, slightly ' +
    'off-centre framing. Strictly avoid: text, letters, numbers, signage, logos, brand marks, ' +
    'watermarks, people, faces, hands, glowing neon, lens flare, HDR, oversaturation, 3D render, CGI, ' +
    'illustration, cartoon, sterile perfection, exaggerated symmetry, glowing orbs, hexagon patterns, sparkles.';

// ── util ──────────────────────────────────────────────────────────────────────

const argv = process.argv.slice(2);
const command = argv[0];
const flag = (name, fallback = undefined) => {
  const i = argv.indexOf(`--${name}`);
  return i === -1 ? fallback : argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : true;
};
const has = (name) => argv.includes(`--${name}`);

function parseFrontmatter(raw) {
  const clean = raw.replace(/^\uFEFF/, '');
  const fields = {};
  let inside = false;
  for (const line of clean.split('\n')) {
    if (line.trim() === '---') {
      if (inside) break;
      inside = true;
      continue;
    }
    if (!inside) continue;
    const m = line.match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
    if (m && !line.startsWith(' ') && !line.startsWith('#')) {
      fields[m[1]] = (m[2] ?? '').trim().replace(/^['"]|['"]$/g, '');
    }
  }
  return fields;
}

function sniffImage(buf) {
  if (
    buf.length >= 8 &&
    buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
  )
    return 'png';
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'jpeg';
  if (buf.length >= 4 && buf.subarray(0, 4).toString() === 'RIFF') return 'webp';
  if (buf.length >= 4 && buf.subarray(0, 4).toString() === 'GIF8') return 'gif';
  return 'unknown';
}

/** Konversi buffer gambar apa pun menjadi PNG 1280x720 di `dest`. */
async function toPng1280x720(buf, dest) {
  try {
    const sharp = (await import('sharp')).default;
    await sharp(buf)
      .resize(COVER_SIZE.width, COVER_SIZE.height, { fit: 'fill' })
      .png({ compressionLevel: 9 })
      .toFile(dest);
    return;
  } catch {
    // fallback macOS (sips): butuh file sumber
    const tmp = `${dest}.src`;
    writeFileSync(tmp, buf);
    execFileSync('sips', [
      '-z',
      String(COVER_SIZE.height),
      String(COVER_SIZE.width),
      '-s',
      'format',
      'png',
      tmp,
      '--out',
      dest,
    ]);
    try {
      execFileSync('rm', ['-f', tmp]);
    } catch {
      /* file sementara boleh tertinggal */
    }
  }
}

function pngSize(buf) {
  if (sniffImage(buf) !== 'png' || buf.length < 24) return null;
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

function coverEnum() {
  const src = readFileSync(CONFIG_FILE, 'utf8');
  const m = src.match(/category:\s*z\.enum\(\[([^\]]+)\]/);
  if (!m) return [];
  return [...m[1].matchAll(/'([^']+)'/g)].map((x) => x[1]);
}

function readPosts() {
  return readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith('.md'))
    .sort()
    .map((file) => {
      const raw = readFileSync(join(POSTS_DIR, file), 'utf8');
      const fields = parseFrontmatter(raw);
      return {
        file,
        slug: basename(file, '.md'),
        draft: fields.draft === 'true',
        title: fields.title || '',
        summary: fields.summary || '',
        tags: fields.tags || '',
        category: fields.category || '',
        cover: fields.coverImage ? basename(fields.coverImage) : '',
      };
    });
}

function git(args) {
  return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' }).trim();
}

/**
 * Cari cover yang mirip secara visual (bukan hanya identik byte) dengan
 * dHash 32x32 + RMSE pada grayscale 128x72. Mengembalikan daftar pasangan.
 */
async function findSimilarCovers(names) {
  let sharp;
  try {
    sharp = (await import('sharp')).default;
  } catch {
    return { skipped: 'sharp tidak tersedia — cek kemiripan dilewati', pairs: [] };
  }
  const vectors = new Map();
  const hashes = new Map();
  for (const name of names) {
    const abs = join(ASSETS_DIR, name);
    if (!existsSync(abs)) continue;
    const gray = await sharp(abs).resize(128, 72, { fit: 'fill' }).grayscale().raw().toBuffer();
    vectors.set(name, gray);
    const { data } = await sharp(abs)
      .resize(33, 32, { fit: 'fill' })
      .grayscale()
      .raw()
      .toBuffer({ resolveWithObject: true });
    let bits = '';
    for (let y = 0; y < 32; y++)
      for (let x = 0; x < 32; x++) bits += data[y * 33 + x] < data[y * 33 + x + 1] ? '1' : '0';
    hashes.set(name, bits);
  }
  const list = [...vectors.keys()];
  const pairs = [];
  for (let i = 0; i < list.length; i++) {
    for (let j = i + 1; j < list.length; j++) {
      const a = list[i];
      const b = list[j];
      const A = vectors.get(a);
      const B = vectors.get(b);
      let sum = 0;
      for (let k = 0; k < A.length; k++) {
        const d = A[k] - B[k];
        sum += d * d;
      }
      const rmse = Math.sqrt(sum / A.length);
      const ha = hashes.get(a);
      const hb = hashes.get(b);
      let hd = 0;
      for (let k = 0; k < ha.length; k++) if (ha[k] !== hb[k]) hd++;
      if (rmse < SIMILAR.rmse || hd < SIMILAR.hashBits)
        pairs.push({ a, b, rmse: +rmse.toFixed(1), hashDistance: hd });
    }
  }
  pairs.sort((x, y) => x.rmse - y.rmse);
  return { pairs };
}

/** Analisis seluruh cover; sumber tunggal untuk audit & verify. */
function analyze() {
  const posts = readPosts();
  const categories = coverEnum();
  const findings = [];
  const add = (level, slug, code, message) => findings.push({ level, slug, code, message });

  const byName = new Map();
  const byHash = new Map();
  for (const p of posts) if (p.cover) byName.set(p.cover, [...(byName.get(p.cover) || []), p.slug]);

  const info = new Map(); // nama file -> { format, width, height, bytes, md5 }
  for (const name of byName.keys()) {
    const abs = join(ASSETS_DIR, name);
    if (!existsSync(abs)) {
      info.set(name, null);
      continue;
    }
    const buf = readFileSync(abs);
    const format = sniffImage(buf);
    const size = pngSize(buf);
    const md5 = createHash('md5').update(buf).digest('hex');
    info.set(name, { format, ...(size || {}), bytes: buf.length, md5 });
    byHash.set(md5, [...(byHash.get(md5) || []), name]);
  }

  for (const p of posts) {
    if (!p.cover) {
      if (!p.draft) add('ERROR', p.slug, 'missing-cover', 'artikel non-draft tanpa coverImage');
      continue;
    }
    const meta = info.get(p.cover);
    if (!meta) {
      add('ERROR', p.slug, 'dangling-cover', `file cover "${p.cover}" tidak ada`);
      continue;
    }
    const ext = p.cover.split('.').pop().toLowerCase();
    const expected = ext === 'jpg' ? 'jpeg' : ext;
    if (meta.format !== 'unknown' && expected !== meta.format)
      add(
        'ERROR',
        p.slug,
        'mismatch-format',
        `"${p.cover}" berekstensi .${ext} tapi isinya ${meta.format.toUpperCase()}`
      );
    if (
      meta.format === 'png' &&
      (meta.width !== COVER_SIZE.width || meta.height !== COVER_SIZE.height)
    )
      add(
        'WARN',
        p.slug,
        'wrong-size',
        `"${p.cover}" ${meta.width}x${meta.height}, seharusnya ${COVER_SIZE.width}x${COVER_SIZE.height}`
      );
    if (byName.get(p.cover).length > 1)
      add(
        'ERROR',
        p.slug,
        'duplicate-name',
        `"${p.cover}" juga dipakai: ${byName
          .get(p.cover)
          .filter((s) => s !== p.slug)
          .join(', ')}`
      );
    if ((byHash.get(meta.md5) || []).length > 1)
      add(
        'ERROR',
        p.slug,
        'duplicate-content',
        `"${p.cover}" kontennya identik dengan: ${(byHash.get(meta.md5) || []).filter((n) => n !== p.cover).join(', ')}`
      );
    if (meta.bytes > 2_500_000)
      add('WARN', p.slug, 'oversize', `"${p.cover}" ${(meta.bytes / 1048576).toFixed(1)} MB`);
    if (categories.length && !categories.includes(p.category))
      add(
        'ERROR',
        p.slug,
        'invalid-category',
        `category "${p.category}" di luar enum [${categories.join(', ')}]`
      );
  }

  return { posts, findings, categories, info };
}

// ── perintah ─────────────────────────────────────────────────────────────────

async function cmdAudit() {
  const { posts, findings } = analyze();
  const covers = [...new Set(posts.map((p) => p.cover).filter(Boolean))];
  const similar = await findSimilarCovers(covers);
  for (const pair of similar.pairs) {
    const owners = posts.filter((p) => p.cover === pair.a || p.cover === pair.b).map((p) => p.slug);
    findings.push({
      level: 'ERROR',
      slug: owners.join(' | '),
      code: 'similar-cover',
      message: `"${pair.a}" dan "${pair.b}" mirip secara visual (RMSE ${pair.rmse}, dHash ${pair.hashDistance}) — kemungkinan foto yang sama dengan crop/encode berbeda`,
    });
  }
  const errors = findings.filter((f) => f.level === 'ERROR');
  const warns = findings.filter((f) => f.level === 'WARN');

  if (has('json')) {
    console.log(JSON.stringify({ posts: posts.length, errors, warnings: warns }, null, 2));
  } else {
    for (const f of findings)
      console.log(`${f.level === 'ERROR' ? '✖' : '⚠'} [${f.code}] ${f.slug}: ${f.message}`);
    if (!findings.length) console.log('✔ tidak ada temuan cover');
    if (similar.skipped) console.log(`ℹ ${similar.skipped}`);
    console.log(
      `\ncovers:audit — ${posts.length} artikel, ${covers.length} cover, ${errors.length} error, ${warns.length} peringatan` +
        (similar.pairs.length ? `, ${similar.pairs.length} pasangan mirip` : '')
    );
  }
  if (errors.length && has('strict')) process.exit(1);
}

function cmdPlan() {
  const { posts } = analyze();
  const fromPr = flag('from-pr');
  const limit = Number(flag('limit', 0)) || 0;
  const out = flag('out', 'covers.plan.json');
  let candidates = posts;

  if (typeof fromPr === 'string') {
    // Artikel baru hanya ada di branch-nya, jadi frontmatter dibaca dari ref itu.
    const ref = `origin/${fromPr}`;
    const files = git(['diff', '--name-only', `origin/main...${ref}`])
      .split('\n')
      .filter((f) => f.startsWith('src/content/posts/') && f.endsWith('.md'));
    candidates = files.map((f) => {
      const fields = parseFrontmatter(git(['show', `${ref}:${f}`]));
      return {
        file: basename(f),
        slug: basename(f, '.md'),
        draft: fields.draft === 'true',
        title: fields.title || '',
        summary: fields.summary || '',
        tags: fields.tags || '',
        category: fields.category || '',
        cover: fields.coverImage ? basename(fields.coverImage) : '',
      };
    });
    console.log(`  (ref: ${ref}, ${candidates.length} artikel baru vs main)`);
  } else {
    candidates = posts.filter((p) => !p.cover && !p.draft);
  }

  const targets = (limit ? candidates.slice(0, limit) : candidates).map((p) => ({
    slug: p.slug,
    postFile: `src/content/posts/${p.file}`,
    title: p.title,
    summary: p.summary.slice(0, 200),
    tags: p.tags,
    coverFile: `src/assets/images/${p.slug}-16x9.png`,
    prompt: '',
  }));

  writeFileSync(out, JSON.stringify({ generatedAt: new Date().toISOString(), targets }, null, 2));
  console.log(`covers:plan — ${targets.length} artikel ditulis ke ${out}`);
  console.log(
    'Isi field "prompt" tiap target (subjek konkret, awali "Wide 16:9 photograph: ..."), lalu jalankan covers:fetch.'
  );
}

async function cmdFetch() {
  const planPath = argv[1] && !argv[1].startsWith('--') ? argv[1] : null;
  if (!planPath) throw new Error('pakai: covers:fetch <plan.json>');
  const plan = JSON.parse(readFileSync(planPath, 'utf8'));
  const statePath = `${planPath}.state.json`;
  const state = existsSync(statePath) ? JSON.parse(readFileSync(statePath, 'utf8')) : {};
  const concurrency = Number(flag('concurrency', 3)) || 3;
  mkdirSync(ASSETS_DIR, { recursive: true });

  if (!existsSync(DEFAULT_IMAGE_CMD)) {
    throw new Error(`generator tidak ditemukan: ${DEFAULT_IMAGE_CMD} (set COVERS_IMAGE_CMD)`);
  }

  const jobs = plan.targets.filter(
    (t) => t.prompt && t.prompt.trim() && state[t.slug]?.status !== 'ok'
  );
  console.log(
    `covers:fetch — ${jobs.length} job (${plan.targets.length} target, ${Object.keys(state).length} sudah ada di state)`
  );

  const runOne = async (job) => {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const raw = execFileSync('python3', [DEFAULT_IMAGE_CMD, job.prompt + COVERS_STYLE], {
          encoding: 'utf8',
          maxBuffer: 32 * 1024 * 1024,
          timeout: 320_000,
        });
        const url = JSON.parse(raw)?.data?.image_url;
        if (!url) throw new Error('respons tanpa image_url');
        const res = await fetch(url);
        if (!res.ok) throw new Error(`unduh gagal HTTP ${res.status}`);
        const buf = Buffer.from(await res.arrayBuffer());

        const dest = join(ROOT, job.coverFile);
        await toPng1280x720(buf, dest);

        const out = readFileSync(dest);
        const size = pngSize(out);
        if (
          sniffImage(out) !== 'png' ||
          size?.width !== COVER_SIZE.width ||
          size?.height !== COVER_SIZE.height
        )
          throw new Error('hasil bukan PNG 1280x720');
        state[job.slug] = { status: 'ok', file: job.coverFile, bytes: out.length };
        console.log(
          `  ✔ ${job.slug} — ${size.width}x${size.height}, ${Math.round(out.length / 1024)}KB`
        );
        writeFileSync(statePath, JSON.stringify(state, null, 2));
        return;
      } catch (err) {
        state[job.slug] = { status: 'failed', error: String(err.message || err) };
        writeFileSync(statePath, JSON.stringify(state, null, 2));
        if (attempt === 2) console.log(`  ✖ ${job.slug} — ${state[job.slug].error}`);
      }
    }
  };

  await awaitPool(jobs, concurrency, runOne);
  const ok = Object.values(state).filter((v) => v.status === 'ok').length;
  console.log(`covers:fetch selesai — ${ok}/${plan.targets.length} ok (state: ${statePath})`);
}

async function awaitPool(items, size, worker) {
  const queue = [...items];
  const runners = Array.from({ length: Math.min(size, queue.length) }, async () => {
    while (queue.length) await worker(queue.shift());
  });
  await Promise.all(runners);
}

function cmdApply() {
  const planPath = argv[1] && !argv[1].startsWith('--') ? argv[1] : null;
  if (!planPath) throw new Error('pakai: covers:apply <plan.json>');
  const plan = JSON.parse(readFileSync(planPath, 'utf8'));
  let changed = 0;

  for (const t of plan.targets) {
    const abs = join(ROOT, t.postFile);
    if (!existsSync(abs)) {
      console.log(`  ✖ ${t.slug}: file post tidak ada`);
      continue;
    }
    const cover = basename(t.coverFile);
    if (!existsSync(join(ASSETS_DIR, cover))) {
      console.log(`  ✖ ${t.slug}: ${cover} belum ada (jalankan covers:fetch dulu)`);
      continue;
    }
    const raw = readFileSync(abs, 'utf8');
    const m = raw.match(/^(\uFEFF?)---(\r?\n)([\s\S]*?)(\r?\n)---/);
    if (!m) {
      console.log(`  ✖ ${t.slug}: frontmatter tidak terbaca`);
      continue;
    }
    const [full, bom, nl, fm] = m;
    const rest = raw.slice(full.length);
    const ref = `'../../assets/images/${cover}'`;
    let next = fm;
    const cur = next.match(/^coverImage:.*$/m);
    if (cur) next = next.replace(cur[0], `coverImage: ${ref}`);
    else {
      const anchor = next.match(/^draft:.*$/m) || next.match(/^author:.*$/m);
      if (!anchor) {
        console.log(`  ✖ ${t.slug}: tidak ada anchor draft/author`);
        continue;
      }
      next =
        next.slice(0, anchor.index + anchor[0].length) +
        `${nl}coverImage: ${ref}` +
        next.slice(anchor.index + anchor[0].length);
    }
    if (next !== fm) {
      writeFileSync(abs, `${bom}---${nl}${next}${nl}---${rest}`);
      changed++;
      console.log(`  ✔ ${t.slug}: coverImage → ${cover}`);
    }
  }
  console.log(`covers:apply — ${changed} frontmatter diperbarui`);
}

async function cmdVerify() {
  const { posts, findings } = analyze();
  const covers = [...new Set(posts.map((p) => p.cover).filter(Boolean))];
  const similar = await findSimilarCovers(covers);
  for (const pair of similar.pairs) {
    findings.push({
      level: 'ERROR',
      slug: `${pair.a} | ${pair.b}`,
      code: 'similar-cover',
      message: `mirip secara visual (RMSE ${pair.rmse}, dHash ${pair.hashDistance})`,
    });
  }
  const errors = findings.filter((f) => f.level === 'ERROR');
  console.log(`covers:verify — ${posts.length} artikel, ${errors.length} error struktural`);
  for (const e of errors) console.log(`  ✖ [${e.code}] ${e.slug}: ${e.message}`);

  if (has('build')) {
    console.log('covers:verify — menjalankan pnpm build…');
    execFileSync('pnpm', ['build'], { cwd: ROOT, stdio: 'inherit' });
  }

  const live = flag('live');
  if (typeof live === 'string') {
    const html = execFileSync('curl', ['-s', `https://teknopulse.id/posts/${live}/`], {
      encoding: 'utf8',
    });
    const og = html.match(/property="og:image" content="([^"]+)"/)?.[1];
    if (!og) console.log('  ✖ og:image tidak ditemukan');
    else {
      const status = execFileSync('curl', ['-s', '-o', '/dev/null', '-w', '%{http_code}', og], {
        encoding: 'utf8',
      });
      console.log(`  ${status === '200' ? '✔' : '✖'} og:image live: ${og} (HTTP ${status})`);
    }
  }
  if (errors.length) process.exit(1);
}

function cmdPublish() {
  const branch = flag('branch');
  if (typeof branch !== 'string')
    throw new Error('pakai: covers:publish --branch <nama> [--pr] [--merge]');
  const message = flag('message', 'content: perbarui cover image');

  const changed = git(['status', '--porcelain'])
    .split('\n')
    .map((l) => l.slice(3).trim())
    .filter((f) => f.startsWith('src/content/posts/') || f.startsWith('src/assets/images/'));
  if (!changed.length) {
    console.log('covers:publish — tidak ada perubahan post/gambar untuk di-commit');
    return;
  }

  git(['checkout', '-b', branch]);
  git(['add', '--', ...changed]);
  git(['commit', '-m', message]);
  git(['push', '-u', 'origin', branch]);
  console.log(`covers:publish — branch ${branch} ter-push (${changed.length} file)`);

  if (has('pr')) {
    const title = String(message).split('\n')[0];
    console.log(
      execFileSync(
        'gh',
        [
          'pr',
          'create',
          '--base',
          'main',
          '--head',
          branch,
          '--title',
          title,
          '--body',
          'Dibuat otomatis oleh `scripts/covers.mjs`.',
        ],
        { cwd: ROOT, encoding: 'utf8' }
      ).trim()
    );
  }
  if (has('merge')) {
    console.log(git(['checkout', 'main']));
    console.log('covers:publish — merge dilakukan manual agar bisa direview lebih dulu');
  }
}

// ── entrypoint ───────────────────────────────────────────────────────────────

const commands = {
  audit: cmdAudit,
  plan: cmdPlan,
  fetch: cmdFetch,
  apply: cmdApply,
  verify: cmdVerify,
  publish: cmdPublish,
};

const run = commands[command];
if (!run) {
  console.error('pakai: covers.mjs <audit|plan|fetch|apply|verify|publish> [opsi]');
  process.exit(1);
}
await run();
