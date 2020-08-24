const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const config = require("./config");

// mount `exampleProxy` in web server
const app = express();

//API service
app.use(
  "/api",
  createProxyMiddleware("/api/**", {
    target: config.proxy.api,
    changeOrigin: true,
    ws: true,
    pathRewrite: {
      "^/api": "/",
    },
  })
);

app.use(
  "/",
  createProxyMiddleware("**", {
    target: config.proxy.spa,
    changeOrigin: true,
    ws: true,
  })
);

app.listen(9000);
