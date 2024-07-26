import { defineConfig } from "vite";

export default defineConfig({
  resolve: {
    alias: {
      // Node.js 모듈을 브라우저 환경에서 사용 불가로 처리
      "node-cache": "/src/shims/node-cache.ts",
    },
  },
});
