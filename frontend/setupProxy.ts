import { createProxyMiddleware } from 'http-proxy-middleware';

export default function(app) {
  app.use(
    '/api', // This matches any request starting with /api
    createProxyMiddleware({
      target: 'https://gen-ai-foundation-demo-cec4ghc4aeesbjba.a03.azurefd.net', // The external server
      changeOrigin: true, // Changes the origin of the request to the target URL
      pathRewrite: {
        '^/api': '/api', // Optional: Rewrite paths if necessary
      },
    })
  );
};
