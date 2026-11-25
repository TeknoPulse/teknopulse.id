<!-- TEMPLATE START MARKER -->

# {{TITLE}}

> **TL;DR** {{DESCRIPTION}}

## Daftar Isi

- [Mengapa Ini Penting](#mengapa-ini-penting)
- [Persiapan](#persiapan)
  {{#each STEPS}}
- [{{this.title}}](#{{this.slug}})
  {{/each}}
- [Tips Lanjutan & Troubleshooting](#tips-lanjutan--troubleshooting)
- [FAQ](#faq)
- [Checklist Ringkas](#checklist-ringkas)

---

## Mengapa Ini Penting

{{PAIN_POINT}}

> **Catatan TeknoPulse:** {{PERSONAL_NOTE}}

## Persiapan

- **Prasyarat:** {{PREREQUISITES}}
- **Waktu estimasi:** {{ESTIMATED_TIME}}
- **Level kesulitan:** {{DIFFICULTY_LABEL}}

{{#each STEPS}}

## {{this.title}}

{{this.content}}

{{#if this.screenshot}}
![Screenshot: {{this.screenshot_alt}}]({{this.screenshot_path}})
{{/if}}

{{#if this.code}}

```{{this.code_lang}}
{{this.code_content}}
```

{{/if}}
{{/each}}

## Tips Lanjutan & Troubleshooting

{{#each TIPS}}

- {{this}}
  {{/each}}

{{#each TROUBLESHOOTING}}

- **{{this.error}}:** {{this.solution}}
  {{/each}}

## FAQ

{{#each FAQ_ITEMS}}

### {{this.question}}

{{this.answer}}

{{/each}}

## Checklist Ringkas

{{#each CHECKLIST}}

- [ ] {{this}}
      {{/each}}

---

> **TeknoPulse** — Tips teknologi untuk orang awam. Ikuti [Threads @teknopulse.id](https://threads.net/@teknopulse.id) & [IG @teknopulse.id](https://instagram.com/teknopulse.id) untuk tip harian.

<!-- TEMPLATE END MARKER -->
