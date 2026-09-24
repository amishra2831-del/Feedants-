import mongoose from 'mongoose';

const rewardSchema = new mongoose.Schema({
  position: { type: Number, required: true, min: 1 },
  label: { type: String, required: true, trim: true },
  amount: { type: Number, required: true, min: 0 }
}, { _id: false });

const winnerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  position: { type: String, required: true },
  imageUrl: { type: String, default: '' },
  videoUrl: { type: String, default: '' }
}, { _id: false });

const competitionSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  category: { type: String, required: true },
  format: { type: String, required: true },
  description: { type: String, required: true },
  judgingParameters: { type: [String], default: [] },
  rules: { type: [String], default: [] },
  prizePool: { type: Number, required: true, min: 0 },
  entryFee: { type: Number, required: true, min: 0 },
  maxParticipants: { type: Number, required: true, min: 1 },
  registeredCount: { type: Number, default: 0, min: 0 },
  registrationStartsAt: { type: Date, required: true },
  registrationEndsAt: { type: Date, required: true },
  submissionStartsAt: { type: Date, required: true },
  submissionEndsAt: { type: Date, required: true },
  resultAt: { type: Date, required: true },
  judge: {
    name: { type: String, required: true },
    title: { type: String, required: true },
    experience: { type: String, required: true },
    imageUrl: { type: String, default: '' },
    introVideoUrl: { type: String, default: '' }
  },
  previousWinners: { type: [winnerSchema], default: [] },
  rewards: { type: [rewardSchema], default: [] },
  disclaimer: { type: String, default: '' },
  paymentNote: { type: String, default: '' },
  refundPolicy: { type: String, default: '' },
  referralAmount: { type: Number, default: 0, min: 0 }
}, { timestamps: true });

competitionSchema.index({ registrationEndsAt: 1 });
competitionSchema.index({ resultAt: 1 });

export const Competition = mongoose.model('Competition', competitionSchema);
