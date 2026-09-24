import { connectDB, disconnectDB } from './db.js';
import { Competition } from './models/Competition.js';

const now = new Date();
const addDays = d => new Date(now.getTime() + d * 86400000);

const competition = {
  title: 'Feedants Classical Dance',
  category: 'Dance',
  format: 'Multi-Win',
  prizePool: 1500,
  entryFee: 99,
  maxParticipants: 20,
  registeredCount: 1,
  registrationStartsAt: addDays(-1),
  registrationEndsAt: addDays(1),
  submissionStartsAt: addDays(-1),
  submissionEndsAt: addDays(7),
  resultAt: addDays(9),
  description: 'This is an online classical dance competition open for all age groups. Participate from anywhere and showcase your talent. Express your passion through traditional dance.',
  judgingParameters: ['Technique & precision', 'Expression & storytelling', 'Rhythm & musicality', 'Presentation & costume'],
  rules: ['One submission per participant during the submission window.', 'Video must be the participant’s original performance.', 'Keep the submission link accessible to judges until results are published.', 'Respectful and appropriate content is required.'],
  judge: {
    name: 'Manju Dubey',
    title: 'Professional Kathak Dancer',
    experience: '12+ Years of Experience',
    imageUrl: 'https://i.pravatar.cc/240?img=47',
    introVideoUrl: 'https://example.com/judge-intro'
  },
  previousWinners: [
    { name: 'Riya Shah', position: '1st Winner', imageUrl: 'https://i.pravatar.cc/180?img=32', videoUrl: 'https://example.com/riya' },
    { name: 'Aarav Mehta', position: '1st Winner', imageUrl: 'https://i.pravatar.cc/180?img=12', videoUrl: 'https://example.com/aarav' },
    { name: 'Neha Verma', position: '2nd Winner', imageUrl: 'https://i.pravatar.cc/180?img=44', videoUrl: 'https://example.com/neha' },
    { name: 'Ishita Chopra', position: '3rd Winner', imageUrl: 'https://i.pravatar.cc/180?img=49', videoUrl: 'https://example.com/ishita' }
  ],
  rewards: [
    { position: 1, label: '1st Winner', amount: 550 },
    { position: 2, label: '2nd Winner', amount: 300 },
    { position: 3, label: '3rd Winner', amount: 240 },
    { position: 4, label: '4th Winner', amount: 200 },
    { position: 5, label: '5th Winner', amount: 130 },
    { position: 6, label: '6th Winner', amount: 80 }
  ],
  disclaimer: 'Only contributions from paid participants will be considered for judging.',
  paymentNote: 'Secure payments powered by Razorpay',
  refundPolicy: 'Refund policy available before the applicable cutoff.',
  referralAmount: 10
};

await connectDB();
await Competition.deleteMany({});
const created = await Competition.create(competition);
console.log(`Seeded competition: ${created._id}`);
await disconnectDB();
