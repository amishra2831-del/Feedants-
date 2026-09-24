export function getLifecycle(c, now = new Date()) {
  const t = now.getTime();
  const start = new Date(c.registrationStartsAt).getTime();
  const end = new Date(c.registrationEndsAt).getTime();
  const submissionStart = new Date(c.submissionStartsAt).getTime();
  const submissionEnd = new Date(c.submissionEndsAt).getTime();
  const result = new Date(c.resultAt).getTime();

  if (t < start) return 'UPCOMING';
  if (t <= end) return 'REGISTRATION_OPEN';
  if (t >= submissionStart && t <= submissionEnd) return 'SUBMISSION_OPEN';
  if (t < result) return 'JUDGING';
  return 'RESULT_PUBLISHED';
}

export function getCountdownTarget(c, lifecycle) {
  const targets = {
    UPCOMING: c.registrationStartsAt,
    REGISTRATION_OPEN: c.registrationEndsAt,
    SUBMISSION_OPEN: c.submissionEndsAt,
    JUDGING: c.resultAt
  };
  return targets[lifecycle] || null;
}
