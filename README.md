# TrendTap – Clickable Prototype

A simple static website (HTML, CSS and JavaScript only, no build step) that demonstrates the TrendTap product
for the IT4050 business pitch evaluation.

> **All trend data is SAMPLE data for demonstration.** The real product reads official APIs (X, Google Trends,
> Meta) and agency submissions. The prototype says so on every page.

## What it shows

| Tab | What to show the panel |
|---|---|
| Dashboard | Feed ranked by **velocity, not volume** (switch the sort to compare), status chips (Rising / Peaking / Peaked), time to peak, and a per-account **alert threshold** slider. |
| WhatsApp alerts | The alert sentence that is the product, and the 9:00 daily digest. Only trends above your threshold are sent. |
| Client report | White-label report: type an agency and client name, then print or save as PDF. |
| Value calculator | Hours scrolling × staff cost vs. plan price (defaults: 6.5 hours, LKR 1,500/hour, Pro at LKR 10,000). |
| Market opportunity | 1,250 organisations, LKR 120M served market, 88 Year-1 accounts, customer research and the competitor table. |

## Folder structure

```
trendtap-prototype/
├── index.html      the page
├── css/style.css   all styling
├── js/data.js      sample trend data (edit this to change the demo)
├── js/app.js       all behaviour
└── README.md
```

## Open it in VS Code

1. In VS Code: **File → Open Folder…** and choose `trendtap-prototype`.
2. Easiest: right-click `index.html` → **Open with Live Server** (install the free "Live Server" extension), or
   just double-click `index.html` in your file explorer. No installation is needed because there is no build step.

## Host it free on GitHub Pages

1. Create a new repository on GitHub (for example `trendtap-prototype`), set it to **Public**.
2. Upload these files, keeping `index.html` at the top level of the repository. (VS Code: **Source Control →
   Initialize Repository → commit → Publish to GitHub**, or use GitHub's **Add file → Upload files**.)
3. On GitHub open **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**,
   select branch `main` and folder `/ (root)`, then **Save**.
4. After a minute your site is live at `https://<your-username>.github.io/<repo-name>/`.

## Editing the demo

- Change or add trends in `js/data.js` (title, category, language, status, `g` = growth, volume, days to peak).
- Colours are variables at the top of `css/style.css`.
