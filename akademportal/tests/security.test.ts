import test from "node:test";
import assert from "node:assert/strict";
import { hasStrongPassword, sanitizeText } from "../lib/security";

test("sanitizeText removes script tags", () => {
  const input = 'hello <script>alert("x")</script> world';
  const out = sanitizeText(input);
  assert.equal(out.includes("<script>"), false);
  assert.equal(out, 'hello alert("x") world');
});

test("hasStrongPassword validates complexity", () => {
  assert.equal(hasStrongPassword("weakpass"), false);
  assert.equal(hasStrongPassword("StrongPass1!"), true);
});
