// Serves the hotel dashboard from the working folder and pushes a reload to
// the open page whenever hotel-data.json changes. Node built-ins only, and it
// listens on 127.0.0.1 so nothing is reachable from the network.
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const http = require("node:http");
const { execFile } = require("node:child_process");

const BLOCK = /(<script id="hotel-data" type="application\/json">)([\s\S]*?)(<\/script>)/;

// { data } when the file parses, { error } when it exists but does not, {} when missing.
function readState(dir) {
  let text;
  try { text = fs.readFileSync(path.join(dir, "hotel-data.json"), "utf8"); } catch { return {}; }
  try { return { data: JSON.parse(text) }; } catch (e) { return { error: e.message }; }
}
const readData = (dir) => readState(dir).data || null;

const esc = (t) => String(t).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));

function render(dir, templatePath, lastGood) {
  const tpl = fs.readFileSync(templatePath, "utf8");
  const st = readState(dir);
  const data = st.data || (st.error ? lastGood : null);
  let html = data ? tpl.replace(BLOCK, (_, a, _b, c) => a + JSON.stringify(data).replace(/</g, "\\u003c") + c) : tpl;
  if (st.error) {
    const note = `hotel-data.json has a mistake in it and cannot be read (${esc(st.error)}). ${lastGood ? "Showing the last good version." : ""} Ask Claude: fix my hotel-data.json.`;
    html = html.replace('<div class="wrap">', `<div class="wrap"><div class="card" style="border-color:#a65a2e;color:#a65a2e;margin-bottom:24px">${note}</div>`);
  }
  return html;
}

function createServer({ dir, templatePath }) {
  const clients = new Set();
  let timer = null;
  let watcher = null;
  let lastGood = readData(dir);
  const push = () => {
    const st = readState(dir);
    if (st.error) { console.log(`hotel-data.json cannot be read right now: ${st.error}`); return; } // mid-write or broken
    lastGood = st.data;
    for (const res of clients) res.write("event: update\ndata: 1\n\n");
  };
  try {
    watcher = fs.watch(dir, (_evt, name) => {
      if (name && name !== "hotel-data.json") return;
      clearTimeout(timer);
      timer = setTimeout(push, 300);
    });
  } catch { /* folder not watchable: the page still loads, it just will not update */ }

  const srv = http.createServer((req, res) => {
    const url = req.url.split("?")[0];
    if (url === "/" || url === "/index.html") {
      res.writeHead(200, { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" });
      return res.end(render(dir, templatePath, lastGood));
    }
    if (url === "/events") {
      res.writeHead(200, { "content-type": "text/event-stream", "cache-control": "no-store", connection: "keep-alive" });
      res.write("retry: 2000\n\n");
      clients.add(res);
      req.on("close", () => clients.delete(res));
      return;
    }
    res.writeHead(404, { "content-type": "text/plain" });
    res.end("Not found");
  });
  // close() waits for open connections, and an event stream never ends on its
  // own, so end the streams first or close() never finishes.
  const close = srv.close.bind(srv);
  srv.close = (cb) => {
    clearTimeout(timer);
    if (watcher) watcher.close();
    for (const r of clients) r.end();
    const out = close(cb);
    if (srv.closeAllConnections) srv.closeAllConnections(); // drop kept-alive sockets so the page cannot reconnect
    return out;
  };
  return srv;
}

function findTemplate() {
  const base = process.env.CLAUDE_SKILLS_DIR || path.join(os.homedir(), ".claude", "skills");
  const installed = path.join(base, "hotel-dashboard", "templates", "dashboard.html");
  if (fs.existsSync(installed)) return installed;
  return path.join(__dirname, "..", "hotel-dashboard", "templates", "dashboard.html");
}

function start({ dir = process.cwd(), port = 4747, open = true } = {}) {
  const srv = createServer({ dir, templatePath: findTemplate() });
  srv.on("error", (e) => {
    if (e.code === "EADDRINUSE" && port < 4757) return start({ dir, port: port + 1, open });
    console.error(`Could not start the dashboard: ${e.message}`);
    process.exit(1);
  });
  srv.listen(port, "127.0.0.1", () => {
    const url = `http://127.0.0.1:${port}/`;
    const file = path.join(dir, "hotel-data.json");
    console.log(`Open Conxi dashboard: ${url}`);
    console.log(fs.existsSync(file)
      ? `Watching ${file}. The page updates itself after every skill run.`
      : `No hotel-data.json in ${dir} yet. Run hotel-setup in this folder and the page fills in on its own.`);
    console.log("Leave this window open. Press Ctrl+C to stop.");
    if (open) {
      const cmd = process.platform === "darwin" ? "open" : process.platform === "win32" ? "explorer" : "xdg-open";
      execFile(cmd, [url], () => {});
    }
  });
  return srv;
}

module.exports = { render, readData, readState, createServer, start };
