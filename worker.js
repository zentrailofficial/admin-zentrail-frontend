const handler = {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Serve static files from the build folder
    const response = await env.ASSETS.fetch(request);

    // Fallback to index.html for React Router support (SPA)
    if (response.status === 404) {
      return await env.ASSETS.fetch(new URL("/index.html", request.url));
    }

    return response;
  },
};

export default handler;
