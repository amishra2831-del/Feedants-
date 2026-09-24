import { getLifecycle } from '../src/utils/lifecycle.js';

test('calculates registration lifecycle', () => {
  const base = new Date('2026-01-01T00:00:00Z');
  const c = { registrationStartsAt: '2025-12-31T00:00:00Z', registrationEndsAt: '2026-01-02T00:00:00Z', submissionStartsAt: '2026-01-02T00:00:00Z', submissionEndsAt: '2026-01-03T00:00:00Z', resultAt: '2026-01-04T00:00:00Z' };
  expect(getLifecycle(c, base)).toBe('REGISTRATION_OPEN');
});
