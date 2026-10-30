import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import axios from "axios";

const testRequire = createRequire(import.meta.url);
const testDirectory = path.dirname(fileURLToPath(import.meta.url));

function browser() {
  const window = new EventTarget();
  const document = new EventTarget();
  const writes = [];
  document.visibilityState = "visible";
  window.localStorage = { setItem: (...args) => writes.push(args) };
  return { window, document, writes };
}

function load(file, env, dependencies = {}) {
  const source = fs.readFileSync(path.join(testDirectory, "..", file), "utf8");
  const code = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  const testModule = { exports: {} };
  vm.runInNewContext(code, {
    ...env, module: testModule, exports: testModule.exports, Event, console, process, setTimeout, clearTimeout,
    require: (name) => name in dependencies ? dependencies[name] : testRequire(name),
  }, { filename: file });
  return testModule.exports;
}

function storageEvent(key) {
  return Object.assign(new Event("storage"), { key });
}

test("successful content writes notify; reads, authentication and failures do not", async () => {
  const env = browser();
  const sync = load("lib/public-content-sync.ts", env);
  const { apiClient } = load("lib/api/client.ts", env, {
    "../public-content-sync": sync,
    "../constants": { REFRESH_TOKEN_STORAGE_KEY: "cms_refresh_token" },
  });
  apiClient.defaults.adapter = async (config) => ({ config, data: { success: true }, status: 200, statusText: "OK", headers: {} });
  let refreshes = 0;
  const unsubscribe = sync.subscribeToPublicContentChanges(() => refreshes++);
  for (const url of ["/admin/hero", "/admin/projects/id", "/admin/services/reorder", "/admin/media", "/admin/contact-cta/phrases/id", "/admin/site-settings", "/admin/tech-icons/id", "/admin/social-links/id", "/admin/footer", "/admin/about"]) {
    await apiClient.patch(url, {});
  }
  await apiClient.post("/admin/projects", {});
  await apiClient.delete("/admin/projects/id");
  assert.equal(refreshes, 12);
  assert.equal(env.writes.length, 12);
  await apiClient.get("/admin/projects");
  await apiClient.post("/admin/auth/refresh", {});
  await apiClient.patch("/admin/auth/profile", {});
  assert.equal(refreshes, 12);
  apiClient.defaults.adapter = async () => { throw new axios.AxiosError("Save failed"); };
  await assert.rejects(apiClient.patch("/admin/hero", {}));
  assert.equal(refreshes, 12);
  apiClient.defaults.adapter = async (config) => ({ config, data: { success: false }, status: 200, headers: {} });
  await apiClient.patch("/admin/hero", {});
  assert.equal(refreshes, 12);
  unsubscribe();
});

test("other tabs refresh only for content changes; hidden tabs catch up on return", () => {
  const env = browser();
  const sync = load("lib/public-content-sync.ts", env);
  let refreshes = 0;
  const unsubscribe = sync.subscribeToPublicContentChanges(() => refreshes++);
  env.window.dispatchEvent(storageEvent("unrelated-key"));
  assert.equal(refreshes, 0);
  env.window.dispatchEvent(storageEvent("cms_public_content_revision"));
  assert.equal(refreshes, 1);
  env.document.visibilityState = "hidden";
  env.window.dispatchEvent(storageEvent("cms_public_content_revision"));
  assert.equal(refreshes, 1);
  env.document.visibilityState = "visible";
  env.document.dispatchEvent(new Event("visibilitychange"));
  env.window.dispatchEvent(new Event("focus"));
  env.window.dispatchEvent(new Event("pageshow"));
  assert.equal(refreshes, 4);
  unsubscribe();
  env.window.dispatchEvent(storageEvent("cms_public_content_revision"));
  env.window.dispatchEvent(new Event("focus"));
  env.document.dispatchEvent(new Event("visibilitychange"));
  assert.equal(refreshes, 4);
});

test("disabled storage never turns a successful save into an error", () => {
  const env = browser();
  env.window.localStorage.setItem = () => { throw new Error("Storage disabled"); };
  const sync = load("lib/public-content-sync.ts", env);
  let refreshes = 0;
  const unsubscribe = sync.subscribeToPublicContentChanges(() => refreshes++);
  assert.doesNotThrow(() => sync.notifyPublicContentChanged());
  assert.equal(refreshes, 1);
  unsubscribe();
  const serverSync = load("lib/public-content-sync.ts", {});
  assert.doesNotThrow(() => serverSync.notifyPublicContentChanged());
});

test("route refreshes coalesce notifications and cancel work on unmount", async () => {
  const env = browser();
  const sync = load("lib/public-content-sync.ts", env);
  let effect;
  let refreshes = 0;
  const { default: PublicContentSync } = load("components/common/PublicContentSync.tsx", env, {
    react: { useEffect: (callback) => { effect = callback; } },
    "next/navigation": { useRouter: () => ({ refresh: () => refreshes++ }), usePathname: () => "/fa" },
    "@/lib/public-content-sync": sync,
  });
  assert.equal(PublicContentSync(), null);
  const cleanup = effect();
  env.window.dispatchEvent(new Event("focus"));
  sync.notifyPublicContentChanged();
  await new Promise((resolve) => setTimeout(resolve, 90));
  assert.equal(refreshes, 1);
  sync.notifyPublicContentChanged();
  cleanup();
  await new Promise((resolve) => setTimeout(resolve, 90));
  assert.equal(refreshes, 1);
});
