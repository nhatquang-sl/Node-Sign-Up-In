import 'module-alias/register';
import 'express-async-errors';
import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import cors from 'cors';
import ENV from '@config';
import corsOptions from '@config/cors-options';
import { dbContext, initializeDb } from '@database';

import authRoute from '@controllers/auth/route';
import userRoute from '@controllers/user/route';
import { BadRequestError, UnauthorizedError, NotFoundError } from '@controllers/exceptions';

import { mediator } from './mediator';
import { SimpleCommand, ExampleAuthorizeCommand } from './mediator/handlers';
import { AuthorizationBehavior } from './application/common/behaviours/authorization';

console.log(ENV);

const app = express();

// Cross Origin Resource Sharing
app.use(cors());
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
router.get('^/$|/index(.html)?', (req, res) => {
  res.sendFile(path.join(fePath, 'index.html'));
});
router.get('/health-check', (req, res) => {
  res.json(ENV.APP_VERSION);
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

app.use('/', router);

app.use('/auth', authRoute);
app.use('/user', userRoute);

// https://medium.com/@utkuu/error-handling-in-express-js-and-express-async-errors-package-639c91ba3aa2
const errorLogger = (error: Error, request: Request, response: Response, next: NextFunction) => {
  console.log(error);
  const { message } = error;
  const data = JSON.parse(message);
  if (error instanceof BadRequestError) return response.status(400).json(data);
  if (error instanceof UnauthorizedError) return response.status(401).json(data);
  if (error instanceof NotFoundError) return response.status(404).json(data);
  return response.sendStatus(500);
};
app.use(errorLogger);
mediator.use(new AuthorizationBehavior());
const command = new SimpleCommand();
command.partyId = 10;

const authCommand = new ExampleAuthorizeCommand();
mediator.send(authCommand);
