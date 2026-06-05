import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173",
    supportFile: false,
    video: true,
    screenshotsFolder: "cypress/screenshots",
    videosFolder: "cypress/videos"
  },
});
