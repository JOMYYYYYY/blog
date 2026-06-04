export default async function handler(req, res) {
  const clientId = process.env.OAUTH_CLIENT_ID;
  const redirectUri = process.env.ORIGIN + "/api/callback";

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: "repo",
  });

  res.writeHead(302, {
    Location: `https://github.com/login/oauth/authorize?${params.toString()}`,
  });
  res.end();
}
