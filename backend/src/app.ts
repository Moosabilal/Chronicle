import 'reflect-metadata';
import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { globalErrorHandler } from './middlewares/error.middleware';
import routes from './routes';

const app: Application = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// Mount central router
app.use('/api/v1', routes);

// Global error handler
app.use(globalErrorHandler);

export default app;
