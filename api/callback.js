export default async function handler(req) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return new Response("Missing code", { status: 400 });
  }

  const tokenRes = await fetch(
    "https://github.com/login/oauth/access_token",
    {
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
    }
  );

  const data = await tokenRes.json();

  if (data.error) {
    return new Response(data.error_description || data.error, { status: 400 });
  }

  return new Response(renderHtml(data.access_token), {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

function renderHtml(token) {
  return `<!DOCTYPE html>
<html><body>
<script>
  (function() {
    window.opener.postMessage(
      ${JSON.stringify({ token, provider: "github" })},
      window.location.origin
    );
  })();
</script>
<p>登录成功，窗口即将关闭...</p>
</body></html>`;
}
