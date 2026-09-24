import { Router } from 'express';
import { getCompetition, registerForCompetition, createSubmission } from '../controllers/competitionController.js';
import { requireUser } from '../middleware/auth.js';
import Joi from 'joi';

const router = Router();
const submissionSchema = Joi.object({ submissionUrl: Joi.string().uri({ scheme: ['http', 'https'] }).required() });

function validateSubmission(req, res, next) {
  const { error } = submissionSchema.validate(req.body);
  if (error) return res.status(400).json({ success: false, message: error.details[0].message });
  next();
}

router.get('/:competitionId', requireUser, getCompetition);
router.post('/:competitionId/register', requireUser, registerForCompetition);
router.post('/:competitionId/submission', requireUser, validateSubmission, createSubmission);

export default router;
