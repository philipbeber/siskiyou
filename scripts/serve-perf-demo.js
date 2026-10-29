const { spawn } = require("child_process");
const http = require("http");

const port = process.env.PORT || "4200";
const url = `http://localhost:${port}/?largeFile`;

const child = spawn("npx", ["ng", "serve", "--port", String(port)], {
  stdio: "inherit",
  shell: true
});

function waitForServer() {
  return new Promise((resolve, reject) => {
    const started = Date.now();
    const tryOnce = () => {
      if (Date.now() - started > 60_000) {
        reject(new Error("Timed out waiting for ng serve"));
        return;
      }
      const req = http.get(`http://localhost:${port}/`, res => {
        res.resume();
        resolve();
      });
      req.on("error", () => setTimeout(tryOnce, 500));
    };
    tryOnce();
  });
}

function openBrowser(target) {
  if (process.platform === "darwin") {
    spawn("open", [target], { stdio: "ignore" });
  } else if (process.platform === "win32") {
    spawn("cmd", ["/c", "start", "", target], { stdio: "ignore" });
  } else {
    spawn("xdg-open", [target], { stdio: "ignore" });
  }
}

waitForServer()
  .then(() => {
    console.log(`Opening ${url}`);
    openBrowser(url);
  })
  .catch(err => {
    console.error(err.message);
  });

function shutdown() {
  child.kill("SIGINT");
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
child.on("exit", code => process.exit(code ?? 0));
