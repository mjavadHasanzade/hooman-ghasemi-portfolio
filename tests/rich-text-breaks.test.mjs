import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
function load(file, dependencies = {}) {
  const code = ts.transpileModule(fs.readFileSync(path.join(root, file), "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true },
  }).outputText;
  const testModule = { exports: {} };
  vm.runInNewContext(code, { module: testModule, exports: testModule.exports,
    require: (id) => dependencies[id] ?? require(id) });
  return testModule.exports;
}
const richText = load("lib/rich-text.ts");
const { RichTextContent, ProjectCardExcerpt } = load("lib/rich-text-react.ts", { "./rich-text": richText });
const render = (value, props = {}) => renderToStaticMarkup(createElement(RichTextContent, { value, ...props }));

test("Enter-created empty paragraphs retain visible blank lines before the project DOI", () => {
  const value = '<p>توضیحات پروژه</p><p></p><p></p><p dir="ltr">https://doi.org/example</p>';
  assert.equal(render(value), '<p>توضیحات پروژه</p><p><br/></p><p><br/></p><p dir="ltr">https://doi.org/example</p>');
  assert.match(render('<p dir="rtl" style="line-height:16px"></p>'), /^<p style="line-height:clamp\([^"]+, 16px\)" dir="rtl"><br\/><\/p>$/);
});

test("Shift+Enter breaks and legacy newlines remain single breaks", () => {
  assert.equal(render('<p>First<br>Second</p>'), '<p>First<br/>Second</p>');
  assert.equal(render('First\n\nSecond'), '<p>First<br/><br/>Second</p>');
});

test("inline summaries and project card excerpts do not acquire extra breaks", () => {
  const value = '<p>First</p><p></p><p>Second</p>';
  assert.doesNotMatch(render(value, { inline: true }), /<br/);
  assert.equal(renderToStaticMarkup(createElement(ProjectCardExcerpt, { value })), 'First');
});
