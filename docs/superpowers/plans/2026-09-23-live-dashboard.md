# Live dashboard implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `npx open-conxi dashboard` serves the hotel dashboard from the working folder and updates the open page the moment any skill saves `hotel-data.json`.

**Architecture:** A zero-dependency Node `http` server in `bin/dashboard.js`. `GET /` returns the installed `dashboard.html` template with the current `hotel-data.json` put into the `hotel-data` script block, the same substitution the hotel-dashboard skill does. `GET /events` is a Server-Sent Events stream. `fs.watch` on the working folder fires when `hotel-data.json` changes. After a 300 ms debounce the server parses the file and, only if it parses, sends one `update` event. The page reloads itself on that event. Opened as a plain file, the page has no server and behaves as it does today.

**Tech stack:** Node 18+ built-ins only (`http`, `fs`, `path`, `child_process`). `node:test` for tests. No npm dependencies, to keep `npx` installs instant.

---

## File structure

- Create `bin/dashboard.js`: `render(dir, templatePath)`, `createServer({dir, templatePath})`, `start({dir, port, open})`. One job, serving and watching.
- Modify `bin/cli.js`: add the `dashboard` command and its help line.
- Modify `hotel-dashboard/templates/dashboard.html`: add the live snippet and a "Live" marker in the top bar.
- Modify `hotel-dashboard/SKILL.md`: one line in section 2, step 3, pointing Claude Code users at the command.
- Modify `README.md`: a short "Live dashboard" section.
- Create `tests/dashboard.test.js`.

## Task 1: render()

**Files:** create `bin/dashboard.js`, create `tests/dashboard.test.js`

- [ ] **Step 1: Write the failing tests**

```js
// tests/dashboard.test.js
const { test } = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { render, createServer } = require("../bin/dashboard.js");
const TPL = path.join(__dirname, "..", "hotel-dashboard", "templates", "dashboard.html");
const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), "ocd-"));
const block = (html) => html.match(/<script id="hotel-data" type="application\/json">([\s\S]*?)<\/script>/)[1];

test("render embeds hotel-data.json from the folder", () => {
  const dir = tmp();
  fs.writeFileSync(path.join(dir, "hotel-data.json"), JSON.stringify({ schema_version: 1, hotel: { name: "Casa Azul", currency: "EUR" } }));
  const data = JSON.parse(block(render(dir, TPL)));
  assert.equal(data.hotel.name, "Casa Azul");
});

test("render falls back to the template's empty block when the file is missing", () => {
  const html = render(tmp(), TPL);
  assert.deepEqual(JSON.parse(block(html)).kpis, []);
});

test("render keeps the last good data when the file does not parse", () => {
  const dir = tmp();
  fs.writeFileSync(path.join(dir, "hotel-data.json"), "{ half written");
  assert.deepEqual(JSON.parse(block(render(dir, TPL))).kpis, []);
});

test("render escapes </script> inside the data", () => {
  const dir = tmp();
  fs.writeFileSync(path.join(dir, "hotel-data.json"), JSON.stringify({ hotel: { name: "</script><b>x" } }));
  const html = render(dir, TPL);
  assert.equal(JSON.parse(block(html)).hotel.name, "</script><b>x");
});
```

- [ ] **Step 2: Run and see them fail**

Run: `node --test tests/dashboard.test.js`
Expected: FAIL, `Cannot find module '../bin/dashboard.js'`.

- [ ] **Step 3: Implement render()**

```js
// bin/dashboard.js
// Serves the hotel dashboard from the working folder and pushes a reload to
// the open page whenever hotel-data.json changes. Node built-ins only.
const fs = require("node:fs");
const path = require("node:path");
const http = require("node:http");

const BLOCK = /(<script id="hotel-data" type="application\/json">)([\s\S]*?)(<\/script>)/;

function readData(dir) {
  try { return JSON.parse(fs.readFileSync(path.join(dir, "hotel-data.json"), "utf8")); }
  catch { return null; }
}

function render(dir, templatePath) {
  const tpl = fs.readFileSync(templatePath, "utf8");
  const data = readData(dir);
  if (!data) return tpl;
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return tpl.replace(BLOCK, (_, a, _b, c) => a + json + c);
}

module.exports = { render, readData };
```

- [ ] **Step 4: Run and see them pass**

Run: `node --test tests/dashboard.test.js`
Expected: 4 pass.

- [ ] **Step 5: Commit**

```bash
git add bin/dashboard.js tests/dashboard.test.js
git commit -m "feat: render the dashboard from the working folder's hotel-data.json"
```

## Task 2: server with SSE on file change

**Files:** modify `bin/dashboard.js`, modify `tests/dashboard.test.js`

- [ ] **Step 1: Write the failing tests**

```js
// append to tests/dashboard.test.js
const http = require("node:http");
const listen = (srv) => new Promise((r) => srv.listen(0, "127.0.0.1", () => r(srv.address().port)));
const get = (port, p) => new Promise((r, j) => http.get({ host: "127.0.0.1", port, path: p }, (res) => { let b = ""; res.on("data", (d) => (b += d)); res.on("end", () => r({ status: res.statusCode, body: b })); }).on("error", j));

test("GET / serves the page with the data embedded", async () => {
  const dir = tmp();
  fs.writeFileSync(path.join(dir, "hotel-data.json"), JSON.stringify({ hotel: { name: "Casa Azul" } }));
  const srv = createServer({ dir, templatePath: TPL });
  const port = await listen(srv);
  const res = await get(port, "/");
  srv.close();
  assert.equal(res.status, 200);
  assert.match(res.body, /Casa Azul/);
});

test("unknown paths return 404 and never read other files", async () => {
  const srv = createServer({ dir: tmp(), templatePath: TPL });
  const port = await listen(srv);
  const res = await get(port, "/../../etc/passwd");
  srv.close();
  assert.equal(res.status, 404);
});

test("/events sends update after a valid save and nothing after a broken one", async () => {
  const dir = tmp();
  const f = path.join(dir, "hotel-data.json");
  fs.writeFileSync(f, "{}");
  const srv = createServer({ dir, templatePath: TPL });
  const port = await listen(srv);
  const events = [];
  const req = http.get({ host: "127.0.0.1", port, path: "/events" }, (res) => res.on("data", (d) => events.push(String(d))));
  await new Promise((r) => setTimeout(r, 200));
  fs.writeFileSync(f, "{ broken");
  await new Promise((r) => setTimeout(r, 600));
  assert.ok(!events.join("").includes("event: update"), "no update for broken JSON");
  fs.writeFileSync(f, JSON.stringify({ updated_at: "2026-09-23T10:00:00+08:00" }));
  await new Promise((r) => setTimeout(r, 600));
  req.destroy(); srv.close();
  assert.ok(events.join("").includes("event: update"));
});
```

- [ ] **Step 2: Run and see them fail**

Run: `node --test tests/dashboard.test.js`
Expected: FAIL, `createServer is not a function`.

- [ ] **Step 3: Implement createServer()**

```js
// add to bin/dashboard.js, above module.exports
function createServer({ dir, templatePath }) {
  const clients = new Set();
  let timer = null;
  let watcher = null;
  const push = () => {
    if (!readData(dir)) return; // mid-write or broken: wait for the next save
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
      return res.end(render(dir, templatePath));
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
  srv.on("close", () => { clearTimeout(timer); if (watcher) watcher.close(); for (const r of clients) r.end(); });
  return srv;
}

module.exports = { render, readData, createServer };
```

(Replace the earlier `module.exports` line with this one.)

- [ ] **Step 4: Run and see them pass**

Run: `node --test tests/dashboard.test.js`
Expected: 7 pass.

- [ ] **Step 5: Commit**

```bash
git add bin/dashboard.js tests/dashboard.test.js
git commit -m "feat: push a dashboard update when hotel-data.json changes"
```

## Task 3: start() and the CLI command

**Files:** modify `bin/dashboard.js`, modify `bin/cli.js`, modify `tests/cli.test.js`

- [ ] **Step 1: Write the failing test**

```js
// append to tests/cli.test.js
test("help lists the dashboard command", () => {
  const out = execFileSync("node", [CLI, "help"], { encoding: "utf8" });
  assert.match(out, /dashboard/);
});
```

- [ ] **Step 2: Run and see it fail**

Run: `node --test tests/cli.test.js`
Expected: FAIL on "help lists the dashboard command".

- [ ] **Step 3: Implement start() and wire the command**

```js
// add to bin/dashboard.js, above module.exports
const { execFile } = require("node:child_process");

function findTemplate() {
  const os = require("node:os");
  const installed = path.join(process.env.CLAUDE_SKILLS_DIR || path.join(os.homedir(), ".claude", "skills"), "hotel-dashboard", "templates", "dashboard.html");
  if (fs.existsSync(installed)) return installed;
  return path.join(__dirname, "..", "hotel-dashboard", "templates", "dashboard.html");
}

function start({ dir = process.cwd(), port = 4747, open = true } = {}) {
  const srv = createServer({ dir, templatePath: findTemplate() });
  srv.on("error", (e) => {
    if (e.code === "EADDRINUSE" && port < 4757) return start({ dir, port: port + 1, open });
    console.error(`Could not start the dashboard: ${e.message}`); process.exit(1);
  });
  srv.listen(port, "127.0.0.1", () => {
    const url = `http://127.0.0.1:${port}/`;
    const has = fs.existsSync(path.join(dir, "hotel-data.json"));
    console.log(`Open Conxi dashboard: ${url}`);
    console.log(has ? `Watching ${path.join(dir, "hotel-data.json")}. The page updates itself after every skill run.` : `No hotel-data.json in ${dir} yet. Run hotel-setup here, the page will fill in on its own.`);
    console.log("Press Ctrl+C to stop.");
    if (open) {
      const cmd = process.platform === "darwin" ? "open" : process.platform === "win32" ? "explorer" : "xdg-open";
      execFile(cmd, [url], () => {});
    }
  });
}

module.exports = { render, readData, createServer, start };
```

In `bin/cli.js`, add to `usage()` after the `list` line:

```js
  console.log("  dashboard  serve the hotel dashboard from this folder; it updates after every skill run");
```

change the usage line to `Usage: npx open-conxi <install|update|uninstall|list|dashboard|help>`, and add to `fns`:

```js
dashboard: () => {
  const a = process.argv;
  const i = a.indexOf("--port");
  require("./dashboard.js").start({ port: i > -1 ? Number(a[i + 1]) : 4747, open: !a.includes("--no-open") });
},
```

- [ ] **Step 4: Run all tests**

Run: `npm test`
Expected: all pass (6 existing CLI tests, 1 new, 7 dashboard).

- [ ] **Step 5: Commit**

```bash
git add bin/ tests/cli.test.js
git commit -m "feat: npx open-conxi dashboard"
```

## Task 4: the page listens

**Files:** modify `hotel-dashboard/templates/dashboard.html`

- [ ] **Step 1: Add the live marker to the top bar**

Replace `<div class="eyebrow" id="asof"></div>` with:

```html
<div class="eyebrow" id="asof"></div><span class="pill copper" id="live" hidden>Live</span>
```

and wrap both in a flex span so they sit together on the right:

```html
<span style="display:flex;gap:12px;align-items:center"><div class="eyebrow" id="asof"></div><span class="pill copper" id="live" hidden>Live</span></span>
```

- [ ] **Step 2: Add the listener at the end of the main script**

```js
if(location.protocol.startsWith('http')&&window.EventSource){
 try{const y=sessionStorage.getItem('oc-scroll');if(y){scrollTo(0,+y);sessionStorage.removeItem('oc-scroll');}}catch(e){}
 const es=new EventSource('/events');const live=document.getElementById('live');
 es.onopen=()=>{live.hidden=false;};es.onerror=()=>{live.hidden=true;};
 es.addEventListener('update',()=>{try{sessionStorage.setItem('oc-scroll',scrollY);}catch(e){}location.reload();});
}
```

- [ ] **Step 3: Verify by hand**

```bash
cd "$(mktemp -d)" && cp ~/Desktop/claudine/projects/open-conxi/mock/hotel-data.json . && node ~/Desktop/claudine/projects/open-conxi/bin/cli.js dashboard
```

Expected: the browser opens on the Ampang Row sample with a copper "Live" pill. In another terminal, change `hotel.name` in `hotel-data.json` and save. The page reloads within a second, keeps its scroll position and shows the new name. Save broken JSON: nothing happens. Stop the server: the Live pill disappears. Open `dashboard.html` as a file: no pill, no errors in the console.

- [ ] **Step 4: Commit**

```bash
git add hotel-dashboard/templates/dashboard.html
git commit -m "feat: dashboard page reloads itself when served live"
```

## Task 5: docs, lint, zips

**Files:** modify `hotel-dashboard/SKILL.md`, `README.md`, regenerate `mock/outputs/hotel-dashboard/dashboard.html` and `dist/`

- [ ] **Step 1: SKILL.md, section 2, step 3, append**

```
To keep the page current without re-running this skill, tell the GM they can run `npx open-conxi dashboard` in the working folder; it serves this page and reloads it every time a skill saves hotel-data.json.
```

- [ ] **Step 2: README.md, after the install section**

```
### Live dashboard (Claude Code)

Run `npx open-conxi dashboard` in your hotel's working folder. It opens the dashboard at http://127.0.0.1:4747 and updates the page every time a skill saves hotel-data.json. Nothing leaves your machine. Ctrl+C stops it.
```

- [ ] **Step 3: Regenerate the mock page and zips, lint, test**

```bash
python3 scripts/lint.py && npm test && bash scripts/build-zips.sh
```

Expected: 12/12 skills pass, prose ok, all tests pass, zips rebuilt.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "docs: live dashboard in README and hotel-dashboard skill"
```
