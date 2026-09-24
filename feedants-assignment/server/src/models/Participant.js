import mongoose from 'mongoose';

const participantSchema = new mongoose.Schema({
  competitionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Competition', required: true },
  userId: { type: String, required: true, trim: true },
  registeredAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['REGISTERED', 'CANCELLED'], default: 'REGISTERED' }
}, { timestamps: true });

participantSchema.index({ competitionId: 1, userId: 1 }, { unique: true });
participantSchema.index({ competitionId: 1, status: 1 });

export const Participant = mongoose.model('Participant', participantSchema);
