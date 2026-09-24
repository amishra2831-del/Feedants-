import { getCountdownTarget, getLifecycle } from './lifecycle.js';

export function serializeCompetition(c, participant, submission, now = new Date()) {
  const lifecycle = getLifecycle(c, now);
  const remainingSpots = Math.max(c.maxParticipants - c.registeredCount, 0);
  return {
    id: c._id.toString(),
    title: c.title,
    category: c.category,
    format: c.format,
    description: c.description,
    judgingParameters: c.judgingParameters,
    rules: c.rules,
    prizePool: c.prizePool,
    entryFee: c.entryFee,
    maxParticipants: c.maxParticipants,
    registeredCount: c.registeredCount,
    remainingSpots,
    registrationStartsAt: c.registrationStartsAt,
    registrationEndsAt: c.registrationEndsAt,
    submissionStartsAt: c.submissionStartsAt,
    submissionEndsAt: c.submissionEndsAt,
    resultAt: c.resultAt,
    lifecycle,
    countdownTarget: getCountdownTarget(c, lifecycle),
    judge: c.judge,
    previousWinners: c.previousWinners,
    rewards: c.rewards,
    disclaimer: c.disclaimer,
    paymentNote: c.paymentNote,
    refundPolicy: c.refundPolicy,
    referralAmount: c.referralAmount,
    userState: {
      isRegistered: Boolean(participant && participant.status === 'REGISTERED'),
      registeredAt: participant?.registeredAt || null,
      hasSubmission: Boolean(submission),
      submissionUrl: submission?.submissionUrl || null,
      submittedAt: submission?.submittedAt || null
    }
  };
}
