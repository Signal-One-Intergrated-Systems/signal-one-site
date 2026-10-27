import test from 'node:test';
import assert from 'node:assert/strict';
import { truthRules } from '../../scripts/public-truth-rules.mjs';
const flagged = text => truthRules.some(([rule]) => rule.test(text));
test('invented dashboard figures and prohibited product claims remain rejected', () => { for(const text of ['Response time 3:41', 'Irongate', '98.6%', '180+ countries', 'Verified', 'Enterprise', 'Shared Phone']) assert.equal(flagged(text),true,text); });
test('ISO sitemap timestamps cannot be mistaken for a dashboard response-time metric', () => { for(const text of ['2026-10-27T11:33:41.000Z', '2026-10-27T03:41:00.000Z', '2026-10-27T13:41:00.000Z']) assert.equal(flagged(text),false,text); });
