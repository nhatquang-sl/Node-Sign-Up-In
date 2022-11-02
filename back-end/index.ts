import 'express-async-errors';
import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import ENV from '@config';
import corsOptions from '@config/cors-options';
import { dbContext, initializeDb } from '@database';

import { mediator } from '@application/mediator';
import { AuthorizeBehavior } from '@application/common/behaviors/authorize';
import authRoute from '@controllers/auth';
import userRoute from '@controllers/user';
import bnbRoute from '@controllers/bnb';
import {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
  ConflictError,
} from '@application/common/exceptions';

console.log(ENV);

mediator.addPipelineBehavior(new AuthorizeBehavior());
const app = express();

// Cross Origin Resource Sharing
// app.use(cors());
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded data
// in other words, form data:
// 'content-type: application/x-www-form-urlencoded'
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

// Serve static files
const fePath = path.join(__dirname, 'public');
app.use('/', express.static(fePath));
const router = express.Router();
router.get('/health-check', (req, res) => {
  res.json({
    ENV: ENV.NODE_ENV,
    APP_VERSION: ENV.APP_VERSION,
  });
});

router.get('/meet', (req, res) => {
  res.redirect('https://meet.google.com/ekv-nqss-pky');
});

router.get('*', (req, res) => {
  res.sendFile(path.join(fePath, 'index.html'));
});

// Middleware function for logging the request method and request URL
const requestLogger = (request: Request, response: Response, next: NextFunction) => {
  console.log(`${request.method} url:: ${request.url}`);
  try {
    next();
  } catch (err) {
    console.log('------------------------------------');
  }
};

app.use(requestLogger);
app.use(cookieParser());
app.use('/auth', authRoute);
app.use('/user', userRoute);
app.use('/bnb', bnbRoute);
app.use('/', router);

// https://medium.com/@utkuu/error-handling-in-express-js-and-express-async-errors-package-639c91ba3aa2
const errorLogger = (error: Error, request: Request, response: Response, next: NextFunction) => {
  console.log(error);
  const { message } = error;
  const data = JSON.parse(message);
  if (error instanceof BadRequestError) return response.status(400).json(data);
  if (error instanceof UnauthorizedError) return response.status(401).json(data);
  if (error instanceof NotFoundError) return response.status(404).json(data);
  if (error instanceof ConflictError) return response.status(409).json(data);
  return response.sendStatus(500);
};
app.use(errorLogger);

dbContext.connect().then(async () => {
  // await initializeDb();
  app.listen(ENV.PORT, () => console.log(`Server running on port ${ENV.PORT}`));
});

export default app;
