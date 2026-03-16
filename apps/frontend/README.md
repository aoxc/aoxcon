<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/5a7f372b-414d-4eca-a04f-7aa8b91629a3

## Run Locally

**Prerequisites:** Node.js 22+


1. Install dependencies (pick one package manager and stick with it):
   - `npm install`
   - or `yarn install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Build troubleshooting

If build errors mention missing files under `.yarn/__virtual__` or `.yarn/berry/cache`, your dependency artifacts were generated on a different machine/path.

Run this once and reinstall:

```bash
rm -f .pnp.cjs .pnp.loader.mjs .yarn/install-state.gz
npm install
npm run build
```
