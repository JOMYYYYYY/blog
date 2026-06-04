export default async function handler(req) {
  const clientId = process.env.OAUTH_CLIENT_ID;
  const redirectUri = process.env.ORIGIN + "/api/callback";

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: "repo",
  });

  return Response.redirect(
    `https://github.com/login/oauth/authorize?${params.toString()}`
  );
}
