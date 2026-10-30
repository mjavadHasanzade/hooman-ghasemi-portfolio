import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const testRequire = createRequire(import.meta.url);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const code = ts.transpileModule(fs.readFileSync(path.join(root, "lib/rich-text.ts"), "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true },
}).outputText;
const testModule = { exports: {} };
vm.runInNewContext(code, { module: testModule, exports: testModule.exports, require: testRequire });
const { richTextHtml, richTextPlainText, revealRichText, shouldReplaceEditorContent } = testModule.exports;

test("legacy plain text stays readable and special characters are escaped", () => {
  assert.equal(richTextHtml("Design & build <3\nNext line"), "<p>Design &amp; build &lt;3<br />Next line</p>");
  assert.equal(richTextPlainText("Design & build <3\nNext line"), "Design & build <3\nNext line");
});

test("editor formatting, nested lists, RTL/LTR and justification survive rendering", () => {
  const html = '<p dir="rtl" style="text-align: justify"><strong>سلام</strong> <em>World</em> <u>text</u></p><ol start="3" dir="ltr" style="list-style-type: upper-roman"><li>One<ul style="list-style-type: square"><li>Nested</li></ul></li></ol>';
  const rendered = richTextHtml(html);
  for (const fragment of ['dir="rtl"', 'text-align:justify', '<strong>سلام</strong>', '<em>World</em>', '<u>text</u>', 'start="3"', 'dir="ltr"', 'list-style-type:upper-roman', 'list-style-type:square']) {
    assert.ok(rendered.includes(fragment), fragment);
  }
  assert.equal(richTextHtml(rendered), rendered);
});

test("scripts, event handlers, unsafe links and unapproved styles are removed", () => {
  const rendered = richTextHtml('<script>alert(1)</script><p onclick="alert(1)" style="position:fixed;text-align:center">Safe</p><a href="javascript:alert(1)" target="_blank">Link</a>');
  assert.ok(!/script|onclick|position:fixed|javascript:/.test(rendered));
  assert.ok(rendered.includes('text-align:center'));
  assert.ok(rendered.includes('rel="noopener noreferrer"'));
});

test("summaries strip formatting and decode entities consistently; empty editors are empty", () => {
  assert.equal(richTextPlainText('<p><strong>A &amp; B</strong></p><ul><li>First</li><li>Second</li></ul>'), 'A & B\nFirst\nSecond');
  assert.equal(richTextPlainText('<p><br></p>'), '');
  assert.equal(richTextPlainText('<p>&nbsp;</p>'), '');
});

test("typewriter reveals visible characters without broken tags or entities", () => {
  const html = '<p dir="rtl"><strong>A &amp; B</strong> <em>سلام</em></p>';
  assert.equal(richTextPlainText(revealRichText(html, 3), false), 'A &');
  assert.ok(revealRichText(html, 3).includes('<strong>A &amp;</strong>'));
  assert.equal(richTextPlainText(revealRichText(html, 0)), '');
  assert.equal(revealRichText(html, 999), richTextHtml(html));
});


test("typewriter cursor stays inside the aligned RTL paragraph at the visible text boundary", () => {
  const html = '<p dir="rtl" style="text-align:right"><strong>سلام</strong> world</p>';
  const revealed = revealRichText(html, 2, true);
  assert.match(revealed, /<p dir="rtl" style="text-align:right"><strong>سل<span/);
  assert.equal((revealed.match(/typewriter-cursor/g) ?? []).length, 1);
  assert.equal(richTextPlainText(revealed), "سل");
  assert.match(revealRichText('<p></p>', 0, true), /<p><span.*<\/span><\/p>/);
});


test("controlled editor echoes and equivalent CSS serialization do not reset selection or undo", () => {
  const typed = '<p style="text-align: center;">Fir</p><p style="text-align: center;">st paragraph.</p><p>Last paragraph.</p>';
  assert.equal(shouldReplaceEditorContent(typed, typed), false);
  assert.equal(shouldReplaceEditorContent(richTextHtml(typed), typed), false);
  assert.equal(shouldReplaceEditorContent('First paragraph.', '<p>First paragraph.</p>'), false);
  assert.equal(shouldReplaceEditorContent('<p>External update</p>', typed), true);
  assert.equal(shouldReplaceEditorContent('', typed), true);
});
