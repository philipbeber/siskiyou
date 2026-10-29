const fs = require("fs");
const os = require("os");
const path = require("path");

function existingFile(filePath) {
  try {
    return fs.existsSync(filePath) ? filePath : null;
  } catch {
    return null;
  }
}

function findPlaywrightChrome() {
  const cache = path.join(os.homedir(), "Library/Caches/ms-playwright");
  if (!fs.existsSync(cache)) {
    return null;
  }

  const dirs = fs
    .readdirSync(cache)
    .filter(dir => dir.startsWith("chromium-") && !dir.includes("headless"))
    .sort();

  for (const dir of dirs.reverse()) {
    const candidates = [
      path.join(
        cache,
        dir,
        "chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing"
      ),
      path.join(
        cache,
        dir,
        "chrome-mac/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing"
      ),
      path.join(cache, dir, "chrome-linux64/chrome"),
      path.join(cache, dir, "chrome-win64/chrome.exe")
    ];
    for (const candidate of candidates) {
      const found = existingFile(candidate);
      if (found) {
        return found;
      }
    }
  }
  return null;
}

function resolveChromeBin() {
  if (process.env.CHROME_BIN) {
    const fromEnv = existingFile(process.env.CHROME_BIN);
    if (fromEnv) {
      return fromEnv;
    }
  }

  const candidates = [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser"
  ];
  for (const candidate of candidates) {
    const found = existingFile(candidate);
    if (found) {
      return found;
    }
  }

  return findPlaywrightChrome();
}

const chromeBin = resolveChromeBin();
if (!chromeBin) {
  console.error(
    "No Chrome/Chromium binary found. Install Google Chrome, or set CHROME_BIN to a Chromium executable."
  );
  process.exit(1);
}
process.env.CHROME_BIN = chromeBin;

module.exports = function (config) {
  config.set({
    basePath: "",
    frameworks: ["jasmine"],
    plugins: [
      require("karma-jasmine"),
      require("karma-chrome-launcher"),
      require("karma-jasmine-html-reporter"),
      require("karma-coverage")
    ],
    client: {
      jasmine: {
        random: false,
        timeoutInterval: 120000
      }
    },
    jasmineHtmlReporter: {
      suppressAll: true
    },
    reporters: ["progress", "kjhtml"],
    browsers: ["Chrome"],
    port: 9988,
    listenAddress: "127.0.0.1",
    hostname: "localhost",
    restartOnFileChange: true,
    browserNoActivityTimeout: 180000,
    browserDisconnectTimeout: 180000,
    pingTimeout: 180000,
    captureTimeout: 180000
  });
};
