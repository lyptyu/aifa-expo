// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");
const { createProxyMiddleware } = require("http-proxy-middleware");
const { withNativeWind } = require('nativewind/metro');
const fs = require('fs');
const path = require('path');

// 读取环境配置
const env = process.env.NODE_ENV || 'development';
let envConfig = {};
try {
  const envFile = env === 'production' ? '.env.prod' : '.env.dev';
  const envPath = path.resolve(__dirname, envFile);
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const [key, value] = line.split('=');
      if (key && value) {
        envConfig[key.trim()] = value.trim();
      }
    });
  }
} catch (error) {
  console.warn('读取环境配置文件失败:', error.message);
}

// 默认配置
const API_PROXY_TARGET = envConfig.API_PROXY_TARGET || 'http://api.aifa.chat/api/mapi/';
const AICHAT_PROXY_TARGET = envConfig.AICHAT_PROXY_TARGET || 'http://152.136.11.133:18888';

const defaultConfig = getDefaultConfig(__dirname);

const config = {
  ...defaultConfig, // 不改变Expo定制的metro配置
  server: {
    ...defaultConfig.server,
    enhanceMiddleware: (middleware) => {
      return (req, res, next) => {
        if (req.url.startsWith("/api")) { // 代理所有以/api开头的请求
          return createProxyMiddleware({
            target: API_PROXY_TARGET,
            changeOrigin: true,
            pathRewrite: { "^/api": "" }, // 移除/api前缀，因为目标地址已包含/api/mapi/
          })(req, res, next);
        }
        if (req.url.startsWith("/aichat")) { // 代理所有以/aichat开头的请求
          return createProxyMiddleware({
            target: AICHAT_PROXY_TARGET,
            changeOrigin: true,
            pathRewrite: { "^/aichat": "" }, // 移除/aichat前缀
          })(req, res, next);
        }
        return middleware(req, res, next);
      };
    },
  },
};

module.exports = withNativeWind(config, { input: './css/global.css' })
