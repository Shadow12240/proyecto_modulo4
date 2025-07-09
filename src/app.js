import express from 'express';

const app=express();

//impoer routes
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/users.routes.js';
import taskRoutes from './routes/tasks.routes.js';
import morgan from 'morgan';
import errorHandler from './middleware/errorhandler.js';
import notFound from './middleware/notFound.js';
import { authenticateToken } from './middleware/authenticate.js';

//middlewares
app.use(morgan('dev'));
app.use(express.json());

//Routes
app.use('/api/login', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tasks',authenticateToken, taskRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;