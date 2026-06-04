export default async function handler(req, res) {
  const url = new URL(req.url, process.env.ORIGIN);
  const code = url.searchParams.get("code");

  if (!code) {
    res.writeHead(400, { "Content-Type": "text/plain" });
    res.end("Missing code");
    return;
  }

  const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      client_id: process.env.OAUTH_CLIENT_ID,
      client_secret: process.env.OAUTH_CLIENT_SECRET,
      code,
    }),
  });

  const data = await tokenRes.json();

  if (data.error) {
    res.writeHead(400, { "Content-Type": "text/plain" });
    res.end(data.error_description || data.error);
    return;
  }

  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(`<!DOCTYPE html>
<html><body><script>
(function() {
  window.opener.postMessage(
    ${JSON.stringify({ token: data.access_token, provider: "github" })},
    window.location.origin
  );
})();
</script></body></html>`);
}
