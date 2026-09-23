// Sends a skill's team message to a staff chat through Beeper Desktop, which
// bridges WhatsApp, Telegram, Signal, Slack and more on the manager's own
// computer. Default is a draft: the text lands in the chat's message box and a
// person presses send. Node built-ins only.
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const readline = require("node:readline");

const CONFIG = path.join(os.homedir(), ".open-conxi", "beeper.json");
const CONNECT = "Run: npx open-conxi team connect";
// One skill's message is under 600 characters; hotel-routine merges several into one under 900.
const MAX_CHARS = 900;

function loadConfig() {
  let saved = {};
  try { saved = JSON.parse(fs.readFileSync(CONFIG, "utf8")); } catch { /* not connected yet */ }
  return {
    url: process.env.BEEPER_URL || saved.url || "http://127.0.0.1:23373",
    token: process.env.BEEPER_TOKEN || saved.token || "",
  };
}

// team_chats in hotel-profile.md maps a role to a chat name as it shows in Beeper:
//   team_chats:
//     housekeeping: "Housekeeping team"
function readTeamChats(dir) {
  let text;
  try { text = fs.readFileSync(path.join(dir, "hotel-profile.md"), "utf8"); } catch { return {}; }
  const out = {};
  const flow = text.match(/^team_chats:\s*\{(.*)\}\s*$/m);
  if (flow) {
    for (const m of flow[1].matchAll(/([\w-]+):\s*(?:"([^"]*)"|'([^']*)'|([^,}]*))/g)) {
      const v = (m[2] ?? m[3] ?? m[4] ?? "").trim();
      if (v) out[m[1]] = v;
    }
    return out;
  }
  let inBlock = false;
  for (const line of text.split("\n")) {
    if (/^team_chats:\s*$/.test(line)) { inBlock = true; continue; }
    if (!inBlock) continue;
    const m = line.match(/^\s+([\w-]+):\s*["']?(.*?)["']?\s*(#.*)?$/);
    if (!m) break;
    if (m[2]) out[m[1]] = m[2];
  }
  return out;
}

async function api(cfg, method, route, body) {
  if (!cfg.token) throw new Error(`Beeper is not connected yet. ${CONNECT}`);
  let res;
  try {
    res = await fetch(cfg.url + route, {
      method,
      headers: { authorization: `Bearer ${cfg.token}`, "content-type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new Error("Could not reach Beeper. Open Beeper Desktop on this computer and try again.");
  }
  const text = await res.text();
  let data = {};
  try { data = JSON.parse(text); } catch { /* empty or plain body */ }
  if (res.status === 401 || res.status === 403) throw new Error(`Beeper turned down the access token. ${CONNECT}`);
  if (!res.ok) {
    const err = new Error(data.message || `Beeper answered ${res.status}`);
    err.status = res.status;
    throw err;
  }
  return data;
}

async function listChats(cfg, query = "") {
  const q = new URLSearchParams({ query, limit: "50" });
  const data = await api(cfg, "GET", `/v1/chats/search?${q}`);
  return data.items || [];
}

async function resolveChat(cfg, name) {
  const items = await listChats(cfg, name);
  const exact = items.filter((c) => (c.title || "").trim().toLowerCase() === name.trim().toLowerCase());
  if (exact.length === 1) return exact[0];
  // Beeper's search misses misspellings, so rank recent chats by spelling too.
  const seen = new Set(items.map((c) => c.id));
  const pool = items.concat((await listChats(cfg, "").catch(() => [])).filter((c) => !seen.has(c.id)));
  const close = pool.map((c) => ({ c, d: distance(c.title || "", name) })).sort((x, y) => x.d - y.d).slice(0, 5).map((x) => x.c);
  const list = close.map((c) => `  ${c.title} (${c.network})`).join("\n");
  if (exact.length > 1) throw new Error(`More than one Beeper chat is called "${name}". Rename one in Beeper so each team chat has its own name.\n${list}`);
  throw new Error(`No Beeper chat is called "${name}".${list ? ` Closest:\n${list}` : ""}\nCopy the name exactly as Beeper shows it into team_chats in hotel-profile.md.`);
}

const ROLES = ["managers", "housekeeping", "maintenance", "all_staff"];

// Letters two names differ by, for "did you mean".
function distance(a, b) {
  a = a.toLowerCase(); b = b.toLowerCase();
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++)
    d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length];
}

async function deliver(cfg, { to, text, send = false, dir }) {
  if (!text || !text.trim()) throw new Error("The message is empty, nothing to send.");
  if (/[\u2013\u2014]/.test(text)) throw new Error("The message has long dashes in it. Rewrite those spots with a comma, a full stop or \"to\", then try again.");
  if (text.length > MAX_CHARS) throw new Error(`The message is ${text.length} characters. Keep it under ${MAX_CHARS} so staff read it on a phone: cut it down and try again.`);
  const roles = dir ? readTeamChats(dir) : {};
  if (ROLES.includes(to) && !roles[to]) throw new Error(`hotel-profile.md in this folder names no ${to} chat under team_chats. Add the chat name exactly as Beeper shows it, or use --to "Chat name".`);
  const name = roles[to] || to;
  const chat = await resolveChat(cfg, name);
  const id = encodeURIComponent(chat.id);
  if (send) {
    await api(cfg, "POST", `/v1/chats/${id}/messages`, { text });
    return `Sent to ${chat.title} (${chat.network}).`;
  }
  try {
    await api(cfg, "PATCH", `/v1/chats/${id}`, { draft: { text } });
  } catch (e) {
    if (e.status === 400) throw new Error(`${chat.title} already has unsent text in its message box. Send or delete it in Beeper, then try again. Open Conxi never overwrites it.`);
    throw e;
  }
  return `Draft is waiting in ${chat.title} (${chat.network}). Open Beeper, check it, press send.`;
}

function ask(q) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((r) => rl.question(q, (a) => { rl.close(); r(a.trim()); }));
}

async function connect(given) {
  console.log("Connect Open Conxi to Beeper Desktop.\n");
  console.log("1. Open Beeper Desktop on this computer.");
  console.log("2. Go to Settings, then Developers. Turn on the Beeper Desktop API.");
  console.log("3. Create an access token with write access and copy it.\n");
  const token = given || await ask("Paste the token here: ");
  const cfg = { url: loadConfig().url, token };
  const accounts = await api(cfg, "GET", "/v1/accounts");
  fs.mkdirSync(path.dirname(CONFIG), { recursive: true });
  fs.writeFileSync(CONFIG, JSON.stringify(cfg, null, 2), { mode: 0o600 });
  const nets = [...new Set((Array.isArray(accounts) ? accounts : accounts.items || []).map((a) => a.network).filter(Boolean))];
  console.log(`\nConnected. Beeper has: ${nets.join(", ") || "no chat accounts yet"}.`);
  console.log("Next: run npx open-conxi team chats to see your chat names, then put them under team_chats in hotel-profile.md.");
}

async function cli(argv) {
  const sub = argv[0];
  const flag = (n) => {
    const i = argv.indexOf(n);
    if (i < 0) return undefined;
    const v = argv[i + 1];
    if (v === undefined || v.startsWith("--")) throw new Error(`${n} needs a value after it.`);
    return v;
  };
  const cfg = loadConfig();
  if (sub === "connect") return connect(argv.includes("--token") ? flag("--token") : undefined);
  if (sub === "chats") {
    const items = await listChats(cfg, argv[1] && !argv[1].startsWith("--") ? argv[1] : "");
    if (!items.length) return console.log("No chats found.");
    for (const c of items) console.log(`${c.title}  (${c.network}${c.type === "group" ? ", group" : ""})`);
    return;
  }
  if (sub === "roles") {
    const roles = readTeamChats(process.cwd());
    if (!Object.keys(roles).length) return console.log("No team_chats in hotel-profile.md in this folder yet.");
    for (const [k, v] of Object.entries(roles)) console.log(`${k}: ${v}`);
    return;
  }
  if (sub === "send") {
    const to = flag("--to");
    const file = flag("--file");
    let text = flag("--text");
    if (file) {
      try { text = fs.readFileSync(file, "utf8"); }
      catch { throw new Error(`Could not open ${file}. Check the file name and that you are in the hotel folder.`); }
    }
    if (!to) throw new Error("Say who it goes to: --to housekeeping (a role from team_chats) or --to \"Chat name\".");
    console.log(await deliver(cfg, { to, text, send: argv.includes("--send"), dir: process.cwd() }));
    return;
  }
  console.log("Usage: npx open-conxi team <connect|chats|roles|send>\n");
  console.log("  connect [--token T]             link Beeper Desktop (once)");
  console.log("  chats [search]                  list chat names as Beeper shows them");
  console.log("  roles                           show team_chats from hotel-profile.md");
  console.log("  send --to <role|chat> --file f  put the message in that chat as a draft");
  console.log("       add --send to send it straight away");
}

module.exports = { readTeamChats, resolveChat, deliver, listChats, cli };
