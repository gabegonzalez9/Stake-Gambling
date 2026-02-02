# SheetForge AI — Spreadsheet-to-App Converter

SheetForge AI is a lightweight single-page app that turns a CSV into an AI-ready app blueprint. It previews detected schema fields, captures your app goals, and outputs screens, data model, and automation suggestions.

## Features
- CSV upload with instant schema detection.
- AI blueprint tabs (screens, data model, automations).
- Responsive, modern landing page layout.

## Run locally
You can serve the static files with any web server. For example:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000` in your browser.

## Notes
This demo focuses on UI and interaction scaffolding. Replace the mocked AI blueprint logic in `app.js` with real API calls to integrate a model of your choice.
