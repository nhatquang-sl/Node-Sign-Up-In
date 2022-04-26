import 'module-alias/register';
import express from 'express';
import path from 'path';
import cors from 'cors';
import ENV from '@config';
import corsOptions from '@config/cors-options';
import dbContext from '@database';
import User from '@database/models/user';
import authRoute from '@controllers/auth/route';

console.log(ENV);

const app = express();

// Cross Origin Resource Sharing
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
app.use('/', router);

app.use('/auth', authRoute);

dbContext.connect().then(async () => {
  // https://sequelize.org/docs/v6/core-concepts/model-basics/#model-synchronization
  // await User.sync();
  // await User.sync({ force: true });
  app.listen(ENV.PORT, () => console.log(`Server running on port ${ENV.PORT}`));
});
