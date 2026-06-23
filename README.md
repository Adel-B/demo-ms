# BrowserStack Two-Site Demo
### M&S Meeting — June 24th

A Playwright + TypeScript demo showcasing BrowserStack Automate across two real-world sites, with cross-browser testing, Percy visual snapshots, Accessibility automation, and Test Reporting & Analytics (TRA).

---

## 🔐 Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Set BrowserStack credentials as environment variables

```bash
export BROWSERSTACK_USERNAME="your_username"
export BROWSERSTACK_ACCESS_KEY="your_access_key"
```

> ⚠️ **Never commit credentials to the repo.** The BrowserStack SDK reads `BROWSERSTACK_USERNAME` and `BROWSERSTACK_ACCESS_KEY` automatically from the environment. See `.env.example` for reference.

You can find your credentials at: https://automate.browserstack.com/dashboard/v2/quick-start/get-started

---

## 🚀 Running the Tests

### Suite 1 — Cross-Browser Ecommerce Demo

**Site:** https://ecommercebs.vercel.app  
**Platforms:** Windows 11 Chrome · OSX Ventura Chrome · Samsung Galaxy S23 Ultra

```bash
npm run test:ecommerce
```

**What runs:**
| Test | Platforms | Expected |
|------|-----------|----------|
| Homepage loads with header & nav | All 3 | ✅ Pass |
| Navigate to Men category | Windows + OSX | ✅ Pass |
| Navigate to Women category | Windows + OSX | ✅ Pass |
| Product listing with images | Windows + OSX | ✅ Pass |
| Women category products | Windows + OSX | ✅ Pass |
| **Featured products [RCA DEMO]** | All 3 | ❌ **Intentional fail** |

> The RCA DEMO test intentionally uses a wrong selector (`Best Sellers` instead of `Featured Products`) to showcase BrowserStack's **AI Root Cause Analysis** feature in TRA.

---

### Suite 2 — M&S Flowers QA Demo

**Site:** https://www.marksandspencer.com/l/gifts/flowers  
**Platform:** Windows 11 Chrome only

```bash
npm run test:ms-flowers
```

**What runs:**
| Test | Expected |
|------|----------|
| Flowers heading + product grid visible | ✅ Pass |
| Filter and sort controls present | ✅ Pass |
| Navigate to a product detail page | ✅ Pass |

---

## 📊 Viewing Results on BrowserStack

After each run, the SDK prints a dashboard link:

```
Visit https://automation.browserstack.com/builds/<build-id> to view build report
```

### Key dashboards:
| Feature | URL |
|---------|-----|
| **Automate** (sessions, video, logs) | https://automate.browserstack.com |
| **Test Reporting & Analytics (TRA)** | https://automation.browserstack.com |
| **Percy Visual** | https://percy.io |
| **Accessibility** | https://accessibility.browserstack.com |

---

## 🔄 CI/CD — GitHub Actions

A workflow is included at `.github/workflows/browserstack.yml`. It runs both suites in parallel on every push or pull request to `main`.

### Configure repository secrets

In your GitHub repo, go to **Settings → Secrets and variables → Actions** and add:

| Secret name | Value |
|-------------|-------|
| `BROWSERSTACK_USERNAME` | Your BrowserStack username |
| `BROWSERSTACK_ACCESS_KEY` | Your BrowserStack access key |

The workflow uses these secrets as environment variables — no credentials are ever stored in code.

---

## 🗂 Project Structure

```
├── .github/
│   └── workflows/
│       └── browserstack.yml       # GitHub Actions CI workflow
├── .env.example                   # Template for local env vars (never commit .env)
├── browserstack.ecommerce.yml     # BrowserStack config for ecommerce suite
├── browserstack.ms-flowers.yml    # BrowserStack config for M&S suite
├── playwright.ecommerce.config.ts # Playwright config for ecommerce suite
├── playwright.ms-flowers.config.ts# Playwright config for M&S suite
│
├── pages/
│   ├── ecommerce/                 # Page Object Models — ecommerce site
│   │   ├── EcommerceHomePage.ts
│   │   ├── EcommerceProductListPage.ts
│   │   ├── EcommerceProductDetailPage.ts
│   │   ├── EcommerceCartPage.ts
│   │   └── EcommerceSearchResultsPage.ts
│   └── ms-flowers/                # Page Object Models — M&S Flowers
│       ├── FlowersLandingPage.ts
│       ├── FlowerProductDetailPage.ts
│       ├── BasketPage.ts
│       └── MSSearchResultsPage.ts
│
├── tests/
│   ├── ecommerce/
│   │   ├── homepage.spec.ts       # Homepage & navigation tests
│   │   └── product-browsing.spec.ts # Product listing + RCA DEMO test
│   └── ms-flowers/
│       └── flowers-landing.spec.ts  # M&S landing page tests
│
└── helpers/
    └── cookie-consent.ts          # Accepts M&S cookie banner
```

---

## ⚙️ How It Works

### Two separate BrowserStack projects

Each suite runs independently and reports to its own TRA project:

| Suite | BrowserStack Project |
|-------|---------------------|
| Ecommerce | `Cross-Browser Ecommerce Demo` |
| M&S Flowers | `M&S Flowers QA Demo` |

The `pretest` scripts automatically copy the correct `browserstack.yml` before each run:

```json
"pretest:ecommerce": "cp browserstack.ecommerce.yml browserstack.yml",
"pretest:ms-flowers": "cp browserstack.ms-flowers.yml browserstack.yml"
```

> Note: `browserstack.yml` (the active config) is gitignored — only the named suite configs are committed.

### BrowserStack SDK

Tests run via `browserstack-node-sdk` which:
1. Intercepts Playwright's browser launch
2. Routes sessions to BrowserStack cloud
3. Captures video, network logs, console logs
4. Sends results to TRA for AI-powered analysis

### Percy Visual Snapshots

Percy is enabled in both YML configs (`percy: true`). Visual snapshots are captured automatically during test runs and compared against baselines in the Percy dashboard.

### Accessibility Automation

Enabled via `accessibility: true` in both YML configs. BrowserStack scans each page for WCAG violations and reports them in the Accessibility dashboard.

---

## 🐛 Known Limitations

- **Samsung mobile nav**: Category navigation tests are skipped on Samsung Galaxy S23 Ultra because the mobile layout uses a hamburger menu. The homepage load and RCA demo tests still run on mobile.
- **M&S page load times**: M&S pages can be slow (10–30s). Tests use `domcontentloaded` + generous timeouts to handle this.
- **Network restrictions**: If `api.browserstack.com` is blocked by a corporate firewall, tests will fail with `ECONNRESET`. Whitelist BrowserStack endpoints per the [SDK troubleshooting guide](https://www.browserstack.com/docs/test-reporting-and-analytics/sdk-troubleshooting/debug-common-errors).