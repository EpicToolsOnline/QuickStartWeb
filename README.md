# QuickStart Web

The website for [QuickStart](https://github.com/EpicToolsOnline/QuickStart), an open source, Ninite-style batch installer for Windows. Lives at [quickstart.epictoolsonline.com](https://quickstart.epictoolsonline.com).

This repo is just the website, a single page where people tick which apps they want and download a renamed exe that installs them. The actual installer app, the thing that gets downloaded and does the installing, lives in the separate [QuickStart](https://github.com/EpicToolsOnline/QuickStart) repo.

## How this site works

Built with Astro, deployed as a Cloudflare Worker. The page itself is static, checkboxes built from a hardcoded list in `src/pages/index.astro`. When someone ticks apps and hits download, JS builds a URL like `/api/download?apps=Chrome,Discord` and sends the browser there.

That endpoint, `src/pages/api/download.js`, runs server-side on Cloudflare. It asks GitHub for the latest release of the QuickStart app repo, grabs the exe attached to it, and streams it back to the browser renamed to something like `QuickStart Chrome Discord.exe`. The renaming happens through the `Content-Disposition` header, not by editing the actual file.

## How this connects to the QuickStart app repo

**This is the important bit if you're adding an app.** The checkboxes on this site come from a list in `src/pages/index.astro` in this repo. The actual installer only knows how to install apps listed in `apps.json` in the [QuickStart](https://github.com/EpicToolsOnline/QuickStart) app repo. These two lists don't sync automatically, they're maintained by hand in two separate repos.

If you add an app to `index.astro` here without also adding it to `apps.json` over there, the checkbox will show up and generate a download link, but the resulting exe won't know what to do with that app name and will just skip it with a warning. Always add new apps to both repos together.

## Contributing

### Adding an app to the site

Add an entry to the matching category array in `src/pages/index.astro`:

```js
{ token: "Firefox", name: "Mozilla Firefox", desc: "An open source web browser" }
```

`token` must exactly match the key used for that same app in `apps.json` over in the QuickStart app repo, otherwise the download link won't work. `desc` should be one short plain sentence, no jargon, explaining what the app actually does for someone who's never heard of it.

### Code changes

Fork the repo, branch, open a pull request. PRs need an approving review before merging.

### Reporting a bug

Open an issue. Include what you clicked, what URL it sent you to, and what happened (or a screenshot).

## Running this locally

```
npm install
npm run dev
```

## Deploying

Pushes to `main` auto-build and deploy through Cloudflare Workers Builds. Build command is `npm run build`, deploy command is `npx wrangler deploy`.

## License

MIT, see [LICENSE](LICENSE). Use it, modify it, redistribute it, just keep the copyright notice intact.
