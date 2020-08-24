const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const config = require("./config");

const app = express();

//QQ OAuth
app.use("/oauth/qq", (req, res, next) => {
  if (req.headers && req.headers["host"] === "api.itxia.site") {
    return res.redirect("/oauth/qq.html");
  }
  next();
});
app.use(express.static("static"));

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

//Front end
app.use(
  "/",
  createProxyMiddleware("**", {
    target: config.proxy.spa,
    changeOrigin: true,
    ws: true,
  })
);

app.listen(9000);
