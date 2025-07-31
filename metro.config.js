// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");
const { createProxyMiddleware } = require("http-proxy-middleware");
const { withNativeWind } = require('nativewind/metro');

const defaultConfig = getDefaultConfig(__dirname);

const config = {
  ...defaultConfig, // 不改变Expo定制的metro配置
  server: {
    ...defaultConfig.server,
    enhanceMiddleware: (middleware) => {
      return (req, res, next) => {
        if (req.url.startsWith("/api")) { // 代理所有以/api开头的请求
          return createProxyMiddleware({
            target: "http://api.aifa.chat", // 目标服务器地址
            changeOrigin: true,
            pathRewrite: { "^/api": "/api" }, // 保持/api路径
          })(req, res, next);
        }
        return middleware(req, res, next);
      };
    },
  },
};

module.exports = withNativeWind(config, { input: './css/global.css' })
