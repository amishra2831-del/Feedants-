import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
  competitionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Competition', required: true },
  userId: { type: String, required: true, trim: true },
  submissionUrl: { type: String, required: true },
  submittedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['SUBMITTED', 'REPLACED'], default: 'SUBMITTED' }
}, { timestamps: true });

submissionSchema.index({ competitionId: 1, userId: 1 }, { unique: true });

export const Submission = mongoose.model('Submission', submissionSchema);
