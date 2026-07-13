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

Each app lives inside a category object in the `categories` array in `src/pages/index.astro`. An entry looks like this:

```js
{ token: "Firefox", name: "Mozilla Firefox", desc: "An open source web browser" }
```

`token` must exactly match the key used for that same app in `apps.json` over in the QuickStart app repo, otherwise the download link won't work. `desc` should be one short plain sentence, no jargon, explaining what the app actually does for someone who's never heard of it.

### Deciding which category an app belongs in

Current categories: **Utilities, Editors & Dev Tools, Browsers, Communication, Media, Design, Gaming, Security, Productivity.**

Pick based on what the app is primarily *for*, not every possible use case. A few rules of thumb, in order:

1. **Does an existing category obviously fit?** If you're adding another web browser, it goes in Browsers, full stop, don't overthink it. Most apps have one clear home.
2. **When an app straddles two categories, pick the one a first-time user would search for it under.** For example, Postman could arguably be "Utilities" or "Dev Tools," but developers specifically look for it as a dev tool, so it's in Editors & Dev Tools, not Utilities.
3. **Look at what's already in that category for a sanity check.** If you're adding a password manager, Security already has KeePassXC and Bitwarden in it, that's your signal, don't invent a new "Passwords" category for one more entry.
4. **Only create a brand new category if an app genuinely doesn't fit any existing one, and you'd expect more apps like it later.** A single odd app doesn't need its own category, that just clutters the filter pills for one entry. If you do add a new category, remember every app inside it shares one `keywords` list (see below), so make sure the new category name and its apps are coherent as a group.

### Category keywords (for search)

Each category also has a `keywords` array sitting next to its `apps` array:

```js
{
  name: "Browsers",
  keywords: ["browser", "browsers", "internet", "web", "surf the web", "surfing", "web browsing"],
  apps: [ ... ],
}
```

These are what make the search bar find apps by context, not just exact name matches, so typing "browsers" or "surf the web" finds every app in that category even if those exact words aren't in any individual app's description.

If you're adding an app to an **existing** category, you don't need to touch its keywords, they already cover that category. If you're creating a **new** category, add 5-10 keywords covering how someone might describe that category in plain language, not just the category name itself. Think about what a non-technical person searching would actually type, not just formal terminology.

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