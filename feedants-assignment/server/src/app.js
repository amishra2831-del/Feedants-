import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import competitionRoutes from './routes/competitionRoutes.js';
import { notFound, errorHandler } from './middleware/error.js';
import { config } from './config.js';

const app = express();
app.use(helmet());
app.use(cors({ origin: config.clientOrigin === '*' ? true : config.clientOrigin }));
app.use(express.json({ limit: '100kb' }));
app.use(morgan('dev'));

app.get('/api/v1/health', (req, res) => res.json({ success: true, service: 'feedants-competition-api', time: new Date().toISOString() }));
app.use('/api/v1/competitions', competitionRoutes);
app.use(notFound);
app.use(errorHandler);

export default app;
