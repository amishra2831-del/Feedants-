import mongoose from 'mongoose';
import { Competition } from '../models/Competition.js';
import { Participant } from '../models/Participant.js';
import { Submission } from '../models/Submission.js';
import { serializeCompetition } from '../utils/serialize.js';
import { getLifecycle } from '../utils/lifecycle.js';

export async function getCompetition(req, res) {
  const { competitionId } = req.params;
  if (!mongoose.isValidObjectId(competitionId)) return res.status(400).json({ success: false, message: 'Invalid competition id.' });
  const competition = await Competition.findById(competitionId).lean();
  if (!competition) return res.status(404).json({ success: false, message: 'Competition not found.' });
  const [participant, submission] = await Promise.all([
    Participant.findOne({ competitionId, userId: req.userId, status: 'REGISTERED' }).lean(),
    Submission.findOne({ competitionId, userId: req.userId }).lean()
  ]);
  res.json({ success: true, data: serializeCompetition(competition, participant, submission) });
}

export async function registerForCompetition(req, res) {
  const { competitionId } = req.params;
  if (!mongoose.isValidObjectId(competitionId)) return res.status(400).json({ success: false, message: 'Invalid competition id.' });

  const competition = await Competition.findById(competitionId);
  if (!competition) return res.status(404).json({ success: false, message: 'Competition not found.' });

  const now = new Date();
  if (getLifecycle(competition, now) !== 'REGISTRATION_OPEN') {
    return res.status(409).json({ success: false, message: 'Registration is not currently open.' });
  }

  const existing = await Participant.findOne({ competitionId, userId: req.userId });
  if (existing?.status === 'REGISTERED') {
    return res.json({ success: true, message: 'Already registered.', data: { isRegistered: true } });
  }

  // Critical concurrency rule: only one request can increment the count while capacity remains.
  const reserved = await Competition.findOneAndUpdate(
    { _id: competitionId, registeredCount: { $lt: competition.maxParticipants } },
    { $inc: { registeredCount: 1 } },
    { new: true }
  );

  if (!reserved) {
    return res.status(409).json({ success: false, message: 'Registration is full.' });
  }

  try {
    await Participant.create({ competitionId, userId: req.userId });
  } catch (error) {
    // If a duplicate request raced this one, compensate the count only for the request that failed.
    if (error.code === 11000) {
      await Competition.updateOne({ _id: competitionId, registeredCount: { $gt: 0 } }, { $inc: { registeredCount: -1 } });
      return res.json({ success: true, message: 'Already registered.', data: { isRegistered: true } });
    }
    await Competition.updateOne({ _id: competitionId, registeredCount: { $gt: 0 } }, { $inc: { registeredCount: -1 } });
    throw error;
  }

  res.status(201).json({ success: true, message: 'Registration successful.', data: { isRegistered: true, registeredCount: reserved.registeredCount } });
}

export async function createSubmission(req, res) {
  const { competitionId } = req.params;
  if (!mongoose.isValidObjectId(competitionId)) return res.status(400).json({ success: false, message: 'Invalid competition id.' });
  const competition = await Competition.findById(competitionId).lean();
  if (!competition) return res.status(404).json({ success: false, message: 'Competition not found.' });
  if (getLifecycle(competition) !== 'SUBMISSION_OPEN') return res.status(409).json({ success: false, message: 'Submission window is not open.' });

  const participant = await Participant.findOne({ competitionId, userId: req.userId, status: 'REGISTERED' });
  if (!participant) return res.status(403).json({ success: false, message: 'Register before submitting.' });

  const submission = await Submission.findOneAndUpdate(
    { competitionId, userId: req.userId },
    { $set: { submissionUrl: req.body.submissionUrl, submittedAt: new Date(), status: 'SUBMITTED' } },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );
  res.status(200).json({ success: true, message: 'Submission saved.', data: submission });
}
