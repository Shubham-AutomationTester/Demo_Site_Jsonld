# JWU Event 404 Mimic Site

This is a lightweight QA test site based on the supplied event-page source. It preserves the event title, date range, description, organizer/campus concepts, JSON-LD Event markup, university-style navigation, and footer structure while intentionally making linked URLs invalid.

## What returns 200
- `/` or `/index.html`
- `/styles.css`
- `/robots.txt`
- `/404.html` (when opened directly)

## What returns 404
Every link on the demo page points under `/broken/...`. Those resources are deliberately not created. When served with `node server.js`, every `/broken/*` request is explicitly returned with status `404` and the custom 404 page.

Examples:
- `/broken/event/details`
- `/broken/event/registration`
- `/broken/document/alumni-guide.pdf`
- `/broken/media/event-photo.jpg`
- `/broken/feed/calendar.ics`

## Local test
```bash
npm start
```
Then open `http://localhost:3000/`.

Verify:
```bash
curl -I http://localhost:3000/
curl -I http://localhost:3000/broken/event/details
```
Expected statuses: `200` for the first request, `404` for the second.

## GitHub Pages
Upload the files to a repository and enable GitHub Pages from the repository root. GitHub Pages will serve `index.html`; missing `/broken/*` paths return HTTP 404 and use `404.html` as the custom error page.

## Render (recommended for deterministic 404 testing)
Create a **Web Service** from the repository.
- Runtime: Node
- Build command: leave empty or use `npm install`
- Start command: `npm start`

The included Node server explicitly returns HTTP 404 for every `/broken/*` route, which makes crawler verification deterministic.

## Important QA note
Do not add files or route rewrites under `/broken/`, otherwise those URLs may stop returning 404.
