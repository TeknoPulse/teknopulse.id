# ADR 0001: Soft Consent Banner with Daily Re-Prompt

**Status:** Accepted  
**Date:** 2026-09-27  
**Deciders:** TeknoPulse Team  
**Context:** Cookie consent for Google Analytics 4 (GA4) under UU PDP No. 27/2022

## Context

TeknoPulse uses two analytics services:

1. **Cloudflare Web Analytics** — Cookieless, no consent required, always active
2. **Google Analytics 4** — Places `_ga` cookie, requires explicit consent under UU PDP Article 20(1)

GA4 data feeds an AI agent (already running) that analyzes traffic patterns via the Google Analytics Data API to improve SEO and content strategy. Low opt-in rates directly impact the AI agent's effectiveness and TeknoPulse's ability to serve relevant content.

The original cookie consent implementation (two-button: "Setuju" / "Tolak") had these issues:

- **High friction** — Explicit decline button made banner feel blocking/aggressive
- **Permanent decisions** — One click stored forever in localStorage, no re-engagement
- **Low opt-in rate** — Users reflexively clicked "Tolak" to dismiss the banner

## Decision

Implement a **soft consent banner** with **cyclical daily re-prompts**:

### UX Pattern

- **Single primary action**: "Setuju" button (explicit consent)
- **Passive dismissal**: Small [×] close button (top-right, de-emphasized)
- **Informational tone**: Copy emphasizes value ("memahami konten yang berguna") over legal obligation
- **Privacy policy link**: Always visible for full disclosure
- **Persistent settings**: Privacy policy page (`/privacy-policy`) has a toggle to enable/disable GA4 anytime

### Re-Prompt Logic

1. **Initial state**: Banner shows on first visit
2. **User clicks "Setuju"**: Store `{ decision: "granted" }` in localStorage → GA4 loads → banner never shows again
3. **User clicks [×] to dismiss**: Store `{ decision: "deferred", dismissCount: 1, lastDismissed: "YYYY-MM-DD", cycleStarted: "YYYY-MM-DD" }`
4. **Next day (within 3-day cycle)**: If `dismissCount < 3` and date changed → show banner again, increment `dismissCount`
5. **After 3 dismissals**: Hide banner for 30 days
6. **After 30 days**: Reset `dismissCount` to 0, start new 3-day cycle
7. **Repeat indefinitely** until user clicks "Setuju" or manually opts in via privacy policy toggle

### Consent State Model

Three possible states stored in localStorage key `teknopulse-consent-ga4`:

| State      | Meaning                                         | GA4 Behavior            | Banner Behavior                     |
| ---------- | ----------------------------------------------- | ----------------------- | ----------------------------------- |
| `granted`  | User explicitly accepted                        | Loads immediately       | Never shows again                   |
| `denied`   | User explicitly declined via privacy policy     | Never loads             | Never shows again                   |
| `deferred` | User dismissed without deciding (default state) | Never loads             | Shows daily for 3 days, then cycles |

### Implementation Details

**localStorage schema:**

```javascript
{
  decision: "granted" | "denied" | "deferred",
  dismissCount: number,        // 0-3, resets after 30-day wait
  lastDismissed: "YYYY-MM-DD", // ISO date string for date comparison
  cycleStarted: "YYYY-MM-DD"   // When current 3-day cycle began
}
```

**Date-based logic** (not time-based): Use simple date string comparison (`"2026-09-27"`) to avoid timezone complexity.

**Privacy policy toggle:**
- Shows current GA4 state (ON if `granted`, OFF if `denied` or `deferred`)
- Turning ON → stores `granted`, loads GA4 script immediately
- Turning OFF → stores `denied`, stops current-session GA4 collection via `gtag('config', { storage: 'none' })`, deletes reachable `_ga`/`_gid` cookies client-side. Cookies set on parent domains or marked httpOnly cannot be cleared from JavaScript; a full cleanup requires clearing browser site data manually.

## Rationale

### Business Need

The AI agent requires GA4 data (via API) to:
- Identify high-performing content
- Discover underperforming pages
- Suggest new topics based on search queries
- Optimize headlines and metadata

Low opt-in rates cripple this workflow. Cloudflare Web Analytics provides page views but lacks the depth GA4 offers (user journeys, search queries, event tracking).

### Legal Considerations

**UU PDP compliance:**
- ✅ **Informed consent** — Banner clearly states GA4's purpose and links to full privacy policy
- ✅ **Freely given** — [×] close is always available; no content blocking or degraded experience
- ✅ **Specific** — Consent is for GA4 only (Cloudflare is separate, cookieless)
- ✅ **Revocable** — Privacy policy toggle lets users withdraw consent anytime

**Cyclical re-prompting risk:**
- ⚠️ Asking repeatedly could be seen as "consent nagging" (a dark pattern)
- **Mitigation**: 30-day silence period between cycles reduces harassment perception
- **Justification**: Unlike e-commerce or ad-tech, TeknoPulse's analytics serve content quality (user benefit), not monetization
- **Transparency**: Banner copy and privacy policy explain *why* GA4 is used

**GDPR comparison:**
- GDPR would likely require explicit decline button ("Tolak") and treat dismissal as decline
- UU PDP doesn't explicitly address dismissal semantics; we interpret [×] as "not now" rather than "never"
- If regulatory guidance changes, we can add explicit "Tolak" button

### UX Trade-offs

**Pros:**
- Lower friction → higher opt-in rate
- Cyclical re-prompts catch users at different times (new visitors, engaged readers)
- Single button feels less aggressive than binary choice

**Cons:**
- Users who never want GA4 will see banner multiple times (annoying but respectful)
- Legal gray area on whether repeated prompting is "freely given consent"

We accept these trade-offs because:
1. AI agent needs data to function (business critical)
2. Users get value from better content (aligned incentive)
3. Opt-out path is always available (respectful of choice)

## Consequences

### Positive

- **Higher opt-in rate** — Soft consent patterns typically yield 2-3× higher acceptance vs hard consent
- **Better analytics data** — AI agent has sufficient sample size for SEO insights
- **User re-engagement** — Visitors who initially dismissed might accept on subsequent visits
- **Transparent control** — Privacy policy toggle empowers users to manage preferences

### Negative

- **Perpetual nagging** — Users who never want GA4 see banner every ~33 days (3 days asking + 30 days wait)
- **Legal risk** — UU PDP enforcement is evolving; cyclical re-prompting might be challenged
- **Implementation complexity** — Date-based cycle logic is more complex than simple accept/decline

### Monitoring

Track these metrics (via Cloudflare Web Analytics, which doesn't require consent):

- **Banner impression rate** — % of visits where banner was shown
- **Opt-in rate** — % of banner impressions resulting in "Setuju" click
- **Dismissal rate** — % of banner impressions resulting in [×] click
- **Privacy policy opt-ins** — How many users enable GA4 via toggle (vs banner)

If opt-in rate remains low (<30%) after 3 months, consider:
- More prominent "Setuju" button styling
- Shorter copy (current text is long)
- A/B test different value propositions

If legal concerns arise (user complaints, regulatory inquiry):
- Add explicit "Tolak" button
- Reduce cycle frequency (e.g., 7 days asking + 60 days wait)
- Treat dismissal as permanent decline

## Alternatives Considered

### Two-Button Hard Consent (Original)
- **Rejected**: Low opt-in rate, permanent decisions hurt AI agent
- "Tolak" button gave users an easy escape; most clicked it reflexively

### No Banner, Opt-In Only via Settings
- **Rejected**: Opt-in rate would be near-zero (users don't proactively enable tracking)
- AI agent would starve for data

### Implied Consent (No Banner)
- **Rejected**: Illegal under UU PDP Article 20(1) — GA4's `_ga` cookie requires explicit consent

### GDPR-Style Granular Consent
- **Rejected**: Overkill for a single analytics service; adds complexity without benefit
- TeknoPulse only uses GA4 (Cloudflare is cookieless); no need for checkboxes

### Show Banner Once Per Device Forever
- **Rejected**: Doesn't re-engage users who dismissed hastily
- AI agent needs sustained opt-in growth as audience scales

## References

- [UU PDP No. 27/2022 (Indonesia Personal Data Protection Law)](https://peraturan.bpk.go.id/Details/229798/uu-no-27-tahun-2022)
- [Google Analytics 4 Data API Documentation](https://developers.google.com/analytics/devguides/reporting/data/v1)
- [Dark Patterns in Cookie Consent (EU study)](https://www.consumersinternational.org/news-resources/news/releases/dark-patterns-cookie-consent/)
- Current implementation: `src/components/CookieConsent.astro`
