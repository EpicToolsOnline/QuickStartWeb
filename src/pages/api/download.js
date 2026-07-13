export const prerender = false;

export async function GET({ request }) {
  const url = new URL(request.url);
  const appsParam = url.searchParams.get("apps") || "";

  const safeApps = appsParam
    .split(",")
    .map((a) => a.trim())
    .filter((a) => /^[a-zA-Z0-9+\-]+$/.test(a));

  const filename = safeApps.length > 0
    ? `QuickStart ${safeApps.join(" ")}.exe`
    : "QuickStart.exe";

  const githubHeaders = {
    "User-Agent": "QuickStart-Website",
    "Accept": "application/vnd.github+json",
  };

  if (import.meta.env.GITHUB_TOKEN) {
    githubHeaders["Authorization"] = `Bearer ${import.meta.env.GITHUB_TOKEN}`;
  }

  const releaseResponse = await fetch(
    "https://api.github.com/repos/EpicToolsOnline/QuickStart/releases/latest",
    { headers: githubHeaders }
  );

  if (!releaseResponse.ok) {
    return new Response(
      `Could not reach GitHub releases. Status: ${releaseResponse.status}`,
      { status: 502 }
    );
  }

  const release = await releaseResponse.json();
  const exeAsset = release.assets.find((a) => a.name.endsWith(".exe"));

  if (!exeAsset) {
    return new Response("No exe found in the latest release.", { status: 404 });
  }

  const exeResponse = await fetch(exeAsset.browser_download_url);

  return new Response(exeResponse.body, {
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
